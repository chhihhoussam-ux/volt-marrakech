import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import {
  sendConfirmationReservation,
  sendReservationConfirmee,
  sendReservationAnnulee,
} from '@/lib/emails/send'

export async function POST(request: Request) {
  let body: Record<string, unknown> = {}

  try {
    body = await request.json()
    console.log('[/api/emails] body:', JSON.stringify(body))
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 },
    )
  }

  try {
    const { type, reservationId } = body as { type?: string; reservationId?: string }

    if (!type || !reservationId) {
      return NextResponse.json(
        { success: false, error: 'type and reservationId are required' },
        { status: 400 },
      )
    }

    // ── Fetch reservation ──
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single()

    if (fetchError || !reservation) {
      console.error('[/api/emails] Reservation fetch error:', fetchError)
      return NextResponse.json(
        { success: false, error: `Reservation not found: ${fetchError?.message || reservationId}` },
        { status: 404 },
      )
    }

    // ── Resolve client email ──
    // Priority: body param > reservation.client_email column > profiles table
    let email = (body.clientEmail as string) || ''
    console.log('[/api/emails] Step 1 — body.clientEmail:', email || '(empty)')

    if (!email && reservation.client_email) {
      email = reservation.client_email
      console.log('[/api/emails] Step 2 — reservation.client_email:', email)
    }

    if (!email && reservation.user_id) {
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', reservation.user_id)
        .single()
      console.log('[/api/emails] Step 3 — profiles query for user_id:', reservation.user_id, '→', profile?.email || '(empty)', profileErr ? `error: ${profileErr.message}` : '')
      email = profile?.email || ''
    }

    console.log('[/api/emails] Final clientEmail:', email || '(EMPTY)')

    if (!email) {
      console.error('[/api/emails] No client email found. reservation.client_email:', reservation.client_email, 'user_id:', reservation.user_id)
      return NextResponse.json(
        { success: false, error: `No client email found for reservation ${reservationId}. Ensure client_email column exists and is populated.` },
        { status: 400 },
      )
    }

    // ── Resolve other fields ──
    let name = (body.clientName as string) || ''
    let scooter = (body.scooterName as string) || ''
    const clientPhone = (body.phone as string) || reservation.phone || ''

    if (!name && reservation.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', reservation.user_id)
        .single()
      name = profile?.full_name || 'Client'
    }

    if (!scooter && reservation.scooter_id) {
      const { data: scooterData } = await supabase
        .from('scooters')
        .select('name')
        .eq('id', reservation.scooter_id)
        .single()
      scooter = scooterData?.name || 'Scooter'
    }

    console.log('[/api/emails] Sending', type, '→ email:', email, 'name:', name, 'scooter:', scooter)

    // ── Send email ──
    let result: { success: boolean; error?: string }

    switch (type) {
      case 'confirmation':
        result = await sendConfirmationReservation(reservation, scooter, email, name, clientPhone)
        break
      case 'confirmee':
        result = await sendReservationConfirmee(reservation, scooter, email, name)
        break
      case 'annulee':
        result = await sendReservationAnnulee(reservation, scooter, email, name)
        break
      default:
        return NextResponse.json(
          { success: false, error: `Unknown email type: ${type}` },
          { status: 400 },
        )
    }

    if (!result.success) {
      console.error('[/api/emails] Send failed:', result.error)
      return NextResponse.json(
        { success: false, error: `Email send failed: ${result.error}` },
        { status: 500 },
      )
    }

    console.log('[/api/emails] Success for type:', type)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : ''
    console.error('[/api/emails] Unhandled error:', message)
    console.error('[/api/emails] Stack:', stack)
    console.error('[/api/emails] Body was:', JSON.stringify(body))
    return NextResponse.json(
      { success: false, error: `Server error: ${message}` },
      { status: 500 },
    )
  }
}

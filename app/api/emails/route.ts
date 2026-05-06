import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import {
  sendConfirmationReservation,
  sendReservationConfirmee,
  sendReservationAnnulee,
  sendContactMessage,
} from '@/lib/emails/send'

export async function POST(request: Request) {
  let body: Record<string, unknown> = {}

  // ── Parse body ──
  try {
    body = await request.json()
  } catch {
    console.error('=== EMAIL API ERROR === Invalid JSON body')
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { type, reservationId } = body as { type?: string; reservationId?: string }

  console.log('=== EMAIL API CALLED ===')
  console.log('Body:', JSON.stringify(body))
  console.log('Type:', type)
  console.log('ReservationId:', reservationId)
  console.log('ClientEmail from body:', body.clientEmail || '(empty)')

  if (!type) {
    return NextResponse.json({ error: 'type is required' }, { status: 400 })
  }

  // Handle contact form (no reservationId needed)
  if (type === 'contact') {
    const { contactName, contactEmail, contactPhone, contactSubject, contactMessage } = body as any
    if (!contactName || !contactEmail || !contactMessage) {
      return NextResponse.json({ error: 'contactName, contactEmail, and contactMessage are required' }, { status: 400 })
    }
    try {
      const result = await sendContactMessage(contactName, contactEmail, contactPhone || '', contactSubject || 'Autre', contactMessage)
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    } catch (error: any) {
      console.error('=== CONTACT EMAIL ERROR ===', error?.message)
      return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 })
    }
  }

  if (!reservationId) {
    return NextResponse.json({ error: 'reservationId is required' }, { status: 400 })
  }

  try {
    // ── Fetch reservation ──
    console.log('=== FETCHING RESERVATION ===')
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single()

    if (fetchError || !reservation) {
      console.error('=== RESERVATION NOT FOUND ===')
      console.error('Error:', fetchError?.message)
      return NextResponse.json(
        { error: `Reservation not found: ${fetchError?.message || reservationId}` },
        { status: 404 },
      )
    }
    console.log('Reservation found. client_email column:', reservation.client_email || '(empty)', 'user_id:', reservation.user_id)

    // ── Resolve client email ──
    // Priority: body > reservation.client_email > profiles table
    let email = (body.clientEmail as string) || ''
    console.log('Step 1 — body.clientEmail:', email || '(empty)')

    if (!email && reservation.client_email) {
      email = reservation.client_email
      console.log('Step 2 — reservation.client_email:', email)
    }

    if (!email && reservation.user_id) {
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', reservation.user_id)
        .single()
      email = profile?.email || ''
      console.log('Step 3 — profiles lookup:', email || '(empty)', profileErr ? `error: ${profileErr.message}` : 'ok')
    }

    console.log('Final clientEmail:', email || '(EMPTY)')

    if (!email) {
      console.error('=== NO CLIENT EMAIL ===')
      return NextResponse.json(
        { error: `No client email found for reservation ${reservationId}` },
        { status: 400 },
      )
    }

    // ── Resolve name & scooter ──
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

    // ── Send email ──
    console.log('=== SENDING EMAIL ===')
    console.log('To:', email)
    console.log('From: noreply@almone-scooter.com')
    console.log('Template type:', type)
    console.log('Name:', name, '| Scooter:', scooter, '| Phone:', clientPhone)

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
        return NextResponse.json({ error: `Unknown email type: ${type}` }, { status: 400 })
    }

    if (!result.success) {
      console.error('=== EMAIL SEND FAILED ===')
      console.error('Error:', result.error)
      return NextResponse.json(
        { error: `Email send failed: ${result.error}` },
        { status: 500 },
      )
    }

    console.log('=== EMAIL SENT SUCCESSFULLY ===')
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('=== EMAIL ERROR ===')
    console.error('Message:', error?.message)
    console.error('Stack:', error?.stack)
    console.error('Full error:', JSON.stringify(error, null, 2))
    console.error('Body was:', JSON.stringify(body))
    return NextResponse.json(
      { error: error?.message || 'Unknown error', stack: error?.stack },
      { status: 500 },
    )
  }
}

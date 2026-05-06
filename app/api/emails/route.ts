import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import {
  sendConfirmationReservation,
  sendReservationConfirmee,
  sendReservationAnnulee,
} from '@/lib/emails/send'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('API emails body:', JSON.stringify(body))

    const { type, reservationId, clientEmail, clientName, scooterName, phone } = body

    if (!type || !reservationId) {
      return NextResponse.json(
        { success: false, error: 'type and reservationId are required' },
        { status: 400 },
      )
    }

    // If client data was passed directly, use it; otherwise fetch from DB
    let email = clientEmail || ''
    let name = clientName || ''
    let scooter = scooterName || ''
    let clientPhone = phone || ''

    // Fetch reservation
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single()

    if (fetchError || !reservation) {
      console.error('Reservation fetch error:', fetchError)
      return NextResponse.json(
        { success: false, error: fetchError?.message || 'Reservation not found' },
        { status: 404 },
      )
    }

    // Fetch scooter name if not provided
    if (!scooter && reservation.scooter_id) {
      const { data: scooterData } = await supabase
        .from('scooters')
        .select('name')
        .eq('id', reservation.scooter_id)
        .single()
      scooter = scooterData?.name || 'Scooter'
    }

    // Fetch client info if not provided
    if (!email && reservation.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', reservation.user_id)
        .single()
      email = profile?.email || ''
      name = name || profile?.full_name || 'Client'
    }

    clientPhone = clientPhone || reservation.phone || ''

    console.log('Resolved — email:', email, 'name:', name, 'scooter:', scooter)

    let result: { success: boolean; error?: string }

    switch (type) {
      case 'confirmation':
        result = await sendConfirmationReservation(
          reservation, scooter, email, name, clientPhone,
        )
        break
      case 'confirmee':
        result = await sendReservationConfirmee(
          reservation, scooter, email, name,
        )
        break
      case 'annulee':
        result = await sendReservationAnnulee(
          reservation, scooter, email, name,
        )
        break
      default:
        return NextResponse.json(
          { success: false, error: `Unknown email type: ${type}` },
          { status: 400 },
        )
    }

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('[POST /api/emails]', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    )
  }
}

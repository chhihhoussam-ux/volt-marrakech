import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import {
  sendConfirmationReservation,
  sendReservationConfirmee,
  sendReservationAnnulee,
} from '@/lib/emails/send'

export async function POST(request: Request) {
  try {
    const { type, reservationId } = await request.json()

    if (!type || !reservationId) {
      return NextResponse.json(
        { success: false, error: 'type and reservationId are required' },
        { status: 400 },
      )
    }

    // Fetch reservation with joined scooter and profile data
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('*, scooters(name), profiles(email, full_name)')
      .eq('id', reservationId)
      .single()

    if (fetchError || !reservation) {
      return NextResponse.json(
        { success: false, error: fetchError?.message || 'Reservation not found' },
        { status: 404 },
      )
    }

    const scooterName = reservation.scooters?.name || 'Scooter'
    const clientEmail = reservation.profiles?.email || ''
    const clientName = reservation.profiles?.full_name || 'Client'

    let result: { success: boolean; error?: string }

    switch (type) {
      case 'confirmation':
        result = await sendConfirmationReservation(
          reservation,
          scooterName,
          clientEmail,
          clientName,
          reservation.phone || '',
        )
        break

      case 'confirmee':
        result = await sendReservationConfirmee(
          reservation,
          scooterName,
          clientEmail,
          clientName,
        )
        break

      case 'annulee':
        result = await sendReservationAnnulee(
          reservation,
          scooterName,
          clientEmail,
          clientName,
        )
        break

      default:
        return NextResponse.json(
          { success: false, error: `Unknown email type: ${type}` },
          { status: 400 },
        )
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[POST /api/emails]', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 },
    )
  }
}

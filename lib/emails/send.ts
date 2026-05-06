import { Resend } from 'resend'
import { supabase } from '../supabase'
import {
  confirmationReservationHtml,
  reservationConfirmeeHtml,
  reservationAnnuleeHtml,
  nouvelleReservationAdminHtml,
} from './templates'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Almone <onboarding@resend.dev>'
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://volt-marrakech.vercel.app'

async function getSettingsMap(): Promise<Record<string, string>> {
  const { data } = await supabase.from('settings').select('key, value')
  const map: Record<string, string> = {}
  for (const row of data || []) map[row.key] = row.value
  return map
}

function waUrl(number: string) {
  return `https://wa.me/${number.replace(/[^0-9]/g, '')}`
}

function rentalTypeLabel(type: string) {
  switch (type) {
    case 'hourly':  return "À l'heure"
    case 'daily':   return 'À la journée'
    case 'weekly':  return 'À la semaine'
    default:        return type
  }
}

function formatDuration(value: number, type: string) {
  switch (type) {
    case 'hourly':  return `${value} heure${value > 1 ? 's' : ''}`
    case 'daily':   return `${value} jour${value > 1 ? 's' : ''}`
    case 'weekly':  return `${value} semaine${value > 1 ? 's' : ''}`
    default:        return `${value}`
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

interface ReservationData {
  id: string
  start_date: string
  end_date: string
  total_price: number
  rental_type: string
  duration_value: number
  phone?: string
}

export async function sendConfirmationReservation(
  reservation: ReservationData,
  scooterName: string,
  clientEmail: string,
  clientName: string,
  clientPhone: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Resend API Key exists:', !!process.env.RESEND_API_KEY)
    const settings = await getSettingsMap()
    const whatsappNumber = settings.whatsapp_number || ''
    const adminEmail = settings.admin_email || 'admin@almone.ma'

    const rentalType = rentalTypeLabel(reservation.rental_type)
    const duration = formatDuration(reservation.duration_value, reservation.rental_type)
    const startDate = formatDate(reservation.start_date)
    const endDate = formatDate(reservation.end_date)

    console.log('Sending email to:', clientEmail)
    const clientResult = await resend.emails.send({
      from: FROM,
      to: clientEmail,
      subject: 'Votre demande de réservation Almone est bien reçue',
      html: confirmationReservationHtml({
        clientName,
        scooterName,
        startDate,
        endDate,
        rentalType,
        duration,
        totalPrice: reservation.total_price,
        phone: clientPhone,
        reservationId: reservation.id,
        whatsappUrl: waUrl(whatsappNumber),
      }),
    })
    console.log('Email sent:', clientResult)

    console.log('Sending email to:', adminEmail)
    const adminResult = await resend.emails.send({
      from: FROM,
      to: adminEmail,
      subject: `🔔 Nouvelle réservation #${reservation.id.slice(0, 8).toUpperCase()}`,
      html: nouvelleReservationAdminHtml({
        clientName,
        clientEmail,
        clientPhone,
        scooterName,
        startDate,
        endDate,
        rentalType,
        duration,
        totalPrice: reservation.total_price,
        reservationId: reservation.id,
        adminUrl: `${SITE_URL}/admin/reservations`,
      }),
    })
    console.log('Email sent:', adminResult)

    return { success: true }
  } catch (error: unknown) {
    console.error('Email error:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function sendReservationConfirmee(
  reservation: ReservationData,
  scooterName: string,
  clientEmail: string,
  clientName: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Resend API Key exists:', !!process.env.RESEND_API_KEY)
    const settings = await getSettingsMap()
    const whatsappNumber = settings.whatsapp_number || ''

    console.log('Sending email to:', clientEmail)
    const result = await resend.emails.send({
      from: FROM,
      to: clientEmail,
      subject: 'Votre réservation Almone est confirmée 🛵',
      html: reservationConfirmeeHtml({
        clientName,
        scooterName,
        startDate: formatDate(reservation.start_date),
        endDate: formatDate(reservation.end_date),
        totalPrice: reservation.total_price,
        reservationId: reservation.id,
        whatsappUrl: waUrl(whatsappNumber),
        siteUrl: SITE_URL,
      }),
    })
    console.log('Email sent:', result)

    return { success: true }
  } catch (error: unknown) {
    console.error('Email error:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function sendReservationAnnulee(
  reservation: ReservationData,
  scooterName: string,
  clientEmail: string,
  clientName: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Resend API Key exists:', !!process.env.RESEND_API_KEY)
    const settings = await getSettingsMap()
    const whatsappNumber = settings.whatsapp_number || ''

    console.log('Sending email to:', clientEmail)
    const result = await resend.emails.send({
      from: FROM,
      to: clientEmail,
      subject: 'Votre réservation Almone a été annulée',
      html: reservationAnnuleeHtml({
        clientName,
        scooterName,
        startDate: formatDate(reservation.start_date),
        reservationId: reservation.id,
        whatsappUrl: waUrl(whatsappNumber),
        siteUrl: SITE_URL,
      }),
    })
    console.log('Email sent:', result)

    return { success: true }
  } catch (error: unknown) {
    console.error('Email error:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

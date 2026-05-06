import { Resend } from 'resend'
import { supabase } from '../supabase'
import {
  confirmationReservationHtml,
  reservationConfirmeeHtml,
  reservationAnnuleeHtml,
  nouvelleReservationAdminHtml,
  contactMessageHtml,
} from './templates'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Almone <noreply@almone-scooter.com>'
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.almone-scooter.com'
const IS_DEV = process.env.NODE_ENV === 'development'

function resolveRecipient(email: string): string {
  if (IS_DEV && process.env.TEST_EMAIL) {
    console.log(`[DEV] Redirecting email from ${email} → ${process.env.TEST_EMAIL}`)
    return process.env.TEST_EMAIL
  }
  return email
}

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
  pickup_type?: string
  pickup_address?: string
  pickup_location_id?: string
  dropoff_type?: string
  dropoff_address?: string
  dropoff_location_id?: string
  delivery_fee?: number
  pickup_fee?: number
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
    const adminEmail = settings.admin_email || 'admin@almone-scooter.com'

    const rentalType = rentalTypeLabel(reservation.rental_type)
    const duration = formatDuration(reservation.duration_value, reservation.rental_type)
    const startDate = formatDate(reservation.start_date)
    const endDate = formatDate(reservation.end_date)

    const pickupInfo = reservation.pickup_type === 'delivery'
      ? `Livraison à ${reservation.pickup_address || 'votre adresse'} (+${reservation.delivery_fee || 0} MAD)`
      : 'En agence'
    const dropoffInfo = reservation.dropoff_type === 'delivery'
      ? `Récupération à ${reservation.dropoff_address || 'votre adresse'} (+${reservation.pickup_fee || 0} MAD)`
      : 'En agence'
    const basePrice = reservation.total_price - (reservation.delivery_fee || 0) - (reservation.pickup_fee || 0)

    console.log('Sending to client:', clientEmail)
    if (!clientEmail) {
      console.error('No client email provided, skipping client email')
      return { success: false, error: 'No client email' }
    }
    const toClient = resolveRecipient(clientEmail)
    const clientResult = await resend.emails.send({
      from: FROM,
      to: toClient,
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
        pickupInfo,
        dropoffInfo,
        deliveryFee: reservation.delivery_fee || 0,
        pickupFee: reservation.pickup_fee || 0,
        basePrice,
      }),
    })
    console.log('Email sent:', clientResult)

    const toAdmin = resolveRecipient(adminEmail)
    console.log('Sending to admin:', toAdmin)
    const adminResult = await resend.emails.send({
      from: FROM,
      to: toAdmin,
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
        pickupInfo,
        dropoffInfo,
        deliveryFee: reservation.delivery_fee || 0,
        pickupFee: reservation.pickup_fee || 0,
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

    console.log('Sending to client:', clientEmail)
    if (!clientEmail) return { success: false, error: 'No client email' }
    const toClient = resolveRecipient(clientEmail)
    const result = await resend.emails.send({
      from: FROM,
      to: toClient,
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
        pickupInfo: reservation.pickup_type === 'delivery'
          ? `Livraison à ${reservation.pickup_address || 'votre adresse'} (+${reservation.delivery_fee || 0} MAD)`
          : 'En agence',
        dropoffInfo: reservation.dropoff_type === 'delivery'
          ? `Récupération à ${reservation.dropoff_address || 'votre adresse'} (+${reservation.pickup_fee || 0} MAD)`
          : 'En agence',
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

    console.log('Sending to client:', clientEmail)
    if (!clientEmail) return { success: false, error: 'No client email' }
    const toClient = resolveRecipient(clientEmail)
    const result = await resend.emails.send({
      from: FROM,
      to: toClient,
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

export async function sendContactMessage(
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const settings = await getSettingsMap()
    const adminEmail = settings.admin_email || 'admin@almone-scooter.com'
    const toAdmin = resolveRecipient(adminEmail)

    console.log('Sending contact message to admin:', toAdmin)
    const result = await resend.emails.send({
      from: FROM,
      to: toAdmin,
      replyTo: email,
      subject: `Nouveau message de contact — ${subject}`,
      html: contactMessageHtml({ name, email, phone, subject, message }),
    })
    console.log('Contact email sent:', result)

    return { success: true }
  } catch (error: unknown) {
    console.error('Contact email error:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

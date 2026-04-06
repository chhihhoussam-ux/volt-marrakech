export type ScooterStatus = 'available' | 'rented'

export interface Scooter {
  id: string
  name: string
  model: string
  autonomy_km: number
  price_per_hour: number
  price_per_day: number
  price_per_week: number
  status: ScooterStatus
  image_url: string | null
  description: string | null
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  created_at: string
}

export type RentalType = 'hourly' | 'daily' | 'weekly'

export interface Reservation {
  id: string
  user_id: string
  scooter_id: string
  start_date: string
  end_date: string
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  rental_type: RentalType
  duration_value: number
  created_at: string
  scooter?: Scooter
  profile?: Profile
}

export interface SiteSettings {
  site_name: string
  accent_color: string
  logo_url: string
  favicon_url: string
  hero_image_url: string
  about_text: string
  // Stats bar
  stat1_value: string
  stat1_label: string
  stat2_value: string
  stat2_label: string
  stat3_value: string
  stat3_label: string
  stat4_value: string
  stat4_label: string
  // Pricing cards
  price1_duration: string
  price1_price: string
  price1_features: string
  price2_duration: string
  price2_price: string
  price2_features: string
  price3_duration: string
  price3_price: string
  price3_features: string
}

export interface Database {
  public: {
    Tables: {
      scooters: {
        Row: Scooter
        Insert: Omit<Scooter, 'id' | 'created_at'>
        Update: Partial<Omit<Scooter, 'id' | 'created_at'>>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      reservations: {
        Row: Reservation
        Insert: Omit<Reservation, 'id' | 'created_at'>
        Update: Partial<Omit<Reservation, 'id' | 'created_at'>>
      }
    }
  }
}

import { supabase } from './supabase'
import type { SiteSettings } from './types'

export const SETTINGS_DEFAULTS: SiteSettings = {
  site_name: 'Almone',
  accent_color: '#FF6700',
  logo_url: '',
  favicon_url: '',
  hero_image_url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?w=1600&q=80',
  about_text:
    "Almone est né d'une conviction simple : la meilleure façon de découvrir Marrakech, c'est à son propre rythme. Forts de 20 ans d'expérience dans la location de véhicules au Maroc, nous avons décidé de tourner la page de l'essence pour embrasser pleinement l'électrique. Même exigence, même fiabilité, même service — mais en version propre, silencieuse et libre.",
  // Stats bar
  stat1_value: '6',
  stat1_label: 'Modèles disponibles',
  stat2_value: '120 km',
  stat2_label: "D'autonomie",
  stat3_value: '60 MAD',
  stat3_label: 'À partir de',
  stat4_value: '7j/7',
  stat4_label: 'Support',
  // Pricing cards
  price1_duration: '2 Heures',
  price1_price: '60',
  price1_features: 'Casque inclus|Assistance téléphonique|Idéal pour la médina et Jemaa el-Fna',
  price2_duration: '1 Journée',
  price2_price: '170',
  price2_features: 'Casque + antivol inclus|Assistance 7j/7|Carte des spots Almone offerte',
  price3_duration: '1 Semaine',
  price3_price: '950',
  price3_features: 'Équipements complets|Assistance prioritaire|Extension possible',
  // Visuals
  marker_icon_url: '',
  formule1_image_url: '',
  formule2_image_url: '',
  formule3_image_url: '',
  etape1_image_url: '',
  etape2_image_url: '',
  etape3_image_url: '',
  faq_image_url: '',
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')

    if (error || !data) return SETTINGS_DEFAULTS

    const map: Record<string, string> = {}
    for (const row of data) {
      map[row.key] = row.value
    }

    return {
      site_name:      map.site_name      ?? SETTINGS_DEFAULTS.site_name,
      accent_color:   map.accent_color   ?? SETTINGS_DEFAULTS.accent_color,
      logo_url:       map.logo_url       ?? SETTINGS_DEFAULTS.logo_url,
      favicon_url:    map.favicon_url    ?? SETTINGS_DEFAULTS.favicon_url,
      hero_image_url: map.hero_image_url ?? SETTINGS_DEFAULTS.hero_image_url,
      about_text:     map.about_text     ?? SETTINGS_DEFAULTS.about_text,
      stat1_value:    map.stat1_value    ?? SETTINGS_DEFAULTS.stat1_value,
      stat1_label:    map.stat1_label    ?? SETTINGS_DEFAULTS.stat1_label,
      stat2_value:    map.stat2_value    ?? SETTINGS_DEFAULTS.stat2_value,
      stat2_label:    map.stat2_label    ?? SETTINGS_DEFAULTS.stat2_label,
      stat3_value:    map.stat3_value    ?? SETTINGS_DEFAULTS.stat3_value,
      stat3_label:    map.stat3_label    ?? SETTINGS_DEFAULTS.stat3_label,
      stat4_value:    map.stat4_value    ?? SETTINGS_DEFAULTS.stat4_value,
      stat4_label:    map.stat4_label    ?? SETTINGS_DEFAULTS.stat4_label,
      price1_duration: map.price1_duration ?? SETTINGS_DEFAULTS.price1_duration,
      price1_price:    map.price1_price    ?? SETTINGS_DEFAULTS.price1_price,
      price1_features: map.price1_features ?? SETTINGS_DEFAULTS.price1_features,
      price2_duration: map.price2_duration ?? SETTINGS_DEFAULTS.price2_duration,
      price2_price:    map.price2_price    ?? SETTINGS_DEFAULTS.price2_price,
      price2_features: map.price2_features ?? SETTINGS_DEFAULTS.price2_features,
      price3_duration: map.price3_duration ?? SETTINGS_DEFAULTS.price3_duration,
      price3_price:    map.price3_price    ?? SETTINGS_DEFAULTS.price3_price,
      price3_features: map.price3_features ?? SETTINGS_DEFAULTS.price3_features,
      marker_icon_url: map.marker_icon_url ?? SETTINGS_DEFAULTS.marker_icon_url,
      formule1_image_url: map.formule1_image_url ?? SETTINGS_DEFAULTS.formule1_image_url,
      formule2_image_url: map.formule2_image_url ?? SETTINGS_DEFAULTS.formule2_image_url,
      formule3_image_url: map.formule3_image_url ?? SETTINGS_DEFAULTS.formule3_image_url,
      etape1_image_url: map.etape1_image_url ?? SETTINGS_DEFAULTS.etape1_image_url,
      etape2_image_url: map.etape2_image_url ?? SETTINGS_DEFAULTS.etape2_image_url,
      etape3_image_url: map.etape3_image_url ?? SETTINGS_DEFAULTS.etape3_image_url,
      faq_image_url: map.faq_image_url ?? SETTINGS_DEFAULTS.faq_image_url,
    }
  } catch {
    return SETTINGS_DEFAULTS
  }
}

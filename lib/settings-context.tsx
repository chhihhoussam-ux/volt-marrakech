'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from './supabase'
import { SETTINGS_DEFAULTS } from './settings'
import type { SiteSettings } from './types'

const SettingsContext = createContext<SiteSettings>(SETTINGS_DEFAULTS)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(SETTINGS_DEFAULTS)

  useEffect(() => {
    supabase
      .from('settings')
      .select('key, value')
      .then(({ data }) => {
        if (!data) return
        const map: Record<string, string> = {}
        for (const row of data) map[row.key] = row.value
        const s: SiteSettings = {
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
        setSettings(s)
        // Apply accent color as a CSS variable so all consumers update
        if (s.accent_color) {
          document.documentElement.style.setProperty('--accent', s.accent_color)
        }
      })
  }, [])

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SiteSettings {
  return useContext(SettingsContext)
}

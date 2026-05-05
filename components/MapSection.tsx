'use client'

import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { supabase } from '@/lib/supabase'

interface Location {
  id: string
  name: string
  address: string | null
  lat: number
  lng: number
  description: string | null
}

const defaultIcon = L.divIcon({
  className: '',
  html: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="#FF6700" stroke="#fff" stroke-width="3"/>
  </svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
})

export default function MapSection() {
  const [locations, setLocations] = useState<Location[]>([])
  const [markerIconUrl, setMarkerIconUrl] = useState('')

  useEffect(() => {
    async function fetchData() {
      const [locRes, settingRes] = await Promise.all([
        supabase
          .from('locations')
          .select('id, name, address, lat, lng, description')
          .eq('is_active', true),
        supabase
          .from('settings')
          .select('value')
          .eq('key', 'marker_icon_url')
          .single(),
      ])

      if (!locRes.error && locRes.data) {
        setLocations(locRes.data as Location[])
      }

      const url = settingRes.data?.value || ''
      setMarkerIconUrl(url)
      console.log('marker_icon_url:', url)
    }

    fetchData()
  }, [])

  const markerIcon = useMemo(() => {
    if (markerIconUrl) {
      return L.icon({
        iconUrl: markerIconUrl,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      })
    }
    return defaultIcon
  }, [markerIconUrl])

  return (
    <section style={{ padding: '120px 24px', background: '#F5F5F5' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{
            fontSize: 11,
            fontWeight: 500,
            color: '#FF6700',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: 16,
            fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
          }}>
            Où nous trouver
          </p>
          <h2 style={{
            fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#0a0a0a',
            marginBottom: 20,
          }}>
            Récupérez votre scooter près de chez vous.
          </h2>
          <p style={{
            fontSize: 16, color: '#757575', lineHeight: 1.7, maxWidth: 560, margin: '0 auto',
            fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
          }}>
            Nous disposons de plusieurs points de relais à Marrakech. Choisissez le point le plus proche de votre hôtel ou riad.
          </p>
        </div>

        <div style={{ width: '100%', height: 480, borderRadius: 12, overflow: 'hidden' }}>
          <MapContainer
            center={[31.6295, -7.9811]}
            zoom={13}
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {locations.map((loc) => (
              <Marker key={`${loc.id}-${markerIconUrl}`} position={[loc.lat, loc.lng]} icon={markerIcon}>
                <Popup>
                  <div style={{
                    fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                    padding: '8px 4px',
                  }}>
                    <p style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#0a0a0a',
                      marginBottom: 4,
                    }}>
                      {loc.name}
                    </p>
                    {loc.address && (
                      <p style={{
                        fontSize: 13,
                        color: '#757575',
                        marginBottom: 4,
                        lineHeight: 1.5,
                      }}>
                        {loc.address}
                      </p>
                    )}
                    {loc.description && (
                      <p style={{
                        fontSize: 13,
                        color: '#757575',
                        marginBottom: 12,
                        lineHeight: 1.5,
                      }}>
                        {loc.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <a
                        href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#fff',
                          background: '#0a0a0a',
                          padding: '8px 14px',
                          borderRadius: 8,
                          textDecoration: 'none',
                          display: 'inline-block',
                        }}
                      >
                        Google Maps
                      </a>
                      <a
                        href={`https://waze.com/ul?ll=${loc.lat},${loc.lng}&navigate=yes`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#0a0a0a',
                          background: '#fff',
                          border: '1px solid #e0e0e0',
                          padding: '8px 14px',
                          borderRadius: 8,
                          textDecoration: 'none',
                          display: 'inline-block',
                        }}
                      >
                        Waze
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  )
}

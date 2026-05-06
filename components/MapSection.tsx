'use client'

import { useEffect, useState, useCallback } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api'
import { supabase } from '@/lib/supabase'

interface Location {
  id: string
  name: string
  address: string | null
  lat: number
  lng: number
  description: string | null
}

const MAP_CENTER = { lat: 31.6295, lng: -7.9811 }

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
]

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: MAP_STYLES,
}

const DEFAULT_MARKER_SVG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="17" fill="#FF6700" stroke="#fff" stroke-width="3"/>
    <circle cx="20" cy="20" r="5" fill="#fff"/>
  </svg>`
)}`

const sf = 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif'

export default function MapSection() {
  const [locations, setLocations] = useState<Location[]>([])
  const [markerIconUrl, setMarkerIconUrl] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  })

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

  const onLoad = useCallback(() => {}, [])

  const iconUrl = markerIconUrl || DEFAULT_MARKER_SVG

  return (
    <section id="carte" style={{ padding: '120px 24px', background: '#F5F5F5' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{
            fontSize: 11, fontWeight: 500, color: '#FF6700', textTransform: 'uppercase',
            letterSpacing: '0.15em', marginBottom: 16, fontFamily: sf,
          }}>
            Où nous trouver
          </p>
          <h2 style={{
            fontFamily: sf, fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 700,
            letterSpacing: '-0.02em', color: '#0a0a0a', marginBottom: 20,
          }}>
            Récupérez votre scooter près de chez vous.
          </h2>
          <p style={{
            fontSize: 16, color: '#757575', lineHeight: 1.7, maxWidth: 560,
            margin: '0 auto', fontFamily: sf,
          }}>
            Nous disposons de plusieurs points de relais à Marrakech. Choisissez le point le plus proche de votre hôtel ou riad.
          </p>
        </div>

        <div style={{ width: '100%', height: 480, borderRadius: 12, overflow: 'hidden' }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={MAP_CENTER}
              zoom={13}
              options={MAP_OPTIONS}
              onLoad={onLoad}
            >
              {locations.map((loc) => (
                <MarkerF
                  key={loc.id}
                  position={{ lat: loc.lat, lng: loc.lng }}
                  icon={{
                    url: iconUrl,
                    scaledSize: new google.maps.Size(40, 40),
                    anchor: new google.maps.Point(20, 20),
                  }}
                  onClick={() => setActiveId(loc.id)}
                >
                  {activeId === loc.id && (
                    <InfoWindowF
                      position={{ lat: loc.lat, lng: loc.lng }}
                      onCloseClick={() => setActiveId(null)}
                    >
                      <div style={{ fontFamily: sf, padding: '4px 0', maxWidth: 260 }}>
                        <p style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', margin: '0 0 4px' }}>
                          {loc.name}
                        </p>
                        {loc.address && (
                          <p style={{ fontSize: 13, color: '#757575', margin: '0 0 4px', lineHeight: 1.5 }}>
                            {loc.address}
                          </p>
                        )}
                        {loc.description && (
                          <p style={{ fontSize: 13, color: '#757575', margin: '0 0 12px', lineHeight: 1.5 }}>
                            {loc.description}
                          </p>
                        )}
                        <div style={{ display: 'flex', gap: 8 }}>
                          <a
                            href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: 12, fontWeight: 600, color: '#fff', background: '#FF6700',
                              padding: '8px 14px', borderRadius: 8, textDecoration: 'none',
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
                              fontSize: 12, fontWeight: 600, color: '#0a0a0a', background: '#fff',
                              border: '1px solid #e0e0e0', padding: '8px 14px', borderRadius: 8,
                              textDecoration: 'none', display: 'inline-block',
                            }}
                          >
                            Waze
                          </a>
                        </div>
                      </div>
                    </InfoWindowF>
                  )}
                </MarkerF>
              ))}
            </GoogleMap>
          ) : (
            <div style={{
              width: '100%', height: '100%', background: '#EBEBEB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#757575', fontSize: 14, fontFamily: sf,
            }}>
              Chargement de la carte...
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

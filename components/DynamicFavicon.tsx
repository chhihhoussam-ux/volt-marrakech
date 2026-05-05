'use client'

import { useEffect } from 'react'
import { useSettings } from '@/lib/settings-context'

export default function DynamicFavicon() {
  const { favicon_url } = useSettings()

  useEffect(() => {
    const href = favicon_url
      ? `${favicon_url}?t=${Date.now()}`
      : '/icon-192.png'

    function upsertLink(rel: string, id: string) {
      let link = document.querySelector(`link#${id}`) as HTMLLinkElement | null
      if (!link) {
        link = document.createElement('link')
        link.id = id
        link.rel = rel
        document.head.appendChild(link)
      }
      link.href = href
    }

    upsertLink('icon', 'dynamic-favicon')
    upsertLink('apple-touch-icon', 'dynamic-apple-icon')
  }, [favicon_url])

  return null
}

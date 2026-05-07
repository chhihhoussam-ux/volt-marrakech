export const SESSION_KEY = 'almone_admin_session'

export interface AdminSession {
  authenticated: boolean
  role: 'superadmin' | 'operator'
  name: string
  email: string
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.authenticated !== true) return null
    return parsed as AdminSession
  } catch {
    return null
  }
}

export function isAdminAuthed(): boolean {
  return getAdminSession() !== null
}

export function adminLogout(): void {
  localStorage.removeItem(SESSION_KEY)
}

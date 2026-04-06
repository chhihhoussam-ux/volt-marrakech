export const ADMIN_PASSWORD = 'volt2024admin'
export const ADMIN_KEY = 'volt_admin'

export function isAdminAuthed(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(ADMIN_KEY)
    if (!raw) return false
    return JSON.parse(raw)?.authenticated === true
  } catch {
    return false
  }
}

export function adminLogin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_KEY, JSON.stringify({ authenticated: true }))
    return true
  }
  return false
}

export function adminLogout(): void {
  localStorage.removeItem(ADMIN_KEY)
}

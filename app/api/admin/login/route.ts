import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return Response.json({ success: false, message: 'Champs requis.' }, { status: 400 })
  }

  // Super admin: any email + ADMIN_PASSWORD env var
  if (password === process.env.ADMIN_PASSWORD) {
    return Response.json({ success: true, role: 'superadmin', name: 'Super Admin', email })
  }

  // Operator: check admin_users table
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, name, email, password_hash, role, is_active')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (!adminUser || !adminUser.is_active || adminUser.password_hash !== password) {
    return Response.json({ success: false, message: 'Email ou mot de passe incorrect.' }, { status: 401 })
  }

  // Update last_login
  await supabase
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', adminUser.id)

  return Response.json({
    success: true,
    role: adminUser.role,
    name: adminUser.name,
    email: adminUser.email,
  })
}

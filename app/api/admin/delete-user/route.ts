import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const { userId } = await request.json()

  if (!userId) {
    return Response.json({ success: false, message: 'userId requis.' }, { status: 400 })
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    return Response.json({ success: false, message: 'Service role key manquante.' }, { status: 500 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}

import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function POST(request: Request) {
  const { userId } = await request.json()

  console.log('SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
  console.log('Deleting user:', userId)

  if (!userId) {
    return Response.json({ error: 'userId requis.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  console.log('Delete error:', error)

  if (error) {
    return Response.json({ error: error.message, details: error }, { status: 500 })
  }

  return Response.json({ success: true })
}

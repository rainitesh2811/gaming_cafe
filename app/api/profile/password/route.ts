import { auth } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const session = await auth()
  const email = session?.user?.email
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { password?: string }
  if (!body.password || body.password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  try {
    const admin = getSupabaseAdmin()
    const { data: users, error: listError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
    if (listError) throw listError

    const existingUser = users.users.find((user) => user.email?.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      const { error } = await admin.auth.admin.updateUserById(existingUser.id, { password: body.password })
      if (error) throw error
    } else {
      const { error } = await admin.auth.admin.createUser({ email, password: body.password, email_confirm: true })
      if (error) throw error
    }

    return NextResponse.json({ saved: true })
  } catch {
    return NextResponse.json({ error: 'Unable to save password' }, { status: 500 })
  }
}

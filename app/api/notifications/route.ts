import { auth } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ unreadCount: 0 })

  try {
    const { count, error } = await getSupabaseAdmin()
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) return NextResponse.json({ error: 'Unable to load notifications' }, { status: 500 })
    return NextResponse.json({ unreadCount: count ?? 0 })
  } catch {
    return NextResponse.json({ error: 'Notification storage is not configured' }, { status: 500 })
  }
}

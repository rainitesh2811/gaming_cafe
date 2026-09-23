import { auth } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as {
    address?: string
    city?: string
    country?: string
    postal_code?: string | null
    latitude?: number
    longitude?: number
  }

  if (!body.address || !body.city || !body.country || typeof body.latitude !== 'number' || typeof body.longitude !== 'number') {
    return NextResponse.json({ error: 'Invalid location data' }, { status: 400 })
  }

  try {
    const { error } = await getSupabaseAdmin().from('locations').insert({
      address: body.address,
      city: body.city,
      country: body.country,
      postal_code: body.postal_code ?? null,
      latitude: body.latitude,
      longitude: body.longitude,
    } as never)

    if (error) return NextResponse.json({ error: 'Unable to save location' }, { status: 500 })
    return NextResponse.json({ saved: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Location storage is not configured' }, { status: 500 })
  }
}

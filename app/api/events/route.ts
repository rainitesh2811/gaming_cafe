import { supabase } from '@/lib/supabase/server'
import type { Event } from '@/lib/supabase/types'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase
    .from('events')
    .select('id, title, description, event_date, ticket_price, max_capacity, locations(address, city, state, country, postal_code)')
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })
    .limit(10)

  if (error) {
    return NextResponse.json({ error: 'Unable to load events' }, { status: 500 })
  }

  const events = (data ?? []).map((event) => ({
    ...event,
    locations: event.locations[0] ?? null,
  })) as Event[]

  return NextResponse.json({ events })
}
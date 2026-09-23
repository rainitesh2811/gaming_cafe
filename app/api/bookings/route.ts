import { auth } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ bookings: [] })

  try {
    const { data, error } = await getSupabaseAdmin()
      .from('bookings')
      .select('id, status, total_amount, booking_date, events(title, event_date, ticket_price, locations(address, city, state, country))')
      .eq('user_id', userId)
      .order('booking_date', { ascending: false })

    if (error) return NextResponse.json({ error: 'Unable to load bookings' }, { status: 500 })

    const bookings = (data ?? []).map((booking) => {
      const event = Array.isArray(booking.events) ? booking.events[0] : booking.events
      const venue = Array.isArray(event?.locations) ? event.locations[0] : event?.locations
      return {
        id: booking.id,
        status: booking.status,
        price: booking.total_amount,
        title: event?.title ?? 'Booked session',
        eventDate: event?.event_date ?? booking.booking_date,
        venue: venue?.address || venue?.city || 'Venue details unavailable',
      }
    })

    return NextResponse.json({ bookings })
  } catch {
    return NextResponse.json({ error: 'Booking storage is not configured' }, { status: 500 })
  }
}

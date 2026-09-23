'use client'

import { CalendarDays, ChevronLeft, Clock3, MapPin, Search, Ticket } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Booking = {
  id: string
  status: string
  price: number | string
  title: string
  eventDate: string
  venue: string
}

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/bookings')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load bookings')
        const result = await response.json() as { bookings: Booking[] }
        setBookings(result.bookings)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return <main className="bookings-shell">
    <header className="bookings-header"><Link className="icon-button" href="/" aria-label="Back to home"><ChevronLeft size={20} /></Link><div><p className="eyebrow">YOUR SESSIONS</p><h1>My bookings</h1></div><Ticket size={21} className="bookings-header-icon" /></header>
    <section className="bookings-content">
      {loading ? <p className="bookings-status">Loading your bookings...</p> : error ? <p className="bookings-status">Bookings are temporarily unavailable.</p> : bookings.length === 0 ? <section className="empty-bookings"><CalendarDays size={28} /><strong>No bookings yet</strong><p>Your reserved venues will appear here.</p><Link className="primary-button" href="/">Explore venues <span>→</span></Link></section> : <div className="booking-list">{bookings.map((booking) => { const eventDate = new Date(booking.eventDate); return <article className="booking-card" key={booking.id}><div className="booking-card-top"><div><p className="eyebrow">BOOKED VENUE</p><h2>{booking.venue}</h2><p className="booking-title">{booking.title}</p></div><span className={`booking-status ${booking.status}`}>{booking.status}</span></div><div className="booking-details"><span><CalendarDays size={15} />{eventDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span><span><Clock3 size={15} />{eventDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span><strong>${Number(booking.price).toFixed(2)}</strong></div><div className="booking-venue"><MapPin size={15} />{booking.venue}</div></article> })}</div>}
    </section>
    <nav className="bottom-nav" aria-label="Main navigation"><Link href="/"><span>Home</span></Link><Link href="/#search"><Search size={20} /><span>Explore</span></Link><Link className="active" href="/bookings"><Ticket size={20} /><span>Bookings</span></Link></nav>
  </main>
}

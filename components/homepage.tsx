'use client'

import type { Event } from '@/lib/supabase/types'
import { Bell, ChevronDown, Home, Map, MapPin, Menu, Search, Star, Ticket, UserRound } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'

const cafes = [
  { name: 'Pixel Forge Arena', rating: '4.8', distance: '1.2 km away', image: '/cafe-neon-grid.png', specs: ['RTX 4080', '180Hz'], accent: 'cyan' },
  { name: 'Nexus Gaming Lounge', rating: '4.6', distance: '2.4 km away', image: '/tournament-arena.png', specs: ['RTX 4070 Ti', '165Hz'], accent: 'purple' },
]

function EventCard({ event }: { event: Event }) {
  const eventDate = new Date(event.event_date)
  return <article className="event-card">
    <img src="/tournament-arena.png" alt="Esports tournament arena" />
    <div className="event-overlay" />
    <div className="event-content"><p className="eyebrow">UPCOMING EVENT</p><h3>{event.title}</h3><p className="event-meta">{eventDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} · {eventDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</p><div className="event-bottom"><strong>{event.ticket_price === 0 ? 'Free' : `$${Number(event.ticket_price).toFixed(2)}`}<span> / seat</span></strong><button>Book Seat <span>→</span></button></div></div>
    <div className="carousel-dots"><i className="active" /><i /><i /></div>
  </article>
}

function CafeCard({ cafe }: { cafe: typeof cafes[number] }) {
  return <article className="cafe-card">
    <div className="cafe-image"><img src={cafe.image} alt={`${cafe.name} interior`} /><span className="open-pill"><i /> Open now</span><button className="heart" aria-label={`Save ${cafe.name}`}>♡</button></div>
    <div className="cafe-info"><div className="cafe-title"><div><h3>{cafe.name}</h3><p><Star size={13} fill="currentColor" /> {cafe.rating} <span>·</span> {cafe.distance}</p></div><span className={`score ${cafe.accent}`}>{cafe.rating}</span></div><div className="specs">{cafe.specs.map((spec) => <span key={spec}>{spec}</span>)}</div><button className="reserve">View &amp; Reserve <span>→</span></button></div>
  </article>
}

type HomepageProps = {
  onLogout: () => void | Promise<void>
  isGoogleUser: boolean
}

export function Homepage({ onLogout, isGoogleUser }: HomepageProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [eventsError, setEventsError] = useState(false)
  const [locationRequest, setLocationRequest] = useState(0)
  const [locationLabel, setLocationLabel] = useState('Locating...')
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [todayLabel, setTodayLabel] = useState('')

  useEffect(() => {
    setTodayLabel(new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase())
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLabel('Location unavailable')
      return
    }

    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`)
        if (!response.ok) throw new Error('Unable to resolve location')
        const result = await response.json() as { city?: string; locality?: string; principalSubdivision?: string; countryName?: string; postcode?: string }
        const city = result.city || result.locality || result.principalSubdivision || 'Unknown'
          const saveResponse = await fetch('/api/locations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
          address: result.locality || city,
          city,
          country: result.countryName || 'Unknown',
          postal_code: result.postcode || null,
          latitude: coords.latitude,
          longitude: coords.longitude,
        } as never)
          })
          if (!saveResponse.ok) throw new Error('Unable to save location')
        setLocationLabel(city)
      } catch {
        setLocationLabel(`${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`)
      }
    }, () => setLocationLabel('Location unavailable'), { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 })
  }, [locationRequest])

  useEffect(() => {
    fetch('/api/events')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load events')
        const result = await response.json() as { events: Event[] }
        setEvents(result.events)
      })
      .catch(() => setEventsError(true))
      .finally(() => setEventsLoading(false))
  }, [])

  useEffect(() => {
    fetch('/api/notifications')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load notifications')
        const result = await response.json() as { unreadCount: number }
        setHasUnreadNotifications(result.unreadCount > 0)
      })
      .catch(() => setHasUnreadNotifications(false))
  }, [])

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!password) return
    setPasswordSaved(true)
  }

  async function handleNotificationsClick() {
    const nextOpen = !notificationsOpen
    setNotificationsOpen(nextOpen)
    if (!nextOpen) return

    setNotificationsLoading(true)
    try {
      const response = await fetch('/api/notifications')
      if (!response.ok) throw new Error('Unable to load notifications')
      const result = await response.json() as { unreadCount: number }
      setHasUnreadNotifications(result.unreadCount > 0)
      setNotificationMessage(result.unreadCount > 0 ? `You have ${result.unreadCount} new notification${result.unreadCount === 1 ? '' : 's'}.` : 'No new notifications.')
    } catch {
      setNotificationMessage('Notifications are temporarily unavailable.')
    } finally {
      setNotificationsLoading(false)
    }
  }

  return <main className="home-shell">
    <header className="topbar"><button className="icon-button" aria-label="Open menu" onClick={() => { setMenuOpen(!menuOpen); setProfileOpen(false); setNotificationsOpen(false) }}><Menu size={22} /></button><button className="location" type="button" onClick={() => setLocationRequest((request) => request + 1)}><MapPin size={16} /><span><small>YOUR LOCATION</small>{locationLabel}</span><ChevronDown size={15} /></button><div className="top-actions"><div className="notification-wrap"><button className="icon-button notification" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={handleNotificationsClick}><Bell size={19} />{hasUnreadNotifications && <i />}</button>{notificationsOpen && <div className="notification-popover" role="status"><strong>Notifications</strong><p>{notificationsLoading ? 'Checking for new notifications...' : notificationMessage}</p></div>}</div></div>{menuOpen && <div className="menu-popover">{profileOpen ? <section className="profile-section"><button className="back-button" type="button" onClick={() => setProfileOpen(false)}>← Menu</button><strong>Profile</strong>{isGoogleUser ? <><p className="profile-note">Signed in with Google. Create a password to also log in with your email.</p><form className="profile-form" onSubmit={handlePasswordSubmit}><label>Create password<input type="password" minLength={8} value={password} onChange={(event) => { setPassword(event.target.value); setPasswordSaved(false) }} placeholder="At least 8 characters" required /></label><button className="profile-save" type="submit">{passwordSaved ? 'Password saved' : 'Create password'}</button></form></> : <p className="profile-note">You are signed in with your account password.</p>}</section> : <><strong>Menu</strong><a href="#events">Events</a><a href="#cafes">Saved cafes</a><a href="#help">Help center</a><button className="menu-button" type="button" onClick={() => setProfileOpen(true)}><UserRound size={15} /> Profile</button><button className="menu-button logout-button" type="button" onClick={onLogout}>Log out <span>→</span></button></>}</div>}</header>
    <div className="home-content">
      <div className="greeting"><div><p className="eyebrow">{todayLabel}</p><h1>Find your <span>next play.</span></h1></div><button className="filter-button" aria-label="Open bookings" onClick={() => { window.location.href = '/bookings' }}><Map size={17} /></button></div>
      <section className="events-section" id="events"><div className="section-heading"><div><p className="eyebrow">DON&apos;T MISS OUT</p><h2>Upcoming events</h2></div><a href="#all-events">View all <span>→</span></a></div>{eventsLoading ? <article className="event-card event-status">Loading upcoming events...</article> : eventsError ? <article className="event-card event-status">Events are temporarily unavailable.</article> : events.length > 0 ? <EventCard event={events[0]} /> : <article className="event-card event-status">No upcoming events yet.</article>}</section>
      <section className="cafes-section" id="cafes"><div className="section-heading"><div><p className="eyebrow">PLAY NEARBY</p><h2>Gaming cafes</h2></div><button className="view-toggle" aria-label="Search cafes"><Search size={17} /></button></div><div className="cafe-list">{cafes.map((cafe) => <CafeCard cafe={cafe} key={cafe.name} />)}</div></section>
    </div>
    <nav className="bottom-nav" aria-label="Main navigation"><a className="active" href="#home"><Home size={20} /><span>Home</span></a><a href="#search"><Search size={20} /><span>Explore</span></a><a href="/bookings"><Ticket size={20} /><span>Bookings</span></a></nav>
  </main>
}
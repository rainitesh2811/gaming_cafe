'use client'

import { useState } from 'react'
import { Bell, ChevronDown, Gamepad2, Home, Map, Menu, Search, Star, Ticket, UserRound } from 'lucide-react'

const cafes = [
  { name: 'Pixel Forge Arena', rating: '4.8', distance: '1.2 km away', image: '/cafe-neon-grid.png', specs: ['RTX 4080', '180Hz'], accent: 'cyan' },
  { name: 'Nexus Gaming Lounge', rating: '4.6', distance: '2.4 km away', image: '/tournament-arena.png', specs: ['RTX 4070 Ti', '165Hz'], accent: 'purple' },
]

function EventCard() {
  return <article className="event-card">
    <img src="/tournament-arena.png" alt="Esports tournament arena" />
    <div className="event-overlay" />
    <div className="event-content"><p className="eyebrow">LIVE EVENT · THIS SATURDAY</p><h3>Midnight Mayhem</h3><p className="event-meta">Valorant · 32 teams · 10:00 PM</p><div className="event-bottom"><strong>02<span>d</span> 14<span>h</span> 32<span>m</span></strong><button>Book Seat <span>→</span></button></div></div>
    <div className="carousel-dots"><i className="active" /><i /><i /></div>
  </article>
}

function CafeCard({ cafe }: { cafe: typeof cafes[number] }) {
  return <article className="cafe-card">
    <div className="cafe-image"><img src={cafe.image} alt={`${cafe.name} interior`} /><span className="open-pill"><i /> Open now</span><button className="heart" aria-label={`Save ${cafe.name}`}>♡</button></div>
    <div className="cafe-info"><div className="cafe-title"><div><h3>{cafe.name}</h3><p><Star size={13} fill="currentColor" /> {cafe.rating} <span>·</span> {cafe.distance}</p></div><span className={`score ${cafe.accent}`}>{cafe.rating}</span></div><div className="specs">{cafe.specs.map((spec) => <span key={spec}>{spec}</span>)}</div><button className="reserve">View &amp; Reserve <span>→</span></button></div>
  </article>
}

export function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return <main className="home-shell">
    <header className="topbar"><button className="icon-button" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}><Menu size={22} /></button><button className="location"><span>⌖</span><span><small>YOUR LOCATION</small>Downtown Branch</span><ChevronDown size={15} /></button><div className="top-actions"><button className="icon-button notification" aria-label="Notifications"><Bell size={19} /><i /></button><button className="avatar" aria-label="Profile"><UserRound size={18} /></button></div>{menuOpen && <div className="menu-popover"><strong>Menu</strong><a href="#events">Events</a><a href="#cafes">Saved cafes</a><a href="#help">Help center</a></div>}</header>
    <div className="home-content">
      <div className="greeting"><div><p className="eyebrow">TUESDAY, SEP 23</p><h1>Find your <span>next play.</span></h1></div><button className="filter-button" aria-label="Filter cafes"><Map size={17} /></button></div>
      <section className="events-section" id="events"><div className="section-heading"><div><p className="eyebrow">DON&apos;T MISS OUT</p><h2>Upcoming events</h2></div><a href="#all-events">View all <span>→</span></a></div><EventCard /></section>
      <section className="cafes-section" id="cafes"><div className="section-heading"><div><p className="eyebrow">PLAY NEARBY</p><h2>Gaming cafes</h2></div><button className="view-toggle" aria-label="Search cafes"><Search size={17} /></button></div><div className="cafe-list">{cafes.map((cafe) => <CafeCard cafe={cafe} key={cafe.name} />)}</div></section>
    </div>
    <nav className="bottom-nav" aria-label="Main navigation"><a className="active" href="#home"><Home size={20} /><span>Home</span></a><a href="#search"><Search size={20} /><span>Explore</span></a><a href="#bookings"><Ticket size={20} /><span>Bookings</span></a><a href="#profile"><UserRound size={20} /><span>Profile</span></a></nav>
  </main>
}
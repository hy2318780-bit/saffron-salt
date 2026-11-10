'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Check, Clock3, MapPin, Phone, UtensilsCrossed } from 'lucide-react'

const slots = ['12:00', '13:00', '14:00', '19:00', '20:00', '21:00', '22:00']
const categories = ['Starters', 'Mains', 'Desserts', 'Drinks']
const menu = [
  { c: 'Starters', n: 'Smoked Beetroot Chaat', d: 'Yoghurt, pomegranate, tamarind glaze, crisp sev.', p: 420, t: 'Veg' },
  { c: 'Starters', n: 'Kolhapuri Prawns', d: 'Charcoal-grilled, red chilli butter, kokum.', p: 780, t: 'Spicy' },
  { c: 'Starters', n: 'Paneer Tikka, Slow Fire', d: 'Hung curd marinade, mint, burnt onion.', p: 540, t: 'Veg' },
  { c: 'Mains', n: 'Dum Raan', d: 'Eight-hour lamb leg, saffron gravy, roomali.', p: 1650, t: "Chef's special" },
  { c: 'Mains', n: 'Konkan Fish Curry', d: 'Catch of the day, coconut, tirphal, steamed rice.', p: 920, t: 'Spicy' },
  { c: 'Mains', n: 'Black Dal Makhani', d: 'Cooked overnight, finished with white butter.', p: 560, t: 'Veg' },
  { c: 'Desserts', n: 'Jaggery Kulfi', d: 'Pistachio dust, salted caramel.', p: 380, t: 'Veg' },
  { c: 'Desserts', n: 'Warm Gulab Jamun', d: 'Rabri, cardamom, rose petals.', p: 360, t: 'Veg' },
  { c: 'Drinks', n: 'Kokum Spritz', d: 'Kokum, soda, lime, black salt.', p: 340, t: 'Veg' },
]

const prettyTime = (time: string) => {
  const hour = Number(time.slice(0, 2))
  return `${hour % 12 || 12}:${time.slice(3)} ${hour < 12 ? 'am' : 'pm'}`
}

export default function Page() {
  const [category, setCategory] = useState('Starters')
  const [date, setDate] = useState('2026-11-10')
  const [time, setTime] = useState('20:00')
  const [booked, setBooked] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const dishes = useMemo(() => menu.filter((item) => item.c === category), [category])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setNavOpen(false)
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="container nav-inner">
          <button className="wordmark" onClick={() => scrollTo('top')}>Saffron <span>&amp;</span> Salt</button>
          <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setNavOpen(!navOpen)}>Menu</button>
          <nav className={navOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
            <button onClick={() => scrollTo('menu')}>Menu</button>
            <button onClick={() => scrollTo('story')}>Our story</button>
            <button onClick={() => scrollTo('visit')}>Visit</button>
            <button className="nav-cta" onClick={() => scrollTo('reserve')}>Reserve a table</button>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Modern Indian kitchen · Bandra West</p>
              <h1>Slow-cooked.<br /><em>Fast to book.</em></h1>
              <p className="hero-intro">Regional Indian cooking, reworked on a charcoal grill. Come hungry, leave with a new favourite.</p>
              <div className="hero-actions">
                <button className="button button-gold" onClick={() => scrollTo('reserve')}>Book a table <ArrowRight size={17} /></button>
                <button className="text-button" onClick={() => scrollTo('menu')}>Explore the menu</button>
              </div>
              <div className="open-note"><span className="status-dot" /> Dinner service tonight · 7pm–11pm</div>
            </div>
            <div className="hero-art" aria-label="Abstract illustration of spices and a cooking flame" role="img">
              <div className="art-circle circle-one" /><div className="art-circle circle-two" /><div className="art-arch" />
              <div className="spice-card"><span>Today's<br />special</span><strong>Dum Raan</strong><small>8 hours · saffron gravy</small></div>
              <div className="art-spice spice-saffron">S</div><div className="art-spice spice-chilli">✦</div>
            </div>
          </div>
        </section>

        <section className="marquee"><div>Charcoal &nbsp;·&nbsp; Coastal &nbsp;·&nbsp; Comfort &nbsp;·&nbsp; Crafted &nbsp;·&nbsp; Charcoal &nbsp;·&nbsp; Coastal &nbsp;·&nbsp; Comfort &nbsp;·&nbsp; Crafted</div></section>

        <section className="section" id="menu"><div className="container">
          <div className="section-heading"><div><p className="eyebrow">From our kitchen</p><h2>A menu with a point of view.</h2></div><p className="section-lede">We cook with the seasons, the neighbourhood, and a healthy respect for the classics.</p></div>
          <div className="tabs" role="tablist">{categories.map((item) => <button key={item} className={category === item ? 'tab active' : 'tab'} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <div className="dish-list">{dishes.map((dish) => <article className="dish" key={dish.n}><div><div className="dish-title"><h3>{dish.n}</h3><span>{dish.t}</span></div><p>{dish.d}</p></div><strong>₹{dish.p}</strong></article>)}</div>
          <button className="outline-button" onClick={() => setCategory('Mains')}>View dinner menu <ArrowRight size={16} /></button>
        </div></section>

        <section className="story-section" id="story"><div className="container story-grid"><div className="story-image"><div className="story-label">Born in Mumbai<br />Made for sharing</div></div><div className="story-copy"><p className="eyebrow">The Saffron &amp; Salt way</p><h2>Tradition, with the volume turned up.</h2><p>There is no one way to cook Indian food. Our menu travels from the Konkan coast to the kitchens of old Delhi, with detours wherever the good stuff grows.</p><p>Everything is made in-house, from the first crackle of the charcoal to the last spoonful of kulfi.</p><button className="text-button dark">Read our story <ArrowRight size={17} /></button></div></div></section>

        <section className="reserve-section" id="reserve"><div className="container reserve-grid"><div><p className="eyebrow">Your table awaits</p><h2>Make a night of it.</h2><p className="reserve-copy">Pick a date and time. We will hold your table the moment you submit.</p><div className="testimonial">“The raan alone is worth the trip. Service never rushed us.”<small>— Meera K., 5 stars</small></div></div><div className="booking-card">{booked ? <div className="success"><div className="success-icon"><Check /></div><p className="eyebrow">Booking received</p><h3>See you at the table.</h3><p>Your table for two is held for <strong>{prettyTime(time)}</strong> on {date}.</p><button className="outline-button" onClick={() => setBooked(false)}>Make another booking</button></div> : <form onSubmit={(event) => { event.preventDefault(); setBooked(true) }}><div className="booking-top"><h3>Reserve a table</h3><span><span className="status-dot" /> Tables available</span></div><label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} min="2026-11-10" /></label><div className="form-row"><label>Time<select value={time} onChange={(e) => setTime(e.target.value)}>{slots.map((slot) => <option key={slot}>{slot}</option>)}</select></label><label>Guests<select defaultValue="2">{[1,2,3,4,5,6,7,8].map((n) => <option key={n}>{n}</option>)}</select></label></div><label>Full name<input required placeholder="Your name" /></label><label>Phone<input required type="tel" placeholder="+91 98200 00000" /></label><label>Email<input required type="email" placeholder="you@example.com" /></label><button className="button button-dark" type="submit">Confirm booking <ArrowRight size={17} /></button><small className="form-note">No payment required. We will confirm by SMS.</small></form>}</div></div></section>

        <section className="visit-section" id="visit"><div className="container visit-grid"><div><p className="eyebrow">Find us</p><h2>Come as you are.</h2><p>14 Hill Road, Bandra West<br />Mumbai 400050</p><a href="tel:+919820000000"><Phone size={15} /> +91 98200 00000</a><a href="mailto:hello@saffronandsalt.example"><span>@</span> hello@saffronandsalt.example</a></div><div className="hours-card"><div><MapPin size={19} /><span>Easy to find, hard to leave.</span></div><div className="hours"><strong>Hours</strong><p>Mon–Thu: 7pm–11pm<br />Fri–Sun: 12pm–3pm, 7pm–11pm</p></div><div className="hours"><strong>Good to know</strong><p>Last booking at 10pm<br />Walk-ins welcome at the bar</p></div></div></div></section>
      </main>
      <footer><div className="container footer-inner"><span className="wordmark">Saffron <span>&amp;</span> Salt</span><span>Modern Indian kitchen, Bandra.</span><span>© 2026 Saffron &amp; Salt</span></div></footer>
    </div>
  )
}

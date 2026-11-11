'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { ArrowRight, Minus, Plus, ShoppingBag } from 'lucide-react'
import { categories, menu, type MenuCategory, type MenuItem } from '@/lib/menu'

type Cart = Record<string, number>

export function OrderMenu() {
  const [category, setCategory] = useState<MenuCategory>('Starters')
  const [cart, setCart] = useState<Cart>({})
  const [message, setMessage] = useState('')
  const [orderId, setOrderId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
  const dishes = useMemo(() => menu.filter((item) => item.c === category), [category])
  const cartItems = menu.filter((item) => cart[item.n])
  const total = cartItems.reduce((sum, item) => sum + item.p * cart[item.n], 0)

  const setQuantity = (item: MenuItem, next: number) => {
    setCart((current) => {
      const updated = { ...current }
      if (next <= 0) delete updated[item.n]
      else updated[item.n] = Math.min(next, 12)
      return updated
    })
    setMessage('')
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          phone: form.get('phone'),
          email: form.get('email'),
          date: form.get('date'),
          time: form.get('time'),
          notes: form.get('notes'),
          items: cartItems.map((item) => ({ name: item.n, quantity: cart[item.n] })),
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        setMessage(result.error ?? 'Please review your order and try again.')
        return
      }
      setOrderId(result.orderId)
      setCart({})
      formElement.reset()
    } catch {
      setMessage('We could not reach the restaurant. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="order-section" id="order" aria-labelledby="order-title">
      <div className="container">
        <div className="section-heading order-heading">
          <div><p className="eyebrow">Order for pickup</p><h2 id="order-title">Your favourites, to go.</h2></div>
          <p className="section-lede">Choose from the kitchen, pick a collection time, and we&apos;ll have it freshly made for you.</p>
        </div>
        {orderId ? (
          <div className="order-confirmation" role="status">
            <span className="eyebrow">Order received</span>
            <h3>We&apos;re getting your order ready.</h3>
            <p>Show this reference when you arrive: <strong>{orderId.slice(0, 8).toUpperCase()}</strong></p>
            <p>Pay at the restaurant when you collect. Keep this reference handy for pickup.</p>
            <button className="outline-button" onClick={() => setOrderId('')}>Place another order</button>
          </div>
        ) : (
          <div className="order-layout">
            <div className="order-catalog">
              <div className="tabs" role="tablist" aria-label="Menu categories">
                {categories.map((item) => <button key={item} type="button" role="tab" aria-selected={category === item} className={category === item ? 'tab active' : 'tab'} onClick={() => setCategory(item)}>{item}</button>)}
              </div>
              <div className="dish-list">
                {dishes.map((dish) => (
                  <article className="dish order-dish" key={dish.n}>
                    <div><div className="dish-title"><h3>{dish.n}</h3><span>{dish.t}</span></div><p>{dish.d}</p></div>
                    <div className="order-item-action"><strong>₹{dish.p}</strong>{cart[dish.n] ? <div className="quantity-control" aria-label={`${dish.n} quantity`}><button type="button" aria-label={`Remove one ${dish.n}`} onClick={() => setQuantity(dish, cart[dish.n] - 1)}><Minus /></button><span aria-live="polite">{cart[dish.n]}</span><button type="button" aria-label={`Add one ${dish.n}`} onClick={() => setQuantity(dish, cart[dish.n] + 1)}><Plus /></button></div> : <button type="button" className="add-button" onClick={() => setQuantity(dish, 1)}><Plus /> Add</button>}</div>
                  </article>
                ))}
              </div>
            </div>
            <aside className="cart-card" aria-label="Your pickup order">
              <div className="cart-heading"><h3><ShoppingBag /> Your order</h3><span>{cartItems.reduce((count, item) => count + cart[item.n], 0)} items</span></div>
              {cartItems.length === 0 ? <p className="cart-empty">Your bag is waiting for something good.</p> : <ul className="cart-list">{cartItems.map((item) => <li key={item.n}><span>{item.n} <small>× {cart[item.n]}</small></span><strong>₹{item.p * cart[item.n]}</strong></li>)}</ul>}
              <div className="cart-total"><span>Estimated total</span><strong>₹{total}</strong></div>
              <p className="cart-note">Pay when you collect. Prices are in INR.</p>
              {cartItems.length > 0 && <form className="order-form" onSubmit={submitOrder}>
                <label>Your name<input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Full name" /></label>
                <label>Phone number<input name="phone" required type="tel" autoComplete="tel" placeholder="+91 98200 00000" /></label>
                <label>Email address<input name="email" required type="email" autoComplete="email" placeholder="you@example.com" /></label>
                <div className="form-row"><label>Pickup date<input name="date" required type="date" min={today} defaultValue={today} /></label><label>Pickup time<select name="time" defaultValue="20:00">{['12:00', '13:00', '14:00', '19:00', '20:00', '21:00', '22:00'].map((time) => <option key={time} value={time}>{time}</option>)}</select></label></div>
                <label>Notes <span className="optional-label">optional</span><textarea name="notes" maxLength={500} rows={2} placeholder="Allergies or special requests" /></label>
                <button className="button button-dark" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Placing order…' : 'Place pickup order'} <ArrowRight size={17} /></button>
                <p className="order-error" aria-live="polite">{message}</p>
              </form>}
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}

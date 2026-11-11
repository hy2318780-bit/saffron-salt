import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { restaurantOrders } from '@/lib/db/schema'
import { menu } from '@/lib/menu'

const pickupSlots = new Set(['12:00', '13:00', '14:00', '19:00', '20:00', '21:00', '22:00'])
const phonePattern = /^[+\d][\d\s()-]{7,19}$/

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Please check your order details.' }, { status: 400 })

    const order = body as Record<string, unknown>
    const name = typeof order.name === 'string' ? order.name.trim() : ''
    const phone = typeof order.phone === 'string' ? order.phone.trim() : ''
    const email = typeof order.email === 'string' ? order.email.trim().toLowerCase() : ''
    const notes = typeof order.notes === 'string' ? order.notes.trim().slice(0, 500) : ''
    const date = typeof order.date === 'string' ? order.date : ''
    const time = typeof order.time === 'string' ? order.time : ''

    if (name.length < 2 || name.length > 100 || !phonePattern.test(phone) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Enter a valid name, phone number, and email address.' }, { status: 400 })
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !pickupSlots.has(time)) {
      return NextResponse.json({ error: 'Choose a valid pickup date and time.' }, { status: 400 })
    }

    const pickupAt = new Date(`${date}T${time}:00+05:30`)
    if (Number.isNaN(pickupAt.getTime()) || pickupAt.toISOString().slice(0, 10) !== date || pickupAt.getTime() < Date.now()) {
      return NextResponse.json({ error: 'Pickup time must be in the future.' }, { status: 400 })
    }

    if (!Array.isArray(order.items) || order.items.length === 0 || order.items.length > menu.length) {
      return NextResponse.json({ error: 'Add at least one menu item to your order.' }, { status: 400 })
    }

    const pricedItems = []
    let quantityTotal = 0
    let totalPaise = 0
    for (const entry of order.items) {
      if (!entry || typeof entry !== 'object') return NextResponse.json({ error: 'Please check your order items.' }, { status: 400 })
      const { name: itemName, quantity } = entry as Record<string, unknown>
      const menuItem = typeof itemName === 'string' ? menu.find((item) => item.n === itemName) : undefined
      if (!menuItem || !Number.isInteger(quantity) || (quantity as number) < 1 || (quantity as number) > 12) {
        return NextResponse.json({ error: 'One or more order items are invalid.' }, { status: 400 })
      }
      quantityTotal += quantity as number
      totalPaise += menuItem.p * 100 * (quantity as number)
      pricedItems.push({ name: menuItem.n, quantity: quantity as number, unitPricePaise: menuItem.p * 100 })
    }
    if (quantityTotal > 30) return NextResponse.json({ error: 'Your order is over the 30-item limit.' }, { status: 400 })

    const [created] = await db.insert(restaurantOrders).values({
      customerName: name,
      phone,
      email,
      pickupAt,
      items: pricedItems,
      totalPaise,
      notes,
    }).returning({ id: restaurantOrders.id })

    return NextResponse.json({ orderId: created.id }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'We could not place your order right now. Please try again.' }, { status: 500 })
  }
}

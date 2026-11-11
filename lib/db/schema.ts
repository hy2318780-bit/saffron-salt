import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const restaurantOrders = pgTable('restaurant_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerName: text('customer_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  pickupAt: timestamp('pickup_at', { withTimezone: true }).notNull(),
  items: jsonb('items').$type<Array<{ name: string; quantity: number; unitPricePaise: number }>>().notNull(),
  totalPaise: integer('total_paise').notNull(),
  notes: text('notes').notNull().default(''),
  status: text('status').notNull().default('received'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

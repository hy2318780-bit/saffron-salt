export const categories = ['Starters', 'Mains', 'Desserts', 'Drinks'] as const

export type MenuCategory = (typeof categories)[number]

export type MenuItem = {
  c: MenuCategory
  n: string
  d: string
  p: number
  t: string
}

export const menu: MenuItem[] = [
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

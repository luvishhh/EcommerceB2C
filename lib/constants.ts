export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Ecom'
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev'
export const SENDER_NAME = process.env.SENDER_NAME || APP_NAME
export const APP_SLOGAN =
  process.env.NEXT_PUBLIC_APP_SLOGAN || 'Your one-stop shop for everything'
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'E-commerce B2C BUILT WITH NEXT.JS AND MONFOGO DB'
export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9)
export const CATEGORY_MAPPING = {
  'Door Hardware': [
    'Door Handles',
    'Designer Material',
    'Back Rubbers',
    'Door Stoppers',
    'Door Magnets',
    'Aldrops-SS',
    'Aldrops-Antique',
    'Tower Bolts',
    'Hinges-SS',
  ],
  'Door Locks': [
    'Lock Cylinder',
    'Mortise Handles',
    'Dead Locks',
    'Digital Locks',
    'Rim Locks',
  ],
  'Window Hardware': ['Window Handles', 'Window Stays', 'Window Hinges'],
  'Cabinet Hardware': ['Hinges', 'Handles', 'Locks', 'Channels'],
  'Glass Profiles': ['U Channels', 'F Profiles', 'H Profiles', 'L Angles'],
  'Almirah Hardware': ['Handles', 'Hinges', 'Locks', 'Accessories'],
  'Sofa Hardware': ['Mechanisms', 'Springs', 'Legs', 'Accessories'],
  'Table Hardware': ['Legs', 'Casters', 'Brackets', 'Mechanisms'],
} as const

export type Category = keyof typeof CATEGORY_MAPPING
export type Subcategory<T extends Category> =
  (typeof CATEGORY_MAPPING)[T][number]

export const FREE_SHIPPING_MIN_PRICE = Number(
  process.env.FREE_SHIPPING_MIN_PRICE || 35
)
export const APP_COPYRIGHT =
  process.env.NEXT_PUBLIC_APP_COPYRIGHT ||
  `Copyright © 2025 ${APP_NAME}. All rights reserved.`
export const AVAILABLE_PAYMENT_METHODS = [
  {
    name: 'PayPal',
    commission: 0,
    isDefault: true,
  },
  {
    name: 'Stripe',
    commission: 0,
    isDefault: true,
  },
  {
    name: 'Cash On Delivery',
    commission: 0,
    isDefault: true,
  },
]
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || 'PayPal'

export const AVAILABLE_DELIVERY_DATES = [
  {
    name: 'Tomorrow',
    daysToDeliver: 1,
    shippingPrice: 12.9,
    freeShippingMinPrice: 0,
  },
  {
    name: 'Next 3 Days',
    daysToDeliver: 3,
    shippingPrice: 6.9,
    freeShippingMinPrice: 0,
  },
  {
    name: 'Next 5 Days',
    daysToDeliver: 5,
    shippingPrice: 4.9,
    freeShippingMinPrice: 35,
  },
]

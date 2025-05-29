export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Ecom'
export const APP_SLOGAN =
  process.env.NEXT_PUBLIC_APP_SLOGAN || 'Your one-stop shop for everything'
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'E-commerce B2C BUILT WITH NEXT.JS AND MONFOGO DB'

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

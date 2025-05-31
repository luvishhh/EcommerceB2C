export type SubCategory = {
  name: string
  products?: { name: string }[]
}

export type Category = {
  name: string
  subCategories: SubCategory[]
}

export const categories: Category[] = [
  {
    name: 'Door Hardware',
    subCategories: [
      { name: 'Door Handles' },
      { name: 'Designer Material' },
      { name: 'Back Rubbers' },
      { name: 'Door Stoppers' },
      { name: 'Door Megnets' },
      { name: 'Aldrops-SS' },
      { name: 'Aldrops-Antique' },
      { name: 'Tower Bolts' },
      {
        name: 'Hinges-SS',
        products: [
          { name: '4x12 Beeta Full SS' },
          { name: '5x12 Beeta Full SS' },
          { name: '6x12 Beeta Full SS' },
        ],
      },
    ],
  },
  {
    name: 'Door Locks',
    subCategories: [
      { name: 'Fancy Designs' },
      { name: '10 Inches Locks' },
      { name: 'SS Material' },
      { name: 'MS Material' },
      { name: 'Lock Machine' },
      {
        name: 'Lock Cylinder',
        products: [{ name: '70 mm Cylender' }, { name: '80 mm Cylender' }],
      },
    ],
  },
  {
    name: 'Window Hardware',
    subCategories: [
      { name: 'Hinges-SS' },
      { name: 'Handles' },
      { name: 'Hooks' },
      { name: 'Tower Bolts' },
    ],
  },
  {
    name: 'Cabinet Hardware',
    subCategories: [
      { name: 'G-Profiles' },
      { name: 'Pull Knobs' },
      { name: 'Handles' },
    ],
  },
  {
    name: 'Glass Profiles',
    subCategories: [
      { name: 'Glass Frame Profiles' },
      { name: 'Glass Handle Profiles' },
    ],
  },
  {
    name: 'Almirah Hardware',
    subCategories: [
      { name: 'L Bihari Hinge' },
      { name: 'Telescopic Channel' },
      { name: 'Designer Handles' },
      {
        name: 'Accessories',
        products: [
          { name: 'Single L Patti' },
          { name: 'Double L Patti' },
          { name: 'L Patti-5 Holes' },
        ],
      },
      { name: 'Slide Door Handle' },
      { name: 'Slide Door Channel & Runner' },
    ],
  },
  {
    name: 'Sofa Hardware',
    subCategories: [],
  },
  {
    name: 'Table Hardware',
    subCategories: [],
  },
]

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

type CardItem = {
  title: string
  link?: { text: string; href: string }
  items: {
    name: string
    items?: string[]
    image: string
    images?: string[] // Additional images
    href: string
    description?: string
    price?: string
    listPrice?: string
    category?: string
    subCategory?: string
    subcategories?: Array<{
      name: string
      count: number
      images: string[]
    }>
  }[]
}

export function HomeCard({ cards }: { cards: CardItem[] }) {
  console.log('HomeCard received cards:', cards)
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
      {cards.map((card) => (
        <Card key={card.title} className='rounded-none flex flex-col'>
          <CardContent className='p-2 flex-grow flex flex-col justify-between'>
            <h3 className='text-base font-semibold mb-2'>{card.title}</h3>
            <div className='grid grid-cols-2 gap-2 md:gap-4 mb-4'>
              {card.items.map((item) => (
                <Link key={item.name} href={item.href} className='group block'>
                  <div className='relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 mb-1 bg-gray-50'>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                    {item.images && item.images.length > 1 && (
                      <div className='absolute bottom-1 right-1 flex gap-0.5'>
                        {item.images.slice(1, 4).map((img, idx) => (
                          <div
                            key={idx}
                            className='relative w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full overflow-hidden border border-white bg-gray-50'
                          >
                            <Image
                              src={img}
                              alt={`${item.name} image ${idx + 2}`}
                              fill
                              className='object-cover'
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className='space-y-0.5 text-xs sm:text-sm'>
                    <h4 className='font-medium line-clamp-1 leading-tight'>
                      {item.name}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
            {card.link && (
              <div className='flex justify-start mt-auto'>
                <Link
                  href={card.link.href}
                  className='text-sm text-black hover:underline font-bold'
                >
                  {card.link.text}
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

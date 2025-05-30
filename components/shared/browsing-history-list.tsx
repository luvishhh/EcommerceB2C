'use client'

import React, { useEffect } from 'react'
import ProductSlider from './product/product-slider'
import { Separator } from '../ui/separator'
import { cn } from '@/lib/utils'
import useBrowsingHistory from '@/app/hooks/use-browsing-history'

export default function BrowsingHistoryList({
  className,
}: {
  className?: string
}) {
  const { products } = useBrowsingHistory()
  return (
    products.length !== 0 && (
      <div className='bg-background'>
        <Separator className={cn('mb-4', className)} />
        <ProductList
          title={"Related to items that you've viewed"}
          type='related'
        />
        <Separator className='mb-4' />
        <ProductList
          title={'Your browsing history'}
          hideDetails
          type='history'
        />
      </div>
    )
  )
}

function ProductList({
  title,
  type = 'history',
  hideDetails = false,
}: {
  title: string
  type: 'history' | 'related'
  hideDetails?: boolean
}) {
  const { products } = useBrowsingHistory()
  const [data, setData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      if (products.length === 0) {
        setData([])
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Create query parameters for categories and subcategories
        const categories = products.map((product) => product.category).join(',')
        const subCategories = products
          .map((product) => product.subCategory)
          .join(',')
        const ids = products.map((product) => product.id).join(',')

        const queryParams = new URLSearchParams({
          type,
          categories,
          subCategories,
          ids,
        })

        // Fixed API endpoint URL
        const res = await fetch(`/api/product/browsing-history?${queryParams}`)

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        setData(data)
      } catch (error) {
        console.error('Error fetching browsing history:', error)
        setError(
          error instanceof Error ? error.message : 'Failed to fetch products'
        )
        setData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [products, type])

  if (isLoading) {
    return (
      <div className='py-4'>
        <h3 className='text-lg font-semibold mb-4'>{title}</h3>
        <div className='flex gap-4 overflow-x-auto pb-4'>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='w-64 h-80 bg-grey-500/10 animate-pulse rounded-lg'
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='py-4'>
        <h3 className='text-lg font-semibold mb-4'>{title}</h3>
        <div className='text-red-500'>{error}</div>
      </div>
    )
  }

  return (
    data.length > 0 && (
      <ProductSlider title={title} products={data} hideDetails={hideDetails} />
    )
  )
}

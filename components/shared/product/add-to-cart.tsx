/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import useCartStore from '@/hooks/use-cart-store'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { OrderItem } from '@/type'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { nanoid } from 'nanoid'

// Assuming a Product type exists with necessary fields like _id, name, slug, category, subCategory, image, price, colors, sizes, countInStock
import { IProduct } from '@/lib/db/models/product.model' // Using IProduct from product.model as it contains countInStock

export default function AddToCart({
  product,
  minimal = false,
}: {
  product: IProduct // Changed from OrderItem to IProduct
  minimal?: boolean
}) {
  const router = useRouter()
  // useSonner is not needed since we import toast directly

  const { addItem } = useCartStore()

  const [quantity, setQuantity] = useState(1)

  // Create OrderItem from Product and selected quantity
  const orderItem: OrderItem = {
    clientId: nanoid(), // Generate a unique clientId for each cart item
    product: product._id.toString(),
    name: product.name,
    slug: product.slug,
    category: product.category,
    subCategory: product.subCategory,
    quantity: quantity, // This will be updated when adding to cart
    image: product.images[0] || '', // Use first image, provide fallback empty string
    price: product.price ? product.price.toString() : '0.00', // Ensure price is a string
    size:
      product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined, // Default size if available
    color:
      product.colors && product.colors.length > 0
        ? product.colors[0]
        : undefined, // Default color if available
    // countInStock is not part of OrderItemSchema, removed
  }

  return minimal ? (
    <Button
      className='rounded-full w-auto'
      onClick={async () => {
        try {
          const itemId = await addItem(orderItem, 1)
          toast({
            description: 'Added to Cart',
            action: (
              <Button
                onClick={() => {
                  router.push(`/cart/${itemId}`)
                }}
              >
                Go to Cart
              </Button>
            ),
          } as any)
        } catch (error: any) {
          toast({
            variant: 'destructive',
            description: error.message,
          } as any)
        }
      }}
    >
      Add to Cart
    </Button>
  ) : (
    <div className='w-full space-y-2'>
      <Select
        value={quantity.toString()}
        onValueChange={(i) => setQuantity(Number(i))}
      >
        <SelectTrigger className=''>
          <SelectValue>Quantity: {quantity}</SelectValue>
        </SelectTrigger>
        <SelectContent position='popper'>
          {/* Use product.countInStock for quantity options */}
          {Array.from({ length: product.countInStock }).map((_, i) => (
            <SelectItem key={i + 1} value={`${i + 1}`}>
              {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        className='rounded-full w-full'
        type='button'
        onClick={async () => {
          try {
            const itemId = await addItem(orderItem, quantity)
            console.log('Redirecting to /cart/' + itemId)
            router.push(`/cart/${itemId}`)
          } catch (error: any) {
            toast({
              variant: 'destructive',
              description: error.message,
            } as any)
          }
        }}
      >
        Add to Cart
      </Button>
      <Button
        variant='secondary'
        onClick={async () => {
          try {
            await addItem(orderItem, quantity)
            router.push(`/checkout`)
          } catch (error: any) {
            toast({
              variant: 'destructive',
              description: error.message,
            } as any)
          }
        }}
        className='w-full rounded-full '
      >
        Buy Now
      </Button>
    </div>
  )
}

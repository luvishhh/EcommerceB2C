import {
  CartSchema,
  OrderItemSchema,
  ProductInputSchema,
} from '@/lib/validator'
import { z } from 'zod'

export type IProductInput = z.infer<typeof ProductInputSchema>

// Product type with explicit string prices for better type safety
export type Product = {
  name: string
  slug: string
  category: string
  subCategory: string
  images: string[]
  brand?: string
  description?: string
  isPublished: boolean
  price?: string
  listPrice?: string
  countInStock: number
  tags: string[]
  sizes: string[]
  colors: string[]
  avgRating: number
  numReviews: number
  ratingDistribution: { rating: number; count: number }[]
  reviews: string[]
  numSales: number
}

export type Data = {
  products: Product[]
  productsMeta?: {
    total: number
    page: number
    pageSize: number
  }
  category: {
    name: string
    subCategories: string[]
  }[]
  headerMenus: {
    name: string
    href: string
    subMenus?: { name: string; href: string }[]
  }[]
  carousels: {
    image: string
    url: string
    title: string
    buttonCaption: string
    isPublished: boolean
    description?: string
    altText?: string
    priority?: number
  }[]
}
export type OrderItem = z.infer<typeof OrderItemSchema>
export type Cart = z.infer<typeof CartSchema>

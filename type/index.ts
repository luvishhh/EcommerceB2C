import {
  CartSchema,
  OrderInputSchema,
  OrderItemSchema,
  ProductInputSchema,
  ReviewInputSchema,
  ShippingAddressSchema,
  UserInputSchema,
  UserNameSchema,
  UserSignInSchema,
  UserSignUpSchema,
} from '@/lib/validator'
import { z } from 'zod'

export type IReviewInput = z.infer<typeof ReviewInputSchema>
export type IReviewDetails = IReviewInput & {
  _id: string
  createdAt: string
  user: {
    name: string
  }
}

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
  users: IUserInput[]
  products: Product[]
  reviews: {
    title: string
    rating: number
    comment: string
  }[]
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
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>

//user
export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>

export type IUserSignUp = z.infer<typeof UserSignUpSchema>
export type IUserName = z.infer<typeof UserNameSchema>
export interface IOrderInput {
  user: string | { name: string; email: string }
  items: Array<{
    clientId: string
    product: string
    name: string
    slug: string
    category: string
    subCategory: string
    quantity: number
    image: string
    price: string
    size?: string
    color?: string
    countInStock: number
  }>
  shippingAddress: {
    fullName: string
    street: string
    city: string
    postalCode: string
    province: string
    phone: string
    country: string
  }
  paymentMethod: string
  paymentResult?: {
    id: string
    status: string
    email_address: string
    pricePaid: string
  }
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
  expectedDeliveryDate: Date
  isPaid: boolean
  paidAt: Date
  isDelivered: boolean
  deliveredAt: Date
}
export type IOrderList = IOrderInput & {
  _id: string
  user: {
    name: string
    email: string
  }
  createdAt: Date
}

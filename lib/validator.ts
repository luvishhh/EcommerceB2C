import { z } from 'zod'

// Common
const Price = (field: string) =>
  z
    .string()
    .refine(
      (value) => /^\d+\.\d{2}$/.test(value),
      `${field} must have exactly two decimal places (e.g., 49.99)`
    )

export const ProductInputSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'), // Main category (e.g., "Door Hardware")
  subCategory: z.string().min(1, 'Sub-category is required'), // Sub-category (e.g., "Hinges-SS")
  images: z.array(z.string()).default([]),
  brand: z.string().optional(),
  description: z.string().optional(),
  isPublished: z.boolean().default(false),
  price: Price('Price').optional(),
  listPrice: Price('List price').optional(),
  countInStock: z.coerce.number().int().nonnegative().default(0),
  tags: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default(['']),
  colors: z.array(z.string()).default([]),
  avgRating: z.coerce.number().min(0).max(5).default(0),
  numReviews: z.coerce.number().int().nonnegative().default(0),
  ratingDistribution: z
    .array(z.object({ rating: z.number(), count: z.number() }))
    .max(5)
    .default([]),
  reviews: z.array(z.string()).default([]),
  numSales: z.coerce.number().int().nonnegative().default(0),
})

// Order Item
export const OrderItemSchema = z.object({
  clientId: z.string().min(1, 'clientId is required'),
  product: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().min(1, 'SubCategory is required'),
  quantity: z
    .number()
    .int()
    .nonnegative('Quantity must be a non-negative number')
    .min(1, 'Quantity must be at least 1'),
  image: z.string().min(1, 'Image is required'),
  price: Price('Price'),
  size: z.string().optional(),
  color: z.string().optional(),
  countInStock: z.number().int().nonnegative(),
})

export const CartSchema = z.object({
  items: z
    .array(OrderItemSchema)
    .min(1, 'Order must contain at least one item'),
  itemsPrice: z.number(),

  taxPrice: z.optional(z.number()),
  shippingPrice: z.optional(z.number()),
  totalPrice: z.number(),
  paymentMethod: z.optional(z.string()),
  deliveryDateIndex: z.optional(z.number()),
  expectedDeliveryDate: z.optional(z.date()),
})

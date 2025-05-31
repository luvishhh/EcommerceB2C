// import {
//   calcDeliveryDateAndPrice,
//   createOrder,
// } from '@/lib/actions/order.action'
import data from '@/lib/data'
import { connectToDatabase } from '.'
import Product from './models/product.model'
import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import User from './models/user.model'
import Review from './models/review.model'
import Order from './models/order.model'
import { IOrderInput, OrderItem, ShippingAddress } from '@/type'
// import client from './models/client'
import {
  calculateFutureDate,
  calculatePastDate,
  generateId,
  round2,
} from '../utils'
// import { count } from 'console'
// import { create } from 'domain'
// import { use } from 'react'
// import { delimiter } from 'path'
import { AVAILABLE_DELIVERY_DATES } from '../constants'

loadEnvConfig(cwd())

const main = async () => {
  try {
    const { products, users, reviews } = data
    await connectToDatabase(process.env.MONGODB_URI)
    await User.deleteMany()
    const createdUser = await User.insertMany(users)
    await Product.deleteMany()
    const createdProducts = await Product.insertMany(products)
    await Review.deleteMany()
    const rws = []
    for (let i = 0; i < createdProducts.length; i++) {
      let x = 0
      const { ratingDistribution } = createdProducts[i]
      for (let j = 0; j < ratingDistribution.length; j++) {
        for (let k = 0; k < ratingDistribution[j].count; k++) {
          x++
          rws.push({
            ...reviews.filter((x) => x.rating === j + 1)[
              x % reviews.filter((x) => x.rating === j + 1).length
            ],
            isVerifiedPurchase: true,
            product: createdProducts[i]._id,
            user: createdUser[x % createdUser.length]._id,
            updatedAt: Date.now(),
            createdAt: Date.now(),
          })
        }
      }
    }
    const createdReviews = await Review.insertMany(rws)
    await Order.deleteMany()
    const orders = []
    for (let i = 0; i < 200; i++) {
      orders.push(
        await generateOrder(
          i,
          createdUser.map((x) => x._id),
          createdProducts.map((x) => x._id)
        )
      )
    }
    await Order.insertMany(orders)
    console.log({
      createdUser,
      createdProducts,
      createdReviews,
      message: 'Seeded database successfully',
    })
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed database')
  }
}
const generateOrder = async (
  i: number,
  users: string[],
  products: string[]
): Promise<IOrderInput> => {
  const product1 = await Product.findById(products[i % products.length])
  const product2 = await Product.findById(
    products[
      i % products.length >= products.length - 1
        ? (i % products.length) - 1
        : (i % products.length) + 1
    ]
  )
  const product3 = await Product.findById(
    products[
      i % products.length >= products.length - 2
        ? (i % products.length) - 2
        : (i % products.length) + 2
    ]
  )
  if (!product1 || !product2 || !product3) {
    throw new Error('Product not found')
  }
  const items = [
    {
      clientId: generateId(),
      product: product1.id,
      name: product1.name,
      slug: product1.slug,
      quantity: 1,
      image: product1.images[0],
      category: product1.category,
      subCategory: product1.subCategory,
      price: product1.price ?? '0',
      countInStock: product1.countInStock,
      size: Array.isArray(product1.sizes)
        ? product1.sizes[0]
        : (product1.sizes ?? undefined),
      color: Array.isArray(product1.colors)
        ? product1.colors[0]
        : (product1.colors ?? undefined),
    },
    {
      clientId: generateId(),
      product: product2.id,
      name: product2.name,
      slug: product2.slug,
      quantity: 1,
      image: product2.images[0],
      category: product2.category,
      subCategory: product2.subCategory,
      price: product2.price ?? '0',
      countInStock: product2.countInStock,
      size: Array.isArray(product2.sizes)
        ? product2.sizes[0]
        : (product2.sizes ?? undefined),
      color: Array.isArray(product2.colors)
        ? product2.colors[0]
        : (product2.colors ?? undefined),
    },
    {
      clientId: generateId(),
      product: product3.id,
      name: product3.name,
      slug: product3.slug,
      quantity: 1,
      image: product3.images[0],
      category: product3.category,
      subCategory: product3.subCategory,
      price: product3.price ?? '0',
      countInStock: product3.countInStock,
      size: Array.isArray(product3.sizes)
        ? product3.sizes[0]
        : (product3.sizes ?? undefined),
      color: Array.isArray(product3.colors)
        ? product3.colors[0]
        : (product3.colors ?? undefined),
    },
  ]
  const order = {
    user: users[i % users.length],
    items: items.map((item) => ({
      ...item,
      product: item.product, // fix typo: was 'prodcut'
    })),
    shippingAddress: data.users[i % users.length].address,
    paymentMethod: data.users[i % users.length].paymentMethod,
    isPaid: true,
    isDelivered: true,
    paidAt: calculatePastDate(i),
    deliveredAt: calculatePastDate(i),
    createdAt: calculatePastDate(i),
    expectedDeliveryDate: calculateFutureDate(i % 2),
    ...calcDeliveryDateAndPriceForSeed({
      items: items as Required<typeof items>, // ensure type matches
      shippingAddress: data.users[i % users.length].address,
      deliveryDateIndex: i % 2,
    }),
  }
  return order
}

export const calcDeliveryDateAndPriceForSeed = ({
  items,
  deliveryDateIndex,
}: {
  deliveryDateIndex?: number
  items: OrderItem[]
  shippingAddress?: ShippingAddress
}) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
  )

  const deliveryDate =
    AVAILABLE_DELIVERY_DATES[
      deliveryDateIndex === undefined
        ? AVAILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex
    ]

  const shippingPrice = deliveryDate.shippingPrice
  const taxPrice = round2(itemsPrice * 0.15)
  const totalPrice = round2(
    itemsPrice +
      (shippingPrice ? round2(shippingPrice) : 0) +
      (taxPrice ? round2(taxPrice) : 0)
  )

  return {
    AVAILABLE_DELIVERY_DATES,
    deliveryDateIndex:
      deliveryDateIndex === undefined
        ? AVAILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  }
}
main()

import { NextRequest } from 'next/server'
import { createOrder } from '@/lib/actions/order.action'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const cart = await req.json()
  const result = await createOrder(cart)
  return Response.json(result)
}

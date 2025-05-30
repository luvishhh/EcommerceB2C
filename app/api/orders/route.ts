import { NextRequest } from 'next/server'
import { createOrder } from '@/lib/actions/order.action'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY)
  console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL)

  const cart = await req.json()
  const result = await createOrder(cart)
  return Response.json(result)
}

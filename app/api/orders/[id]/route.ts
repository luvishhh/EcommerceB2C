import { NextRequest, NextResponse } from 'next/server'
import { getOrderById } from '@/lib/actions/order.action'

// Correct Next.js dynamic route handler signature
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  const order = await getOrderById(params.id)
  if (!order)
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  return NextResponse.json({ isPaid: order.isPaid })
}

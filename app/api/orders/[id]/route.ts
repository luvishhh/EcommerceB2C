import { NextRequest, NextResponse } from 'next/server'
import { getOrderById } from '@/lib/actions/order.action'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const order = await getOrderById(params.id)
  if (!order)
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  return NextResponse.json({ isPaid: order.isPaid })
}

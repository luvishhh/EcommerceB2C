import { notFound } from 'next/navigation'
import React from 'react'

import { auth } from '@/auth'
import PaymentForm from './payment-form'
import { getOrderById } from '@/lib/actions/order.action'

export const metadata = {
  title: 'Payment',
}

const CheckoutPaymentPage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const params = await props.params

  const { id } = params

  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()

  return (
    <PaymentForm
      order={order}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      isAdmin={session?.user?.role === 'Admin' || false}
    />
  )
}

export default CheckoutPaymentPage

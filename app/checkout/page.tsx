import { auth } from '@/auth'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import CheckoutForm from './checkout-form'
// Update the import path below if your 'auth' module is located elsewhere

export const metadata: Metadata = {
  title: 'Checkout',
}
export default async function CheckoutPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/checkout')
  }
  // return <div>Checkout form</div>
  return <CheckoutForm />
}

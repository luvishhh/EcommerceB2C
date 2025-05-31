// components/ClientProviders.tsx
'use client'
import React from 'react'
import useCartSidebar from '@/hooks/use-cart-sidebar'
import CartSidebar from './cart-sidebar'
import { Toaster } from '../ui/sonner'
import { ThemeProvider } from './theme-provider'

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('Rendering ClientProviders')
  const isCartSidebarOpen = useCartSidebar()
  console.log('isCartSidebarOpen:', isCartSidebarOpen)

  return (
    <ThemeProvider attribute='class' defaultTheme='light'>
      {isCartSidebarOpen ? (
        <div className='flex min-h-screen'>
          <div className='flex-1 overflow-hidden'>{children}</div>
          <CartSidebar />
        </div>
      ) : (
        <div>{children}</div>
      )}
      <Toaster />
    </ThemeProvider>
  )
}

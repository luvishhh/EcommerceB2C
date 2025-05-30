import React from 'react'

import Header from '@/components/shared/header'
import Footer from '@/components/shared/footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <main className='container mx-auto px-3'>{children}</main>
      <Footer />
    </>
  )
}

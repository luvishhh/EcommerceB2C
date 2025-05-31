"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function OrderPaidPoller({ orderId, initialIsPaid }: { orderId: string, initialIsPaid: boolean }) {
  const [isPaid, setIsPaid] = useState(initialIsPaid)
  const router = useRouter()

  useEffect(() => {
    if (isPaid) return
    const interval = setInterval(async () => {
      const res = await fetch(`/api/orders/${orderId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.isPaid) {
          setIsPaid(true)
          router.refresh()
        }
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [isPaid, orderId, router])

  return null
}

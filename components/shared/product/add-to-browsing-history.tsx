'use client'
import useBrowsingHistory from '@/hooks/use-browsing-history'
import { useEffect } from 'react'

export default function AddToBrowsingHistory({
  id,
  category,
  subCategory,
}: {
  id: string
  category: string
  subCategory: string
}) {
  const { addItem } = useBrowsingHistory()

  useEffect(() => {
    addItem({ id, category, subCategory })
    // Only run on mount or when id/category/subCategory change
  }, [id, category, subCategory, addItem])

  return null
}

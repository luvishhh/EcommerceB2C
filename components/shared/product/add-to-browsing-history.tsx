'use client'
import useBrowsingHistory from '@/app/hooks/use-browsing-history'
import { useEffect, useCallback } from 'react'

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

  const addToHistory = useCallback(() => {
    addItem({
      id,
      category,
      subCategory,
    })
  }, [id, category, subCategory])

  useEffect(() => {
    addToHistory()
  }, [addToHistory])

  return null
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useCallback } from 'react'

type BrowsingHistory = {
  products: { id: string; category: string; subCategory: string }[]
}

const initialState: BrowsingHistory = {
  products: [],
}

export const browsingHistoryStore = create<BrowsingHistory>()(
  persist(() => initialState, {
    name: 'browsingHistoryStore',
  })
)

export default function useBrowsingHistory() {
  const { products } = browsingHistoryStore()

  // Memoize addItem and clear so they are stable between renders
  const addItem = useCallback(
    (product: { id: string; category: string; subCategory: string }) => {
      browsingHistoryStore.setState((state) => {
        const newProducts = [...state.products]
        const index = newProducts.findIndex((p) => p.id === product.id)
        if (index !== -1) newProducts.splice(index, 1)
        newProducts.unshift(product)
        if (newProducts.length > 10) newProducts.pop()
        return { products: newProducts }
      })
    },
    []
  )

  const clear = useCallback(() => {
    browsingHistoryStore.setState({ products: [] })
  }, [])

  return {
    products,
    addItem,
    clear,
  }
}

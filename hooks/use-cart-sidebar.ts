import { create } from 'zustand'
import { usePathname } from 'next/navigation'
import useDeviceType from './use-device-type'
import useCartStore from './use-cart-store'

// Zustand store for cart sidebar state
export type SidebarState = {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useCartSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))

const isNotInPaths = (s: string) =>
  !/^\/$|^\/cart$|^\/checkout$|^\/sign-in$|^\/sign-up$|^\/order(\/.*)?$|^\/account(\/.*)?$|^\/admin(\/.*)?$/.test(
    s
  )

function useCartSidebar() {
  const {
    cart: { items },
  } = useCartStore()
  const deviceType = useDeviceType()
  const currentPath = usePathname()

  return (
    items.length > 0 && deviceType === 'desktop' && isNotInPaths(currentPath)
  )
}

export default useCartSidebar

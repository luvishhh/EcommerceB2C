import Link from 'next/link'
import CartButton from './cart-button'
import UserButton from './user-button'

export default function Menu() {
  return (
    <div className='flex justify-end'>
      <nav className='flex gap-3 w-full relative z-20'>
        <Link href='/signup' className='flex items-center header-button'>
          Hello, Sign In
        </Link>
        <UserButton />
        <CartButton />
      </nav>
    </div>
  )
}

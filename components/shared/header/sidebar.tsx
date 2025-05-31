import * as React from 'react'
import Link from 'next/link'
import { X, ChevronRight, UserCircle, MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignOut } from '@/lib/actions/user.action'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { auth } from '@/auth'
import { categories } from '@/lib/data/categories'

export default async function Sidebar() {
  const session = await auth()

  return (
    <Drawer direction='left'>
      <DrawerTrigger className='header-button flex items-center !p-2'>
        <MenuIcon className='h-5 w-5 mr-1' />
        All
      </DrawerTrigger>
      <DrawerContent className='w-[350px] mt-0 top-0 bg-white dark:bg-gray-800'>
        <div className='flex flex-col h-full'>
          {/* User Sign In Section */}
          <div className='dark bg-gray-800 text-foreground flex items-center justify-between'>
            <DrawerHeader>
              <DrawerTitle className='flex items-center'>
                <UserCircle className='h-6 w-6 mr-2' />
                {session ? (
                  <DrawerClose asChild>
                    <Link href='/account'>
                      <span className='text-lg font-semibold'>
                        Hello, {session.user.name}
                      </span>
                    </Link>
                  </DrawerClose>
                ) : (
                  <DrawerClose asChild>
                    <Link href='/sign-in'>
                      <span className='text-lg font-semibold'>
                        Hello, sign in
                      </span>
                    </Link>
                  </DrawerClose>
                )}
              </DrawerTitle>
              <DrawerDescription></DrawerDescription>
            </DrawerHeader>
            <DrawerClose asChild>
              <Button variant='ghost' size='icon' className='mr-2'>
                <X className='h-5 w-5' />
                <span className='sr-only'>Close</span>
              </Button>
            </DrawerClose>
          </div>

          {/* Shop By Category */}
          <div className='flex-1 overflow-y-auto'>
            <div className='p-4 border-b'>
              <h2 className='text-lg font-semibold'>Shop By Department</h2>
            </div>
            <nav className='flex flex-col'>
              {categories.map((category) => (
                <div key={category.name} className='border-b'>
                  <Link
                    href={`/search?category=${category.name}`}
                    className='flex items-center justify-between item-button font-semibold'
                  >
                    <span>{category.name}</span>
                    <ChevronRight className='h-4 w-4' />
                  </Link>
                  {category.subCategories.length > 0 && (
                    <div className='pl-4'>
                      {category.subCategories.map((subCategory) => (
                        <DrawerClose asChild key={subCategory.name}>
                          <Link
                            href={`/search?category=${category.name}&subCategory=${subCategory.name}`}
                            className='flex items-center justify-between item-button text-sm'
                          >
                            <span>{subCategory.name}</span>
                            {subCategory.products &&
                              subCategory.products.length > 0 && (
                                <ChevronRight className='h-4 w-4' />
                              )}
                          </Link>
                        </DrawerClose>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Setting and Help */}
          <div className='border-t flex flex-col'>
            <div className='p-4'>
              <h2 className='text-lg font-semibold'>Help & Settings</h2>
            </div>
            <DrawerClose asChild>
              <Link href='/account' className='item-button'>
                Your account
              </Link>
            </DrawerClose>
            <DrawerClose asChild>
              <Link href='/page/customer-service' className='item-button'>
                Customer Service
              </Link>
            </DrawerClose>
            {session ? (
              <form action={SignOut} className='w-full'>
                <Button
                  className='w-full justify-start item-button text-base'
                  variant='ghost'
                >
                  Sign out
                </Button>
              </form>
            ) : (
              <Link href='/sign-in' className='item-button'>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

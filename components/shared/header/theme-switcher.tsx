'use client'

import { ChevronDownIcon, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import useColorStore from '@/hooks/use-color-store'
import useIsMounted from '@/hooks/is-mounted-hook'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { availableColors, color, setColor } = useColorStore(theme)
  const isMounted = useIsMounted()

  const changeTheme = (value: string) => {
    setTheme(value)
  }

  React.useEffect(() => {
    if (!isMounted) return

    const selectedColor = availableColors.find((c) => c.name === color.name)
    if (!selectedColor) return

    const root = document.documentElement
    const colorsToApply: { [key: string]: string } =
      theme === 'dark' ? selectedColor.dark : selectedColor.root

    for (const key in colorsToApply) {
      root.style.setProperty(key, colorsToApply[key])
    }
  }, [theme, color.name, isMounted, availableColors])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='header-button h-[41px]'>
        {theme === 'dark' && isMounted ? (
          <div className='flex items-center gap-1'>
            <Moon className='h-4 w-4' /> Dark <ChevronDownIcon />
          </div>
        ) : (
          <div className='flex items-center gap-1'>
            <Sun className='h-4 w-4' /> Light
            <ChevronDownIcon />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 bg-white dark:bg-gray-800'>
        <DropdownMenuLabel>Theme</DropdownMenuLabel>

        <DropdownMenuRadioGroup value={theme} onValueChange={changeTheme}>
          <DropdownMenuRadioItem value='dark'>
            <Moon className='h-4 w-4 mr-1' /> Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='light'>
            <Sun className='h-4 w-4 mr-1' /> Light
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Color</DropdownMenuLabel>

        <DropdownMenuRadioGroup
          value={color.name}
          onValueChange={(value) => setColor(value, true)}
        >
          {availableColors.map((c) => (
            <DropdownMenuRadioItem key={c.name} value={c.name}>
              <div
                style={{ backgroundColor: c.name }}
                className='h-4 w-4 mr-1 rounded-full'
              ></div>
              {c.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

'use client'

import { IoIosLogIn } from 'react-icons/io'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AuthButton() {
  const { data } = useSession()
  const [isManager, setIsManager] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/getUser')
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const { user } = await response.json()
        console.log('user:', user)

        if (user?.role === 'manager') {
          setIsManager(true)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  return data?.user ? (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className='w-8 h-8'>
          <AvatarImage src={data?.user?.image!} alt='@shadcn' />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {data?.user?.name} {isManager ? ' (Manager)' : ''}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href='profile'>Profile</Link>
        </DropdownMenuItem>
        {isManager && (
          <DropdownMenuItem>
            <Link href='/team-sentiment'>View Team Sentiment</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Link href='/api/auth/signout'>Logout</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Link href='/api/auth/signin'>
      <Button size='icon' variant='ghost'>
        <IoIosLogIn className='text-2xl' />
      </Button>
    </Link>
  )
}

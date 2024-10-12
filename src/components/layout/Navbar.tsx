'use client'
import Link from 'next/link'
import { BrowserOnly } from 'react-kuh'
import { ThemeToggle, AuthButton } from '@/components/layout'
import { useEffect, useState } from 'react'

export default function Navbar() {
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

  return (
    <header className='border-b border-opacity-10 backdrop-blur-lg bg-opacity-70 sticky top-0 z-50'>
      <div className='max-w-screen-2xl mx-auto flex items-center justify-between py-2 px-6 md:px-8'>
        <div className='space-x-3'>
          <Link className='font-bold text-lg w-16 h-auto' href={'/'}>
            PSAPortal
          </Link>

          <Link href='upskill'>Upskill</Link>
          <Link href='/feedback'>Give Feedback</Link>
          {isManager && (
            <Link href='/team-sentiment'>Team Sentiment</Link>
          )}

        </div>

        <div className='flex items-center gap-x-2'>
          <AuthButton />
          <BrowserOnly>
            <ThemeToggle />
          </BrowserOnly>
        </div>
      </div>
    </header>
  )
}

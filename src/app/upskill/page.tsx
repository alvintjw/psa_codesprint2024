'use client'

import Image from 'next/image'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { Button } from '@/registry/new-york/ui/button'
import { ScrollArea, ScrollBar } from '@/registry/new-york/ui/scroll-area'
import { Separator } from '@/registry/new-york/ui/separator'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/registry/new-york/ui/tabs'

import { AlbumArtwork } from './components/album-artwork'
import { Menu } from './components/menu'
import { PodcastEmptyPlaceholder } from './components/podcast-empty-placeholder'
import { Sidebar } from './components/sidebar'
import { listenNowAlbums, madeForYouAlbums } from './data/albums'
import { playlists } from './data/playlists'
import { Loader2 } from 'lucide-react'

// API data interface
// Define the Course type based on the new response structure
interface Course {
  course_id: number
  course_organisation: string
  course_title: string
  course_certificate_type: string
  course_rating: number
  course_difficulty: string
}

export default function CoursePage() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [madeForYouCourses, setMadeForYouCourses] = useState<Course[]>([])
  const [listenNowCourses, setListenNowCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/getUser')
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const { user } = await response.json()
        console.log('user:', user)
        setUser(user)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    if (status === 'authenticated') {
      fetchUserData()
    }
  }, [status])

  // Fetch courses once user data is available
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const skillsString = user.existingSkills.join(', ')
        const keywords = `${user.department}, ${skillsString}`
        console.log('keywords:', keywords)

        // Call the getRecommendations API route with POST method
        const response = await fetch('/api/getRecommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ keywords }) // Send the keywords as the body
        })

        const responseData = await response.json()
        if (responseData) {
          console.log('responseData:', responseData)
          setMadeForYouCourses(responseData.recommendations) // Set courses data from the fake response
        } else {
          throw new Error('Failed to fetch courses')
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching courses:', error)
        setError('Error fetching courses')
        setLoading(false)
      }
    }

    if (user) {
      fetchCourses() // Fetch recommendations once user data is available
    }
  }, [user]) // Only run this effect when user is set

  if (loading)
    return (
      <div className='flex flex-col justify-center items-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <p className='mt-4 text-muted-foreground'>Getting recommendations...</p>
      </div>
    )
  if (error) return <div>{error}</div>

  return (
    <>
      <div className='block'>
        <Menu />
        <div className='border-t'>
          <div className='bg-background'>
            <div className='grid lg:grid-cols-5'>
              <div className='col-span-3 lg:col-span-5 lg:border-l'>
                <div className='h-full px-4 py-6 lg:px-8'>
                  <Tabs defaultValue='music' className='h-full space-y-6'>
                    <div className='space-between flex items-center'>
                      <TabsList>
                        <TabsTrigger value='music' className='relative'>
                          E-Courses
                        </TabsTrigger>
                        <TabsTrigger value='podcasts'>Webinars</TabsTrigger>
                        <TabsTrigger value='live' disabled>
                          Live
                        </TabsTrigger>
                      </TabsList>
                      <div className='ml-auto mr-4'>
                        <Button>
                          <PlusCircledIcon className='mr-2 h-4 w-4' />
                          Add Courses
                        </Button>
                      </div>
                    </div>
                    <TabsContent
                      value='music'
                      className='border-none p-0 outline-none'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='space-y-1'>
                          <h2 className='text-2xl font-semibold tracking-tight'>
                            Watch Now
                          </h2>
                          <p className='text-sm text-muted-foreground'>
                            Courses Based on {user?.name}'s Interests
                          </p>
                        </div>
                      </div>
                      <Separator className='my-4' />
                      <div className='relative'>
                        <ScrollArea>
                          <div className='flex space-x-4 pb-4'>
                            {(madeForYouCourses || []).map(course => (
                              <div
                                key={course.course_id}
                                className='w-[250px] p-4 border rounded-md relative bg-cover bg-center'
                              >
                                {/* Play Button Image */}
                                <div className='flex justify-center mb-2'>
                                  <Image
                                    src='/youtube.png'
                                    alt='Play Button'
                                    width={200} // Adjust size as needed
                                    height={150}
                                    className='opacity-70' // Optional opacity for effect
                                  />
                                </div>

                                {/* Course Details */}
                                <h3 className='text-lg font-bold'>
                                  {course.course_title}
                                </h3>
                                <p className='text-sm'>
                                  Difficulty: {course.course_difficulty}
                                </p>
                              </div>
                            ))}
                          </div>
                          <ScrollBar orientation='horizontal' />
                        </ScrollArea>
                      </div>
                      <div className='mt-6 space-y-1'>
                        <h2 className='text-2xl font-semibold tracking-tight'>
                          Made for You
                        </h2>
                        <p className='text-sm text-muted-foreground'>
                          Courses People Like You Are Taking
                        </p>
                      </div>
                      <Separator className='my-4' />
                      <div className='relative'>
                        <ScrollArea>
                          <div className='flex space-x-4 pb-4'>
                            {madeForYouAlbums.map(album => (
                              <AlbumArtwork
                                key={album.name}
                                album={album}
                                className='w-[150px]'
                                aspectRatio='square'
                                width={150}
                                height={150}
                              />
                            ))}
                          </div>
                          <ScrollBar orientation='horizontal' />
                        </ScrollArea>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value='podcasts'
                      className='h-full flex-col border-none p-0 data-[state=active]:flex'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='space-y-1'>
                          <h2 className='text-2xl font-semibold tracking-tight'>
                            New Episodes
                          </h2>
                          <p className='text-sm text-muted-foreground'>
                            Your favorite podcasts. Updated daily.
                          </p>
                        </div>
                      </div>
                      <Separator className='my-4' />
                      <PodcastEmptyPlaceholder />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

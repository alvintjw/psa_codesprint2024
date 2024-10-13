'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Checkbox } from '@/registry/default/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/registry/default/ui/select'

import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface User {
  name?: string
  email?: string
  teamNumber?: number
  department?: string
  existingSkills: string[]
}

const availableSkills = [
  'JavaScript',
  'React',
  'Node.js',
  'Python',
  'SQL',
  'AWS',
  'Data Analysis',
  'Project Management'
]

const EditProfile = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [teamNumber, setTeamNumber] = useState<number | null>(null)
  const [department, setDepartment] = useState<string | null>(null)
  const [existingSkills, setExistingSkills] = useState<string[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/getUser')
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const response = await fetch('/api/updateUser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      // Redirect to profile page after a successful update
      router.push('/profile')
    } catch (error) {
      setError('Failed to update profile')
      console.error('Error updating profile:', error)
    }
  }

  const handleSkillChange = (skill: string) => {
    setExistingSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill) // Remove skill if it's already selected
      } else {
        return [...prev, skill] // Add skill if not selected
      }
    })
  }

  if (loading) {
    return (
      <div className='flex flex-col justify-center items-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <p className='mt-4 text-muted-foreground'>Loading your profile...</p>
      </div>
    )
  }

  const handleUpdateProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamNumber, department, existingSkills })
      })
      if (!response.ok) {
        throw new Error('Failed to update user')
      }
      router.push('/profile') // Redirect back to profile page
    } catch (error) {
      console.error('Error updating user:', error)
      setError('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold text-center mb-6'>Edit Profile</h1>
      <Card className='max-w-3xl mx-auto'>
        <CardHeader>
          <CardTitle className='text-2xl'>Update Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {/* Team Number */}
            <div>
              <label htmlFor='teamNumber'>Team Number</label>
              <Select
                onValueChange={value => setTeamNumber(Number(value))}
                value={teamNumber?.toString() || ''}
              >
                <SelectTrigger id='teamNumber'>
                  <SelectValue placeholder='Select your team number' />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Team {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Department */}
            <div>
              <label htmlFor='department'>Department</label>
              <Select onValueChange={setDepartment} value={department || ''}>
                <SelectTrigger id='department'>
                  <SelectValue placeholder='Select your department' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Product Manager'>
                    Product Manager
                  </SelectItem>
                  <SelectItem value='Software Developer'>
                    Software Developer
                  </SelectItem>
                  <SelectItem value='HR'>HR</SelectItem>
                  <SelectItem value='Data Analyst'>Data Analyst</SelectItem>
                  <SelectItem value='System Architect'>
                    System Architect
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Existing Skills */}
            <div>
              <label className='block text-sm font-medium text-muted-foreground mb-1'>
                Skills to Learn/Existing Skills
              </label>
              <div className='space-y-2'>
                {availableSkills.map(skill => (
                  <div key={skill} className='flex items-center'>
                    <Checkbox
                      id={skill}
                      checked={existingSkills.includes(skill)}
                      onCheckedChange={() => handleSkillChange(skill)}
                    />
                    <label
                      htmlFor={skill}
                      className='ml-2 text-sm text-muted-foreground'
                    >
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleUpdateProfile} disabled={loading}>
              {loading ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditProfile

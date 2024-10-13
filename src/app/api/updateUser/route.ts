import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth' // Assuming this points to your authOptions

const prisma = new PrismaClient()

// Helper function to get the current user
async function getUser(session: any) {
  if (!session || !session.user || !session.user.id) {
    throw new Error('User not authenticated')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

export async function POST(request: Request) {
  try {
    // Fetch session using next-auth
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in.' },
        { status: 401 }
      )
    }

    // Get the existing user based on the session
    const existingUser = await getUser(session)

    const { teamNumber, department, existingSkills } = await request.json()

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        teamNumber,
        department,
        existingSkills
      }
    })

    return NextResponse.json({ user: updatedUser }, { status: 200 })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user.' },
      { status: 500 }
    )
  }
}

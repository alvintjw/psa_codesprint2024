import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // Ensure your prisma client is imported

// Handle GET request
export async function GET(request: Request) {
  // Fetch recommended courses based on some logic (e.g., userId in query)
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    // Fetch recommended courses (replace with your actual logic)
    const recommendedCourses = await prisma.course.findMany({
      where: {
        // Add your filtering logic based on recommendation
      }
    })

    return NextResponse.json(recommendedCourses, { status: 200 })
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
}

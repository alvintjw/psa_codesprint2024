import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const feedbackData = await req.json()

    // Save the feedback to the database
    const feedback = await prisma.feedback.create({
      data: feedbackData
    })

    return NextResponse.json({ success: true, feedback })
  } catch (error) {
    return NextResponse.json({ error: 'Error saving feedback' }, { status: 500 })
  }
}

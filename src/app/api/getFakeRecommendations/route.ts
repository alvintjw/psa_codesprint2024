import { NextResponse } from 'next/server'

// This will simulate a response from the recommendation API
export async function GET() {
  const fakeRecommendations = {
    recommendations: [
      {
        course_id: 101,
        course_title: 'Introduction to JavaScript',
        course_organisation: 'Coursera',
        course_certificate_type: 'Certificate',
        course_rating: 4.7,
        course_difficulty: 'Beginner',
        course_students_enrolled: 2000,
        overall_rating: 4.5
      },
      {
        course_id: 102,
        course_title: 'Advanced Python Programming',
        course_organisation: 'Harvard University',
        course_certificate_type: 'Specialization',
        course_rating: 4.8,
        course_difficulty: 'Advanced',
        course_students_enrolled: 5000,
        overall_rating: 4.6
      },
      {
        course_id: 103,
        course_title: 'Data Science for Beginners',
        course_organisation: 'University of Michigan',
        course_certificate_type: 'Certificate',
        course_rating: 4.9,
        course_difficulty: 'Intermediate',
        course_students_enrolled: 10000,
        overall_rating: 4.7
      }
    ]
  }

  return NextResponse.json(fakeRecommendations, { status: 200 })
}

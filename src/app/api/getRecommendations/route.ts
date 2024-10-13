import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios'

// Handle GET requests
export async function POST(req: NextRequest) {
  const keywords = await req.json()
  const keywords_value = keywords.keywords
  console.log(keywords_value)
  const apiUrl = `http://127.0.0.1:8000/recommendations/${keywords_value})}`
  try {
    const response = await axios.post(apiUrl)
    console.log(response.data)
    return NextResponse.json(response.data, { status: response.status })
  } catch (error: any) {
    console.error('Error fetching from FastAPI:', error.message)
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    )
  }
}

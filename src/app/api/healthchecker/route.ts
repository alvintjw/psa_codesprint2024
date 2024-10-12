// /pages/api/[...path].ts

import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// Handle GET requests
export async function GET(req: NextRequest) {
  const apiUrl = 'http://127.0.0.1:8000/api/healthchecker';

  try {
    const response = await axios.get(apiUrl);
    console.log(response.data)
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error fetching from FastAPI:", error.message);
    return NextResponse.json({ error: "Error processing request" }, { status: 500 });
  }
}

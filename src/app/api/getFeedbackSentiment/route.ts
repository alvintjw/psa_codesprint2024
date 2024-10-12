// /pages/api/getFeedbackSummary.ts

import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// Handle POST requests
export async function POST(req: NextRequest) {
  const apiUrl = 'http://127.0.0.1:8000/api/getFeedbackSentiment';

  try {
    // Parse the request body to get the teamNumber
    const { teamNumber } = await req.json();

    // Make sure the teamNumber is sent in the correct format (key: teamNumber)
    const response = await axios.post(apiUrl, {
      teamNumber: teamNumber,  // Explicitly include the teamNumber key
    });

    // Return the response from FastAPI
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error fetching from FastAPI:", error.message);
    return NextResponse.json({ error: "Error processing request" }, { status: 500 });
  }
}

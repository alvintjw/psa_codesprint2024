
import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// Handle POST requests
export async function POST(req: NextRequest) {
  const apiUrl = 'http://127.0.0.1:8000/api/getFeedbackSummary';

  try {
    // Parse the request body to get the teamNumber
    const { teamNumber } = await req.json();
    console.log("Made it here 2!")

    // Make sure the teamNumber is sent in the correct format (key: teamNumber)
    const response = await axios.post(apiUrl, {
      teamNumber: teamNumber,  // Explicitly include the teamNumber key
    });

    console.log('Made it here 3!')

    // Return the response from FastAPI
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error fetching from FastAPI:", error.message);
    return NextResponse.json({ error: "Error processing request" }, { status: 500 });
  }
}

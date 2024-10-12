// /app/api/fetchAllFeedback/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { MongoClient } from 'mongodb';

// MongoDB connection URI from environment variable
const uri = process.env.MONGO_URI as string;

// Function to connect to MongoDB
async function connectToDatabase() {
  const client = await MongoClient.connect(uri);
  return client;
}

// POST request handler
export async function POST(req: NextRequest) {
  try {
    // Parse the request body to get the teamNumber
    const { teamNumber } = await req.json();

    // Connect to the MongoDB database
    const client = await connectToDatabase();
    const db = client.db('database'); // Use your database name here
    const feedbackCollection = db.collection('Feedback'); // Use your collection name here

    // Find feedback items with the matching teamNumber
    const feedbackItems = await feedbackCollection.find({ "teamNumber": teamNumber }).toArray();

    // Close the client connection
    client.close();

    // Check if feedbackItems is empty and respond accordingly
    if (feedbackItems.length === 0) {
      return NextResponse.json({ error: "No feedback found for the specified team number." }, { status: 404 });
    }

    // Return the feedback items
    return NextResponse.json(feedbackItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching feedback from MongoDB:", error);
    return NextResponse.json({ error: "Error processing request" }, { status: 500 });
  }
}

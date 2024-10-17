from fastapi import FastAPI, HTTPException
# main.py
from pydantic import BaseModel
from pymongo import MongoClient
from .analyzer import Analyzer
import os
from dotenv import load_dotenv
from .gpt import GPT
from .course_recommender import CourseRecommender
import uvicorn
from typing import List

# Load environment variables from .env file
load_dotenv()

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

@app.get("/api/healthchecker")
def healthchecker():
    return {"status": "success", "message": "Integrate FastAPI Framework with Next.js"}

# MongoDB setup
client = MongoClient(os.getenv("MONGO_URI"), tls=True,
    tlsAllowInvalidCertificates=True)
db = client["database"]
feedback_collection = db["Feedback"]

# Initialize the Analyzer model
analyzer = Analyzer()

class FeedbackRequest(BaseModel):
    teamNumber: int

@app.post("/api/getFeedbackSummary")
async def get_feedback_summary(request: FeedbackRequest): 
    team_number = request.teamNumber

    # Retrieve feedback items for the given teamNumber
    feedback_items = feedback_collection.find({"teamNumber": team_number})
    feedback_list = list(feedback_items)

    # Initialize variables to store concatenated responses and sentiment counts
    summary = {
        "overallWorkLifeBalance": [],
        "teamWorkingRelationship": [],
        "enjoymentOfWork": [],
        "collaborationChallenges": [],
        "workRelatedStressors": []
    }
    sentiment_counts = {
        field: {"positive": 0, "negative": 0, "neutral": 0}
        for field in summary.keys()
    }

    # Process each feedback item
    for item in feedback_list:
        for field in summary.keys():
            # Collect responses for the summary
            if field in item:
                summary[field].append(item[field])

            # Sentiment analysis for the field
            text = item.get(field, "")
            if not text:
                continue

            chunks = chunk_text(text, 512)
            positive_count = 0
            negative_count = 0
            neutral_count = 0

            for chunk in chunks:
                sentiment_label = analyzer.get_sentiment_score(chunk)
                if sentiment_label == "positive":
                    positive_count += 1
                elif sentiment_label == "negative":
                    negative_count += 1
                else:
                    neutral_count += 1

            # Update overall sentiment counts for the field
            sentiment = find_highest_sentiment(positive_count, negative_count, neutral_count)
            sentiment_counts[field][sentiment] += 1

    # Join responses for each field for the GPT summary generation
    concatenated_summary = {
        key: "\n".join(value) for key, value in summary.items()
    }

    # Generate the manager report with GPT
    gpt = GPT(openai_api_key=os.getenv("OPENAI_API_KEY"))
    manager_report = gpt.generate_manager_report(concatenated_summary)

    return {
        "manager_report": manager_report,
        "sentiment_counts": sentiment_counts,
        "total_count": len(feedback_list)
    }


def chunk_text(text: str, max_tokens: int) -> list:
    """
    Split the input text into chunks with each chunk having a max length 
    to ensure compatibility with the model's token limit.
    """
    words = text.split()
    chunks = []

    while words:
        chunk = words[:max_tokens]
        chunks.append(" ".join(chunk))
        words = words[max_tokens:]

    return chunks

def find_highest_sentiment(positive: int, negative: int, neutral: int) -> str:
    # Create a dictionary with the sentiment counts
    sentiment_counts = {
        "positive": positive,
        "negative": negative,
        "neutral": neutral
    }
    
    # Find the sentiment with the maximum count
    highest_sentiment = max(sentiment_counts, key=sentiment_counts.get)
    
    return highest_sentiment

model = CourseRecommender()
class RecommendationRequest(BaseModel):
    keywords: str

@app.get("/")
def read_root():
    return {"message": "Hello World!"}

@app.post("/recommendations/{keywords}")
def get_recommendations(keywords: str):
    recommendations = model.recommend(keywords)
    formatted_recommendations = []
    for course_id in recommendations['course_title'].index:
        course_details = {
            "course_id": course_id,
            "course_title": recommendations['course_title'][course_id],
            "course_Certificate_type": recommendations['course_Certificate_type'][course_id],
            "course_rating": recommendations['course_rating'][course_id],
            "course_difficulty": recommendations['course_difficulty'][course_id],
            "course_students_enrolled": recommendations['course_students_enrolled'][course_id],
            "overall_rating": recommendations['overall_rating'][course_id]
        }
        formatted_recommendations.append(course_details)
    return {"recommendations": formatted_recommendations}

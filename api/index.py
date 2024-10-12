from fastapi import FastAPI, HTTPException
# main.py
from pydantic import BaseModel
from pymongo import MongoClient
from .analyzer import Analyzer
import os
from dotenv import load_dotenv
from .gpt import GPT

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

@app.post("/api/getFeedbackSentiment")
async def get_team_feedback_sentiment(request: FeedbackRequest):
    team_number = request.teamNumber

    # Retrieve feedback items for the given teamNumber
    feedback_items = feedback_collection.find({"teamNumber": team_number})
    print(team_number)

    # Sentiment counters
    sentiment_counts = {"positive": 0, "negative": 0, "neutral": 0}

    # Check if any feedback items were retrieved
    feedback_list = list(feedback_items)
    if not feedback_list:
        return sentiment_counts

    # Analyze sentiment for each feedback item's 'questionOne'
    for item in feedback_list:
        
        question_one = item.get("overallWorkLifeBalance", "")
        if not question_one: 
          continue
        print(question_one)

        # If the text is too long, split into chunks with a max token limit of 512
        chunks = chunk_text(question_one, 512)
        positive_count = 0
        negative_count = 0
        neutral_count = 0 

        for chunk in chunks:
          sentiment_label = analyzer.get_sentiment_score(chunk)

          # Update sentiment counters
          if sentiment_label == "positive":
            positive_count += 1
          elif sentiment_label == "negative":
            negative_count += 1
          else:
            neutral_count += 1
        sentiment = find_highest_sentiment(positive_count, negative_count, neutral_count)

        sentiment_counts[sentiment] += 1
    print(sentiment_counts)
    return sentiment_counts

@app.post("/api/getFeedbackSummary")
async def get_feedback_summary(request: FeedbackRequest): 
  team_number = request.teamNumber
  feedback_items = feedback_collection.find({"teamNumber": team_number})

  # Initialize variables to store concatenated responses
  overall_work_life_balance = []
  team_working_relationship = []
  enjoyment_of_work = []
  collaboration_challenges = []
  work_related_stressors = []
  
  # Loop through each feedback item and concatenate responses
  for item in feedback_items:
    if 'overallWorkLifeBalance' in item:
        overall_work_life_balance.append(item['overallWorkLifeBalance'])
    if 'teamWorkingRelationship' in item:
        team_working_relationship.append(item['teamWorkingRelationship'])
    if 'enjoymentOfWork' in item:
        enjoyment_of_work.append(item['enjoymentOfWork'])
    if 'collaborationChallenges' in item:
        collaboration_challenges.append(item['collaborationChallenges'])
    if 'workRelatedStressors' in item:
        work_related_stressors.append(item['workRelatedStressors'])

  # Join all responses with a line separator for each field
  summary = {
    "overallWorkLifeBalance": "\n".join(overall_work_life_balance),
    "teamWorkingRelationship": "\n".join(team_working_relationship),
    "enjoymentOfWork": "\n".join(enjoyment_of_work),
    "collaborationChallenges": "\n".join(collaboration_challenges),
    "workRelatedStressors": "\n".join(work_related_stressors),
  }
   
  gpt = GPT(openai_api_key=os.getenv("OPENAI_API_KEY")) 
  manager_report = gpt.generate_manager_report(summary)
  print(manager_report)
  return {"manager_report": manager_report}

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



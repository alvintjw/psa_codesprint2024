import pickle
from course_recommender import CourseRecommender
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

model = CourseRecommender()
app = FastAPI()

class RecommendationRequest(BaseModel):
    keywords: str

@app.get("/")
def read_root():
    return {"message": "Hello World!"}

@app.get("/recommendations/{keywords}")
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

# To run the FastAPI app, use the following command in your terminal:
# uvicorn filename:app --reload
if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)
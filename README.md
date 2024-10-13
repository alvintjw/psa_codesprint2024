# PSAPortal

An employee portal designed to facilitate employee skills development and support employees in their professional growth, while boosting well-being and promoting a supportive workplace culture. 

## Table of Contents
- [Features](#features)
  - [Personalised Course Recommendation](#personalised-course-recommendation)
  - [Employee Feedback Collection & Summary / Dashboard](#employee-feedback-collection--summary--dashboard)
  - [Mentor Matching Telegram Chatbot](#mentor-matching-telegram-chatbot)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [License](#license)

## Features

### 1. Personalised Course Recommendation
The portal offers tailored course recommendations for employees to upskill based on their roles, interests, and current skill sets. This feature leverages TF-IDF vectorizer to match employees with courses that align closely with their learning preferences and professional goals using content-based recommendation system by comparing the cosine similarity between the TF-IDF vectors. 

## 2. Employee Feedback Collection & Summary / Dashboard
- **Feedback Collection:** Employees can submit forms regarding their well-being and work environment. This gives managers a deeper insight into the challenges their teams face, as well as their overall well-being.
- **Feedback Dashboard:** Managers can view a dashboard that highlights key insights from the responses submitted by employees, such as average satisfaction scores and the percentage of employees reporting work-related stressors. This dashboard offers a clear, data-driven perspective on employee sentiment.
- **AI-Powered Summary Reports:** Using OpenAI's GPT-4o-mini model, the portal synthesizes employee feedback into concise summaries. The AI model identifies common themes, concerns, and improvement suggestions from the feedback collected, making it easy for managers to understand the prevailing sentiments.
- **Individual Feedback View:** Managers also have access to individual (anonymous) feedback entries, providing a closer look at specific responses for deeper insights.

### 3. Mentor Matching Telegram Chatbot
This Telegram bot matches employees with potential mentors within PSA. Matches are based on factors such as years of experience, job descriptions, interests, and skill sets. This helps employees connect with mentors who can provide personalized guidance and support in their professional journeys.

## Technologies Used
- **Frontend:** Next.js
- **Backend:** FastAPI
- **Database:** MongoDB
- **Database ORM:** Prisma

## Getting Started
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/PSAPortal.git
   cd psaCodeSprint_nextjs


2. **Install required packages using pip for the backend and npm for the frontend. Note that a virtual environment is required to download the backend packages using pip:**
   ```bash
   pip install -r requirements.txt  # Backend
   npm install                       # Frontend
   ```

3. **Set up environment variables**
Create a .env file in the root directory and configure necessary environment variables as such:
  ```bash
  MONGO_URI= 
  NEXTAUTH_SECRET= 
  GOOGLE_APP_CLIENT_ID = 
  GOOGLE_APP_CLIENT_SECRET = 
  NEXTAUTH_URL= 
  OPENAI_API_KEY=
  ```

4. **Run the application**
   Start both the frontend and backend servers.
   ```bash
   npm run dev        # Frontend
   uvicorn main:app --reload  # Backend
   ```
     

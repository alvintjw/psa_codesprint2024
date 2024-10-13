import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Initialize OpenAI API client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in your .env file
});

// Function to safely convert string fields to numbers or use default values
function parseRating(value: string | null, defaultValue = 0): number {
  const parsedValue = parseFloat(value || '');
  return isNaN(parsedValue) ? defaultValue : parsedValue;
}

// Function to generate feedback summary
function generateFeedbackSummary(feedbackData: any[]) {
  return feedbackData
    .map(
      (feedback, index) => `
    Feedback #${index + 1}:
    - Work Satisfaction: ${feedback.workSatisfaction || 'N/A'}
    - Work-Life Balance: ${feedback.workLifeBalance || 'N/A'}
    - Work Support: ${feedback.workSupport || 'N/A'}
    - Inter-Department Communication: ${
      feedback.interDepartmentCommunication || 'N/A'
    }
    - Work Recognition: ${feedback.workRecognition || 'N/A'}
    - Tools Satisfaction: ${feedback.toolsSatisfaction || 'N/A'}
    - Culture Alignment: ${feedback.cultureAlignment || 'N/A'}
    - Career Growth Satisfaction: ${feedback.careerGrowthSatisfaction || 'N/A'}
    - Training Preference: ${feedback.trainingPreference || 'N/A'}
    - Development Opportunities: ${feedback.developmentOpportunities || 'N/A'}
    - Learning Preference: ${feedback.learningPreference || 'N/A'}
    - Weakest Skill: ${feedback.weakestSkill || 'N/A'}
    - Recognition Satisfaction: ${feedback.recognitionSatisfaction || 'N/A'}
    - Feedback Frequency: ${feedback.feedbackFrequency || 'N/A'}
    - Recommend Company: ${feedback.recommendCompany || 'N/A'} (out of 10)
    - Overall Work-Life Balance: ${feedback.overallWorkLifeBalance || 'N/A'}
    - Team Working Relationship: ${feedback.teamWorkingRelationship || 'N/A'}
    - Enjoyment of Work: ${feedback.enjoymentOfWork || 'N/A'}
    - Collaboration Challenges: ${feedback.collaborationChallenges || 'N/A'}
    - Work-Related Stressors: ${feedback.workRelatedStressors || 'N/A'}
    - Support for Well-Being: ${feedback.supportWellBeing || 'N/A'}
    - Improve Experience: ${feedback.improveExperience || 'N/A'}
    `
    )
    .join('\n\n');
}

async function generateKPIReport(feedbackData: any[]) {
  const feedbackSummary = generateFeedbackSummary(feedbackData);

  const prompt = `
  Based on the following team feedback, generate a detailed report with metrics for key performance indicators (KPIs):
  1. Average Work Satisfaction (out of 5, with decimal points).
  2. Average Work-Life Balance (out of 5, with decimal points).
  3. Percentage of employees reporting work-related stress.
  4. Common Weak Skills reported by employees.
  5. Net Promoter Score (NPS) based on the recommendation score.
  6. Positive vs Negative Sentiment (% positive vs % negative).
  7. Breakdown of training preferences (e.g., on-the-job training, external courses).
  8. Suggestions for areas of improvement.

  Can you make it such that the fields where the numbers/percentages are needed to be generated, 
  just take it such that eg. Very satisfied means 5, satisfied means 4, neutral means 3 and etc. You can make your own judgement on the values.

  Here is the feedback:
  ${feedbackSummary}

  Please return **only** valid JSON, without any additional text or explanation. The JSON object should contain the KPI metrics with corresponding values in the following format: 
  { "AverageWorkSatisfaction": 3, "AverageWorkLifeBalance": 3, "PercentageOfEmployeesReportingWorkRelatedStress": 37.5, "CommonWeakSkillsReportedByEmployees": [ "Technical skills", "Leadership skills", "Problem-solving skills", "Time management skills", "Communication skills" ], "NetPromoterScore": 0, "PositiveSentimentPercentage": 37.5, "NegativeSentimentPercentage": 62.5, "BreakdownOfTrainingPreferences": { "TechnicalSkills": 25, "LeadershipAndManagement": 12.5, "CommunicationAndTeamwork": 12.5, "TimeManagement": 37.5, "ProblemSolvingAndCriticalThinking": 12.5 }, "SuggestionsForAreasOfImprovement": [ "Increase recognition programs", "Enhance collaboration within teams", "Provide more development opportunities", "Address work-life balance concerns", "Improve communication channels" ] }
  `;

  try {
    const response = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
    });

    let kpiReport = response.choices?.[0]?.message?.content?.trim() || '{}';
    kpiReport = kpiReport.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(kpiReport);
  } catch (error: any) {
    console.error('Error generating KPI report:', error);
    throw new Error('Failed to generate KPI report');
  }
}

// Handle GET requests
export async function POST(req: NextRequest) {
  try {
    const { teamNumber } = await req.json();    // Fetch all feedback data from the database

    const feedbackData = await prisma.feedback.findMany({
      where: {
        teamNumber: teamNumber,
      },
    });

    // Prepare data by converting necessary fields to numerical values for KPI generation
    const preparedFeedbackData = feedbackData.map(feedback => ({
      ...feedback,
      workSatisfaction: parseRating(feedback.workSatisfaction),
      workLifeBalance: parseRating(feedback.workLifeBalance),
      workSupport: parseRating(feedback.workSupport),
      interDepartmentCommunication: parseRating(feedback.interDepartmentCommunication),
      workRecognition: parseRating(feedback.workRecognition),
      toolsSatisfaction: parseRating(feedback.toolsSatisfaction),
      cultureAlignment: parseRating(feedback.cultureAlignment),
      careerGrowthSatisfaction: parseRating(feedback.careerGrowthSatisfaction),
      overallWorkLifeBalance: parseRating(feedback.overallWorkLifeBalance),
      teamWorkingRelationship: parseRating(feedback.teamWorkingRelationship),
      enjoymentOfWork: parseRating(feedback.enjoymentOfWork),
      supportWellBeing: parseRating(feedback.supportWellBeing),
      recommendCompany: parseRating(feedback.recommendCompany),
    }));

    // Generate the KPI report from the fetched data
    const kpiReport = await generateKPIReport(preparedFeedbackData);

    return NextResponse.json(kpiReport, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error.message);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}

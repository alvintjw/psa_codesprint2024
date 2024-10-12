'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeedbackItem {
  workSatisfaction?: string;
  workLifeBalance?: string;
  workSupport?: string;
  interDepartmentCommunication?: string;
  workRecognition?: string;
  toolsSatisfaction?: string;
  cultureAlignment?: string;
  careerGrowthSatisfaction?: string;
  trainingPreference?: string;
  developmentOpportunities?: string;
  learningPreference?: string;
  weakestSkill?: string;
  recognitionSatisfaction?: string;
  feedbackFrequency?: string;
  recommendCompany?: string;
  overallWorkLifeBalance?: string;
  teamWorkingRelationship?: string;
  enjoymentOfWork?: string;
  collaborationChallenges?: string;
  workRelatedStressors?: string;
  supportWellBeing?: string;
  improveExperience?: string;
}

interface ReportData {
  summary_of_report: string;
  positive_points_employee_wellbeing: string[];
  negative_points_employee_wellbeing: string[];
  positive_points_work_environment: string[];
  negative_points_work_environment: string[];
  actionable_suggestions_for_improvement: string[];
}

export default function ReportDisplay() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);

  const handleClickSentiment = async () => {
    try {
      const response = await axios.post('/api/getFeedbackSentiment', {
        teamNumber: 1,
      });
      console.log('Feedback Sentiment:', response.data);
    } catch (error) {
      console.error('Error fetching feedback summary:', error);
    }
  };

  const handleClickReport = async () => {
    try {
      const response = await axios.post('/api/getFeedbackSummary', {
        teamNumber: 1,
      });
      const report_dict = parseReport(response.data['manager_report']['manager_report']);
      setReportData(report_dict);
    } catch (error) {
      console.error('Error fetching manager report:', error);
    }
  };

  const fetchAllFeedback = async () => {
    try {
      const response = await axios.post('/api/fetchAllFeedback');
      setFeedbackItems(response.data);
    } catch (error) {
      console.error('Error fetching all feedback:', error);
    }
  };

  useEffect(() => {
    fetchAllFeedback();
  }, []);

  function parseReport(jsonString: string): ReportData {
    try {
      const parsedObject = JSON.parse(jsonString);
      const keys: (keyof ReportData)[] = [
        "summary_of_report",
        "positive_points_employee_wellbeing",
        "negative_points_employee_wellbeing",
        "positive_points_work_environment",
        "negative_points_work_environment",
        "actionable_suggestions_for_improvement"
      ];
      for (const key of keys) {
        if (!(key in parsedObject)) {
          throw new Error(`Key "${key}" is missing from the JSON data.`);
        }
      }
      return parsedObject as ReportData;
    } catch (error) {
      console.error("Error parsing JSON string:", error);
      throw new Error("Invalid JSON format or missing keys.");
    }
  }

  const renderCard = (title: string, content: string | string[]) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {typeof content === 'string' ? (
          <p>{content}</p>
        ) : (
          <ul className="list-disc pl-5">
            {content.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4">
      <div className="mb-4">
        <button 
          className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-md mr-2 transition-colors duration-200" 
          onClick={handleClickReport}
        >
          Click to generate summary report
        </button>
        <button 
          className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-md transition-colors duration-200" 
          onClick={handleClickSentiment}
        >
          Click to get general sentiment
        </button>
      </div>

      {reportData && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Summary Report</h1>
          {renderCard("Summary of Report", reportData.summary_of_report)}
          {renderCard("Positive Points - Employee Wellbeing", reportData.positive_points_employee_wellbeing)}
          {renderCard("Negative Points - Employee Wellbeing", reportData.negative_points_employee_wellbeing)}
          {renderCard("Positive Points - Work Environment", reportData.positive_points_work_environment)}
          {renderCard("Negative Points - Work Environment", reportData.negative_points_work_environment)}
          {renderCard("Actionable Suggestions for Improvement", reportData.actionable_suggestions_for_improvement)}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 mt-8">All Feedback</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {feedbackItems.map((item, index) => (
          <Card key={index} style={{ flex: '0 0 calc(50% - 10px)', padding: '16px', marginBottom: '20px' }}>
            <CardHeader>
              <CardTitle>Feedback {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Work Satisfaction:</strong> {item.workSatisfaction || 'N/A'}</p>
              <p><strong>Work-Life Balance:</strong> {item.workLifeBalance || 'N/A'}</p>
              {/* Add other fields here as needed */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

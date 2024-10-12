'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

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

interface SentimentData {
  overallWorkLifeBalance: { positive: number; negative: number; neutral: number };
  teamWorkingRelationship: { positive: number; negative: number; neutral: number };
  enjoymentOfWork: { positive: number; negative: number; neutral: number };
}

const ratingFields = [
  'workSatisfaction', 'workLifeBalance', 'workSupport', 'interDepartmentCommunication',
  'workRecognition', 'toolsSatisfaction', 'cultureAlignment', 'careerGrowthSatisfaction',
  'trainingPreference', 'developmentOpportunities', 'learningPreference', 'weakestSkill',
  'recognitionSatisfaction', 'feedbackFrequency', 'recommendCompany'
];

const openEndedFields = [
  'overallWorkLifeBalance', 'teamWorkingRelationship', 'enjoymentOfWork',
  'collaborationChallenges', 'workRelatedStressors', 'supportWellBeing', 'improveExperience'
];

export default function ReportDisplay() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportLoading, setIsReportLoading] = useState(false);

  const handleClickReport = async () => {
    try {
      setIsReportLoading(true);
      const response = await axios.post('/api/getFeedbackSummary', {
        teamNumber: 1,
      });
      const report_dict = parseReport(response.data['manager_report']['manager_report']);
      setReportData(report_dict);
      setSentimentData(response.data['sentiment_counts'])
    } catch (error) {
      console.error('Error fetching manager report:', error);
    } finally {
      setIsReportLoading(false);
    }
  };

  const fetchAllFeedback = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/fetchAllFeedback', { 
        teamNumber: 1
      });
      setFeedbackItems(response.data);
    } catch (error) {
      console.error('Error fetching all feedback:', error);
    } finally {
      setIsLoading(false);
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

  const calculateSentimentPercentages = (sentimentCounts: { positive: number; negative: number; neutral: number }, total: number) => {
    const positive = (sentimentCounts.positive / total) * 100
    const negative = (sentimentCounts.negative / total) * 100
    return {
      positive: positive,
      negative: negative,
      neutral: 100 - positive - negative,
    };
  };

  const generateSentimentSummary = (percentages: { positive: number; negative: number; neutral: number }, topic: string) => {
    const highestSentiment = Object.entries(percentages).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    return (
      <p className="mt-4 font-semibold">
        Most of your employees have{' '}
        <span className={`font-bold ${
          highestSentiment === 'positive' ? 'text-green-600' :
          highestSentiment === 'negative' ? 'text-red-600' :
          'text-yellow-600'
        }`}>
          {highestSentiment} sentiments
        </span>{' '}
        towards {topic} in the company.
      </p>
    );
  };

  const renderCard = (title: string, content: string | string[]) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {typeof content === 'string' ? (
          <p>{content || 'No feedback.'}</p>
        ) : (
          content.length > 0 ? (
            <ul className="list-disc pl-5">
              {content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No feedback.</p>
          )
        )}
      </CardContent>
    </Card>
  );

  const renderFeedbackItem = (item: FeedbackItem, index: number) => (
    <Card key={index} className="mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardTitle>Feedback {index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Rating Responses</h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {ratingFields.map((field) => (
              <div key={field} className="flex items-center justify-between">
                <span className="font-medium text-gray-700">{field.charAt(0).toUpperCase() + field.replace(/([A-Z])/g, ' $1').trim().slice(1)}:</span>
                <Badge variant="secondary" className="ml-2 text-xs">{item[field as keyof FeedbackItem] || 'N/A'}</Badge>
              </div>
            ))}
          </div>
        </div>
        <Separator className="my-4" />
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Open-Ended Responses</h3>
          <div className="space-y-3 text-sm">
            {openEndedFields.map((field) => (
              <div key={field}>
                <h4 className="font-semibold text-gray-800 mb-1">{field.charAt(0).toUpperCase() + field.replace(/([A-Z])/g, ' $1').trim().slice(1)}:</h4>
                <p className="text-gray-600 bg-gray-100 p-2 rounded-md">{item[field as keyof FeedbackItem] || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSentimentAnalysis = () => {
    if (!sentimentData || feedbackItems.length === 0) return null;

    const totalResponses = feedbackItems.length;
    const topics = ['overallWorkLifeBalance', 'teamWorkingRelationship', 'enjoymentOfWork'];

    return (
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">General Sentiment</h3>
        {topics.map((topic, index) => {
          const key = topic as keyof SentimentData;
          const percentages = calculateSentimentPercentages(sentimentData[key], totalResponses);
          const summary = generateSentimentSummary(percentages, topic.charAt(0).toUpperCase() + topic.replace(/([A-Z])/g, ' $1').trim().slice(1));

          return (
            <Card key={index} className="mb-4">
              <CardHeader>
                <CardTitle>{topic.charAt(0).toUpperCase() + topic.replace(/([A-Z])/g, ' $1').trim().slice(1)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2">
                  <span className="text-green-600">Positive: {percentages.positive.toFixed(2)}%</span>
                  <span className="text-yellow-600">Neutral: {percentages.neutral.toFixed(2)}%</span>
                  <span className="text-red-600">Negative: {percentages.negative.toFixed(2)}%</span>
                </div>
                {summary}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderSummaryReport = () => {
    if (!reportData) return null;

    return (
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-6 text-center">Summary Report</h1>
        {renderSentimentAnalysis()}
        <h3 className="text-2xl font-bold mb-4">Key Points</h3>
        {renderCard("Summary of Report", reportData.summary_of_report)}
        {renderCard("Positive Points - Employee Wellbeing", reportData.positive_points_employee_wellbeing)}
        {renderCard("Negative Points - Employee Wellbeing", reportData.negative_points_employee_wellbeing)}
        {renderCard("Positive Points - Work Environment", reportData.positive_points_work_environment)}
        {renderCard("Negative Points - Work Environment", reportData.negative_points_work_environment)}
        {renderCard("Actionable Suggestions for Improvement", reportData.actionable_suggestions_for_improvement)}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-center space-x-4">
        <button 
          className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
          onClick={handleClickReport}
          disabled={isReportLoading}
        >
          {isReportLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Summary Report'
          )}
        </button>
      </div>

      {renderSummaryReport()}

      <h2 className="text-3xl font-bold mb-6 text-center">All Feedback</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {feedbackItems.map((item, index) => renderFeedbackItem(item, index))}
        </div>
      )}
    </div>
  );
}
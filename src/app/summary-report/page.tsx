'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';

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

export default function ReportDisplay() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleBackButtonClick = () => {
    router.push('/team-sentiment');
  };

  useEffect(() => {
    const fetchReportSummary = async () => {
      try {
        const response = await axios.post('/api/getFeedbackSummary', {
          teamNumber: 1,
        });
        const report_dict = parseReport(response.data['manager_report']['manager_report']);
        setReportData(report_dict);
        setSentimentData(response.data['sentiment_counts']);
      } catch (error) {
        console.error('Error fetching manager report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportSummary();
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
    const positive = (sentimentCounts.positive / total) * 100;
    const negative = (sentimentCounts.negative / total) * 100;
    return {
      positive: positive,
      negative: negative,
      neutral: 100 - positive - negative,
    };
  };

  const generateSentimentSummary = (percentages: { positive: number; negative: number; neutral: number }, topic: string) => {
    const highestSentiment = Object.entries(percentages).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    return (
      <p className="mt-4 font-semibold">
        Most of your employees have{' '}
        <span
          className={`font-bold ${
            highestSentiment === 'positive' ? 'text-green-600' :
            highestSentiment === 'negative' ? 'text-red-600' :
            'text-yellow-600'
          }`}
        >
          {highestSentiment} sentiments
        </span>{' '}
        towards {topic} in the company.
      </p>
    );
  };

  const renderSentimentAnalysis = () => {
    if (!sentimentData) return null;

    const totalResponses = 100; // Assuming total responses are 100 for calculation
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

  const renderCard = (title: string, content: string | string[]) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {typeof content === 'string' ? (
          <p>{content || 'No feedback.'}</p>
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
    <div className="p-4 max-w-7xl mx-auto">
      {/* Back button always visible */}
      <button 
        onClick={handleBackButtonClick}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
      >
        ← Back
      </button>

      {/* Loading and content rendering */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Generating summary report...</p>
        </div>
      ) : (
        renderSummaryReport()
      )}
    </div>
  );
}

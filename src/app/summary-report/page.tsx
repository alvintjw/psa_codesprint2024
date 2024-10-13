'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession(); 
  const teamNumber = session?.user?.teamNumber;

  useEffect(() => {
    const fetchReportSummary = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post('/api/getFeedbackSummary', { teamNumber: teamNumber || 1 });
        const reportDict = parseReport(response.data['manager_report']['manager_report']);
        setReportData(reportDict);
        setSentimentData(response.data['sentiment_counts']);
      } catch (error) {
        console.error('Error fetching summary report:', error);
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

  const renderSummaryReport = () => {
    if (!reportData) return null;

    return (
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-6 text-center">Summary Report</h1>
        {renderCard("Summary of Report", reportData.summary_of_report)}
        {renderCard("Positive Points - Employee Wellbeing", reportData.positive_points_employee_wellbeing)}
        {renderCard("Negative Points - Employee Wellbeing", reportData.negative_points_employee_wellbeing)}
        {renderCard("Positive Points - Work Environment", reportData.positive_points_work_environment)}
        {renderCard("Negative Points - Work Environment", reportData.negative_points_work_environment)}
        {renderCard("Actionable Suggestions for Improvement", reportData.actionable_suggestions_for_improvement)}
      </div>
    );
  };

  const handleBackButtonClick = () => {
    window.location.href = '/team-sentiment';
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Back button */}
      <button 
        onClick={handleBackButtonClick}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
      >
        ← Back
      </button>
      
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

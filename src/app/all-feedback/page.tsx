'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
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

export default function FeedbackDisplay() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleBackButtonClick = () => {
    router.push('/team-sentiment');
  };

  useEffect(() => {
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

    fetchAllFeedback();
  }, []);

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
                <span className="font-medium text-gray-700">
                  {field.charAt(0).toUpperCase() + field.replace(/([A-Z])/g, ' $1').trim().slice(1)}:
                </span>
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
                <h4 className="font-semibold text-gray-800 mb-1">
                  {field.charAt(0).toUpperCase() + field.replace(/([A-Z])/g, ' $1').trim().slice(1)}:
                </h4>
                <p className="text-gray-600 bg-gray-100 p-2 rounded-md">{item[field as keyof FeedbackItem] || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <button 
        onClick={handleBackButtonClick}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
      >
        ← Back
      </button>
      <h2 className="text-3xl font-bold mb-6 text-center">All Feedback</h2>
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Retrieving employee feedback...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {feedbackItems.map((item, index) => renderFeedbackItem(item, index))}
        </div>
      )}
    </div>
  );
}

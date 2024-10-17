'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { Loader2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

interface TeamSentimentData {
  AverageWorkSatisfaction: number
  AverageWorkLifeBalance: number
  PercentageOfEmployeesReportingWorkRelatedStress: number
  CommonWeakSkillsReportedByEmployees: string[]
  NetPromoterScore: number
  PositiveSentimentPercentage: number
  NegativeSentimentPercentage: number
  BreakdownOfTrainingPreferences?: {
    TechnicalSkills: number
    LeadershipAndManagement: number
    CommunicationAndTeamwork: number
    TimeManagement: number
    ProblemSolvingAndCriticalThinking: number
  }
  SuggestionsForAreasOfImprovement: string[]
}

const TeamSentiment = () => {
  const [sentimentData, setSentimentData] = useState<TeamSentimentData | null>(
    null
  )
  const { data: session } = useSession()
  const router = useRouter()

  const handleClickSummaryReport = () => {
    router.push('/summary-report')
  }

  const handleClickViewAllFeedback = () => {
    router.push('/all-feedback')
  }

  useEffect(() => {
    const fetchSentimentData = async () => {
      try {
        const response = await fetch('/api/generateTeamSentiment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ teamNumber: session?.user?.teamNumber || 1 })
        })
        if (!response.ok) {
          throw new Error('Failed to fetch sentiment data')
        }
        const data = await response.json()
        setSentimentData(data)
      } catch (error) {
        console.error('Error fetching sentiment data:', error)
      }
    }

    fetchSentimentData()
  }, [])

  if (!sentimentData) {
    return (
      <div className='flex flex-col justify-center items-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <p className='mt-4 text-muted-foreground'>
          Generating team sentiment dashboard...
        </p>
      </div>
    )
  }

  const sentimentColors = {
    positive: 'hsl(120, 40%, 60%)',
    negative: 'hsl(var(--destructive))'
  }

  const trainingPreferencesData = sentimentData.BreakdownOfTrainingPreferences
    ? Object.entries(sentimentData.BreakdownOfTrainingPreferences).map(
        ([key, value]) => ({
          name: key.replace(/([A-Z])/g, ' $1').trim(),
          value: value
        })
      )
    : []

  const CIRCLE_CIRCUMFERENCE = 282.6 // Approximate circumference for a circle with radius 45

  const calculateCircleOffset = (value: number, max: number) => {
    const offset = CIRCLE_CIRCUMFERENCE - (value / max) * CIRCLE_CIRCUMFERENCE
    return offset
  }

  return (
    <div className='mx-auto max-w-7xl p-6 sm:p-8'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold'>Team Sentiment Dashboard</h1>
        <div className='flex flex-col space-y-2'>
          <button
            onClick={handleClickSummaryReport}
            className='px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600'
          >
            Generate Summary Report
          </button>
          <button
            onClick={handleClickViewAllFeedback}
            className='px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600'
          >
            View All Feedback
          </button>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Card className='col-span-1 md:col-span-2 lg:col-span-3'>
          <CardHeader>
            <CardTitle>Work Satisfaction & Work-Life Balance</CardTitle>
          </CardHeader>
          <CardContent className='flex justify-around items-center'>
            {[
              {
                label: 'Work Satisfaction',
                value: sentimentData.AverageWorkSatisfaction,
                max: 5
              },
              {
                label: 'Work-Life Balance',
                value: sentimentData.AverageWorkLifeBalance,
                max: 5
              }
            ].map((item, index) => (
              <div key={index} className='flex flex-col items-center'>
                <div className='relative w-32 h-32'>
                  <svg viewBox='0 0 100 100' className='w-full h-full'>
                    <circle
                      cx='50'
                      cy='50'
                      r='45'
                      fill='none'
                      stroke='hsl(var(--muted))'
                      strokeWidth='10'
                    />
                    <circle
                      cx='50'
                      cy='50'
                      r='45'
                      fill='none'
                      stroke='hsl(var(--primary))'
                      strokeWidth='10'
                      strokeDasharray={`${CIRCLE_CIRCUMFERENCE}`}
                      strokeDashoffset={calculateCircleOffset(
                        item.value,
                        item.max
                      )}
                      transform='rotate(-90 50 50)'
                    />
                  </svg>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <span className='text-4xl font-bold'>
                      {item.value.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className='mt-2 text-sm text-muted-foreground'>
                  {item.label}
                </p>
              </div>
            ))}
          </CardContent>
          <CardFooter className='justify-center'>
            <p className='text-sm text-muted-foreground'>Scores out of 5</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Work-Related Stress</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col items-center'>
            <div className='relative w-32 h-32'>
              <svg viewBox='0 0 100 100' className='w-full h-full'>
                <circle
                  cx='50'
                  cy='50'
                  r='45'
                  fill='none'
                  stroke='hsl(var(--muted))'
                  strokeWidth='10'
                />
                <circle
                  cx='50'
                  cy='50'
                  r='45'
                  fill='none'
                  stroke='hsl(var(--destructive))'
                  strokeWidth='10'
                  strokeDasharray={`${CIRCLE_CIRCUMFERENCE}`}
                  strokeDashoffset={calculateCircleOffset(
                    sentimentData.PercentageOfEmployeesReportingWorkRelatedStress,
                    100
                  )}
                  transform='rotate(-90 50 50)'
                />
              </svg>
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-4xl font-bold'>
                  {
                    sentimentData.PercentageOfEmployeesReportingWorkRelatedStress
                  }
                  %
                </span>
              </div>
            </div>
            <p className='mt-4 text-sm text-muted-foreground text-center'>
              of employees report work-related stress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Weak Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {(sentimentData.CommonWeakSkillsReportedByEmployees || []).map(
                (skill, index) => (
                  <Badge key={index} variant='secondary'>
                    {skill}
                  </Badge>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col items-center'>
            <BarChart
              width={200}
              height={200}
              data={[
                {
                  name: 'Positive',
                  value: sentimentData.PositiveSentimentPercentage
                },
                {
                  name: 'Negative',
                  value: sentimentData.NegativeSentimentPercentage
                }
              ]}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' type='category' />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Bar dataKey='value'>
                <Cell fill={sentimentColors.positive} />
                <Cell fill={sentimentColors.negative} />
              </Bar>
            </BarChart>
          </CardContent>
        </Card>

        <Card className='col-span-1'>
          <CardHeader>
            <CardTitle>Improvement Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {(sentimentData.SuggestionsForAreasOfImprovement || []).map(
                (suggestion, index) => (
                  <Badge key={index} variant='secondary'>
                    {suggestion}
                  </Badge>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card className='col-span-2'>
          <CardHeader>
            <CardTitle>Training Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={trainingPreferencesData.reduce((acc, item) => {
                acc[item.name] = {
                  label: item.name,
                  color: `hsl(${Math.random() * 360}, 70%, 50%)`
                }
                return acc
              }, {})}
            >
              <BarChart
                width={500} 
                height={300}
                data={trainingPreferencesData}
                layout='vertical'
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  type='number'
                  label={{
                    value: 'Percentage of Respondents',
                    position: 'insideBottom',
                    offset: -5
                  }}
                />
                <YAxis dataKey='name' type='category' width={120} />{' '}
                {/* Adjusted Y-axis width */}
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Bar dataKey='value' fill='#8884d8'>
                  {trainingPreferencesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(${index * 60}, 70%, 50%)`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

      
      </div>
    </div>
  )
}

export default TeamSentiment

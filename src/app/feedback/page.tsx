'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const FormSchema = z.object({
    workSatisfaction: z.string(),
    workLifeBalance: z.string(),
    workSupport: z.string(),
    interDepartmentCommunication: z.string(),
    workRecognition: z.string(),
    toolsSatisfaction: z.string(),
    cultureAlignment: z.string(),
    careerGrowthSatisfaction: z.string(),
    trainingPreference: z.string(),
    developmentOpportunities: z.string(),
    learningPreference: z.string(),
    weakestSkill: z.string(),
    recognitionSatisfaction: z.string(),
    feedbackFrequency: z.string(),
    recommendCompany: z.string(),
    other: z.string().optional(),
    overallWorkLifeBalance: z.string().optional(),
    teamWorkingRelationship: z.string().optional(),
    enjoymentOfWork: z.string().optional(),
    collaborationChallenges: z.string().optional(),
    workRelatedStressors: z.string().optional(),
    supportWellBeing: z.string().optional(),
    improveExperience: z.string().optional()
  })

const questions = [
  {
    name: 'workSatisfaction',
    label:
      'How satisfied are you with your current role and responsibilities at the company?',
    options: [
      'Very satisfied',
      'Satisfied',
      'Neutral',
      'Dissatisfied',
      'Very dissatisfied'
    ]
  },
  {
    name: 'workLifeBalance',
    label:
      'How well do you feel your work-life balance is maintained at the company?',
    options: [
      'Very well balanced',
      'Mostly balanced',
      'Neutral',
      'Not very balanced',
      'Poorly balanced'
    ]
  },
  {
    name: 'workSupport',
    label:
      'How supported do you feel by your manager in your daily tasks and career growth?',
    options: [
      'Very well supported',
      'Supported',
      'Neutral',
      'Not very supported',
      'Not supported at all'
    ]
  },
  {
    name: 'interDepartmentCommunication',
    label:
      'How effective is the communication between different departments within the company?',
    options: [
      'Very effective',
      'Effective',
      'Neutral',
      'Ineffective',
      'Very ineffective'
    ]
  },
  {
    name: 'workRecognition',
    label: 'How valued do you feel for your contributions to the company?',
    options: [
      'Extremely valued',
      'Valued',
      'Neutral',
      'Not very valued',
      'Not valued at all'
    ]
  },
  {
    name: 'toolsSatisfaction',
    label:
      'How satisfied are you with the tools and resources provided to do your job effectively?',
    options: [
      'Very satisfied',
      'Satisfied',
      'Neutral',
      'Dissatisfied',
      'Very dissatisfied'
    ]
  },
  {
    name: 'cultureAlignment',
    label:
      'How well do you feel the company’s culture aligns with your personal values?',
    options: [
      'Very well aligned',
      'Somewhat aligned',
      'Neutral',
      'Not aligned',
      'Completely misaligned'
    ]
  },
  {
    name: 'careerGrowthSatisfaction',
    label:
      'How satisfied are you with the career growth opportunities available at the company?',
    options: [
      'Very satisfied',
      'Satisfied',
      'Neutral',
      'Dissatisfied',
      'Very dissatisfied'
    ]
  },
  {
    name: 'trainingPreference',
    label: 'Which area would you like more training or development in?',
    options: [
      'Technical skills',
      'Leadership and management',
      'Communication and teamwork',
      'Time management',
      'Problem-solving and critical thinking'
    ]
  },
  {
    name: 'developmentOpportunities',
    label:
      'How often do you have opportunities for professional development and skill-building?',
    options: ['Very often', 'Occasionally', 'Rarely', 'Never']
  },
  {
    name: 'learningPreference',
    label: 'What is your preferred method of learning new skills?',
    options: [
      'Hands-on training/workshops',
      'Online courses',
      'Reading materials',
      'Learning from colleagues/mentors',
      'Self-paced study'
    ]
  },
  {
    name: 'weakestSkill',
    label: 'Which skill do you feel is your weakest and would like to improve?',
    options: [
      'Technical skills',
      'Leadership skills',
      'Communication skills',
      'Problem-solving skills',
      'Time management skills'
    ]
  },
  {
    name: 'recognitionSatisfaction',
    label:
      'How satisfied are you with the recognition and appreciation you receive for your work?',
    options: [
      'Very satisfied',
      'Satisfied',
      'Neutral',
      'Dissatisfied',
      'Very dissatisfied'
    ]
  },
  {
    name: 'feedbackFrequency',
    label: 'How often would you like to receive feedback on your performance?',
    options: [
      'Weekly',
      'Monthly',
      'Quarterly',
      'Annually',
      'Only when necessary'
    ]
  },
  {
    name: 'recommendCompany',
    label:
      'How likely are you to recommend the company as a good place to work?',
    options: [
      'Extremely likely',
      'Likely',
      'Neutral',
      'Unlikely',
      'Extremely unlikely'
    ]
  }
]

const openEndedQuestions = [
    {
      name: 'overallWorkLifeBalance',
      label: 'How do you feel about the overall balance between your work responsibilities and personal life?'
    },
    {
      name: 'teamWorkingRelationship',
      label: 'How would you describe your working relationship with your teammates?'
    },
    {
      name: 'enjoymentOfWork',
      label: 'What do you enjoy most about working here right now, and why?'
    },
    {
      name: 'collaborationChallenges',
      label: 'Are there any challenges you face when collaborating with your teammates? If so, please elaborate.'
    },
    {
      name: 'workRelatedStressors',
      label: 'Are there any specific work-related stressors that negatively impact your well-being? If so, please elaborate.'
    },
    {
      name: 'supportWellBeing', 
      label: 'What can the company or your manager do to better support your well-being?'
    },
    {
      name: 'improveExperience',  
      label: 'Are there any changes or resources that would help to improve your working experience?'
    }
  ]
  
  

  const FeedbackForm = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
  
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema)
    })
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/getUser')
          if (!response.ok) {
            throw new Error('Failed to fetch user data')
          }
          const { user } = await response.json()
          setUser(user)
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
  
      if (status === 'authenticated') {
        fetchUserData()
      }
    }, [status])
  
    if (status === 'loading') {
      return <p>Loading...</p>
    }
  
    if (status === 'unauthenticated' || !session) {
      return <p>You need to be logged in to provide feedback</p>
    }
  
    async function onSubmit(data: z.infer<typeof FormSchema>) {
      try {
        if (!user) {
          throw new Error('User data is not available')
        }
  
        const feedbackData = {
          ...data,
          userId: user.id,
          teamNumber: user.teamNumber
        }
  
        const response = await fetch('/api/addFeedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(feedbackData)
        })
  
        if (!response.ok) {
          throw new Error('Error saving feedback')
        }
  
        console.log('Feedback saved successfully')
        router.push('/') // Redirect after submission
  
      } catch (error) {
        console.error('Error submitting feedback:', error)
      }
    }
  
    return (
      <div className='flex flex-col items-center justify-center w-full h-auto mt-4 pb-6 space-y-6'>
        <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>Share your thoughts with us!</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='lg:w-2/3 space-y-3 w-full'>
            {questions.map(question => (
              <Card key={question.name} className='p-5'>
                <FormField
                  control={form.control}
                  name={question.name as keyof z.infer<typeof FormSchema>}
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>{question.label}</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                          {question.options.map(option => (
                            <label key={option} className='flex items-center space-x-3 cursor-pointer hover:text-blue-700'>
                              <FormControl>
                                <RadioGroupItem value={option} />
                              </FormControl>
                              <span className='font-normal'>{option}</span>
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Card>
            ))}
  
            {openEndedQuestions.map(question => (
              <Card key={question.name} className='p-5'>
                <FormField
                  control={form.control}
                  name={question.name as keyof z.infer<typeof FormSchema>}
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>{question.label}</FormLabel>
                      <FormControl>
                        <textarea {...field} className="textarea w-full p-2" placeholder="Type your answer here..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Card>
            ))}
  
            {Object.keys(form.formState.errors).length > 0 && (
              <p className='text-red-500 font-medium'>Please answer all required questions before submitting.</p>
            )}
  
            <Button type='submit' className='mb-6'>
              Submit Feedback
            </Button>
          </form>
        </Form>
      </div>
    )
  }
  
  export default FeedbackForm
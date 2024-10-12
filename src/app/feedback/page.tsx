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

const FormSchema = z.object({
  workSatisfaction: z.enum(
    ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'],
    {
      required_error: 'Please select an option for work satisfaction.'
    }
  ),
  workLifeBalance: z.enum(
    ['Very well balanced', 'Mostly balanced', 'Neutral', 'Not very balanced', 'Poorly balanced'],
    {
      required_error: 'Please select an option for work-life balance.'
    }
  ),
  workSupport: z.enum(
    ['Very well supported', 'Supported', 'Neutral', 'Not very supported', 'Not supported at all'],
    {
      required_error: 'Please select an option for work support.'
    }
  ),
  interDepartmentCommunication: z.enum(
    ['Very effective', 'Effective', 'Neutral', 'Ineffective', 'Very ineffective'],
    {
      required_error: 'Please select an option for inter-department communication.'
    }
  ),
  workRecognition: z.enum(
    ['Extremely valued', 'Valued', 'Neutral', 'Not very valued', 'Not valued at all'],
    {
      required_error: 'Please select an option for work recognition.'
    }
  ),
  toolsSatisfaction: z.enum(
    ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'],
    {
      required_error: 'Please select an option for tools and resources satisfaction.'
    }
  ),
  cultureAlignment: z.enum(
    ['Very well aligned', 'Somewhat aligned', 'Neutral', 'Not aligned', 'Completely misaligned'],
    {
      required_error: 'Please select an option for culture alignment.'
    }
  ),
  careerGrowthSatisfaction: z.enum(
    ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'],
    {
      required_error: 'Please select an option for career growth satisfaction.'
    }
  ),
  trainingPreference: z.enum(
    ['Technical skills', 'Leadership and management', 'Communication and teamwork', 'Time management', 'Problem-solving and critical thinking'],
    {
      required_error: 'Please select an option for training preference.'
    }
  ),
  developmentOpportunities: z.enum(
    ['Very often', 'Occasionally', 'Rarely', 'Never'],
    {
      required_error: 'Please select an option for development opportunities.'
    }
  ),
  learningPreference: z.enum(
    ['Hands-on training/workshops', 'Online courses', 'Reading materials', 'Learning from colleagues/mentors', 'Self-paced study'],
    {
      required_error: 'Please select an option for learning preference.'
    }
  ),
  weakestSkill: z.enum(
    ['Technical skills', 'Leadership skills', 'Communication skills', 'Problem-solving skills', 'Time management skills'],
    {
      required_error: 'Please select an option for weakest skill.'
    }
  ),
  recognitionSatisfaction: z.enum(
    ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'],
    {
      required_error: 'Please select an option for recognition satisfaction.'
    }
  ),
  feedbackFrequency: z.enum(
    ['Weekly', 'Monthly', 'Quarterly', 'Annually', 'Only when necessary'],
    {
      required_error: 'Please select an option for feedback frequency.'
    }
  ),
  recommendCompany: z.enum(
    ['Extremely likely', 'Likely', 'Neutral', 'Unlikely', 'Extremely unlikely'],
    {
      required_error: 'Please select an option for recommending the company.'
    }
  )
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

const FeedbackForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // Set default values to ensure form starts with valid selections if necessary
      workSatisfaction: 'Neutral',
      workLifeBalance: 'Neutral',
      workSupport: 'Neutral',
      // Add other default values here
    }
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('You submitted the following values:', JSON.stringify(data, null, 2))
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-auto mt-4 pb-6 space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-3">
          {questions.map((question) => (
            <Card key={question.name} className="p-5">
              <FormField
                control={form.control}
                name={question.name as keyof z.infer<typeof FormSchema>}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{question.label}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {question.options.map((option) => (
                          <FormItem key={option} className="flex items-center space-x-3">
                            <FormControl>
                              <RadioGroupItem value={option} />
                            </FormControl>
                            <FormLabel className="font-normal">{option}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
          ))}
          <Button type="submit" className="mb-6">
            Submit Feedback
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default FeedbackForm

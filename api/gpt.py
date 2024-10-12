# summarizer.py

import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from typing import List, Dict
import openai

class GPT:
    def __init__(self, openai_api_key: str):
        self.client = OpenAI(
            # This is the default and can be omitted
            api_key=openai_api_key,
        )

    def generate_manager_report(self, feedback_summary: Dict[str, str]) -> str:
        """
        Generate a report for managers summarizing employee feedback on well-being and work satisfaction.
        
        Args:
            feedback_summary (Dict[str, str]): A dictionary where keys are feedback categories and values are concatenated responses.
        
        Returns:
            str: A comprehensive report for managers, summarizing the feedback and providing recommendations.
        """
        # Prepare a detailed prompt for ChatGPT to generate the report
        prompt = (
            "You are an assistant that only speaks JSON. Do not write normal text. You are an expert at summarising and organising reports for managers to consolidate employee responses and feedback."
            "Based on the following employee feedback, generate a comprehensive report in JSON format for managers. "
            "The report should summarize what employees are happy and unhappy about regarding their well-being "
            "and work environment. Additionally, provide actionable recommendations for how the company and "
            "managers can address the concerns raised by employees, supporting both their personal and professional development.\n\n"
        )

        for section, responses in feedback_summary.items():
            prompt += f"{section.capitalize()} Feedback:\n{responses}\n\n"

        prompt += "Generate a summary in JSON format highlighting positive and negative points, and recommend steps the company can take to improve employee well-being and work satisfaction. /n"
        prompt += """
          The JSON format returned should be strictly as follows:

          {
              "summary_of_report": "Employees are generally happy and satisfied with how the company is supporting them in their well-being and work. However, some employees hope that more work-life balance can be achieved.",
              "positive_points_employee_wellbeing": [
                  "Good managers",
                  "Good team members",
                  "Good employee welfare initiatives"
              ],
              "negative_points_employee_wellbeing": [
                  "High workload"
              ],
              "positive_points_work_environment": [
                  "Good work resources"
              ],
              "negative_points_work_environment": [
                  "High stress"
              ],
              "actionable_suggestions_for_improvement": [
                  "More initiatives for employee welfare"
              ]
          }
          """

        print(prompt)

        try:
            # OpenAI API call to generate the report
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that summarizes employee feedback and provides recommendations."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1200,  # Increase max tokens for a detailed report
                temperature=0
            )
            
            # Extract the report from the response
            report = response.choices[0].message.content
            return {'manager_report': report}

        except Exception as e:
            print("Error calling OpenAI API:", e)
            return "An error occurred while generating the report."

# Example usage:
# feedback_summary = {
#     "overallWorkLifeBalance": "Great work-life balance but sometimes long hours...",
#     "teamWorkingRelationship": "Team is supportive but communication can improve...",
#     # ... additional fields as needed
# }
# analyzer = FeedbackAnalyzer(openai_api_key="your_openai_api_key")
# report = analyzer.generate_manager_report(feedback_summary)
# print(report)

import os
import asyncio
import re
import json
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import CallbackContext
from openai import OpenAI
from repository import (
    user as db_user,
)

# Define states
START_ROUTES, JOBDESC_STATE, INTEREST_STATE = range(3)


async def recommendJobDescription(update: Update, context: CallbackContext) -> int:
    await update.message.reply_text(
        "Please enter your job description:"
    )
    return JOBDESC_STATE


async def handle_jobDescription_request(update: Update, context: CallbackContext) -> int:
    user_input = update.message.text

    wait_message = await update.message.reply_text(
        "Please wait... I am finding mentors for you!"
    )

    asyncio.create_task(process_jobDescription_request(update, context, user_input, wait_message))

    return JOBDESC_STATE


async def process_jobDescription_request(update: Update, context: CallbackContext, jobdescription: str, wait_message):
    try:
        chatgpt_response = await get_chatgpt_recommendation(update, jobdescription)

        await context.bot.delete_message(
            chat_id=update.effective_chat.id, message_id=wait_message.message_id
        )

        await update.message.reply_text(
            f"Here are some mentors I have matched for you: \n\n{chatgpt_response}"
        )

        keyboard = [
            [InlineKeyboardButton("Enter another Job Description!", callback_data="jobdescription")],
            [InlineKeyboardButton("Enter a field you want to learn more about!", callback_data="interest")],
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        # Send a follow-up message with buttons
        await update.message.reply_text(
            """
                What would you like to do next?
            """,
            reply_markup=reply_markup,
        )

    except Exception as e:
        await update.message.reply_text(f"An error occurred: {e}")


def format_mentor_recommendation(mentor_recommendation: dict) -> str:
    list_of_mentors = mentor_recommendation.get("list_of_mentors", [])

    formatted_response = "Here are 3 recommended mentors based on your input:\n"

    for i, mentor in enumerate(list_of_mentors):
        name = mentor.get("name", "Name not provided")
        field = mentor.get("field", "Field not available")
        role = mentor.get("role", "Role not available")
        specialized_field = mentor.get("specialized_field", "Specialization not available")
        experience_years = mentor.get("experience_years", "Experience not available")
        email = mentor.get("email", "Email not available")
        reason_for_recommendation = mentor.get("reason_for_recommendation", "Reason not provided")

        formatted_response += (
            f"Name: {name}\n"
            f"Role: {role}\n"
            f"Field: {field}\n"
            f"Specialized Field: {specialized_field}\n"
            f"Experience: {experience_years} years\n"
            f"Contact: {email}\n"
            f"Reason for Recommendation: {reason_for_recommendation}\n"
            
        )

    return formatted_response



async def get_chatgpt_recommendation(update: Update, user_input: str) -> str:
    try:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        assistant_id = "asst_0V2Dzw7IbQAhHTMpFQ2OBnyY"

        thread = await asyncio.to_thread(client.beta.threads.create)

        await asyncio.to_thread(client.beta.threads.messages.create, thread_id=thread.id, role="user", content=user_input)

        run = await asyncio.to_thread(client.beta.threads.runs.create, thread_id=thread.id, assistant_id=assistant_id, instructions="""
                You are a sharp and intuitive mentor matcher with a knack for finding the perfect mentor for PSA employees. Your job is to listen carefully 
                to the user's job description and match them with a mentor who can guide them. You prioritize relevance, experience, and compatibility when suggesting 
                mentors, all while maintaining a friendly, encouraging tone. Your goal is to match the user with the most suitable mentor based on their job description and 
                specialized skills, ensuring that the mentor's experience aligns with the user's aspirations.

                Output the results in this format:

                JSON Format:
                list_of_mentors: An array containing exactly 3 mentor objects, each with the following fields:
                name: Name of the mentor.
                field: The broad area of expertise.
                role: The mentor's job role.
                specialized_field: The specific skill or subtopic the mentor excels in.
                experience_years: Number of years of experience the mentor has.
                email: The mentor's contact email.
                reason_for_recommendation: A brief paragraph explaining what the user can expect to learn from these mentors, their job scopes, and why they were recommended.
            """)

        while True:
            run_status = await asyncio.to_thread(client.beta.threads.runs.retrieve, thread_id=thread.id, run_id=run.id)

            if run_status.status == "completed":
                break
            elif run_status.status == "failed":
                return "Failed to retrieve recommendations. Please try again."

            await asyncio.sleep(1)

        messages = await asyncio.to_thread(client.beta.threads.messages.list, thread_id=thread.id)

        assistant_response = None
        for message in messages.data:
            if message.role == "assistant":
                assistant_response = message.content[0].text.value
                break

        if assistant_response:
            try:
                # Extract JSON block from the response
                match = re.search(r"```json\n(.*?)\n```", assistant_response, re.DOTALL)

                if match:
                    json_content = match.group(1)
                    print("Extracted JSON:", json_content)

                    mentor_recommendation = json.loads(json_content)

                    # Initialize formatted_output as an empty string
                    formatted_output = ""

                    # Assuming the structure matches the given format
                    list_of_mentors = mentor_recommendation.get("list_of_mentors", [])
                    
                    for i, mentor in enumerate(list_of_mentors, start=1):
                        formatted_output += (
                            f"Mentor {i}:\n"
                            f"Name: {mentor['name']}\n"
                            f"Role: {mentor['role']}\n"
                            f"Field: {mentor['field']}\n"
                            f"Specialized Field: {mentor['specialized_field']}\n"
                            f"Experience: {mentor['experience_years']} years\n"
                            f"Contact: {mentor['email']}\n\n"
                            f"Reason for Recommendation: {mentor['reason_for_recommendation']}\n\n"
                        )

                    return formatted_output
                else:
                    print("No JSON block found, returning raw response.")
                    return assistant_response

            except (json.JSONDecodeError, AttributeError) as e:
                print(f"Error parsing JSON: {e}, returning raw response.")
                return assistant_response
        else:
            return "No recommendation received from the assistant."

    except Exception as e:
        return f"An error occurred while retrieving the recommendation: {e}"

import os
from telegram.ext import (
    ContextTypes,  # Use consistent context type
    CallbackContext,
    CallbackQueryHandler,
)
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from repository import user as db_user

start_text = """
Hello! 👋 
I am here to help find the perfect mentor for you!

Here is what I can do!:

1) /jobdescription - Recommend you a mentor based on the skill basket of your job description.

2) /interest - Type in the name of a field/interest you want to learn more about and I will find mentors for you.

Let's get started! 
"""

START_ROUTES, JOBDESC_STATE, INTEREST_STATE = range(3)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    
    Inlinekeyboard = [
        [InlineKeyboardButton("Enter your Job Description!", callback_data='recommendJobDescription')],
        [InlineKeyboardButton("Enter a Interest you want to learn more about!", callback_data='recommendInterest')],
    ]
    reply_markup = InlineKeyboardMarkup(Inlinekeyboard)
    
    await context.bot.send_message(
        chat_id=update.effective_chat.id,
        text=start_text,
        reply_markup=reply_markup
    )
    
    return START_ROUTES


async def button_click(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query

    await query.answer()

    if query.data == "recommendJobDescription":
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text="Please enter your job description (As detailed as possible: you can enter your full job scope):"
        )
        await query.message.edit_reply_markup(reply_markup=None)
        return JOBDESC_STATE
        
    elif query.data == "recommendInterest":
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text="Please enter any field that you would like to learn more about."
        )
        await query.message.edit_reply_markup(reply_markup=None)
        return INTEREST_STATE

    else:
        await query.answer("Invalid Button Click.")
        return START_ROUTES

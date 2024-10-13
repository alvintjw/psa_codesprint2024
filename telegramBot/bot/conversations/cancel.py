from telegram.ext import ContextTypes, ConversationHandler, CallbackQueryHandler, CommandHandler
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup

START_ROUTES, RECOMMEND_STATE, JUDGE_STATE = range(3)

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):

    await context.bot.send_message(
        chat_id=update.effective_chat.id,
        text="Operation cancelled, the bot is stopping. ",
    )

    return START_ROUTES
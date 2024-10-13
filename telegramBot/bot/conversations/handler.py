from warnings import filterwarnings
from conversations.start import start, button_click
from conversations.cancel import cancel
from conversations import interest
from conversations.interest import handle_interest_input, recommendInterest
from conversations.jobdescription import handle_jobDescription_request, recommendJobDescription
from telegram.ext import (
    CallbackQueryHandler,
    CommandHandler,
    ConversationHandler,
    MessageHandler,
    Application,
    filters,
)

filterwarnings(action="ignore", message=r".*CallbackQueryHandler")

# Define states
START_ROUTES, JOBDESC_STATE, INTEREST_STATE = range(3)

conv_handler = ConversationHandler(
    entry_points=[
        CommandHandler("start", start),
    ],
    states={
        START_ROUTES: [
            CommandHandler("start", start),
            CommandHandler("jobdescription", recommendJobDescription),
            CommandHandler("interest", recommendInterest),
            CallbackQueryHandler(button_click, pattern="^recommendJobDescription$"),
            CallbackQueryHandler(button_click, pattern="^recommendInterest$"),
        ],
        JOBDESC_STATE: [
            CommandHandler("start", start),
            CommandHandler("jobdescription", recommendJobDescription),
            CommandHandler("interest", recommendInterest),
            CallbackQueryHandler(button_click, pattern="^recommendJobDescription$"),
            CallbackQueryHandler(button_click, pattern="^recommendInterest$"),
            MessageHandler(filters.TEXT & ~filters.COMMAND, handle_jobDescription_request)
        ],
        INTEREST_STATE: [
            CommandHandler("start", start),
            CommandHandler("jobdescription", recommendJobDescription),
            CommandHandler("interest", recommendInterest),
            CallbackQueryHandler(button_click, pattern="^recommendJobDescription$"),
            CallbackQueryHandler(button_click, pattern="^recommendInterest$"),
            MessageHandler(filters.TEXT & ~filters.COMMAND, handle_interest_input),
        ],
    },
    fallbacks=[
        CommandHandler("cancel", cancel)
    ]
)

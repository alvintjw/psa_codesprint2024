# Check if the module exists and is accessible
# If it does, make sure the file name is spelled correctly and the module is in the correct location
# If it is part of an external package, make sure the package is installed
# If the module is not available, check your project structure or install the necessary dependencies
from dotenv import load_dotenv
import os
from conversations.handler import conv_handler
from telegram import Update
from telegram.ext import (
    Application,
    MessageHandler,
    filters,
)

class MentorMatchingBot:
    def run(self):
        load_dotenv()

        telegram_token = os.getenv('TELEGRAM_BOT_TOKEN')

        application = (
            Application.builder()
            .token(telegram_token)
            .read_timeout(30)
            .write_timeout(30)
            .build()
        )

        application.add_handler(conv_handler)
        # application.add_handler(MessageHandler(filters.TEXT & filters.Regex(r'^/\d+$'), handle_numeric_command))
        application.run_polling(allowed_updates=Update.ALL_TYPES)
        application.run_polling()
    
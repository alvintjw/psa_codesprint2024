# # analyzer.py
# from tweetnlp import Classifier

# class Analyzer:
#     def __init__(self):
#         # Initialize the sentiment analysis model
#         self.sentiment_model = Classifier("cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual", max_length=512) # XLM-RoBERTa has a token limit of 512

#     def get_sentiment_score(self, text: str) -> str:
#         """Calculate the sentiment score for the given text.

#         Args:
#             text (str): The input text for sentiment analysis.

#         Returns:
#             str: The predicted sentiment label.
#         """
#         # Perform sentiment analysis using tweetnlp
#         result = self.sentiment_model.predict(text)
#         return result['label']

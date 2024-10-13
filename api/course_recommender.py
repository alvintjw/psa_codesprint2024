# course_recommender.py
import kagglehub
import os
import sys
from tempfile import NamedTemporaryFile
from urllib.request import urlopen
from urllib.parse import unquote, urlparse
from urllib.error import HTTPError
from zipfile import ZipFile
import tarfile
import shutil
import pickle
import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
from statistics import harmonic_mean
from langdetect import detect
from sklearn.feature_extraction.text import TfidfVectorizer, TfidfTransformer, CountVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import f1_score
from sklearn.metrics.pairwise import cosine_similarity

class CourseRecommender:
    def __init__(self):
        path_course = kagglehub.dataset_download("siddharthm1698/coursera-course-dataset")
        self.df = pd.read_csv(path_course + '/coursea_data.csv')
        self.df.drop(['Unnamed: 0', 'course_organization'], axis=1, inplace=True)
        self.df = self.df[self.df.course_students_enrolled.str.endswith('k')]
        self.df['course_students_enrolled'] = self.df['course_students_enrolled'].apply(lambda enrolled : eval(enrolled[:-1]) * 1000)
        minmax_scaler = MinMaxScaler()
        scaled_ratings = minmax_scaler.fit_transform(self.df[['course_rating','course_students_enrolled']])
        self.df['course_rating'] = scaled_ratings[:,0]
        self.df['course_students_enrolled'] = scaled_ratings[:,1]
        self.df['overall_rating'] = self.df[['course_rating','course_students_enrolled']].apply(lambda row : harmonic_mean(row), axis=1)
        self.df = self.df[self.df.course_title.apply(lambda title : detect(title) == 'en')]
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.vectors = self.vectorizer.fit_transform(self.df['course_title'])

    # Recommend courses based on a title
    def recommend(self, title, recomm_count=10):
        title_vector = self.vectorizer.transform([title])
        cosine_sim = cosine_similarity(self.vectors, title_vector)
        idx = cosine_sim.flatten().argsort()[-recomm_count:]
        return self.df.iloc[idx].sort_values(by='overall_rating', ascending=False)

    # Save the model to a pickle file
    def save_model(self, filename='model.pkl'):
        with open(filename, 'wb') as file:
            pickle.dump(self, file)

    # Load the model from a pickle file
    @staticmethod
    def load_model(filename='model.pkl'):
        with open(filename, 'rb') as file:
            return pickle.load(file)
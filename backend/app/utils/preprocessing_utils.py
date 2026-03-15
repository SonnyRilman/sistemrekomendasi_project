# app/utils/preprocessing_utils.py
from app.models.product import Product
import pandas as pd
import math

def load_preprocessing_data_price():
    df = pd.read_excel('collab/preprocessed_data/price_preprocessing.xlsx', header=2)
    return df

def load_preprocessing_data_rating():
    df = pd.read_excel('collab/preprocessed_data/rating_preprocessing.xlsx', header=2)
    return df

def load_preprocessing_data_ingredients_tfidf():
    df = pd.read_excel('collab/preprocessed_data/ingredient_preprocessing.xlsx', header=33)

    # Hapus kolom "Unnamed" yang muncul karena sel kosong di Excel
    df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
    
    # Hapus kolom 'Total' jika ada agar tidak mengganggu perhitungan similarity nanti
    if 'Total' in df.columns:
        df = df.drop(columns=['Total'])
    return df
    
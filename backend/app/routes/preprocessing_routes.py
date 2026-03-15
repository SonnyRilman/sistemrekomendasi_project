from flask import Blueprint, request, jsonify, send_file
from app import db
from app.models.product import Product
from app.utils.preprocessing_utils import load_preprocessing_data_price, load_preprocessing_data_rating, load_preprocessing_data_ingredients_tfidf
import pandas as pd
import io
import numpy as np

preprocessing_bp = Blueprint('preprocessing', __name__)

def get_products_as_df(ids=None):
    if ids:
        products = Product.query.filter(Product.id.in_(ids)).all()
    else:
        products = Product.query.all()
    
    if not products:
        return pd.DataFrame()
        
    df = pd.DataFrame([p.to_dict() for p in products])
    # Ensure numeric columns are correct
    df['price'] = pd.to_numeric(df['price'], errors='coerce')
    df['Rating'] = pd.to_numeric(df['Rating'], errors='coerce')
    return df

@preprocessing_bp.route('/rekomendasi_start', methods=['POST'])
def rekomendasi_start():
    # Inputan dari user
    data = request.get_json()
    kategori_produk = data.get('kategori_produk')
    rating = data.get('rating')
    pilihan_ingredients = data.get('pilihan_ingredients')
    budget_max = data.get('budget_max')

    # panggi fungsi get_products_as_df untuk load semua data
    df_all = get_products_as_df()

    # Filter tahap pertama data berdasarkan input "Kaku" (Category & Budget)
    eligible_products = df_all[
        (df_all['Category'] == kategori_produk) & 
        (df_all['price'] <= budget_max) &
        (df_all['Rating'] >= rating)
    ]

    # Ambil Nama Produk yang lolos filter untuk mencocokkan di matriks TF-IDF
    product_names = eligible_products['name'].tolist()

    # Panggil utils preprocessing_utils
    df_price = load_preprocessing_data_price()
    max_price = df_price['price'].max()
    min_price = df_price['price'].min()

    df_rating = load_preprocessing_data_rating()
    max_rating = df_rating['Rating'].max()
    min_rating = df_rating['Rating'].min()

    df_ingredients_tfidf = load_preprocessing_data_ingredients_tfidf()

    # Buang 'Ingredient Number' dan 'Ingredient Name' (2 kolom pertama)
    feature_columns = df_ingredients_tfidf.columns[2:] 

    # Buat vector sepanjang jumlah kolom df_ingredients_tfidf
    user_vector = np.zeros(len(feature_columns))

    # Isi angka 1 jika bahan pilihan user ada di daftar df_ingredients_tfidf
    for ing in pilihan_ingredients:
        if ing in feature_columns:
            # Cari posisi index df_ingredients_tfidf tersebut
            col_idx = feature_columns.get_loc(ing)
            user_vector[col_idx] = 1

    # Hitung Skor Kemiripan (Cosine Similarity)
    recommendations = []
    
    # Beri kode "P1, P2, dst" pada data DB agar sinkron dengan baris Excel
    df_all_with_code = df_all.copy()
    df_all_with_code['product_code'] = [f"P{i+1}" for i in range(len(df_all_with_code))]

    # Ambil daftar kode produk yang lolos filter awal
    eligible_codes = df_all_with_code[df_all_with_code['id'].isin(eligible_products['id'])]['product_code'].values

    for index, row in df_ingredients_tfidf.iterrows():
        # AMBIL BERDASARKAN KODE (P1, P2...)
        p_code = row['Ingredient Number'] # Kode Produk
        
        # Cek apakah kode produk ini termasuk yang lolos filter awal
        if p_code in eligible_codes:
            # Ambil vector fitur produk ini (kolom 2 ke atas)
            product_vector = row[2:].values.astype(float)
            
            # Hitung Cosine Similarity
            # Membandingkan daftar bahan (ingredients) yang User pilih (user_vector) dengan bahan yang ada di sebuah produk (product_vector
            dot_product = np.dot(user_vector, product_vector)

            # Menghitung "Bobot Keinginan user".
            norm_user = np.linalg.norm(user_vector)
            
            # Menghitung "Bobot Produk".
            norm_product = np.linalg.norm(product_vector)
            
            similarity = 0
            if norm_user > 0 and norm_product > 0:
                # Skor = Titik Temu / (Bobot User * Bobot Produk)
                similarity = dot_product / (norm_user * norm_product)
            
            # Ambil detail produk asli dari database menggunakan kode pencocokan
            match_row = df_all_with_code[df_all_with_code['product_code'] == p_code].iloc[0]
            product_info = match_row.to_dict()
            product_info['similarity_score'] = round(float(similarity), 4)
            recommendations.append(product_info)

    # Urutkan hasil berdasarkan skor tertinggi
    recommendations = sorted(recommendations, key=lambda x: x['similarity_score'], reverse=True)

    return jsonify({
        'eligible_products': eligible_products.to_dict(orient='records'),
        'input_user': {
            'kategori_produk': kategori_produk,
            'rating': rating,
            'pilihan_ingredients': pilihan_ingredients,
            'budget_max': budget_max
        },
        'status': 'success',
        'count': len(recommendations),
        'results': recommendations
    })
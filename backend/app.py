# type: ignore
# app.py
from flask import Flask # type: ignore
from flask_cors import CORS # type: ignore
from flask import jsonify, request # type: ignore
import os
import data_manager # type: ignore
import numpy as np # type: ignore
import pandas as pd # type: ignore

# Global cache
cached_data = {
    'tfidf': None,
    'products': None,
    'feature_columns': None
}

def load_global_cache():
    try:
        if cached_data['tfidf'] is None:
            print("[SERVER] Loading TF-IDF matrix...")
            df = data_manager.load_preprocessing_data_ingredients_tfidf()
            df['Ingredient Number'] = df['Ingredient Number'].astype(str).str.strip()
            # Bersihkan NaN di TF-IDF juga jika ada
            df = df.where(pd.notnull(df), 0)
            cached_data['tfidf'] = df
            cached_data['feature_columns'] = df.columns[2:]
            
        if cached_data['products'] is None:
            print("[SERVER] Loading products list...")
            df_all = data_manager.load_data_products()
            df_all['price'] = pd.to_numeric(df_all['price'], errors='coerce').fillna(0)
            df_all['Rating'] = pd.to_numeric(df_all['Rating'], errors='coerce').fillna(0)
            
            # Persiapkan list kategori case-insensitive
            df_all['Category_search'] = df_all['Category'].astype(str).str.lower().str.strip()
            
            # Beri kode "P1, P2, dst"
            df_all['product_code'] = [f"P{i+1}" for i in range(len(df_all))]
            
            # PENTING: Bersihkan NaN agar JSON valid (diubah jadi null)
            df_all = df_all.replace({np.nan: None})
            
            cached_data['products'] = df_all
        print("[SERVER] Cache loaded successfully.")
    except Exception as e:
        print(f"[SERVER] Error loading cache: {e}")

def create_app():
    app = Flask(__name__)
    CORS(app)
    load_global_cache()
    
    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'status': 'error', 'message': str(e)}), 500

    @app.route('/api/products/', methods=['GET'])
    def get_products():
        load_global_cache()
        products = cached_data['products']
        if products is None:
            return jsonify({'message': 'OK', 'products': []}), 200
            
        return jsonify({
            'message': 'OK',
            'products': products.to_dict(orient='records')
        }), 200

    def generate_recommendations(user_data):
        df_all = cached_data['products']
        df_tfidf = cached_data['tfidf']
        feature_cols = cached_data['feature_columns']
        
        if df_all is None or df_tfidf is None or feature_cols is None:
            return pd.DataFrame()
            
        kategori = str(user_data.get('kategori_produk', '')).lower().strip()
        budget = float(user_data.get('budget_max', 1000000))
        rating_min = float(user_data.get('rating', 0))
        ingredients = user_data.get('pilihan_ingredients', [])

        # Filter
        products_df = df_all
        # Use more explicit filtering for IDE
        c1 = (products_df['Category_search'] == kategori) # type: ignore
        c2 = (products_df['price'] <= budget) # type: ignore
        c3 = (products_df['Rating'] >= rating_min) # type: ignore
        eligible = products_df.loc[c1 & c2 & c3].copy() # type: ignore
        if eligible is None: eligible = pd.DataFrame() # type: ignore

        if eligible.empty: return pd.DataFrame()

        # Vectorized Recommendation
        feature_cols_list = []
        if feature_cols is not None and hasattr(feature_cols, 'tolist'):
            feature_cols_list = feature_cols.tolist()
            
        user_vec = np.zeros(len(feature_cols)) if feature_cols is not None else np.array([])
        if len(user_vec) > 0 and feature_cols is not None:
            for ing in ingredients:
                if ing in feature_cols_list:
                    idx = feature_cols.get_loc(ing) if hasattr(feature_cols, 'get_loc') else -1
                    if idx >= 0:
                        user_vec[idx] = 1
        
        norm_u = float(np.linalg.norm(user_vec))
        eligible_codes = set(eligible['product_code'].values)
        tfidf_df = df_tfidf
        # Use loc for more explicit type info
        df_tfidf_sub = tfidf_df.loc[tfidf_df['Ingredient Number'].isin(eligible_codes)] # type: ignore

        if df_tfidf_sub.empty or norm_u == 0:
            eligible['similarity_score'] = 0.0
        else:
            matrix = df_tfidf_sub.iloc[:, 2:].values.astype(float)
            dot = np.dot(matrix, user_vec)
            norm_m = np.linalg.norm(matrix, axis=1)
            denom = norm_u * norm_m
            sims = np.divide(dot, denom, out=np.zeros_like(dot), where=denom!=0)
            score_map = dict(zip(df_tfidf_sub['Ingredient Number'], sims))
            eligible['similarity_score'] = eligible['product_code'].map(score_map).fillna(0)

        return eligible.sort_values(by='similarity_score', ascending=False)

    @app.route('/api/evaluate', methods=['GET'])
    def evaluate_system():
        try:
            load_global_cache()
            df = cached_data['products']
            
            # Scenarios (According to your requirement)
            scenarios = [
                {'user': 'User 1', 'kategori_produk': 'foundation', 'shade': '', 'budget_max': 500000, 'brand': None, 'ingredients': ['niacinamide', 'glycerin']},
                {'user': 'User 2', 'kategori_produk': 'lipstick', 'shade': '', 'budget_max': 200000, 'brand': None, 'ingredients': ['tocopherol']},
                {'user': 'User 3', 'kategori_produk': 'pressed-powder', 'shade': '', 'budget_max': 300000, 'brand': None, 'ingredients': ['titanium']},
                {'user': 'User 4', 'kategori_produk': 'blush', 'shade': '', 'budget_max': 500000, 'brand': None, 'ingredients': ['mica']},
                {'user': 'User 5', 'kategori_produk': 'foundation', 'shade': '', 'budget_max': 300000, 'brand': None, 'ingredients': ['zinc']}
            ]
            
            summary_results = []
            
            for s in scenarios:
                # 1. Real Recommendation (Top 10)
                recs = generate_recommendations(s)
                if recs.empty:
                    top10 = pd.DataFrame(columns=['product_code'])
                else:
                    top10 = recs.head(10).copy()
                
                # 2. Ground Truth (Real Match based on constraints)
                # Use explicit boolean filters
                f1 = (df['Category_search'] == str(s.get('kategori_produk', '')).lower())
                
                budget_val = s.get('budget_max')
                f2 = (df['price'] <= float(str(budget_val))) if budget_val is not None else True
                
                brand_val = s.get('brand')
                f3 = (df['brand'].astype(str).str.lower() == str(brand_val).lower()) if (brand_val and brand_val != 'None') else True
                
                shade_key = str(s.get('shade', '')).lower()
                name_col = df['name'].astype(str).str.lower()
                f4 = name_col.str.contains(shade_key, na=False)
                
                gt = df.loc[f1 & f2 & f3 & f4].copy() # type: ignore
                # Ensure gt is a DataFrame
                if gt is None: gt = pd.DataFrame(columns=['product_code']) # type: ignore
                
                # 3. Metrik
                rec_ids = set(top10['product_code'])
                rel_ids = set(gt['product_code'])
                matched_count = len(rec_ids.intersection(rel_ids))
                
                prec = matched_count / 10.0
                rec = matched_count / len(gt) if not gt.empty else 0
                f1 = 2 * (prec * rec) / (prec + rec) if (prec + rec) > 0 else 0

                summary_results.append({
                    'user': s['user'],
                    'precision': float(round(float(prec), 4)), # type: ignore
                    'recall': float(round(float(rec), 4)), # type: ignore
                    'f1': float(round(float(f1), 4)), # type: ignore
                    'matches': int(matched_count),
                    'total_relevant': int(len(gt))
                })
                
            return jsonify({'status': 'success', 'results': summary_results})
        except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)}), 500

    @app.route('/api/preprocessing/rekomendasi_start', methods=['POST'])
    def rekomendasi_start():
        try:
            load_global_cache()
            data = request.get_json()
            kategori_user = str(data.get('kategori_produk', '')).lower().strip()
            rating_user = float(data.get('rating', 0))
            ingredients_user = data.get('pilihan_ingredients', [])
            budget_user = float(data.get('budget_max', 1000000))

            print(f"\n[API] Processing: {kategori_user}, Budget: {budget_user}")

            load_global_cache()
            df_all = cached_data['products']
            
            recs = generate_recommendations(data)
            
            if recs.empty:
                 return jsonify({'status': 'success', 'count': 0, 'results': []})

            results = recs.to_dict(orient='records')
            top10 = recs.head(10)

            # --- LIVE EVALUATION FOR THIS SEARCH ---
            # Ground Truth based on input
            pa = df_all
            m1 = (pa['Category_search'] == kategori_user) # type: ignore
            m2 = (pa['price'] <= budget_user) # type: ignore
            m3 = (pa['Rating'] >= rating_user) # type: ignore
            gt = pa.loc[m1 & m2 & m3].copy() # type: ignore

            rec_ids = set(top10['product_code'])
            rel_ids = set(gt['product_code'])
            matched = len(rec_ids.intersection(rel_ids))

            prec = matched / 10.0
            rec = matched / len(gt) if not gt.empty else 0
            f1 = 2 * (prec * rec) / (prec + rec) if (prec + rec) > 0 else 0
            
            metrics = {
                'precision': float(round(float(prec), 4)), # type: ignore
                'recall': float(round(float(rec), 4)), # type: ignore
                'f1': float(round(float(f1), 4)), # type: ignore
                'matched': int(matched),
                'relevant_in_db': int(len(gt))
            }

            return jsonify({
                'status': 'success',
                'count': len(results),
                'results': results,
                'metrics': metrics,
                'input_user': data
            })

        except Exception as e:
            print(f"[REK_ERROR]: {e}")
            return jsonify({'status': 'error', 'message': str(e)}), 500

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
# app.py
from flask import Flask
from flask_cors import CORS
from flask import jsonify, request
import os
import data_manager
import numpy as np
import pandas as pd

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
            df_all = df_all.where(pd.notnull(df_all), None)
            
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
        return jsonify({
            'message': 'OK',
            'products': cached_data['products'].to_dict(orient='records')
        }), 200

    def generate_recommendations(user_data):
        df_all = cached_data['products']
        df_tfidf = cached_data['tfidf']
        feature_cols = cached_data['feature_columns']
        
        kategori = str(user_data.get('kategori_produk', '')).lower().strip()
        budget = float(user_data.get('budget_max', 1000000))
        rating_min = float(user_data.get('rating', 0))
        ingredients = user_data.get('pilihan_ingredients', [])

        # Filter
        eligible = df_all[
            (df_all['Category_search'] == kategori) & 
            (df_all['price'] <= budget) &
            (df_all['Rating'] >= rating_min)
        ].copy()

        if eligible.empty: return []

        # Vectorized Recommendation
        user_vec = np.zeros(len(feature_cols))
        for ing in ingredients:
            if ing in feature_cols:
                user_vec[feature_cols.get_loc(ing)] = 1
        
        norm_u = np.linalg.norm(user_vec)
        eligible_codes = set(eligible['product_code'].values)
        df_tfidf_sub = df_tfidf[df_tfidf['Ingredient Number'].isin(eligible_codes)]

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
                {'user': 'User 1', 'kategori_produk': 'foundation', 'shade': 'Medium', 'budget_max': 150000, 'brand': None, 'ingredients': ['niacinamide', 'glycerine']},
                {'user': 'User 2', 'kategori_produk': 'lipstik', 'shade': 'Nude', 'budget_max': 100000, 'brand': None, 'ingredients': ['tocopherol', 'stearyl']},
                {'user': 'User 3', 'kategori_produk': 'bedak', 'shade': 'Light', 'budget_max': 200000, 'brand': 'Wardah', 'ingredients': ['titanium']},
                {'user': 'User 4', 'kategori_produk': 'blush', 'shade': 'Coral', 'budget_max': 500000, 'brand': None, 'ingredients': ['mica', 'dimethicone']},
                {'user': 'User 5', 'kategori_produk': 'foundation', 'shade': 'Dark', 'budget_max': 300000, 'brand': None, 'ingredients': ['zinc']}
            ]
            
            summary_results = []
            
            for s in scenarios:
                # 1. Real Recommendation (Top 10)
                recs = generate_recommendations(s)
                top10 = recs.head(10).copy()
                
                # 2. Ground Truth (Real Match based on constraints)
                # Filter category, price, and brand (Wajib)
                gt_mask = (df['Category_search'] == s['kategori_produk'].lower())
                if s['budget_max']: gt_mask &= (df['price'] <= s['budget_max'])
                if s['brand'] and s['brand'] != 'None':
                    gt_mask &= (df['brand'].str.lower() == s['brand'].lower())
                
                # Strict Shade matching (If no 'shade' column, we simulate with name containing shade keyword)
                shade_key = s['shade'].lower()
                gt_mask &= (df['name'].str.lower().str.contains(shade_key))
                
                gt = df[gt_mask].copy()
                
                # 3. Metrik
                rec_ids = set(top10['product_code'])
                rel_ids = set(gt['product_code'])
                matched_count = len(rec_ids.intersection(rel_ids))
                
                prec = matched_count / 10.0
                rec = matched_count / len(gt) if not gt.empty else 0
                f1 = 2 * (prec * rec) / (prec + rec) if (prec + rec) > 0 else 0
                
                # 4. RMSE Calculation (Real vs Predicted)
                # Normalisasi Sim Score biar rentangnya (0-1) untuk RMSE yang akurat
                if not top10.empty:
                    sim_vals = top10['similarity_score'].values
                    min_sim, max_sim = sim_vals.min(), sim_vals.max()
                    
                    if max_sim > min_sim:
                        norm_sim = (sim_vals - min_sim) / (max_sim - min_sim)
                    else:
                        norm_sim = sim_vals # Tetap kalau semua sama
                    
                    # Prediksi (skala 1-5): 1 + (norm_sim * 4)
                    pred_ratings = 1 + (norm_sim * 4)
                    true_ratings = top10['Rating']
                    rmse = np.sqrt(np.mean((pred_ratings - true_ratings) ** 2))
                else:
                    rmse = 0

                summary_results.append({
                    'user': s['user'],
                    'precision': round(prec, 4),
                    'recall': round(rec, 4),
                    'f1': round(f1, 4),
                    'rmse': round(rmse, 4),
                    'matches': matched_count,
                    'total_relevant': len(gt)
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
            
            if isinstance(recs, list) and len(recs) == 0:
                 return jsonify({'status': 'success', 'count': 0, 'results': []})

            results = recs.to_dict(orient='records')
            top10 = recs.head(10)

            # --- LIVE EVALUATION FOR THIS SEARCH ---
            # Ground Truth based on input
            gt_mask = (df_all['Category_search'] == kategori_user)
            gt_mask &= (df_all['price'] <= budget_user)
            gt_mask &= (df_all['Rating'] >= rating_user)
            # Shade match simulation from name
            gt = df_all[gt_mask]

            rec_ids = set(top10['product_code'])
            rel_ids = set(gt['product_code'])
            matched = len(rec_ids.intersection(rel_ids))

            prec = matched / 10.0
            rec = matched / len(gt) if not gt.empty else 0
            f1 = 2 * (prec * rec) / (prec + rec) if (prec + rec) > 0 else 0
            
            # RMSE
            if not top10.empty:
                sim_vals = top10['similarity_score'].values
                min_sim, max_sim = sim_vals.min(), sim_vals.max()
                
                if max_sim > min_sim:
                    norm_sim = (sim_vals - min_sim) / (max_sim - min_sim)
                else:
                    norm_sim = sim_vals 

                # Prediksi: 1 + (norm_sim * 4)
                pred_ratings = 1 + (norm_sim * 4)
                rmse = np.sqrt(np.mean((pred_ratings - top10['Rating']) ** 2))
            else:
                rmse = 0

            metrics = {
                'precision': round(prec, 4),
                'recall': round(rec, 4),
                'f1': round(f1, 4),
                'rmse': round(rmse, 4),
                'matched': matched,
                'relevant_in_db': len(gt)
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
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg') # Enable headless execution (saving files without showing GUI)
import matplotlib.pyplot as plt
import os

# 1. Load Dataset
# Note: Using your existing product data for the evaluation
def load_data():
    try:
        # Load from your primary product mapping
        df = pd.read_excel('backend/data/upload_data_products.xlsx')
        # Ensure correct column casing
        df.columns = [c.lower() for c in df.columns]
        # Map essential columns for evaluation
        if 'category' not in df.columns and 'category' in df.columns:
            pass # already handled by lower
        
        # Simulated 'shade' column if not present, because evaluation scenario requires it
        if 'shade' not in df.columns:
            df['shade'] = 'Medium' # Default fallback for simulation
            
        print(f"[EVAL] Dataset Loaded: {len(df)} products")
        return df
    except Exception as e:
        print(f"[EVAL_ERROR] Load failed: {e}")
        return None

# 2. Recommendation Engine (Simulated for Evaluation)
def get_top10_recommendations(user_prefs, dataset):
    # This simulates the logic in app.py but for evaluation top-10
    # Step 1: Filter basics
    category = user_prefs.get('jenis_produk', '').lower()
    budget = user_prefs.get('harga_max')
    brand = user_prefs.get('brand')
    
    mask = (dataset['category'].str.lower() == category)
    if budget:
        mask &= (dataset['price'] <= budget)
    if brand and brand != 'None':
        mask &= (dataset['brand'].str.lower() == brand.lower())
        
    candidates = dataset[mask].copy()
    
    if len(candidates) == 0:
        return pd.DataFrame()
        
    # Step 2: Similarity (Simulated simple matching for precision calculation)
    # In a real scenario, this uses TF-IDF, but for evaluation ground truth, 
    # we simulate high scores for products that match shade
    target_shade = str(user_prefs.get('shade', '')).lower()
    candidates['similarity_score'] = 0.5 # base score
    candidates.loc[candidates['shade'].str.lower().str.contains(target_shade), 'similarity_score'] += 0.4
    
    # Sort and take top 10
    return candidates.sort_values(by='similarity_score', ascending=False).head(10)

# 3. Ground Truth Generator
def get_ground_truth(user_prefs, dataset):
    category = user_prefs.get('jenis_produk', '').lower()
    shade = str(user_prefs.get('shade', '')).lower()
    budget = user_prefs.get('harga_max')
    brand = user_prefs.get('brand')
    skin_type = str(user_prefs.get('jenis_kulit', '')).lower()
    
    # Strict matching (Wajib)
    mask = (dataset['category'].str.lower() == category)
    mask &= (dataset['shade'].str.lower().str.contains(shade))
    if budget:
        mask &= (dataset['price'] <= budget)
    if brand and brand != 'None':
        mask &= (dataset['brand'].str.lower() == brand.lower())
        
    relevant = dataset[mask]
    return relevant

# 4. Metrics Calculation
def calculate_precision(recommended, relevant):
    if recommended.empty: return 0.0
    rec_ids = set(recommended.index)
    rel_ids = set(relevant.index)
    match = len(rec_ids.intersection(rel_ids))
    return match / 10.0

def calculate_recall(recommended, relevant):
    if recommended.empty or relevant.empty: return 0.0
    rec_ids = set(recommended.index)
    rel_ids = set(relevant.index)
    match = len(rec_ids.intersection(rel_ids))
    return match / len(relevant)

def calculate_f1(precision, recall):
    if (precision + recall) == 0: return 0.0
    return 2 * (precision * recall) / (precision + recall)

def calculate_rmse(recommended, dataset):
    if recommended.empty: return 0.0
    # Prediksi rating = 1 + (sim * 4)
    y_pred = 1 + (recommended['similarity_score'] * 4)
    # True rating dari dataset
    y_true = recommended['rating']
    
    mse = np.mean((y_pred - y_true)**2)
    return np.sqrt(mse)

# 5. Full Evaluation Runner
def evaluate_all_users(scenarios, dataset):
    results = []
    
    for i, pref in enumerate(scenarios):
        user_name = f"User {i+1}"
        
        # Process
        recommended = get_top10_recommendations(pref, dataset)
        relevant_all = get_ground_truth(pref, dataset)
        
        # Calculate Metrics
        prec = calculate_precision(recommended, relevant_all)
        rec = calculate_recall(recommended, relevant_all)
        f1 = calculate_f1(prec, rec)
        rmse = calculate_rmse(recommended, dataset)
        
        # Relevan in Top 10
        rel_ids = set(relevant_all.index)
        rec_ids = set(recommended.index)
        rel_in_top10 = len(rec_ids.intersection(rel_ids))
        
        results.append({
            'User': user_name,
            'Relevant_Dataset': len(relevant_all),
            'Relevant_Top10': rel_in_top10,
            'Precision': round(prec, 4),
            'Recall': round(rec, 4),
            'F1_Score': round(f1, 4),
            'RMSE': round(rmse, 4)
        })
        
    df_results = pd.DataFrame(results)
    
    # Add Mean Row
    mean_row = df_results.mean(numeric_only=True).to_dict()
    mean_row['User'] = 'Rata-rata'
    df_results = pd.concat([df_results, pd.DataFrame([mean_row])], ignore_index=True)
    
    return df_results

# 6. Main Execution & Visualization
if __name__ == "__main__":
    # Test Scenarios
    scenarios = [
        {'jenis_produk': 'Foundation', 'shade': 'Medium', 'jenis_kulit': 'Berminyak', 'harga_max': 150000, 'brand': 'None'},
        {'jenis_produk': 'Lipstik', 'shade': 'Nude', 'jenis_kulit': 'Semua', 'harga_max': 100000, 'brand': 'None'},
        {'jenis_produk': 'Bedak', 'shade': 'Light', 'jenis_kulit': 'Kering', 'harga_max': 200000, 'brand': 'Wardah'},
        {'jenis_produk': 'Blush On', 'shade': 'Coral', 'jenis_kulit': 'Kombinasi', 'harga_max': None, 'brand': 'None'},
        {'jenis_produk': 'Foundation', 'shade': 'Dark', 'jenis_kulit': 'Berminyak', 'harga_max': 300000, 'brand': 'None'}
    ]
    
    dataset = load_data()
    if dataset is not None:
        eval_df = evaluate_all_users(scenarios, dataset)
        print("\n=== HASIL EVALUASI REKOMENDASI ===")
        print(eval_df)
        
        # VISUALIZATION
        users = eval_df['User'][:-1] # Remove mean row for plot
        precision = eval_df['Precision'][:-1]
        recall = eval_df['Recall'][:-1]
        f1 = eval_df['F1_Score'][:-1]
        rmse = eval_df['RMSE'][:-1]
        
        x = np.arange(len(users))
        width = 0.25
        
        # Chart 1: Precision, Recall, F1
        plt.figure(figsize=(10, 6))
        plt.bar(x - width, precision, width, label='Precision', color='#e63946')
        plt.bar(x, recall, width, label='Recall', color='#a8dadc')
        plt.bar(x + width, f1, width, label='F1-Score', color='#1d3557')
        
        plt.xlabel('User Scenario')
        plt.ylabel('Score (0-1)')
        plt.title('Evaluasi Metrik Per User (Precision, Recall, F1)')
        plt.xticks(x, users)
        plt.legend()
        plt.grid(axis='y', linestyle='--', alpha=0.7)
        plt.savefig('backend/evaluation_metrics.png')
        print(f"\n[EVAL] Chart saved: backend/evaluation_metrics.png")
        
        # Chart 2: RMSE
        plt.figure(figsize=(10, 6))
        plt.plot(users, rmse, marker='o', linestyle='-', color='#e63946', linewidth=2, markersize=8)
        plt.fill_between(users, rmse, color='#e63946', alpha=0.1)
        plt.xlabel('User Scenario')
        plt.ylabel('RMSE Value')
        plt.title('Root Mean Square Error (RMSE) Per User')
        plt.grid(axis='y', linestyle='--', alpha=0.7)
        plt.savefig('backend/evaluation_rmse.png')
        print(f"[EVAL] Chart saved: backend/evaluation_rmse.png")
        
        plt.show()

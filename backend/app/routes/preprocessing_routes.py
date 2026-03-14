from flask import Blueprint, request, jsonify, send_file
from app import db
from app.models.product import Product
from app.utils.product_utils import SkincarePreprocessor
import pandas as pd
import io

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

@preprocessing_bp.route('/name', methods=['POST'])
def preprocess_name():
    df = get_products_as_df(request.get_json().get('ids'))
    if df.empty: return jsonify({'error': 'No products found'}), 404
    
    counts, tf, tfidf, idf = SkincarePreprocessor.process_text_tfidf(df['name'], use_log=False)
    return jsonify({
        'counts': counts.to_dict(orient='records'),
        'tf': tf.to_dict(orient='records'),
        'tfidf': tfidf.to_dict(orient='records'),
        'idf': idf.to_dict()
    })

@preprocessing_bp.route('/ingredients', methods=['POST'])
def preprocess_ingredients():
    df = get_products_as_df(request.get_json().get('ids'))
    if df.empty: return jsonify({'error': 'No products found'}), 404
    
    counts, tf, tfidf, idf = SkincarePreprocessor.process_text_tfidf(df['ingredients'], use_log=False)
    return jsonify({
        'counts': counts.to_dict(orient='records'),
        'tf': tf.to_dict(orient='records'),
        'tfidf': tfidf.to_dict(orient='records'),
        'idf': idf.to_dict()
    })

@preprocessing_bp.route('/brand', methods=['POST'])
def preprocess_brand():
    df = get_products_as_df(request.get_json().get('ids'))
    if df.empty: return jsonify({'error': 'No products found'}), 404
    
    counts, tf, tfidf, idf = SkincarePreprocessor.process_text_tfidf(df['brand'], use_log=True)
    return jsonify({
        'counts': counts.to_dict(orient='records'),
        'tf': tf.to_dict(orient='records'),
        'tfidf': tfidf.to_dict(orient='records'),
        'idf': idf.to_dict()
    })

@preprocessing_bp.route('/shades', methods=['POST'])
def preprocess_shades():
    df = get_products_as_df(request.get_json().get('ids'))
    if df.empty: return jsonify({'error': 'No products found'}), 404
    
    counts, tf, tfidf, idf = SkincarePreprocessor.process_text_tfidf(df['shades'], use_log=True)
    return jsonify({
        'counts': counts.to_dict(orient='records'),
        'tf': tf.to_dict(orient='records'),
        'tfidf': tfidf.to_dict(orient='records'),
        'idf': idf.to_dict()
    })

@preprocessing_bp.route('/category', methods=['POST'])
def preprocess_category():
    df = get_products_as_df(request.get_json().get('ids'))
    if df.empty: return jsonify({'error': 'No products found'}), 404
    
    df_cat = SkincarePreprocessor.process_category(df['Category'])
    return jsonify(df_cat.to_dict(orient='records'))

@preprocessing_bp.route('/price', methods=['POST'])
def preprocess_price():
    df = get_products_as_df(request.get_json().get('ids'))
    if df.empty: return jsonify({'error': 'No products found'}), 404
    
    df_price = SkincarePreprocessor.normalize_numeric(df, 'price')
    return jsonify(df_price.to_dict(orient='records'))

@preprocessing_bp.route('/rating', methods=['POST'])
def preprocess_rating():
    df = get_products_as_df(request.get_json().get('ids'))
    if df.empty: return jsonify({'error': 'No products found'}), 404
    
    df_rating = SkincarePreprocessor.normalize_numeric(df, 'Rating')
    return jsonify(df_rating.to_dict(orient='records'))

@preprocessing_bp.route('/all', methods=['POST'])
def preprocess_all():
    df = get_products_as_df(request.get_json().get('ids'))
    if df.empty: return jsonify({'error': 'No products found'}), 404
    
    merged = SkincarePreprocessor.get_merged_tfidf_matrix(df)
    
    return jsonify({
        'merged_matrix': merged.to_dict(orient='records')
    })

@preprocessing_bp.route('/export_excel', methods=['POST'])
def export_excel():
    df = get_products_as_df(request.get_json().get('ids'))
    if df.empty: return jsonify({'error': 'No products found'}), 404
    
    # Generate TF-IDFs with consistent names to ensure column alignment
    _, _, tfidf_n, _ = SkincarePreprocessor.process_text_tfidf(df['name'], use_log=False, names=df['name'])
    _, _, tfidf_i, _ = SkincarePreprocessor.process_text_tfidf(df['ingredients'], use_log=False, names=df['name'])
    _, _, tfidf_b, _ = SkincarePreprocessor.process_text_tfidf(df['brand'], use_log=True, names=df['name'])
    _, _, tfidf_s, _ = SkincarePreprocessor.process_text_tfidf(df['shades'], use_log=True, names=df['name'])
    
    # Create Excel file in memory
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        start_row = 0
        sheet_name = 'All Merged Preprocessing Data'
        
        # Label (seperti baris 2135 di notebook)
        pd.DataFrame([['Pivot and Merged Preprocessing Data:']]).to_excel(writer, sheet_name=sheet_name, startrow=start_row, header=False, index=False)
        start_row += 2

        def prepare_for_excel(df_tfidf, group_name):
            pivoted = SkincarePreprocessor.pivot_tfidf(df_tfidf, "Product").reset_index()
            pivoted['Group'] = group_name
            # Move Group and Term to the front
            cols = ['Group', 'Term'] + [c for c in pivoted.columns if c not in ['Group', 'Term']]
            return pivoted[cols]

        # 1. Products (Header = True)
        p_name = prepare_for_excel(tfidf_n, 'Product')
        p_name.to_excel(writer, sheet_name=sheet_name, startrow=start_row, index=False)
        start_row += len(p_name)

        # 2. Brands (Header = False)
        p_brand = prepare_for_excel(tfidf_b, 'Brand')
        p_brand.to_excel(writer, sheet_name=sheet_name, startrow=start_row, index=False, header=False)
        start_row += len(p_brand)

        # 3. Shades (Header = False)
        p_shades = prepare_for_excel(tfidf_s, 'Shade')
        p_shades.to_excel(writer, sheet_name=sheet_name, startrow=start_row, index=False, header=False)
        start_row += len(p_shades)

        # 4. Ingredients (Header = False)
        p_ingred = prepare_for_excel(tfidf_i, 'Ingredient')
        p_ingred.to_excel(writer, sheet_name=sheet_name, startrow=start_row, index=False, header=False)
        
    output.seek(0)
    
    return send_file(
        output,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        as_attachment=True,
        download_name='all_pivoted_data.xlsx'
    )
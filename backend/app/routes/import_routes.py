# app/routes/import_routes.py
from flask import Blueprint, request, jsonify
from app import db
from app.models.product import Product
from flask_jwt_extended import jwt_required
from app.schemas.product_schema import product_schema
import bcrypt
import pandas as pd
from sqlalchemy.exc import IntegrityError

import_bp = Blueprint('import', __name__)

# POST import product dari file excel
@import_bp.route('/import_products', methods=['POST'])
def import_products():
    # 1. Pastikan request memiliki payload file
    if 'file' not in request.files:
        return jsonify({'error': 'No file part found in request. Make sure to send a file.'}), 400
    
    file = request.files['file']
    
    # 2. Pastikan file valid telah dipilih
    if file.filename == '':
        return jsonify({'error': 'No selected file.'}), 400
        
    # 3. Validasi ekstensi file harus format excel (.xls atau .xlsx)
    if file and file.filename.endswith(('.xls', '.xlsx')):
        try:
            # 4. Membaca data excel menggunakan library pandas ke dalam object DataFrame
            df = pd.read_excel(file)
            
            # Ganti nilai kosong (NaN) dari kolom dengan string kosong untuk mencegah error tipe data
            df = df.fillna('')
            
            success_count = 0
            skipped_errors = []
            
            # 5. Looping untuk tiap baris data di file Excel
            # iterrows() akan mengiterasi setiap baris. index: nomor baris, row: data per baris
            for index, row in df.iterrows():
                try:
                    product_name = str(row.get('name', '')).strip()
                    if not product_name:
                        skipped_errors.append(f"Row {index + 2}: Product name is missing.")
                        continue

                    # 6. Validasi duplikat nama produk agar tidak terjadi error bentrok
                    if Product.query.filter_by(name=product_name).first():
                        skipped_errors.append(f"Row {index + 2}: Product '{product_name}' already registered.")
                        continue
                        
                    # 7. Membuat objek Product dari data tiap row. 
                    # Sesuaikan key (.get('Nama Header Akhir')) dengan header yang ditulis di Excel
                    product = Product(
                        name=product_name,
                        price=str(row.get('price', '0')), # Kolom DB string
                        brand=str(row.get('brand', '')),
                        shades=str(row.get('shades', '')),
                        ingredients=str(row.get('ingredients', '')),
                        Category=str(row.get('Category', '')),
                        Rating=float(row.get('Rating', 0.0))
                        if row.get('Rating') else 0.0 # Kolom DB Float
                    )
                    
                    db.session.add(product)
                    success_count += 1
                    
                except Exception as e:
                    skipped_errors.append(f"Row {index + 2}: Failed to parse data - {str(e)}")
            
            # 8. Simpan semua data valid ke database
            db.session.commit()
            
            return jsonify({
                'message': f'Successfully imported {success_count} products.',
                'skipped_amount': len(skipped_errors),
                'details': skipped_errors
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f"Failed to read file format. Error: {str(e)}"}), 500
    else:
        return jsonify({'error': 'Invalid file format. Please upload an .xls or .xlsx file.'}), 400
# app/routes/product_routes.py
from flask import Blueprint, request, jsonify
from app import db
from app.models.product import Product
from flask_jwt_extended import jwt_required
from app.schemas.product_schema import product_schema

product_bp = Blueprint('products', __name__)

# GET semua product
@product_bp.route('/', methods=['GET'])

def get_products():
    products = Product.query.all()
    return jsonify({
        'message': 'Memuat semua product berhasil',
        'products': [p.to_dict() for p in products]
    }), 200

# GET product by ID
@product_bp.route('/<int:id>', methods=['GET'])

def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify({
        'message': 'Product berhasil ditemukan',
        'product': product.to_dict()
    }), 200

# POST buat product baru
@product_bp.route('/', methods=['POST'])

def create_product():
    data = request.get_json()

    # Validate requests
    errors = product_schema.validate(data)
    if errors: return jsonify(errors), 400

    # Validate Duplicate Product Name
    if Product.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Product name is already registered.'}), 400

    product = Product(
        name=data['name'], 
        price=data['price'], 
        brand=data['brand'], 
        shades=data['shades'], 
        ingredients=data['ingredients'], 
        Category=data['Category'], 
        Rating=data['Rating']
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify({
        'message': 'Product berhasil dibuat',
        'product': product.to_dict()
    }), 201

# PUT update product
@product_bp.route('/<int:id>', methods=['PUT'])

def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()

    # Handle partial updates per field
    if 'name' not in data:
        data['name'] = product.name
    else:
        # Validate Duplicate Nama Produk jika dirubah
        if Product.query.filter_by(name=data['name']).first() and data['name'] != product.name:
            return jsonify({'error': 'Product name is already registered.'}), 400

    if 'price' not in data:
        data['price'] = product.price
        
    if 'brand' not in data:
        data['brand'] = product.brand
        
    if 'shades' not in data:
        data['shades'] = product.shades
        
    if 'ingredients' not in data:
        data['ingredients'] = product.ingredients
        
    if 'Category' not in data:
        data['Category'] = product.Category
        
    if 'Rating' not in data:
        data['Rating'] = product.Rating

    # Validate remaining requests with schema
    errors = product_schema.validate(data)
    if errors: return jsonify(errors), 400

    # Update objek database
    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.shades = data['shades']
    product.ingredients = data['ingredients']
    product.Category = data['Category']
    product.Rating = data['Rating']
    
    db.session.commit()
    return jsonify({
        'message': 'Product berhasil diperbarui',
        'product': product.to_dict()
    }), 200

# DELETE product
@product_bp.route('/<int:id>', methods=['DELETE'])

def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product berhasil dihapus'}), 200
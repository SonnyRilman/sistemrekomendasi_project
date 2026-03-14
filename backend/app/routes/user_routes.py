# app/routes/user_routes.py
from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from flask_jwt_extended import jwt_required
from app.schemas.user_schema import user_schema
import bcrypt

user_bp = Blueprint('users', __name__)

# GET semua user
@user_bp.route('/', methods=['GET'])

def get_users():
    users = User.query.all()
    return jsonify({
        'message': 'Memuat semua user berhasil',
        'users': [u.to_dict() for u in users]
    }), 200

# GET user by ID
@user_bp.route('/<int:id>', methods=['GET'])

def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify({
        'message': 'User berhasil ditemukan',
        'user': user.to_dict()
    }), 200

# POST buat user baru
@user_bp.route('/', methods=['POST'])

def create_user():
    data = request.get_json()

    # Validate requests
    errors = user_schema.validate(data)
    if errors: return jsonify(errors), 400

    # Validate Duplicate Email
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email is already registered.'}), 400

    # Encrypt password
    password = data['password'].encode('utf-8')

    # 1. Generate a salt and hash the password
    # bcrypt.gensalt() generates a random salt and is saved within the hash itself
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

    user = User(name=data['name'], email=data['email'], password=hashed_password)
    db.session.add(user)
    db.session.commit()
    return jsonify({
        'message': 'User berhasil dibuat',
        'user': user.to_dict()
    }), 201

# PUT update user
@user_bp.route('/<int:id>', methods=['PUT'])

def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()

    # If name not provided, do not update
    if 'name' not in data:
        data['name'] = user.name

    # If email not provided, do not update
    if 'email' not in data:
        data['email'] = user.email
    else:
        # Validate Duplicate Email
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email is already registered.'}), 400

    # If password not provided, do not update
    if 'password' not in data:
        data['password'] = user.password
    else:
        # Encrypt password
        password = data['password'].encode('utf-8')

        # 1. Generate a salt and hash the password
        # bcrypt.gensalt() generates a random salt and is saved within the hash itself
        hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

        data['password'] = hashed_password

    # Validate requests
    errors = user_schema.validate(data)
    if errors: return jsonify(errors), 400

    user.name = data['name']
    user.email = data['email']
    user.password = data['password']
    db.session.commit()
    return jsonify({
        'message': 'User berhasil diperbarui',
        'user': user.to_dict()
    }), 200

# DELETE user
@user_bp.route('/<int:id>', methods=['DELETE'])

def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User berhasil dihapus'}), 200
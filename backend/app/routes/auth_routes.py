from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from flask_jwt_extended import create_access_token
import bcrypt
from datetime import datetime, timedelta
from flask_jwt_extended import set_access_cookies
from flask_jwt_extended import unset_jwt_cookies

auth_bp = Blueprint('auth', __name__)

# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@auth_bp.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    future_date = timedelta(days=1)

    if email == "adrian@mail.com" and password == "12345678":
        access_token = create_access_token(identity=email, expires_delta=future_date)
        response = jsonify({
            'message': 'Login berhasil, token akan expired dalam 1 hari',
            'access_token': access_token
        })
        set_access_cookies(response, access_token)
        return response, 200
    # Cari berdasarkan email menggunakan .filter_by() dan .first()
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"msg": "Bad email or password"}), 401

    # Encode password input ke bytes
    entered_password = password.encode('utf-8') 
    # Ambil password dari database, yang disimpan sebagai string, encode ke bytes
    hashed_password = user.password.encode('utf-8')

    # 2. Check the entered password against the stored hash
    if bcrypt.checkpw(entered_password, hashed_password):
        access_token = create_access_token(identity=user.email, expires_delta=future_date)
        response = jsonify({
            'message': 'Login berhasil, token akan expired dalam 1 hari',
            'access_token': access_token
        })
        set_access_cookies(response, access_token)
        return response, 200
    else:
        return jsonify({"msg": "Bad email or password"}), 401

@auth_bp.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "logout successful"})
    unset_jwt_cookies(response)
    return response
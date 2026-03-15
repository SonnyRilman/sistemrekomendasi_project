# app/__init__.py
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# tambahkan error handler
from flask import jsonify

import os

db = SQLAlchemy()
load_dotenv()

def create_app():
    app = Flask(__name__)

    dbUser = os.environ.get('DATABASE_USER')
    dbPassword = os.environ.get('DATABASE_PASSWORD')
    dbHostname = os.environ.get('DATABASE_HOSTNAME')
    dbPort = os.environ.get('DATABASE_PORT')
    dbDatabase = os.environ.get('DATABASE_NAME')
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://{user}:{password}@{hostname}:{port}/{database}'.format(
        user=dbUser,
        password=dbPassword,
        hostname=dbHostname,
        port=dbPort,
        database=dbDatabase
    )
    app.config['SECRET_KEY'] = 'your-secret-key'
    
    # Fix "MySQL server has gone away" error
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({'error': 'Bad Request', 'message': str(e)}), 400

    @app.errorhandler(415)
    def unsupported_media_type(e):
        return jsonify({'error': 'Unsupported Media Type', 'message': str(e)}), 415

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Not Found', 'message': str(e)}), 404

    @app.errorhandler(405)
    def not_found(e):
        return jsonify({'error': 'Method Not Allowed', 'message': str(e)}), 405

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'error': 'Internal Server Error'}), 500

    # initialisasi JWT, SQL Alchemy, dan CORS
    db.init_app(app)
    CORS(app)

    from app.routes.hello import hello_bp
    app.register_blueprint(hello_bp, url_prefix='/api/hello')

    from app.routes.import_routes import import_bp
    app.register_blueprint(import_bp, url_prefix='/api/import')

    from app.routes.product_routes import product_bp
    app.register_blueprint(product_bp, url_prefix='/api/products')

    from app.routes.preprocessing_routes import preprocessing_bp
    app.register_blueprint(preprocessing_bp, url_prefix='/api/preprocessing')

    return app
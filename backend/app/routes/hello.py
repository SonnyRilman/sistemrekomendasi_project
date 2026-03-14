from flask import Blueprint, request, jsonify

hello_bp = Blueprint('hello', __name__)

@hello_bp.route('/', methods=['GET'])
def hello_world():
    return jsonify({
        "status": "success",
        "message": "Hello World!"
    }), 200
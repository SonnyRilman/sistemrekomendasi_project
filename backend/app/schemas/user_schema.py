# app/schemas/user_schema.py
from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True)
    password = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)

user_schema = UserSchema()
users_schema = UserSchema(many=True)

# Cara pakai di route:
# from app.schemas.user_schema import user_schema
# errors = user_schema.validate(request.get_json())
# if errors: return jsonify(errors), 400
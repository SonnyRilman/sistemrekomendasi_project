# app/schemas/product_schema.py
from marshmallow import Schema, fields, validate

class ProductSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    price = fields.Float(required=True)
    brand = fields.Str(required=True)
    shades = fields.Str(required=True)
    ingredients = fields.Str(required=True)
    Category = fields.Str(required=True)
    Rating = fields.Float(required=True)
    created_at = fields.DateTime(dump_only=True)

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

# Cara pakai di route:
# from app.schemas.product_schema import product_schema
# errors = product_schema.validate(request.get_json())
# if errors: return jsonify(errors), 400
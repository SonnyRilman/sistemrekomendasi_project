# app/models/user.py
from app import db
from datetime import datetime

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    price = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    brand = db.Column(db.String(100), nullable=False)
    shades = db.Column(db.Text, nullable=False)
    ingredients = db.Column(db.Text, nullable=False)
    Category = db.Column(db.String(100), nullable=False)
    Rating = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'brand': self.brand,
            'shades': self.shades,
            'ingredients': self.ingredients,
            'Category': self.Category,
            'Rating': self.Rating,
            'created_at': self.created_at.isoformat()
        }
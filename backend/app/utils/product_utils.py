# app/utils/product_utils.py
from app.models.product import Product
import pandas as pd
import math

def get_unique_product_words(ids):
    """
    Mengambil produk berdasarkan list of IDs, mengekstrak namanya,
    memecahnya berdasarkan kata (spasi), dan menghilangkan duplikat.
    """
    # Get products by ids
    products = Product.query.filter(Product.id.in_(ids)).all()
    
    # Extract product name to array separate by white space
    product_names = []
    for product in products:
        if product.name:
            product_names.append(product.name.split())

    # Join into single array
    product_names_join = [item for sublist in product_names for item in sublist]

    # Remove duplicate
    product_names_unique = list(dict.fromkeys(product_names_join))
    
    return product_names, product_names_join, product_names_unique

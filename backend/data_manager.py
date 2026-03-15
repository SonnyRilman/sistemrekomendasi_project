import pandas as pd

# Fungsi untuk load data product lalu jadikan dataframe
def get_products_as_df(ids=None):
    # get products from excel
    products = load_data_products()
    if ids:
        products = products[products['id'].isin(ids)]
    
    if products.empty:
        return pd.DataFrame()
    
    # Ensure numeric columns are correct
    products['price'] = pd.to_numeric(products['price'], errors='coerce')
    products['Rating'] = pd.to_numeric(products['Rating'], errors='coerce')
    return products

def load_preprocessing_data_price():
    df = pd.read_excel('data/price_preprocessing.xlsx', header=2)
    return df

def load_preprocessing_data_rating():
    df = pd.read_excel('data/rating_preprocessing.xlsx', header=2)
    return df

def load_preprocessing_data_ingredients_tfidf():
    df = pd.read_excel('data/ingredient_preprocessing.xlsx', header=33)

    # Hapus kolom "Unnamed" yang muncul karena sel kosong di Excel
    df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
    
    # Hapus kolom 'Total' jika ada agar tidak mengganggu perhitungan similarity nanti
    if 'Total' in df.columns:
        df = df.drop(columns=['Total'])
    return df

def load_data_products():
    df = pd.read_excel('data/upload_data_products.xlsx')

    # Menghapus kolom shades.1 jika ada (agar tidak double)
    if 'shades.1' in df.columns:
        df = df.drop(columns=['shades.1'])

    # Insert new column 'id' auto increment
    df.insert(0, 'id', range(1, 1 + len(df)))

    # Insert new column 'product_code' auto increment dengan format P1, P2, dst
    df.insert(1, 'product_code', [f"P{i+1}" for i in range(len(df))])
    
    return df
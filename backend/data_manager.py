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
    # Menggunakan header=2 agar pas dengan Tabel 1 (berisi P1 s/d P165 yang ada di upload_data_products.xlsx)
    df = pd.read_excel('data/ingredient_preprocessing.xlsx', header=2)

    # Jika 'Ingredient Number' sudah ada di kolom lain (misal di akhir sebagai ringkasan), hapus dulu agar tidak duplikat saat rename
    if 'Ingredient Number' in df.columns:
        df = df.drop(columns=['Ingredient Number'])

    # Sesuaikan nama kolom agar terbaca oleh app.py (Tabel 1 menggunakan 'Product Number' bukan 'Ingredient Number')
    if 'Product Number' in df.columns:
        df = df.rename(columns={'Product Number': 'Ingredient Number'})

    # Hapus kolom "Unnamed" yang muncul karena sel kosong di Excel
    df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
    
    # Hapus kolom 'Total' jika ada agar tidak mengganggu perhitungan similarity nanti
    if 'Total' in df.columns:
        df = df.drop(columns=['Total'])
    
    # Karena ini file Excel raksasa dengan tabel ganda, kita hanya ambil s/d P165 yg ada di dataset
    # (Pencegahan agar tidak tercampur dengan Tabel 2 di baris 341)
    df = df.head(337) # Tabel 1 hanya sampai baris 337 (sebelum header tabel 2)
    
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
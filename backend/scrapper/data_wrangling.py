import pandas as pd
import re

# Load file Excel
file_in = 'detail_produk_sociolla.xlsx'
df = pd.read_excel(file_in)

# Tambahkan kolom Category dari segment 1 pada link
def extract_category(url):
    try:
        return re.search(r'sociolla\.com/([^/]+)/', url).group(1)
    except Exception:
        return ''
df['Category'] = df['link'].apply(extract_category)

df = df.drop(columns=['link'])

def clean_ingredients(text):
    if pd.isnull(text):
        return ''
    text = re.sub(r'\([^)]*\)', '', text)
    text = re.sub(r'\[[^\]]*\]', '', text)
    text = text.replace(',', ' ').replace('/', ' ')
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = text.lower()
    text = re.sub(r'\s+', ' ', text).strip()
    return text

df['ingredients'] = df['ingredients'].apply(clean_ingredients)

# Rename kolom nama ke name
df = df.rename(columns={'nama': 'name'})

# Ubah kolom name dan brand ke huruf kecil
df['name'] = df['name'].str.lower()
df['brand'] = df['brand'].str.lower()

# Bersihkan kolom price: hapus Rp, titik, ambil angka kiri jika range
def clean_price(val):
    if pd.isnull(val):
        return ''
    val = str(val)
    val = re.sub(r'(?i)rp\.?\s*', '', val)
    val = val.replace('.', '')
    val = val.split('-')[0].strip()
    val = re.sub(r'\D', '', val)
    return val

df['price'] = df['price'].apply(clean_price)

# Tambahkan kolom nomor urut di paling kiri
df.insert(0, 'no', range(1, len(df) + 1))

# Rename kolom rating ke Rating jika ada
if 'rating' in df.columns:
    df = df.rename(columns={'rating': 'Rating'})

# Urutkan kolom sesuai permintaan
kolom_urut = ['no', 'name', 'price', 'brand', 'ingredients', 'Category', 'Rating']
df = df[[col for col in kolom_urut if col in df.columns]]

df.to_excel('detail_produk_sociolla_fixed.xlsx', index=False)
print('File detail_produk_sociolla_fixed.xlsx berhasil dibuat.')

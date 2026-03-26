import pandas as pd
df = pd.read_excel('d:/sistemrekomendasi_project/backend/data/upload_data_products.xlsx')
print('Categories in DB:', df['Category'].unique().tolist())
print('Brands in DB:', df['brand'].unique().tolist())

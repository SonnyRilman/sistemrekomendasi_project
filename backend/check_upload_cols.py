import pandas as pd
try:
    df = pd.read_excel('d:/sistemrekomendasi_project/backend/data/upload_data_products.xlsx')
    print("Columns in upload_data_products.xlsx:")
    print(df.columns.tolist())
except Exception as e:
    print(f"Error: {e}")

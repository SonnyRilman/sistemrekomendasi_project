import pandas as pd

try:
    df = pd.read_excel('d:/sistemrekomendasi_project/backend/data/upload_data_products.xlsx')
    print("Columns:", df.columns.tolist())
    print("\nFirst 5 rows:")
    print(df.head())
    
    # Check for Category 'Foundation', Rating >= 4, price <= 300000
    # Note: Column names in Excel might be different (e.g. 'Category' vs 'category')
    # According to app.py, it uses 'Category', 'price', 'Rating'
    
    filtered = df[
        (df['Category'] == 'Foundation') & 
        (df['price'] <= 300000) &
        (df['Rating'] >= 4)
    ]
    print("\nFiltered count (Foundation, <= 300k, >= 4):", len(filtered))
except Exception as e:
    print(f"Error: {e}")

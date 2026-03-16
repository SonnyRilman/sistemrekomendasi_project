import pandas as pd

try:
    df = pd.read_excel('d:/sistemrekomendasi_project/backend/data/upload_data_products.xlsx')
    print("Columns:", df.columns.tolist())
    print("\nUnique Categories:", df['Category'].unique().tolist())
    print("\nPrice stats:")
    print(df['price'].describe())
    print("\nRating stats:")
    print(df['Rating'].describe())
    
    # Try a looser filter
    f2 = df[df['Category'] == 'Face Skin Care']
    print(f"\nCount for 'Face Skin Care':", len(f2))
    
    f3 = df[df['Category'] == 'Foundation']
    print(f"Count for 'Foundation':", len(f3))

except Exception as e:
    print(f"Error: {e}")

import pandas as pd
import sys

try:
    # Based on data_manager.py, header is 341
    df = pd.read_excel('d:/sistemrekomendasi_project/backend/data/ingredient_preprocessing.xlsx', header=341)
    df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
    print("Columns in ingredient_preprocessing.xlsx:")
    print(df.columns.tolist())
    print("\nFirst 5 rows:")
    print(df.head())
except Exception as e:
    print(f"Error: {e}")

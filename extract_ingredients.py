import pandas as pd
import json

try:
    df = pd.read_excel('d:/sistemrekomendasi_project/backend/data/ingredient_preprocessing.xlsx', header=33)
    df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
    if 'Total' in df.columns:
        df = df.drop(columns=['Total'])
    
    # Columns starting from index 2 are ingredients
    ingredients = df.columns[2:].tolist()
    print(json.dumps(ingredients))
except Exception as e:
    print(f"Error: {e}")

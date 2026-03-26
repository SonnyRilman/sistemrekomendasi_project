import pandas as pd
import sys

try:
    df = pd.read_excel('d:/sistemrekomendasi_project/backend/data/ingredient_preprocessing.xlsx', header=341)
    df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
    cols = [c.lower() for c in df.columns]
    
    frontend_ingredients = ["niacinamide", "tocopherol", "glycerin", "squalane", "ceramide", "hyaluronate", "salicylic", "titanium", "zinc", "oxide"]
    
    print("Checking frontend ingredients in Excel columns:")
    for ing in frontend_ingredients:
        found = any(ing in c for c in cols)
        print(f"{ing}: {'FOUND' if found else 'NOT FOUND'}")
        if found:
            match = [c for c in df.columns if ing in c.lower()]
            print(f"  Matches: {match[:5]}")
            
except Exception as e:
    print(f"Error: {e}")

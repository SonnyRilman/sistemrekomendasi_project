import pandas as pd
try:
    df = pd.read_excel('d:/sistemrekomendasi_project/backend/data/ingredient_preprocessing.xlsx', header=341)
    df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
    cols = [c.lower() for c in df.columns]
    
    new_ingredients = ["retinol", "bakuchiol", "peptide", "panthenol", "centella", "allantoin", "madecassoside", "ascorbic", "arbutin", "tranexamic", "glycolic", "lactic", "mugwort", "calamine"]
    
    print("Checking requested ingredients in Excel columns:")
    for ing in new_ingredients:
        found = any(ing in c for c in cols)
        print(f"{ing}: {'FOUND' if found else 'NOT FOUND'}")
            
except Exception as e:
    print(f"Error: {e}")

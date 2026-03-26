import pandas as pd
try:
    df = pd.read_excel('d:/sistemrekomendasi_project/backend/data/ingredient_preprocessing.xlsx', header=341)
    cols = [c.lower() for c in df.columns]
    print(f"artemisia: {any('artemisia' in c for c in cols)}")
except: pass

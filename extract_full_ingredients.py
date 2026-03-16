import openpyxl
import json

try:
    wb = openpyxl.load_workbook('d:/sistemrekomendasi_project/backend/data/ingredient_preprocessing.xlsx', read_only=True)
    sheet = wb.active
    header_row = list(sheet.iter_rows(min_row=34, max_row=34, values_only=True))[0]
    ingredients = [h for h in header_row[2:] if h and not str(h).startswith('Unnamed') and h != 'Total']
    with open('ingredients.json', 'w') as f:
        json.dump(ingredients, f)
    print("Success: Extracted", len(ingredients), "ingredients")
except Exception as e:
    print(f"Error: {e}")

import openpyxl

try:
    wb = openpyxl.load_workbook('d:/sistemrekomendasi_project/backend/data/ingredient_preprocessing.xlsx', read_only=True)
    sheet = wb.active
    # Row 34 (1-indexed) is the header according to data_manager.py (header=33 in pandas means 34th row)
    header_row = list(sheet.iter_rows(min_row=34, max_row=34, values_only=True))[0]
    # Filter out None and names starting with Unnamed or Total
    ingredients = [h for h in header_row[2:] if h and not str(h).startswith('Unnamed') and h != 'Total']
    print(ingredients)
except Exception as e:
    print(f"Error: {e}")

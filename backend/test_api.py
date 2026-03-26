import requests
import json

url = 'http://127.0.0.1:5000/api/preprocessing/rekomendasi_start'
payload = {
    "kategori_produk": "Serum", 
    "rating": 4.0,
    "pilihan_ingredients": ["Niacinamide", "Vitamin C"],
    "budget_max": 200000
}

try:
    print(f"Testing URL: {url} with payload: {payload}")
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error testing API: {e}")

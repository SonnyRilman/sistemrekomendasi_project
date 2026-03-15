# Skincare Recommendation System - Backend API

Backend API minimalist menggunakan Flask untuk mendukung sistem rekomendasi skincare. Proyek ini mencakup fitur pengelolaan produk, otentikasi JWT, dan modul preprocessing data (TF-IDF) untuk engine rekomendasi.

## 🚀 Fitur Utama

- **Pembacaan Data Excel**: Manajemen data skincare dengan spesifikasi lengkap.
- **Recommendation System**: Sistem rekomendasi skincare menggunakan TF-IDF dan Cosine Similarity.

## 🛠️ Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:
- **Python 3.10 atau versi di atasnya**

## 📥 Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone [url-repository-anda]
   cd flask-minimal
   ```

2. **Instal Dependensi**
   ```bash
   pip install -r requirements.txt
   ```

## ⚙️ Menjalankan Aplikasi

Jalankan server pengembangan:
```bash
python run.py
```
Aplikasi akan berjalan di `http://localhost:5000`.

## 📂 Struktur Proyek
- `collab/`: Berisi proses preprocessing data dan notebook.
- `app.py`: Logika endpoint API.
- `data_manager.py`: Fungsi pembantu untuk load data.
- `docs/`: Dokumentasi API.
- `requirements.txt`: Daftar dependensi yang dibutuhkan.
- `data/`: Data yang digunakan untuk sistem rekomendasi.

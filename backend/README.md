# Skincare Recommendation System - Backend API

Backend API minimalist menggunakan Flask untuk mendukung sistem rekomendasi skincare. Proyek ini mencakup fitur pengelolaan produk, otentikasi JWT, dan modul preprocessing data (TF-IDF) untuk engine rekomendasi.

## 🚀 Fitur Utama

- **CRUD Produk**: Manajemen data skincare dengan spesifikasi lengkap.
- **Recommendation System**: Sistem rekomendasi skincare menggunakan TF-IDF dan Cosine Similarity.

## 🛠️ Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:
- **Python 3.10 atau versi di atasnya**
- **MySQL Server**

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

3. **Konfigurasi Lingkungan (`.env`)**
   Salin file `.envexample` menjadi `.env` dan lengkapi kredensial database Anda:
   ```env
   DATABASE_PORT=3306
   DATABASE_USER=root
   DATABASE_PASSWORD=password_anda
   DATABASE_HOSTNAME=localhost
   DATABASE_NAME=skincare_db
   ```

## 🗄️ Persiapan Database

Pastikan database dengan nama yang ditentukan di `.env` (misal: `skincare_db`) sudah dibuat di MySQL Anda.

Jalankan skrip migrasi atau gunakan model yang ada untuk inisialisasi tabel:
```bash
# Jika menggunakan Flask-Migrate
flask db upgrade
```

## ⚙️ Menjalankan Aplikasi

Jalankan server pengembangan:
```bash
python run.py
```
Aplikasi akan berjalan di `http://localhost:5000`.

## 📂 Struktur Proyek
- `app/models/`: Definisi tabel database (SQLAlchemy).
- `app/routes/`: Logika endpoint API.
- `app/utils/`: Fungsi pembantu dan core logic.
- `app/schemas/`: Validasi data menggunakan Marshmallow.
- `docs/`: Dokumentasi API.
- `collab/`: Dokumentasi dan riset asli (Notebook Google Colab).

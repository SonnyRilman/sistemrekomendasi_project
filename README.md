# Sistem Rekomendasi Kosmetik

Sistem ini adalah aplikasi berbasis web yang dirancang untuk memberikan rekomendasi produk kosmetik berdasarkan preferensi pengguna, seperti kategori produk, anggaran (budget), rating minimal, dan kandungan bahan (ingredients). Sistem ini menggunakan teknik Content-Based Filtering dengan algoritma TF-IDF (Term Frequency - Inverse Document Frequency) untuk mencocokkan profil bahan produk dengan preferensi pengguna.

## Struktur Proyek

Proyek ini terbagi menjadi dua bagian utama:

1.  **Frontend (React + Vite)**: Menyediakan antarmuka pengguna yang interaktif dan responsif untuk memasukkan kriteria pencarian dan menampilkan hasil rekomendasi.
2.  **Backend (Flask)**: Berfungsi sebagai API server yang mengolah data produk dari file Excel, menghitung skor kemiripan bahan menggunakan TF-IDF, dan mengembalikan hasil rekomendasi ke frontend.

## Teknologi yang Digunakan

### Frontend
- React.js
- Vite (sebagai build tool)
- Tailwind CSS (untuk styling)
- Framer Motion (untuk animasi UI)

### Backend
- Python 3.x
- Flask (Web Framework)
- Pandas (Manipulasi data)
- NumPy (Operasi matriks dan numerik)
- Flask-CORS (Penanganan integrasi lintas domain)

### Data
- Dataset disimpan dalam format Excel (.xlsx) di direktori `backend/data/`.
- Perhitungan kemiripan dilakukan berdasarkan kolom bahan produk yang telah diproses.

## Cara Menjalankan Sistem

Pastikan Anda telah menginstal Node.js dan Python di sistem Anda sebelum memulai.

### Langkah 1: Persiapan Backend

1.  Buka terminal dan navigasikan ke direktori utama proyek.
2.  Aktifkan lingkungan virtual Python (venv):
    ```powershell
    .\venv\Scripts\activate
    ```
3.  Masuk ke direktori backend:
    ```powershell
    cd backend
    ```
4.  Jalankan server Flask:
    ```powershell
    python app.py
    ```
    Server backend akan berjalan secara default pada alamat http://localhost:5000.

### Langkah 2: Persiapan Frontend

1.  Buka terminal baru (biarkan terminal backend tetap berjalan).
2.  Navigasikan ke direktori utama proyek.
3.  Instal dependensi Node.js (hanya perlu dilakukan sekali):
    ```bash
    npm install
    ```
4.  Jalankan server pengembangan Vite:
    ```bash
    npm run dev
    ```
    Aplikasi frontend akan tersedia pada alamat http://localhost:5173.

## Fitur Utama

- Pencarian produk berdasarkan kategori (seperti lipstick, foundation, pressed-powder, dll).
- Filter berdasarkan rentang harga atau budget maksimal.
- Filter berdasarkan rating minimal produk dari pengguna lain.
- Rekomendasi tingkat lanjut berdasarkan kesesuaian bahan (ingredients) menggunakan perhitungan skor similarity.
- Tampilan detail produk yang informatif.

## Catatan Tambahan

Aplikasi ini memerlukan kedua komponen (Frontend dan Backend) untuk berjalan secara bersamaan agar fungsi rekomendasi dapat bekerja sepenuhnya. Jika Anda melakukan perubahan pada dataset Excel, pastikan untuk memulai ulang server backend agar perubahan data dapat dimuat kembali ke dalam sistem.

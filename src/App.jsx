import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Recommendations from './pages/Recommendations';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/recommendations" element={<Recommendations />} />
          </Routes>
        </main>
        
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-4">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-rose-500">
                GlowGuide
              </span>
              <p className="text-slate-500 text-sm max-w-xs mx-auto md:mx-0">
                Sistem rekomendasi makeup cerdas untuk membantu Anda menemukan produk kecantikan yang paling pas.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">Quick Links</h4>
              <nav className="flex flex-col space-y-2 text-sm text-slate-500">
                <a href="/" className="hover:text-primary-600">Home</a>
                <a href="/products" className="hover:text-primary-600">Daftar Produk</a>
                <a href="/recommendations" className="hover:text-primary-600">Hasil Rekomendasi</a>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">Metodologi</h4>
              <p className="text-slate-500 text-sm">
                Project Skripsi: <br />
                Implementasi Content-Based Filtering pada Platform E-Commerce Makeup.
              </p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-center text-slate-400 text-xs">
            © 2024 GlowGuide System. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Recommendations from './pages/Recommendations';
import Evaluation from './pages/Evaluation';
import { Mail, ShieldCheck, Database, LayoutPanelLeft } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-primary/20 bg-[#fafafa]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/evaluation" element={<Evaluation />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-neutral-200 py-12 px-6 mt-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              
              {/* Brand Section */}
              <div className="md:col-span-2 space-y-6">
                <Link to="/" className="flex flex-col">
                  <span className="text-2xl font-black tracking-tighter text-neutral-900 font-outfit uppercase">
                    GLOW<span className="text-primary italic">GUIDE</span>
                  </span>
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.3em] mt-1">
                    Cosmetic Recommender System
                  </span>
                </Link>
                <p className="text-neutral-500 text-sm font-medium leading-relaxed max-w-sm">
                  Platform cerdas yang menerapkan <b>Content-Based Filtering</b> untuk membantu pemilihan produk kecantikan secara personal berdasarkan data bahan aktif produk.
                </p>
                <div className="flex gap-3">
                  {[ShieldCheck, Database, LayoutPanelLeft].map((Icon, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400">
                      <Icon size={14} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-900">Navigasi</h4>
                <nav className="flex flex-col space-y-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
                  <Link to="/" className="hover:text-primary transition-colors">Beranda</Link>
                  <Link to="/products" className="hover:text-primary transition-colors">Katalog Produk</Link>
                  <Link to="/recommendations" className="hover:text-primary transition-colors">Hasil Rekomendasi</Link>
                </nav>
              </div>

              {/* Research Info */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-900">Informasi Projek</h4>
                <div className="space-y-3">
                   <div className="flex items-center gap-3 text-neutral-500">
                      <Mail size={12} />
                      <span className="text-xs font-bold">admin@glowguide.id</span>
                   </div>
                   <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 leading-relaxed">
                        Tugas Akhir / Skripsi: <br />
                        <span className="text-neutral-900">Implementasi Cosine Similarity pada Sistem Rekomendasi Kosmetik</span>
                      </p>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-neutral-400">
                © 2024 GLOWGUIDE CORE SYSTEM.
              </div>
              <div className="flex gap-8 text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                 <a href="#" className="hover:text-neutral-900">Documentation</a>
                 <a href="#" className="hover:text-neutral-900">Methodology</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

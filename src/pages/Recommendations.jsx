import { useLocation, useNavigate } from 'react-router-dom';
import { RefreshCw, LayoutGrid, Info, ArrowLeft, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { apiService } from '../services/api';

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ... same effect logic
  }, [location.state, navigate]);

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="text-neutral-900 animate-spin" size={32} />
            <div className="space-y-1">
              <h2 className="text-xl font-black uppercase tracking-tight text-neutral-900">Memproses Data...</h2>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Menghitung Cosine Similarity</p>
            </div>
          </div>
        ) : error ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
            <Info className="text-red-500" size={32} />
            <div className="space-y-1">
              <h3 className="text-xl font-black uppercase tracking-tight text-neutral-900">Terjadi Kesalahan</h3>
              <p className="text-neutral-500 text-sm max-w-md mx-auto">{error}</p>
            </div>
            <button onClick={() => navigate('/')} className="primary-btn">Kembali ke Beranda</button>
          </div>
        ) : (
          <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-100 pb-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-neutral-100 rounded border border-neutral-200">
                  <span className="text-[9px] font-black uppercase tracking-wider text-neutral-500">Hasil Analisis Content-Based Filtering</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight uppercase">
                  Hasil Rekomendasi <br/> <span className="text-primary italic">Terbaik Untuk Anda</span>
                </h1>
                <p className="text-neutral-500 text-sm font-medium max-w-xl">
                  Berdasarkan algoritma kemiripan konten (Cosine Similarity).
                </p>
              </div>

              <div className="flex gap-3">
                 <button onClick={() => navigate('/')} className="outline-btn !px-4 !py-2 text-[10px] uppercase tracking-widest">
                  <ArrowLeft size={14} /> Kembali
                </button>
                 <button onClick={() => navigate('/')} className="primary-btn !px-4 !py-2 text-[10px] uppercase tracking-widest">
                  <RefreshCw size={14} /> Konsultasi Ulang
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((product) => (
                <div key={product.id} className="space-y-3">
                  <ProductCard product={product} />
                  <div className="bg-white border border-neutral-100 p-3 rounded-xl flex items-center justify-between shadow-sm">
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-wider text-neutral-400">Match Accuracy</span>
                        <div className="w-16 h-1 bg-neutral-100 rounded-full mt-1 overflow-hidden">
                           <div className="h-full bg-primary" style={{ width: `${product.similarityScore * 100}%` }}></div>
                        </div>
                     </div>
                     <span className="text-lg font-black text-neutral-900 tracking-tighter">{(product.similarityScore * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Technical Methodology Breakdown */}
            <section className="bg-neutral-900 text-white rounded-2xl p-8 relative overflow-hidden">
               <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-4">
                     <h4 className="text-xl font-black uppercase tracking-tight">Catatan Metodologi</h4>
                     <p className="text-neutral-400 text-xs font-medium leading-relaxed">
                        Sistem ini menggunakan teknik <b>Content-Based Filtering</b>. Kemiripan dihitung menggunakan rumus <b>Cosine Similarity</b>.
                     </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm space-y-3 text-[10px] font-bold uppercase tracking-widest">
                        <div className="flex justify-between">
                           <span className="text-neutral-400 font-medium">Algorithm</span>
                           <span className="text-primary">Cosine Similarity</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-neutral-400 font-medium">Vector Mode</span>
                           <span className="text-white">TF-IDF Inspired</span>
                        </div>
                  </div>
               </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;

import { useLocation, useNavigate } from 'react-router-dom';
import { RefreshCw, LayoutGrid, Info, ArrowLeft, Loader2, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { apiService } from '../services/api';

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (!location.state) {
          navigate('/');
          return;
        }
        
        // Memanggil API Service dengan data payload yang benar
        const response = await apiService.getRecommendations(location.state.payload);
        
        const formattedResults = response.results.map(item => ({
          ...item,
          similarityScore: item.similarity_score
        }));

        setRecommendations(formattedResults);
        if (response.metrics) {
          setMetrics(response.metrics);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Gagal memuat rekomendasi.");
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [location.state, navigate]);

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6 space-y-12">

        {/* Header & Metrics Dashboard */}
        {!loading && !error && (
        <div className="space-y-8">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-neutral-100 rounded-lg shadow-sm">
                      <Zap size={14} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Algorithmic Match Engine</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tighter uppercase leading-tight">
                      Search <br/> <span className="text-neutral-300 italic">Results</span>
                  </h1>
              </div>

              {/* Real-time Accuracy Metrics */}
              {metrics && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-xl shadow-neutral-900/5">
                    <div className="space-y-1 text-center border-r border-neutral-50 px-4">
                        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Precision</p>
                        <p className="text-xl font-black text-neutral-900 italic">{(metrics.precision * 100).toFixed(1)}%</p>
                    </div>
                    <div className="space-y-1 text-center lg:border-r border-neutral-50 px-4">
                        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Recall</p>
                        <p className="text-xl font-black text-neutral-900 italic">{(metrics.recall * 100).toFixed(1)}%</p>
                    </div>
                    <div className="space-y-1 text-center px-4">
                        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">F1-Score</p>
                        <p className="text-xl font-black text-neutral-900 italic">{(metrics.f1 * 100).toFixed(1)}%</p>
                    </div>
                </div>
              )}
           </div>
        </div>
        )}
        
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

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {recommendations.map((product) => (
                <motion.div 
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex flex-col h-full"
                >
                  <ProductCard product={product} isRecommendation={true} />
                </motion.div>
              ))}
            </motion.div>

            {/* Technical Methodology Breakdown */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-neutral-900 text-white rounded-[2rem] p-10 relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32"></div>
               <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                  <div className="space-y-4">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                        <Zap size={14} className="text-primary" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Analysis Protocol</span>
                     </div>
                     <h4 className="text-2xl font-black uppercase tracking-tight">Catatan Metodologi</h4>
                     <p className="text-neutral-400 text-xs font-medium leading-relaxed max-w-md">
                        Sistem menggunakan teknik <b>Content-Based Filtering</b>. Setiap skor kemiripan dihitung matematis menggunakan rumus <b>Cosine Similarity</b> dengan membandingkan vektor bahan aktif user terhadap 1400+ molekul dalam database.
                     </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl grid grid-cols-2 gap-8 text-[10px] font-black uppercase tracking-widest">
                        <div className="space-y-4">
                           <div className="space-y-1">
                              <span className="text-neutral-500">Algorithm</span>
                              <p className="text-primary">Cosine Similarity</p>
                           </div>
                           <div className="space-y-1">
                              <span className="text-neutral-500">Processing</span>
                              <p className="text-white">Vectorized (NumPy)</p>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div className="space-y-1">
                              <span className="text-neutral-500">Feature Vector</span>
                              <p className="text-white">TF-IDF Weights</p>
                           </div>
                           <div className="space-y-1">
                              <span className="text-neutral-500">Latency</span>
                              <p className="text-white">~0.002s / Result</p>
                           </div>
                        </div>
                  </div>
               </div>
            </motion.section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;

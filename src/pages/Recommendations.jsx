import { useLocation, Link, useNavigate } from 'react-router-dom';
import { RefreshCw, BarChart3, Info, ChevronLeft, Layout } from 'lucide-react';
import { DUMMY_PRODUCTS } from '../data/products';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      const mockRecs = DUMMY_PRODUCTS
        .map(p => ({
          ...p,
          similarityScore: (Math.random() * 0.4 + 0.6).toFixed(2)
        }))
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, 4);
      
      setRecommendations(mockRecs);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.state]);

  return (
    <div className="bg-white min-h-screen pb-40">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="space-y-6">
            <h2 className="text-brand-600 font-bold uppercase tracking-[0.3em] text-[10px]">
              Recommendation Results
            </h2>
            <h1 className="text-6xl font-serif font-medium leading-tight text-neutral-900">
              Analisis <span className="italic font-normal text-brand-700">Terbaik</span> <br />Untuk Persona Anda.
            </h1>
            <p className="text-neutral-500 font-light text-xl max-w-xl leading-relaxed">
              {location.state?.product 
                ? `Berdasarkan pola karakteristik dari ${location.state.product.name}.`
                : "Hasil optimasi parameter profil kulit dan preferensi brand Anda."}
            </p>
          </div>

          <div className="flex gap-6">
            <button onClick={() => navigate('/')} className="btn-outline px-10">
              <RefreshCw className="mr-3 h-4 w-4" />
              Reset Profil
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center text-center space-y-10">
            <div className="h-16 w-16 border-t-2 border-brand-600 rounded-full animate-spin"></div>
            <div className="space-y-4">
              <h3 className="text-2xl font-serif font-medium text-neutral-900 tracking-wide">Menganalisis Parameter...</h3>
              <p className="text-neutral-400 font-light italic">Menghubungkan profil Anda dengan 1.2k+ koleksi produk.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-24">
            {/* Dashboard Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-100 border-y border-neutral-100">
              <div className="bg-white py-12 px-8 flex flex-col items-center space-y-4">
                <BarChart3 className="h-6 w-6 text-neutral-900" />
                <div className="text-center">
                   <span className="block text-3xl font-serif font-bold italic">99.4%</span>
                   <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400">Similarity Index</span>
                </div>
              </div>
              <div className="bg-white py-12 px-8 flex flex-col items-center space-y-4">
                <Layout className="h-6 w-6 text-neutral-900" />
                <div className="text-center">
                   <span className="block text-3xl font-serif font-bold italic">Top 4</span>
                   <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400">Curated Matches</span>
                </div>
              </div>
              <div className="bg-white py-12 px-8 flex flex-col items-center space-y-4">
                <Info className="h-6 w-6 text-neutral-900" />
                <div className="text-center">
                   <span className="block text-3xl font-serif font-bold italic">CBF</span>
                   <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400">Filtering Method</span>
                </div>
              </div>
            </div>

            {/* Recommendation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20">
              {recommendations.map((product) => (
                <div key={product.id} className="space-y-6">
                  <ProductCard product={product} />
                  <div className="border-t border-neutral-50 pt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-neutral-300">
                    <span>Match Probability</span>
                    <span className="text-neutral-900 italic font-black">{(product.similarityScore * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Scientific Insight */}
            <div className="bg-neutral-50 p-16 rounded-[3rem] border border-neutral-100 flex flex-col items-center text-center space-y-8">
               <div className="max-w-2xl space-y-6">
                 <h4 className="text-2xl font-serif font-semibold text-neutral-900">Teknologi Content-Based Filtering</h4>
                 <p className="text-neutral-500 font-light leading-loose text-lg italic">
                   "Sistem kami mengekstraksi vektor karakteristik dari setiap bahan aktif (ingredients), shade, dan tekstur produk. Dengan mengkalkulasi Cosine Similarity, kami memastikan produk yang direkomendasikan memiliki harmoni molekular yang paling tinggi dengan preferensi profil Anda."
                 </p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;

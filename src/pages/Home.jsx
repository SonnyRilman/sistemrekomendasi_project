import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, CheckCircle2, Sparkles, Droplets, ShieldCheck, Zap, Beaker, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../data/products';
import { clsx } from 'clsx';

const Home = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [preferences, setPreferences] = useState({
    category: 'foundation',
    rating: 4,
    ingredients: [],
    priceRange: '300000',
  });

  const INGREDIENT_GROUPS = [
    { 
      label: 'Brightening', 
      icon: <Sparkles size={14} />,
      items: ["niacinamide", "tocopherol"] 
    },
    { 
      label: 'Hydration & Barrier', 
      icon: <Droplets size={14} />,
      items: ["glycerin", "squalane", "ceramide", "hyaluronate"] 
    },
    { 
      label: 'Treatment', 
      icon: <Zap size={14} />,
      items: ["salicylic"] 
    },
    { 
      label: 'Protection & Base', 
      icon: <ShieldCheck size={14} />,
      items: ["titanium", "zinc", "oxide"] 
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (ing) => {
    setPreferences(prev => {
      const current = [...prev.ingredients];
      if (current.includes(ing)) {
        return { ...prev, ingredients: current.filter(i => i !== ing) };
      } else {
        return { ...prev, ingredients: [...current, ing] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsScanning(true);
    
    // Artificial scanning delay for "WOW" effect
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const payload = {
      kategori_produk: preferences.category,
      rating: parseFloat(preferences.rating),
      pilihan_ingredients: preferences.ingredients,
      budget_max: parseInt(preferences.priceRange)
    };
    navigate('/recommendations', { state: { payload } });
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      
      {/* Dynamic Hero Section - High End Visual */}
      <section className="relative min-h-[500px] md:min-h-[700px] flex items-start overflow-hidden bg-neutral-900 pt-32 pb-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/skincare_lab_hero_minimalist_1773682856998.png" 
            className="w-full h-full object-cover opacity-50 contrast-125 scale-105"
            alt="Lab Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f5f5f5] via-neutral-900/50 to-neutral-900/70"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
              <Beaker size={14} className="text-primary animate-pulse" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white">Advanced Analysis Protocol v2.0</span>
            </div>
            <h1 className="text-[clamp(3.5rem,10vw,7rem)] font-black text-white leading-[0.8] uppercase tracking-tighter">
              Digital <br/> <span className="text-primary italic">Skin Lab</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 font-medium leading-relaxed max-w-xl">
              Precision skincare recommendations powered by <b>Content-Based Filtering</b> and molecular similarity profiling.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Consultation Area */}
      <main className="max-w-[1400px] mx-auto px-6 -mt-32 pb-40 relative z-20">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
          
          {/* Left: Input Form Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="xl:col-span-8 bg-white border border-neutral-200 rounded-[3rem] p-8 md:p-16 shadow-xl shadow-neutral-900/5 relative overflow-hidden"
          >
            {/* Scanning Overlay */}
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center space-y-6"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-neutral-100 border-t-primary rounded-full animate-spin"></div>
                    <Search className="absolute inset-0 m-auto text-primary" size={32} />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-black uppercase tracking-tighter">Scanning Database...</h3>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Applying Cosine Similarity Vectors</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-16">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] ml-2">Target Category</label>
                  <select 
                    name="category" 
                    value={preferences.category} 
                    onChange={handleChange} 
                    className="w-full bg-neutral-50 border-none rounded-2xl px-6 py-5 outline-none focus:ring-4 focus:ring-primary/5 transition-all text-xl font-black uppercase tracking-tight" 
                    required
                  >
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] ml-2">Satisfaction Threshold</label>
                  <select 
                    name="rating" 
                    value={preferences.rating} 
                    onChange={handleChange} 
                    className="w-full bg-neutral-50 border-none rounded-2xl px-6 py-5 outline-none focus:ring-4 focus:ring-primary/5 transition-all text-xl font-black"
                  >
                    {[4, 4.5, 5].map((r) => <option key={r} value={r}>{r}.0+ Minimal Rating</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-10">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-6">
                  <h3 className="text-[11px] font-black text-neutral-900 uppercase tracking-[0.3em]">Molecular Profile Selection</h3>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-12 bg-neutral-100 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(preferences.ingredients.length / 10) * 100}%` }}
                        className="h-full bg-primary"
                       />
                    </div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">{preferences.ingredients.length}/10</span>
                  </div>
                </div>
                
                <div className="grid gap-10">
                  {INGREDIENT_GROUPS.map((group) => (
                    <div key={group.label} className="space-y-5">
                      <div className="flex items-center gap-3 text-neutral-300">
                        {group.icon}
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{group.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {group.items.map((ing) => {
                          const isActive = preferences.ingredients.includes(ing);
                          return (
                            <button
                              key={ing}
                              type="button"
                              onClick={() => handleIngredientChange(ing)}
                              className={clsx(
                                "px-6 py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all relative overflow-hidden group/btn",
                                isActive 
                                  ? "bg-neutral-900 text-white border-neutral-900 shadow-xl -translate-y-1" 
                                  : "bg-white text-neutral-400 border-neutral-100 hover:border-neutral-900 hover:text-neutral-900"
                              )}
                            >
                              <div className="flex items-center gap-3 relative z-10">
                                {isActive && <motion.div layoutId="check"><CheckCircle2 size={14} className="text-primary" /></motion.div>}
                                {ing}
                              </div>
                              {isActive && (
                                <motion.div 
                                  className="absolute inset-0 bg-primary/10 pointer-events-none"
                                  initial={{ x: '-100%' }}
                                  animate={{ x: '100%' }}
                                  transition={{ repeat: Infinity, duration: 1.5 }}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-12 border-t border-neutral-100 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Economic Parameters (Budget)</label>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-neutral-300 italic">IDR</span>
                      <span className="text-7xl font-black font-outfit tracking-tighter text-neutral-900 leading-none">
                        {parseInt(preferences.priceRange).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 max-w-md pb-6">
                    <input
                      type="range"
                      name="priceRange"
                      min="30000"
                      max="500000"
                      step="10000"
                      value={preferences.priceRange}
                      onChange={handleChange}
                      className="w-full h-2 bg-neutral-100 rounded-full appearance-none cursor-pointer accent-neutral-900"
                    />
                    <div className="flex justify-between mt-4 text-[9px] font-black text-neutral-300 uppercase tracking-widest">
                       <span>Min. 30k</span>
                       <span>Max. 500k</span>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isScanning}
                  className="premium-button w-full !py-8 text-sm flex items-center justify-center gap-6 group scale-100 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isScanning ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      EXECUTE CALCULATION PROTOCOL
                      <ChevronRight size={20} className="group-hover:translate-x-3 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Right: Live Data Profile */}
          <motion.aside 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-4 space-y-8 sticky top-32"
          >
            <div className="premium-card bg-neutral-900 text-white border-none space-y-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] -mr-16 -mt-16 group-hover:bg-primary/40 transition-all duration-1000"></div>
               
               <div className="space-y-2 relative">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Profiling</h3>
                 <p className="text-3xl font-black uppercase tracking-tighter leading-none">Analysis Summary</p>
               </div>

               <div className="space-y-8 relative">
                 <div className="space-y-3">
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">Operational Space</span>
                    <p className="text-2xl font-black uppercase tracking-tight italic text-white capitalize">{preferences.category}</p>
                 </div>
                 
                 <div className="space-y-4">
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">Kandungan Terdeteksi</span>
                    <div className="flex flex-wrap gap-2">
                      {preferences.ingredients.length > 0 ? (
                        preferences.ingredients.map(ing => (
                          <motion.span 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            key={ing} 
                            className="text-[9px] font-black uppercase tracking-tighter px-3 py-1 bg-white/10 rounded-full border border-white/5 flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(230,57,70,0.8)]"></div>
                            {ing}
                          </motion.span>
                        ))
                      ) : (
                        <span className="text-xs text-neutral-600 font-medium italic">Menunggu input user...</span>
                      )}
                    </div>
                 </div>

                 <div className="pt-8 border-t border-white/10 flex justify-between items-center">
                    <div className="space-y-1">
                       <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest block">Algorithm State</span>
                       <span className="text-xs font-bold text-neutral-200">READY_FOR_COMPUTE</span>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                       <Zap size={20} className="text-primary" />
                    </div>
                 </div>
               </div>
            </div>

            <div className="premium-card bg-white border-neutral-100 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-neutral-900 flex items-center justify-center text-white">
                     <ShieldCheck size={20} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest italic text-neutral-900">Lab Standards</span>
               </div>
               <p className="text-[11px] font-medium text-neutral-400 leading-relaxed uppercase tracking-wider">
                Sistem menggunakan Dataset Terbaru 2024 untuk menjamin validasi kemiripan bahan aktif yang akurat.
               </p>
            </div>
          </motion.aside>

        </div>
      </main>
    </div>
  );
};

export default Home;

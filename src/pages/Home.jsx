import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Database, Layers, Cpu } from 'lucide-react';
import { BRANDS, CATEGORIES, SKIN_TYPES, SHADES } from '../data/products';

const Home = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    category: '',
    brand: '',
    skinType: '',
    shade: '',
    priceRange: '300000',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/recommendations', { state: { preferences } });
  };

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero Section - Refined Proportions */}
      <section className="relative pt-20 pb-12 md:pb-24 overflow-hidden">
        <div className="section-container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 animate-fade-up">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-[1px] w-8 bg-brand-500"></div>
                <h2 className="text-brand-600 font-bold uppercase tracking-[0.3em] text-[10px]">
                  Sistem Rekomendasi Produk Makeup
                </h2>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-black leading-[1.1] text-neutral-900 tracking-tight">
                Pilih Pesona <br />
                <span className="italic font-normal text-brand-600">Terbaik</span> Anda.
              </h1>
            </div>
            
            <p className="text-base text-neutral-500 max-w-sm leading-relaxed font-light italic">
              "Teknologi cerdas untuk kulit unik Anda. Temukan harmoni sempurna melalui algoritma presisi."
            </p>

            <div className="flex items-center space-x-6">
              <a href="#consultation" className="btn-primary flex items-center">
                Mulai Konsultasi
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <button 
                onClick={() => navigate('/products')} 
                className="btn-secondary"
              >
                Lihat Katalog
              </button>
            </div>

            <div className="flex items-center space-x-12 pt-4 border-t border-neutral-50 max-w-sm">
                <div className="text-center">
                    <p className="text-2xl font-serif font-bold text-neutral-900">12k+</p>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Katalog</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-serif font-bold text-neutral-900">99.8%</p>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Akurasi</p>
                </div>
            </div>
          </div>

          <div className="relative hidden lg:block animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-100/50 rounded-full blur-3xl -z-10"></div>
            <div className="luxury-card p-3 rotate-1 hover:rotate-0 transition-transform duration-700">
              <img
                src="/hero.png"
                alt="Luxury Makeup"
                className="rounded-xl aspect-square object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Bar - Subtle & Neat */}
      <section className="bg-neutral-50 py-10 border-y border-neutral-100">
        <div className="section-container flex flex-wrap justify-between items-center gap-8 opacity-40 grayscale">
           {['WARDAH', 'MAKE OVER', 'EMINA', 'SOMETHINC', 'MAYBELLINE', 'PURBASARI'].map(brand => (
             <span key={brand} className="text-sm font-serif font-black tracking-widest">{brand}</span>
           ))}
        </div>
      </section>

      {/* Methodology Section - Scientific & Minimalist */}
      <section className="section-container py-32 space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6 group">
            <div className="w-10 h-10 bg-neutral-900 text-white rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-neutral-200">
                <Database className="h-5 w-5" />
            </div>
            <div className="space-y-2">
                <h3 className="text-lg font-bold uppercase tracking-widest text-neutral-900">Analisis</h3>
                <p className="text-neutral-500 font-light text-sm leading-relaxed">Ekstraksi data mikroskopis dari shade dan bahan aktif untuk mengenali karakteristik unik.</p>
            </div>
          </div>
          <div className="space-y-6 group">
            <div className="w-10 h-10 bg-neutral-900 text-white rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-neutral-200">
                <Layers className="h-5 w-5" />
            </div>
            <div className="space-y-2">
                <h3 className="text-lg font-bold uppercase tracking-widest text-neutral-900">Komputasi</h3>
                <p className="text-neutral-500 font-light text-sm leading-relaxed">Menghitung skor kedekatan antara preferensi profil kulit dan koleksi database kami.</p>
            </div>
          </div>
          <div className="space-y-6 group">
            <div className="w-10 h-10 bg-neutral-900 text-white rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-neutral-200">
                <Cpu className="h-5 w-5" />
            </div>
            <div className="space-y-2">
                <h3 className="text-lg font-bold uppercase tracking-widest text-neutral-900">Kurasi</h3>
                <p className="text-neutral-500 font-light text-sm leading-relaxed">Memberikan rekomendasi Top-N produk dengan tingkat harmoni tertinggi bagi Anda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skin Education - Beautiful Card Layout */}
      <section className="bg-nude-50 py-32 border-y border-nude-100">
        <div className="section-container grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 order-2 lg:order-1">
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden luxury-card border-8 border-white p-0">
                    <img 
                        src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800" 
                        alt="Skin Education" 
                        className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-1000"
                    />
                </div>
            </div>
            <div className="space-y-10 order-1 lg:order-2">
                <div className="space-y-4">
                    <span className="text-accent-gold font-bold uppercase tracking-[0.4em] text-[9px]">The Skin Guide</span>
                    <h2 className="text-5xl font-serif leading-tight">Pahami <span className="italic serif">Kebutuhan</span> <br/> Kulit Anda.</h2>
                </div>
                <div className="grid grid-cols-1 gap-8">
                    {[
                        { type: 'Oily', desc: 'Produk light-weight & matte control.' },
                        { type: 'Dry', desc: 'Produk dewy & hidrasi berkelanjutan.' },
                        { type: 'Combination', desc: 'Balance antara kontrol minyak & moisturizer.' }
                    ].map(skin => (
                        <div key={skin.type} className="flex space-x-6 group">
                            <div className="text-accent-gold font-serif font-black italic text-2xl opacity-20 transition-opacity group-hover:opacity-100">0{['Oily','Dry','Combination'].indexOf(skin.type)+1}</div>
                            <div className="space-y-1 pt-1">
                                <h4 className="font-bold text-neutral-900 uppercase tracking-widest text-xs">{skin.type} Skin</h4>
                                <p className="text-neutral-500 font-light text-sm">{skin.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Form Section - Neat Floating Consultation */}
      <section id="consultation" className="py-32 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-neutral-900">Mulai Konsultasi</h2>
            <p className="text-neutral-400 font-light text-lg">Wujudkan profil kecantikan ideal Anda sekarang.</p>
          </div>

          <form onSubmit={handleSubmit} className="luxury-card p-10 md:p-16 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 pl-1">Kategori Produk</label>
                <select name="category" value={preferences.category} onChange={handleChange} className="input-field" required>
                  <option value="">Pilih Kategori</option>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="group space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 pl-1">Brand Favorit</label>
                <select name="brand" value={preferences.brand} onChange={handleChange} className="input-field">
                  <option value="">Semua Brand</option>
                  {BRANDS.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </div>

              <div className="group space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 pl-1">Tipe Kulit</label>
                <select name="skinType" value={preferences.skinType} onChange={handleChange} className="input-field" required>
                  <option value="">Pilih Tipe Kulit</option>
                  {SKIN_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div className="group space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 pl-1">Pilihan Shade</label>
                <select name="shade" value={preferences.shade} onChange={handleChange} className="input-field">
                  <option value="">Semua Shade</option>
                  {SHADES.map((shade) => <option key={shade} value={shade}>{shade}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-neutral-50">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                <label>Batas Budget Maksimal</label>
                <span className="text-neutral-900 bg-neutral-50 px-3 py-1 rounded-full">Rp {parseInt(preferences.priceRange).toLocaleString('id-ID')}</span>
              </div>
              <input
                type="range"
                name="priceRange"
                min="30000"
                max="500000"
                step="10000"
                value={preferences.priceRange}
                onChange={handleChange}
                className="w-full h-1 bg-neutral-100 rounded-full appearance-none cursor-pointer accent-neutral-900"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-5 text-base tracking-[0.2em] font-black"
            >
              DAPATKAN REKOMENDASI
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Shield, Truck, RefreshCcw, Share2, Plus, Star, MapPin, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';

const getProductImage = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('powder')) return '/powder.png';
  if (cat.includes('lipstick') || cat.includes('lip-tint') || cat.includes('lip-cream')) return '/lipstick.png';
  if (cat.includes('blush')) return '/blush.png';
  if (cat.includes('cushion')) return '/cushion.png';
  if (cat.includes('serum')) return '/serum.png';
  if (cat.includes('mask')) return '/sheet-mask.png';
  if (cat.includes('wash') || cat.includes('cleanser')) return '/cleanser.png';
  if (cat.includes('sunscreen')) return '/sunscreen.png';
  return '/serum.png';
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts();
        const foundProduct = response.products.find((p) => p.id === parseInt(id));
        if (foundProduct) {
          const category = foundProduct.Category || '';
          setProduct({
            id: foundProduct.id,
            name: foundProduct.name,
            brand: foundProduct.brand || 'Luxury Brand',
            category: category,
            price: foundProduct.price,
            rating: foundProduct.Rating,
            image: getProductImage(category),
            description: foundProduct.Deskripsi || 'Detail produk istimewa.',
            shade: foundProduct.shades || '-',
            skinType: foundProduct.skinType || 'All types',
            ingredients: foundProduct.ingredients || 'Data bahan aktif tidak tersedia.'
          });
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
        <div className="w-12 h-12 border-4 border-neutral-100 border-t-neutral-900 rounded-full animate-spin"></div>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Loading Specification</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-24 pt-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumb */}
        <motion.div 
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-8"
        >
          <button onClick={() => navigate('/')} className="hover:text-neutral-900 transition-colors">Lab</button>
          <div className="w-1 h-px bg-neutral-200"></div>
          <button onClick={() => navigate('/products')} className="hover:text-neutral-900 transition-colors">Specimens</button>
          <div className="w-1 h-px bg-neutral-200"></div>
          <span className="text-neutral-900 font-black">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Product Image Column */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             className="lg:col-span-6 relative group"
          >
            <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden aspect-square shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3 mt-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="flex-1 aspect-square rounded-xl border border-neutral-100 overflow-hidden cursor-pointer hover:border-neutral-900 transition-all shadow-sm">
                    <img src={product.image} className="w-full h-full object-cover" alt="view" />
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Product Info Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-6 space-y-8"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                 <div className="bg-neutral-100 text-neutral-500 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded inline-block border border-neutral-200">
                    {product.brand}
                 </div>
                 <h1 className="text-4xl md:text-5xl font-black font-outfit text-neutral-900 uppercase tracking-tighter leading-[1.1]">
                    {product.name}
                 </h1>
              </div>

              <div className="flex items-end gap-8">
                <div className="space-y-1">
                   <div className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Retail Price</div>
                   <div className="text-4xl font-black font-outfit tracking-tighter">
                      <span className="text-sm font-bold mr-1 italic text-neutral-300">Rp</span>
                      {product.price.toLocaleString('id-ID')}
                   </div>
                </div>
                <div className="pb-1">
                   <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-black">{product.rating}</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-8 border-b border-neutral-100">
              <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-100">
                 <div className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1">Optical Shade</div>
                 <p className="font-black text-base text-neutral-900 tracking-tight">{product.shade}</p>
              </div>
              <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-100">
                 <div className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1">Dermal Compatibility</div>
                 <p className="font-black text-base text-neutral-900 uppercase tracking-tight">{product.skinType}</p>
              </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-[9px] font-black text-neutral-900 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Detailed Formulation
               </h3>
               <p className="text-neutral-500 text-base leading-relaxed font-medium">
                {product.description}
               </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
              <h3 className="text-[9px] font-black text-neutral-900 uppercase tracking-[0.2em]">Active Ingredients</h3>
              <div className="flex flex-wrap gap-1.5">
                 {product.ingredients.split(',').map((ing, i) => (
                   <span key={i} className="text-[9px] font-bold bg-neutral-50 px-2.5 py-1 rounded-md text-neutral-600 border border-neutral-100">{ing.trim()}</span>
                 ))}
              </div>
            </div>

            <div className="flex gap-3 pt-6">
               <button 
                 onClick={() => navigate('/recommendations', { state: { payload: {
                   kategori_produk: product.category,
                   rating: product.rating,
                   pilihan_ingredients: [],
                   budget_max: product.price + 50000
                 } } })}
                 className="primary-btn flex-1 py-4 text-xs"
               >
                  Identify Similar Specimens
               </button>
               <button className="w-14 h-14 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-400 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all shadow-sm">
                  <Plus size={24} />
               </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-neutral-100">
              <div className="flex flex-col items-center gap-2">
                 <Shield size={18} className="text-neutral-300" />
                 <span className="text-[8px] font-black uppercase text-neutral-400 tracking-widest text-center">Authenticity Verified</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <Truck size={18} className="text-neutral-300" />
                 <span className="text-[8px] font-black uppercase text-neutral-400 tracking-widest text-center">Express Logistics</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <RefreshCcw size={18} className="text-neutral-300" />
                 <span className="text-[8px] font-black uppercase text-neutral-400 tracking-widest text-center">Easy Returns Cycle</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

import { Star, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product, isRecommendation = false }) => {
  const matchPercentage = product.similarityScore ? (product.similarityScore * 100).toFixed(1) : 0;

  return (
    <div className="bg-white border border-neutral-200 rounded-[2rem] overflow-hidden flex flex-col h-full hover:border-neutral-900 transition-all group shadow-sm hover:shadow-2xl hover:shadow-neutral-900/5">
      {/* Product Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <img
          src={product.image || `https://source.unsplash.com/featured/?${(product.category || 'beauty').replace('-', ',')},skincare,makeup`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Match Score Badge (Only for recommendations) */}
        {isRecommendation && (
          <div className="absolute top-6 left-6 right-6">
            <div className="bg-neutral-900/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-400">Match Accuracy</span>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${matchPercentage}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <span className="text-sm font-black text-white">{matchPercentage}%</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap size={14} className="text-primary fill-primary" />
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-6">
           <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[9px] font-black text-neutral-900 uppercase tracking-widest border border-neutral-100 shadow-sm">
            {product.brand}
          </span>
        </div>
      </div>
      
      {/* Product Information */}
      <div className="p-8 flex flex-col flex-1 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{product.category}</span>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-400/10 rounded-lg">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] font-black text-neutral-900">{product.rating}</span>
            </div>
          </div>
          <h3 className="text-xl font-black text-neutral-900 leading-[1.2] uppercase tracking-tighter line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>
        
        <div className="mt-auto pt-6 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1">Estimated Price</span>
            <div className="text-2xl font-black font-outfit tracking-tighter text-neutral-900">
              <span className="text-[10px] font-bold mr-1 text-neutral-300 italic">Rp</span>
              {product.price ? product.price.toLocaleString('id-ID') : '0'}
            </div>
          </div>
          <Link 
            to={`/products/${product.id}`} 
            className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-900 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all shadow-sm"
          >
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

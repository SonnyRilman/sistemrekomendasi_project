import { Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden flex flex-col h-full hover:border-neutral-900 transition-all group shadow-sm">
      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 border-b border-neutral-100">
        <img
          src={product.image || `https://picsum.photos/seed/${product.id}/500/600`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-black text-neutral-900 uppercase tracking-widest border border-neutral-100">
            {product.brand}
          </span>
        </div>
      </div>
      
      {/* Product Body */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{product.category}</span>
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-neutral-600">{product.rating}</span>
            </div>
          </div>
          <h3 className="text-lg font-black text-neutral-900 leading-tight uppercase tracking-tight line-clamp-2">
            {product.name}
          </h3>
        </div>
        
        <div className="mt-auto pt-4 border-t border-neutral-50 flex items-center justify-between">
          <div className="text-xl font-black font-outfit tracking-tighter">
            <span className="text-[10px] font-bold mr-1 text-neutral-300 italic">Rp</span>
            {product.price.toLocaleString('id-ID')}
          </div>
          <Link 
            to={`/products/${product.id}`}
            className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
          >
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

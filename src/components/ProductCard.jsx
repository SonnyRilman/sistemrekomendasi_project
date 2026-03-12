import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="card-editorial group cursor-pointer block">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-[3/4] overflow-hidden relative rounded-xl bg-neutral-50 shadow-sm border border-neutral-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4">
             <span className="text-[9px] font-black uppercase tracking-widest bg-white/90 backdrop-blur-sm px-2 py-1 rounded">
               {product.brand}
             </span>
          </div>
        </div>
      </Link>
      
      <div className="py-5 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-bold text-neutral-900 line-clamp-1 group-hover:text-brand-600 transition-colors uppercase tracking-tight">
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm font-light text-neutral-400">
            {product.category}
          </p>
          <div className="flex items-center text-[10px] font-bold text-neutral-800">
             <span className="mr-1">{product.rating}</span>
             <div className="flex text-neutral-300">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className={`w-1 h-3 rounded-full mx-[1px] ${i < Math.floor(product.rating) ? 'bg-brand-400' : 'bg-neutral-100'}`}></div>
               ))}
             </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-base font-bold text-neutral-900">
            Rp {product.price.toLocaleString('id-ID')}
          </span>
          <Link
            to={`/products/${product.id}`}
            className="text-[10px] font-black uppercase tracking-tighter text-neutral-900 flex items-center group-hover:text-brand-600 transition-all"
          >
            Details <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Shield, Truck, RefreshCcw, Share2, Plus } from 'lucide-react';
import { DUMMY_PRODUCTS } from '../data/products';
import { useState, useEffect } from 'react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const foundProduct = DUMMY_PRODUCTS.find((p) => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    }
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-neutral-100 border-t-neutral-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center space-x-2 text-neutral-400 text-[9px] font-bold uppercase tracking-widest mb-10">
          <button onClick={() => navigate('/')} className="hover:text-neutral-900">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-neutral-900">Collections</button>
          <span>/</span>
          <span className="text-neutral-900 line-clamp-1 truncate max-w-[150px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Gallery Column */}
          <div className="space-y-6">
            <div className="aspect-square bg-neutral-50 rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info Column */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-600">
                    {product.brand}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-serif font-medium leading-tight text-neutral-900">
                    {product.name}
                  </h1>
                </div>
                <button className="p-2.5 border border-neutral-100 rounded-full hover:bg-neutral-50 transition-all">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center space-x-6">
                <p className="text-xl font-bold text-neutral-900">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                <div className="h-3 w-px bg-neutral-200"></div>
                <div className="flex items-center text-[9px] uppercase font-bold text-neutral-400 tracking-widest">
                  <span className="text-neutral-900 mr-2">{product.rating}</span>
                  Rating Score
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-neutral-900">Description</h3>
              <p className="text-neutral-500 font-light leading-relaxed text-sm italic">
                "{product.description}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 py-6 border-y border-neutral-50">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Shade</span>
                <p className="font-bold text-neutral-900 text-sm">{product.shade}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Tipe Kulit</span>
                <p className="font-bold text-neutral-900 text-sm">{product.skinType}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-neutral-900">Ingredients</h3>
              <p className="text-xs text-neutral-400 font-light italic leading-loose">
                {product.ingredients}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <button
                onClick={() => navigate('/recommendations', { state: { product } })}
                className="btn-primary w-full flex justify-between items-center group py-4 px-8"
              >
                <span className="text-xs tracking-widest uppercase font-bold">Rekomendasikan Serupa</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 opacity-40 grayscale group-hover:grayscale-0 transition-all border-t border-neutral-50">
              <div className="text-center space-y-1.5">
                <Shield className="h-4 w-4 mx-auto" />
                <span className="text-[7px] font-bold uppercase tracking-widest">Authentic</span>
              </div>
              <div className="text-center space-y-1.5">
                <Truck className="h-4 w-4 mx-auto" />
                <span className="text-[7px] font-bold uppercase tracking-widest">Premium Care</span>
              </div>
              <div className="text-center space-y-1.5">
                <RefreshCcw className="h-4 w-4 mx-auto" />
                <span className="text-[7px] font-bold uppercase tracking-widest">14 Day Return</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

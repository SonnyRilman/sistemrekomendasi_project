import { useState, useMemo } from 'react';
import { Search, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { DUMMY_PRODUCTS, BRANDS, CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredProducts = useMemo(() => {
    return DUMMY_PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === '' || product.brand === selectedBrand;
      const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
      
      return matchesSearch && matchesBrand && matchesCategory;
    });
  }, [searchTerm, selectedBrand, selectedCategory]);

  return (
    <div className="bg-white min-h-screen pb-40">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-100 pb-12 mb-12 gap-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-serif font-medium text-neutral-900 tracking-tight">Koleksi Produk</h1>
            <p className="text-neutral-400 font-light text-lg">Menemukan keindahan melalui sains dan presisi.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
            <div className="relative group">
              <input
                type="text"
                placeholder="Cari..."
                className="w-full md:w-64 py-3 bg-transparent border-b border-neutral-200 outline-none focus:border-neutral-900 transition-all font-light"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300" />
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                {filteredProducts.length} Results
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-12">
            <div className="space-y-10">
              <div className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 border-l-2 border-neutral-900 pl-4">Category</h3>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`text-left text-sm transition-all ${selectedCategory === '' ? 'font-black text-brand-600 tracking-wide' : 'font-light text-neutral-500 hover:text-neutral-900'}`}
                  >
                    Semua
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-left text-sm transition-all ${selectedCategory === cat ? 'font-black text-brand-600 tracking-wide' : 'font-light text-neutral-500 hover:text-neutral-900'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 border-l-2 border-neutral-900 pl-4">Brand</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setSelectedBrand('')}
                    className={`text-left text-sm transition-all ${selectedBrand === '' ? 'font-black text-brand-600 tracking-wide' : 'font-light text-neutral-500 hover:text-neutral-900'}`}
                  >
                    Semua
                  </button>
                  {BRANDS.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`text-left text-sm transition-all ${selectedBrand === brand ? 'font-black text-brand-600 tracking-wide' : 'font-light text-neutral-500 hover:text-neutral-900'}`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-40 text-center space-y-6">
                <p className="text-3xl font-serif text-neutral-300">No results found.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setSelectedBrand(''); setSelectedCategory('');}}
                  className="text-xs font-bold uppercase tracking-widest border-b border-neutral-900 pb-1"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

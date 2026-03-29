import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, SlidersHorizontal, X, Filter, LayoutGrid, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { BRANDS, CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';
import { apiService } from '../services/api';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    // Reset page to 1 whenever filters change
    setCurrentPage(1);
  }, [searchTerm, selectedBrand, selectedCategory]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts();
        if (response.products) {
          const formatted = response.products.map(p => ({
            id: p.id,
            name: p.name,
            brand: p.brand || 'Luxury Brand',
            category: p.Category,
            price: p.price,
            rating: p.Rating,
            description: p.Deskripsi || 'Koleksi produk istimewa.'
          }));
          setProducts(formatted);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const availableBrands = useMemo(() => {
    if (!products.length) return [];
    const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    return uniqueBrands.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === '' || product.brand === selectedBrand;
      const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
      
      return matchesSearch && matchesBrand && matchesCategory;
    });
  }, [searchTerm, selectedBrand, selectedCategory, products]);

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header section */}
        <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-2 py-1 bg-white border border-neutral-100 shadow-sm rounded">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">Inventory Overview</span>
             </div>
             <h1 className="text-4xl font-black text-neutral-900 tracking-tighter leading-none uppercase">
                Premium <br/> <span className="text-neutral-300 italic">Catalogue</span>
             </h1>
          </div>

          <div className="relative group w-full xl:max-w-md">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
               <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by brand or chemical compound..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm text-neutral-800 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Filters Column */}
          <aside className="lg:col-span-3">
            <div className="sticky top-32 space-y-12 max-h-[calc(100vh-10rem)] overflow-y-auto pr-4 custom-scrollbar">
              
              <div className="space-y-6">
                 <div className="flex items-center gap-2 mb-2 sticky top-0 bg-[#f5f5f5] py-2 z-10">
                    <Filter size={16} className="text-neutral-400" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-neutral-900">Categories</span>
                 </div>
                 <div className="flex flex-wrap lg:flex-col gap-1.5">
                   <button
                      onClick={() => setSelectedCategory('')}
                      className={clsx(
                        "tag-premium text-left !py-2.5 !px-4 text-[10px]",
                        selectedCategory === '' ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-400 border-neutral-100"
                      )}
                    >
                      All Collection
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={clsx(
                          "tag-premium text-left capitalize !py-2.5 !px-4 text-[10px]",
                          selectedCategory === cat ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-400 border-neutral-100"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                 </div>
              </div>
  
              <div className="space-y-6 pb-10">
                 <div className="flex items-center gap-2 mb-2 sticky top-0 bg-[#f5f5f5] py-2 z-10">
                    <Sparkles size={16} className="text-neutral-400" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-neutral-900">Verified Brands</span>
                 </div>
                 <div className="flex flex-wrap lg:flex-col gap-1.5">
                   <button
                      onClick={() => setSelectedBrand('')}
                      className={clsx(
                        "tag-premium text-left !py-2.5 !px-4 text-[10px]",
                        selectedBrand === '' ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-400 border-neutral-100"
                      )}
                    >
                      Worldwide Brands
                    </button>
                    {availableBrands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={clsx(
                          "tag-premium text-left !py-2.5 !px-4 text-[10px]",
                          selectedBrand === brand ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-400 border-neutral-100"
                        )}
                      >
                        {brand}
                      </button>
                    ))}
                 </div>
              </div>
            </div>
          </aside>

          {/* Catalog Column */}
          <div className="lg:col-span-9">
            <div className="mb-10 flex items-center justify-between">
               <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                  Showing <span className="text-neutral-900">{filteredProducts.length}</span> verified specimens
               </div>
               <div className="h-0.5 flex-1 mx-8 bg-neutral-100 rounded-full"></div>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                   key="loading"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="py-32 flex flex-col items-center justify-center space-y-6"
                >
                  <div className="h-14 w-14 border-4 border-neutral-100 border-t-neutral-900 rounded-full animate-spin"></div>
                  <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Querying Global Database...</p>
                </motion.div>
              ) : filteredProducts.length > 0 ? (
                <motion.div 
                   key="grid"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="space-y-16"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                    {currentProducts.map((product, idx) => (
                      <motion.div 
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination UI */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-10">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => paginate(i + 1)}
                          className={clsx(
                            "w-12 h-12 rounded-2xl font-black text-xs transition-all border",
                            currentPage === i + 1 
                              ? "bg-neutral-900 text-white border-neutral-900 shadow-xl shadow-neutral-900/10" 
                              : "bg-white text-neutral-400 border-neutral-100 hover:border-neutral-900 hover:text-neutral-900"
                          )}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-40 text-center space-y-8"
                >
                  <div className="w-20 h-20 bg-neutral-50 rounded-full mx-auto flex items-center justify-center text-neutral-200">
                     <Search size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">No Specimens Found</h3>
                    <p className="text-neutral-400 font-medium">Try adjusting your filtration parameters.</p>
                  </div>
                  <button 
                    onClick={() => {setSearchTerm(''); setSelectedBrand(''); setSelectedCategory('');}}
                    className="premium-button !px-8 !py-4"
                  >
                    Reset Parameters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

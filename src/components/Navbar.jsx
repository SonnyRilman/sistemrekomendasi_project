import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Katalog Produk', path: '/products' },
    { name: 'Rekomendasi', path: '/recommendations' },
  ];

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        {/* Logo Section - Professional Typography instead of generic icon */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-neutral-900 font-outfit uppercase leading-none">
              GLOW<span className="text-primary italic">GUIDE</span>
            </span>
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.2em] mt-1">
              Content-Based System
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={clsx(
                'text-sm font-bold transition-all hover:text-primary',
                location.pathname === link.path
                  ? 'text-primary'
                  : 'text-neutral-500'
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/recommendations" 
            className="primary-btn !py-2 !px-6 text-xs"
          >
            Mulai Konsultasi
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-neutral-900"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="bg-white border-b border-neutral-200 md:hidden animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  'text-lg font-bold py-2',
                  location.pathname === link.path ? 'text-primary' : 'text-neutral-900'
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/recommendations"
              className="primary-btn w-full mt-4"
              onClick={() => setIsOpen(false)}
            >
              Mulai Konsultasi
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Collections', path: '/products' },
    { name: 'Recommendation', path: '/recommendations' },
    { name: 'About', path: '#' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-50 h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-neutral-900"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-serif font-black tracking-widest uppercase text-neutral-900">
            GLOW<span className="text-brand-600">GUIDE</span>
          </span>
        </Link>

        {/* Desktop Links - Left aligned after logo usually looks more high-end */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={clsx(
                'text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:text-brand-600',
                location.pathname === link.path
                  ? 'text-brand-600 underline underline-offset-8 decoration-2'
                  : 'text-neutral-500'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-6">
          <button className="text-neutral-900 hover:text-brand-600 transition-colors">
            <Search className="h-5 w-5 stroke-[1.5]" />
          </button>
          <button className="text-neutral-900 hover:text-brand-600 transition-colors relative">
            <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[8px] font-bold text-white">
              0
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-b border-neutral-100 p-6 md:hidden animate-in fade-in duration-300">
          <div className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-neutral-900 hover:text-brand-600"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

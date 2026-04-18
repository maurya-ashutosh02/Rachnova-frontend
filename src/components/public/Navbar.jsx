import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  {
    label: 'Projects',
    children: [
      { label: 'Portfolio', path: '/portfolio' },
      { label: 'Completed', path: '/completed-projects' },
      { label: 'Ongoing', path: '/ongoing-projects' },
      { label: 'Upcoming', path: '/upcoming-projects' },
    ],
  },
  { label: 'Services', path: '/services' },
  { label: 'Background', children: [
    { label: 'Education', path: '/education' },
    { label: 'Achievements', path: '/achievements' },
  ]},
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const { pathname } = useLocation();
  const { settings } = useSite();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setDropdown(null); }, [pathname]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-dark-950/95 backdrop-blur-md border-b border-dark-800/60 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-primary-600 flex items-center justify-center transform rotate-45 group-hover:rotate-0 transition-transform duration-300">
              <span className="font-heading text-white text-lg transform -rotate-45 group-hover:rotate-0 transition-transform duration-300">R</span>
            </div>
          </div>
          <div>
            <div className="font-heading text-white text-xl tracking-widest leading-none">
              RACHNOVA
            </div>
            <div className="text-primary-500 text-[9px] tracking-[0.35em] uppercase font-mono">
              PROJECTS
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div key={link.label} className="relative group"
              onMouseEnter={() => link.children && setDropdown(link.label)}
              onMouseLeave={() => setDropdown(null)}
            >
              {link.children ? (
                <button className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  link.children.some(c => c.path === pathname) ? 'text-primary-400' : 'text-dark-200 hover:text-white'
                }`}>
                  {link.label}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdown === link.label ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link to={link.path} className={`flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  pathname === link.path ? 'text-primary-400' : 'text-dark-200 hover:text-white'
                }`}>
                  {link.label}
                </Link>
              )}
              {/* Dropdown */}
              {link.children && dropdown === link.label && (
                <div className="absolute top-full left-0 mt-1 bg-dark-900 border border-dark-700 min-w-[180px] shadow-xl shadow-black/40 py-1 animate-fade-in">
                  {link.children.map(child => (
                    <Link key={child.path} to={child.path}
                      className={`block px-5 py-2.5 text-sm hover:bg-dark-800 hover:text-primary-400 transition-colors ${
                        pathname === child.path ? 'text-primary-400 bg-dark-800' : 'text-dark-200'
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/contact" className="btn-primary text-xs px-5 py-2.5">
            Get In Touch
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-white p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-dark-950 border-t border-dark-800 animate-fade-in">
          <div className="container-custom py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <>
                    <button
                      onClick={() => setDropdown(dropdown === link.label ? null : link.label)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-dark-200 hover:text-white"
                    >
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform ${dropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    {dropdown === link.label && (
                      <div className="pl-4 border-l border-dark-800 ml-3">
                        {link.children.map(child => (
                          <Link key={child.path} to={child.path}
                            className="block px-3 py-2 text-sm text-dark-300 hover:text-primary-400">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link to={link.path} className={`block px-3 py-2.5 text-sm ${
                    pathname === link.path ? 'text-primary-400' : 'text-dark-200 hover:text-white'
                  }`}>
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <Link to="/contact" className="btn-primary text-xs mt-3 text-center">Get In Touch</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Home, Info, Briefcase, CheckSquare, Construction,
  Clock, Settings, Image, Award, GraduationCap, MessageSquare, Star,
  LogOut, Menu, X, ChevronRight, Bell, User, Wrench
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navSections = [
  {
    title: 'Overview',
    links: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
      { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
    ]
  },
  {
    title: 'Content',
    links: [
      { icon: Home, label: 'Home Content', path: '/admin/home' },
      { icon: Info, label: 'About', path: '/admin/about' },
      { icon: Settings, label: 'Site Settings', path: '/admin/settings' },
    ]
  },
  {
    title: 'Projects',
    links: [
      { icon: Briefcase, label: 'Portfolio', path: '/admin/portfolio' },
      { icon: CheckSquare, label: 'Completed', path: '/admin/completed-projects' },
      { icon: Construction, label: 'Ongoing', path: '/admin/ongoing-projects' },
      { icon: Clock, label: 'Upcoming', path: '/admin/upcoming-projects' },
    ]
  },
  {
    title: 'Sections',
    links: [
      { icon: Wrench, label: 'Services', path: '/admin/services' },
      { icon: GraduationCap, label: 'Education', path: '/admin/education' },
      { icon: Award, label: 'Achievements', path: '/admin/achievements' },
      { icon: Image, label: 'Gallery', path: '/admin/gallery' },
      { icon: Star, label: 'Testimonials', path: '/admin/testimonials' },
    ]
  },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'w-full' : 'w-64 shrink-0'} bg-dark-900 border-r border-dark-800 flex flex-col h-full`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-dark-800">
        <Link to="/" target="_blank" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-primary-600 flex items-center justify-center transform rotate-45 group-hover:rotate-0 transition-transform duration-300">
            <span className="font-heading text-white text-base transform -rotate-45 group-hover:rotate-0 transition-transform duration-300">R</span>
          </div>
          <div>
            <div className="font-heading text-white text-sm tracking-widest leading-none">RACHNOVA</div>
            <div className="text-primary-500 text-[8px] tracking-[0.3em] uppercase font-mono">Admin Panel</div>
          </div>
        </Link>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="text-dark-400 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navSections.map(section => (
          <div key={section.title} className="mb-5">
            <div className="px-4 mb-2 text-dark-600 text-[10px] font-mono uppercase tracking-[0.25em]">{section.title}</div>
            {section.links.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              return (
                <Link key={link.path} to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`admin-sidebar-link ${isActive ? 'active' : ''}`}>
                  <Icon size={16} className={isActive ? 'text-primary-400' : 'text-dark-500'} />
                  {link.label}
                  {isActive && <ChevronRight size={14} className="ml-auto text-primary-500" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-dark-800 p-4">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 bg-primary-600/20 border border-primary-800/40 flex items-center justify-center rounded-full">
            <User size={14} className="text-primary-400" />
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-semibold truncate">{admin?.name || 'Admin'}</div>
            <div className="text-dark-500 text-xs truncate">{admin?.email}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-dark-400 hover:text-red-400 hover:bg-red-900/10 transition-all text-sm rounded-sm">
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:h-screen lg:sticky lg:top-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative w-72 h-full flex flex-col">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Bar */}
        <header className="bg-dark-900 border-b border-dark-800 px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-dark-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-dark-500">
              <span>Admin</span>
              <ChevronRight size={12} />
              <span className="text-dark-200">
                {navSections.flatMap(s => s.links).find(l => l.path === pathname)?.label || 'Dashboard'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank"
              className="text-xs font-mono text-dark-400 hover:text-primary-400 transition-colors border border-dark-700 hover:border-primary-700 px-3 py-1.5 hidden sm:block">
              View Site ↗
            </Link>
            <button className="text-dark-400 hover:text-white w-8 h-8 flex items-center justify-center">
              <Bell size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Construction, Clock, Briefcase, Image, MessageSquare, Award, ArrowRight, TrendingUp } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { Spinner } from '../../components/public/UI';
import { useAuth } from '../../context/AuthContext';

function StatCard({ icon: Icon, label, value, path, color = 'primary', badge }) {
  const colors = {
    primary: 'bg-primary-600/10 border-primary-800/40 text-primary-400',
    green: 'bg-green-600/10 border-green-800/40 text-green-400',
    blue: 'bg-blue-600/10 border-blue-800/40 text-blue-400',
    amber: 'bg-amber-600/10 border-amber-800/40 text-amber-400',
    purple: 'bg-purple-600/10 border-purple-800/40 text-purple-400',
    red: 'bg-red-600/10 border-red-800/40 text-red-400',
  };
  return (
    <Link to={path} className="admin-card hover:border-dark-700 transition-all group block">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 flex items-center justify-center border ${colors[color]}`}>
          <Icon size={20} />
        </div>
        {badge !== undefined && badge > 0 && (
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span>
        )}
      </div>
      <div className="font-heading text-4xl text-white tracking-wider mb-1">{value ?? '—'}</div>
      <div className="text-dark-500 text-xs font-mono uppercase tracking-widest group-hover:text-dark-300 transition-colors">{label}</div>
      <div className="flex items-center gap-1 mt-3 text-xs text-dark-600 group-hover:text-primary-500 transition-colors">
        <span>Manage</span>
        <ArrowRight size={12} />
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentMessages, setRecentMessages] = useState([]);
  const { admin } = useAuth();

  useEffect(() => {
    Promise.all([
      api.get('/content/stats'),
      api.get('/contact/messages?limit=5'),
    ]).then(([s, m]) => {
      setStats(s.data.data);
      setRecentMessages(m.data.data || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
      </AdminLayout>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="text-dark-500 font-mono text-xs tracking-widest uppercase mb-1">{greeting}</div>
        <h1 className="font-heading text-4xl text-white tracking-wider">
          {admin?.name || 'Admin'} <span className="text-primary-500">Dashboard</span>
        </h1>
        <p className="text-dark-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={TrendingUp} label="Total Projects" value={stats?.totalProjects} path="/admin/portfolio" color="primary" />
        <StatCard icon={CheckSquare} label="Completed" value={stats?.completedProjects} path="/admin/completed-projects" color="green" />
        <StatCard icon={Construction} label="Ongoing" value={stats?.ongoingProjects} path="/admin/ongoing-projects" color="blue" />
        <StatCard icon={Clock} label="Upcoming" value={stats?.upcomingProjects} path="/admin/upcoming-projects" color="amber" />
        <StatCard icon={Briefcase} label="Portfolio Items" value={stats?.portfolioItems} path="/admin/portfolio" color="purple" />
        <StatCard icon={Image} label="Gallery Images" value={stats?.galleryImages} path="/admin/gallery" color="primary" />
        <StatCard icon={Award} label="Achievements" value={stats?.achievements} path="/admin/achievements" color="amber" />
        <StatCard icon={MessageSquare} label="Total Messages" value={stats?.totalMessages} path="/admin/messages" color="red" badge={stats?.unreadMessages} />
      </div>

      {/* Quick Actions + Recent Messages */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="admin-card">
          <h2 className="font-heading text-xl text-white tracking-wider mb-5 pb-3 border-b border-dark-800">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Portfolio', path: '/admin/portfolio', icon: '🏗️' },
              { label: 'Add Completed', path: '/admin/completed-projects', icon: '✅' },
              { label: 'Add Ongoing', path: '/admin/ongoing-projects', icon: '🔧' },
              { label: 'Add Upcoming', path: '/admin/upcoming-projects', icon: '🚀' },
              { label: 'Upload Gallery', path: '/admin/gallery', icon: '📷' },
              { label: 'Add Achievement', path: '/admin/achievements', icon: '🏆' },
              { label: 'Edit Home', path: '/admin/home', icon: '🏠' },
              { label: 'View Messages', path: '/admin/messages', icon: '💬' },
            ].map(action => (
              <Link key={action.path} to={action.path}
                className="flex items-center gap-2 px-3 py-3 bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-primary-700/50 transition-all text-sm text-dark-300 hover:text-white group">
                <span className="text-lg">{action.icon}</span>
                <span className="font-medium text-xs">{action.label}</span>
                <ArrowRight size={12} className="ml-auto text-dark-600 group-hover:text-primary-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-dark-800">
            <h2 className="font-heading text-xl text-white tracking-wider">Recent Messages</h2>
            <Link to="/admin/messages" className="text-primary-500 hover:text-primary-400 text-xs font-mono tracking-wider">View All</Link>
          </div>
          {recentMessages.length === 0 ? (
            <div className="text-center py-8 text-dark-600">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No messages yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map(msg => (
                <Link key={msg._id} to="/admin/messages"
                  className={`block p-3 border transition-colors hover:border-dark-700 ${msg.read ? 'border-dark-800 bg-transparent' : 'border-primary-900/40 bg-primary-900/5'}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className={`font-semibold text-sm truncate ${msg.read ? 'text-dark-300' : 'text-white'}`}>{msg.name}</span>
                    {!msg.read && <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0 mt-1"></span>}
                  </div>
                  <div className="text-dark-500 text-xs mb-1 font-medium">{msg.subject}</div>
                  <div className="text-dark-600 text-xs truncate">{msg.message}</div>
                  <div className="text-dark-700 text-xs mt-1.5 font-mono">
                    {new Date(msg.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

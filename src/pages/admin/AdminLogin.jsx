import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(249,115,22,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
      </div>

      {/* Accent lines */}
      <div className="absolute top-0 left-1/2 w-px h-32 bg-gradient-to-b from-primary-600 to-transparent opacity-60"></div>
      <div className="absolute bottom-0 left-1/2 w-px h-32 bg-gradient-to-t from-primary-600 to-transparent opacity-60"></div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 transform rotate-45 mb-5">
            <span className="font-heading text-white text-3xl transform -rotate-45">R</span>
          </div>
          <div className="font-heading text-white text-3xl tracking-[0.3em] uppercase">RACHNOVA</div>
          <div className="text-primary-500 font-mono text-xs tracking-[0.4em] uppercase mt-1">Admin Panel</div>
        </div>

        {/* Form Card */}
        <div className="bg-dark-900 border border-dark-800 p-8">
          <h2 className="font-heading text-2xl text-white tracking-wider mb-1">Secure Login</h2>
          <p className="text-dark-500 text-sm mb-8">Enter your admin credentials to access the dashboard</p>

          {error && (
            <div className="flex items-center gap-3 bg-red-900/20 border border-red-800/50 text-red-400 px-4 py-3 mb-6 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="admin-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type="email"
                  className="admin-input pl-9"
                  placeholder="admin@rachnovaprojects.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="admin-input pl-9 pr-10"
                  placeholder="••••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Authenticating...</>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-dark-600 text-xs mt-6 font-mono">
          Protected area — Admin access only
        </p>
      </div>
    </div>
  );
}

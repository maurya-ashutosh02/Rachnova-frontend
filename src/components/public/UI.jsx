import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

// Loading Spinner
export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 16, md: 24, lg: 40 };
  return <Loader2 size={sizes[size]} className={`animate-spin text-primary-500 ${className}`} />;
}

// Page Loader
export function PageLoader() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-600 flex items-center justify-center transform rotate-45 mx-auto mb-6">
          <span className="font-heading text-white text-2xl transform -rotate-45">R</span>
        </div>
        <div className="flex gap-1 justify-center">
          {[0,1,2].map(i => (
            <div key={i} className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Section Label
export function SectionLabel({ children }) {
  return (
    <div className="section-label mb-4">
      <span className="w-6 h-px bg-primary-600 inline-block"></span>
      {children}
      <span className="w-6 h-px bg-primary-600 inline-block"></span>
    </div>
  );
}

// Skeleton Card
export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-dark-900 border border-dark-800 overflow-hidden ${className}`}>
      <div className="skeleton h-48 w-full"></div>
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded"></div>
        <div className="skeleton h-3 w-full rounded"></div>
        <div className="skeleton h-3 w-5/6 rounded"></div>
      </div>
    </div>
  );
}

// Count Up Animation
export function CountUp({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Status Badge
export function StatusBadge({ status }) {
  const variants = {
    Completed: 'status-completed',
    Ongoing: 'status-ongoing',
    Upcoming: 'status-upcoming',
    Planning: 'bg-purple-900/40 text-purple-400 border border-purple-800',
    'Design Phase': 'bg-cyan-900/40 text-cyan-400 border border-cyan-800',
    'Approval Pending': 'bg-yellow-900/40 text-yellow-400 border border-yellow-800',
    'Coming Soon': 'bg-amber-900/40 text-amber-400 border border-amber-800',
    Announced: 'bg-blue-900/40 text-blue-400 border border-blue-800',
  };
  return (
    <span className={`status-badge ${variants[status] || 'bg-dark-800 text-dark-300 border border-dark-700'}`}>
      {status}
    </span>
  );
}

// Progress Bar
export function ProgressBar({ percentage, label }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setWidth(percentage); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [percentage]);

  return (
    <div ref={ref} className="w-full">
      {label && (
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-dark-300">{label}</span>
          <span className="text-sm text-primary-400 font-mono">{percentage}%</span>
        </div>
      )}
      <div className="w-full h-1.5 bg-dark-800">
        <div className="progress-bar h-1.5 transition-all duration-1000 ease-out" style={{ width: `${width}%` }}></div>
      </div>
    </div>
  );
}

// Image with fallback
export function ProjectImage({ src, alt, className = '' }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div className={`bg-dark-800 flex items-center justify-center ${className}`}>
        <div className="text-center text-dark-600">
          <div className="font-heading text-4xl mb-1">R</div>
          <div className="text-xs font-mono tracking-widest">NO IMAGE</div>
        </div>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
}

// Confirm Modal
export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, loading }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-dark-900 border border-dark-700 p-6 max-w-md w-full shadow-2xl animate-fade-up">
        <div className="w-12 h-12 bg-red-900/30 border border-red-800 flex items-center justify-center mb-4">
          <span className="text-red-400 text-xl">⚠</span>
        </div>
        <h3 className="text-white font-heading text-xl tracking-wider mb-2">{title || 'Confirm Delete'}</h3>
        <p className="text-dark-300 text-sm mb-6">{message || 'Are you sure you want to delete this item? This action cannot be undone.'}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1 text-xs py-2.5" disabled={loading}>Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 bg-red-700 hover:bg-red-600 text-white font-semibold py-2.5 text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
            {loading ? <Spinner size="sm" /> : null}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Empty State
export function EmptyState({ title = 'No items found', description = '', icon = '📋' }) {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-heading text-2xl text-dark-200 tracking-wider mb-2">{title}</h3>
      {description && <p className="text-dark-500 text-sm">{description}</p>}
    </div>
  );
}

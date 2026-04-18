import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Send, Phone, Mail, ExternalLink } from 'lucide-react';
import api from '../../utils/api';
import PublicLayout from '../../components/public/PublicLayout';
import { SectionLabel, PageLoader, StatusBadge, SkeletonCard, EmptyState, ProgressBar, ProjectImage } from '../../components/public/UI';
import { useSite } from '../../context/SiteContext';
import toast from 'react-hot-toast';

// ===== PAGE HEADER =====
function PageHeader({ label, title, subtitle }) {
  return (
    <section className="pt-32 pb-16 bg-dark-950 relative overflow-hidden border-b border-dark-900">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(249,115,22,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.6) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>
      <div className="container-custom relative">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="section-heading text-5xl md:text-7xl mb-4">{title}</h1>
        {subtitle && <p className="section-subheading max-w-xl">{subtitle}</p>}
      </div>
    </section>
  );
}

// ===== PORTFOLIO PAGE =====
export function PortfolioPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const categories = ['', 'Structural', 'Residential', 'Commercial', 'Infrastructure', 'Industrial', 'Renovation', 'Other'];

  useEffect(() => {
    setLoading(true);
    api.get(`/portfolio?${category ? `category=${category}` : ''}`)
      .then(r => setItems(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <PublicLayout>
      <PageHeader label="Our Work" title="Portfolio" subtitle="Complete showcase of our engineering and construction projects" />
      <section className="section-padding bg-dark-950">
        <div className="container-custom">
          {/* Filters */}
          <div className="flex gap-2 flex-wrap mb-10">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all ${
                  category === c ? 'bg-primary-600 text-white' : 'border border-dark-700 text-dark-400 hover:border-primary-600 hover:text-primary-400'
                }`}>
                {c || 'All'}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : items.length === 0 ? (
            <EmptyState title="No Portfolio Items" description="Portfolio items will appear here once added." icon="🏗️" />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => (
                <div key={item._id} className="card card-hover group">
                  <div className="img-zoom h-52">
                    <ProjectImage src={item.images?.[0]?.url} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-primary-500 font-mono text-xs tracking-wider uppercase">{item.category}</span>
                      <StatusBadge status={item.status} />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-primary-400 transition-colors">{item.title}</h3>
                    <p className="text-dark-400 text-sm leading-relaxed line-clamp-2 mb-4">{item.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-dark-500 font-mono border-t border-dark-800 pt-3">
                      {item.location && <span className="flex items-center gap-1"><MapPin size={10} />{item.location}</span>}
                      {item.completionDate && <span className="flex items-center gap-1"><Calendar size={10} />{new Date(item.completionDate).getFullYear()}</span>}
                    </div>
                    {item.technologiesUsed?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.technologiesUsed.slice(0, 3).map((t, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-dark-800 text-dark-400 border border-dark-700">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

// ===== COMPLETED PROJECTS =====
export function CompletedProjectsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects/completed')
      .then(r => setItems(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <PublicLayout>
      <PageHeader label="Delivered Excellence" title="Completed Projects" subtitle="Projects we've successfully delivered with precision and quality" />
      <section className="section-padding bg-dark-950">
        <div className="container-custom">
          {items.length === 0 ? (
            <EmptyState title="No Completed Projects" icon="✅" />
          ) : (
            <div className="space-y-8">
              {items.map((item, i) => (
                <div key={item._id} className={`grid lg:grid-cols-2 gap-8 items-center border border-dark-800 overflow-hidden hover:border-primary-700/40 transition-colors ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={`img-zoom h-64 lg:h-72 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <ProjectImage src={item.photos?.[0]?.url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className={`p-8 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-primary-500 font-mono text-xs tracking-wider uppercase">{item.category}</span>
                      {item.completionYear && <span className="text-dark-500 font-mono text-xs">{item.completionYear}</span>}
                    </div>
                    <h3 className="font-heading text-3xl text-white tracking-wider mb-3">{item.name}</h3>
                    <p className="text-dark-300 text-sm leading-relaxed mb-4">{item.description}</p>
                    {item.scopeOfWork && (
                      <div className="mb-3">
                        <div className="text-dark-500 text-xs font-mono uppercase tracking-wider mb-1">Scope of Work</div>
                        <p className="text-dark-400 text-sm">{item.scopeOfWork}</p>
                      </div>
                    )}
                    {item.results && (
                      <div className="mb-4">
                        <div className="text-dark-500 text-xs font-mono uppercase tracking-wider mb-1">Results</div>
                        <p className="text-dark-400 text-sm">{item.results}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-4 text-xs text-dark-500 font-mono">
                      {item.location && <span className="flex items-center gap-1"><MapPin size={10} />{item.location}</span>}
                      {item.clientName && <span>Client: {item.clientName}</span>}
                      {item.projectValue && <span>Value: {item.projectValue}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

// ===== ONGOING PROJECTS =====
export function OngoingProjectsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects/ongoing')
      .then(r => setItems(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <PublicLayout>
      <PageHeader label="In Progress" title="Ongoing Projects" subtitle="Active projects currently under construction and development" />
      <section className="section-padding bg-dark-950">
        <div className="container-custom">
          {items.length === 0 ? (
            <EmptyState title="No Ongoing Projects" icon="🔧" />
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {items.map(item => (
                <div key={item._id} className="card card-hover overflow-hidden">
                  <div className="img-zoom h-48">
                    <ProjectImage src={item.images?.[0]?.url} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  {/* Progress bar */}
                  <div className="h-1 bg-dark-800">
                    <div className="progress-bar h-1" style={{ width: `${item.progressPercentage}%` }}></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-primary-500 font-mono text-xs tracking-wider uppercase">{item.category}</span>
                      <span className="text-primary-400 font-mono text-xs font-bold">{item.progressPercentage}% Complete</span>
                    </div>
                    <h3 className="font-heading text-2xl text-white tracking-wider mb-3">{item.title}</h3>
                    <p className="text-dark-400 text-sm leading-relaxed mb-4">{item.description}</p>
                    <ProgressBar percentage={item.progressPercentage} />
                    <div className="flex flex-wrap gap-4 mt-4 text-xs text-dark-500 font-mono">
                      {item.startDate && <span>Started: {new Date(item.startDate).toLocaleDateString()}</span>}
                      {item.expectedCompletionDate && <span>Expected: {new Date(item.expectedCompletionDate).toLocaleDateString()}</span>}
                      {item.location && <span className="flex items-center gap-1"><MapPin size={10} />{item.location}</span>}
                    </div>
                    {item.currentPhase && (
                      <div className="mt-3 px-3 py-2 bg-blue-900/20 border border-blue-800/40 text-blue-400 text-xs font-mono">
                        Current Phase: {item.currentPhase}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

// ===== UPCOMING PROJECTS =====
export function UpcomingProjectsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects/upcoming')
      .then(r => setItems(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <PublicLayout>
      <PageHeader label="What's Next" title="Upcoming Projects" subtitle="Future projects and exciting developments on the horizon" />
      <section className="section-padding bg-dark-950">
        <div className="container-custom">
          {items.length === 0 ? (
            <EmptyState title="No Upcoming Projects" icon="🚀" />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => (
                <div key={item._id} className="card card-hover group">
                  <div className="img-zoom h-48 relative">
                    <ProjectImage src={item.previewImage} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-dark-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-mono text-xs tracking-widest uppercase border border-white/30 px-3 py-1.5">Preview</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-dark-500 font-mono text-xs uppercase tracking-wider">{item.category}</span>
                      <StatusBadge status={item.estimatedStatus || 'Coming Soon'} />
                    </div>
                    <h3 className="font-heading text-xl text-white tracking-wider mb-2">{item.title}</h3>
                    <p className="text-dark-400 text-sm leading-relaxed mb-4">{item.description}</p>
                    {item.projectConcept && (
                      <div className="mb-3 text-dark-500 text-xs leading-relaxed border-l-2 border-primary-800 pl-3">{item.projectConcept}</div>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-dark-500 font-mono">
                      {item.expectedStartDate && <span>Est. Start: {new Date(item.expectedStartDate).toLocaleDateString()}</span>}
                      {item.location && <span><MapPin size={10} className="inline" /> {item.location}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

// ===== SERVICES PAGE =====
export function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services')
      .then(r => setServices(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <PublicLayout>
      <PageHeader label="What We Offer" title="Our Services" subtitle="Comprehensive engineering and construction services from concept to completion" />
      <section className="section-padding bg-dark-950">
        <div className="container-custom">
          {services.length === 0 ? (
            <EmptyState title="No Services Listed" icon="🔧" />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <div key={s._id} className="card card-hover group p-8">
                  <div className="text-5xl mb-5">{s.icon || '🏗️'}</div>
                  {s.image && <img src={s.image} alt={s.title} className="w-full h-32 object-cover mb-5" />}
                  <h3 className="font-heading text-2xl text-white tracking-wider mb-3 group-hover:text-primary-400 transition-colors">{s.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed mb-5">{s.description}</p>
                  {s.features?.length > 0 && (
                    <ul className="space-y-2 border-t border-dark-800 pt-4">
                      {s.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-2 text-dark-300 text-sm">
                          <span className="w-1.5 h-1.5 bg-primary-600 rounded-full shrink-0"></span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="py-16 bg-dark-900 border-t border-dark-800">
        <div className="container-custom text-center">
          <h3 className="font-heading text-3xl text-white tracking-wider mb-4">Need a Custom Solution?</h3>
          <p className="text-dark-400 mb-6 max-w-md mx-auto">Contact us to discuss your specific project requirements and get a tailored proposal.</p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2 group">
            Request a Consultation <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}

// ===== EDUCATION PAGE =====
export function EducationPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/education')
      .then(r => setItems(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <PublicLayout>
      <PageHeader label="Academic Background" title="Education" subtitle="Academic qualifications and educational foundations" />
      <section className="section-padding bg-dark-950">
        <div className="container-custom">
          {items.length === 0 ? (
            <EmptyState title="No Education Records" icon="🎓" />
          ) : (
            <div className="space-y-6">
              {items.map((item, i) => (
                <div key={item._id} className="flex gap-0">
                  <div className="flex flex-col items-center mr-8">
                    <div className="w-4 h-4 bg-primary-600 rotate-45 shrink-0 mt-2"></div>
                    {i < items.length - 1 && <div className="w-px h-full bg-dark-800 mt-2"></div>}
                  </div>
                  <div className="card p-8 flex-1 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-heading text-2xl text-white tracking-wider mb-1">{item.degree}</h3>
                        <p className="text-primary-400 font-semibold">{item.institution}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="font-mono text-sm text-dark-400 border border-dark-700 px-3 py-1 inline-block">{item.year}</div>
                        {item.grade && <div className="text-green-400 text-xs font-mono mt-1">{item.grade}</div>}
                      </div>
                    </div>
                    {item.description && <p className="text-dark-300 leading-relaxed mb-4">{item.description}</p>}
                    {item.relevantSubjects?.length > 0 && (
                      <div>
                        <div className="text-dark-500 text-xs font-mono uppercase tracking-wider mb-2">Key Subjects</div>
                        <div className="flex flex-wrap gap-2">
                          {item.relevantSubjects.map((s, i) => (
                            <span key={i} className="text-xs px-3 py-1 border border-dark-700 text-dark-300 font-mono">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {item.academicAchievements && (
                      <div className="mt-4 p-3 bg-dark-800 border border-dark-700">
                        <div className="text-dark-500 text-xs font-mono uppercase tracking-wider mb-1">Academic Achievements</div>
                        <p className="text-dark-300 text-sm">{item.academicAchievements}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

// ===== ACHIEVEMENTS PAGE =====
export function AchievementsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const categories = ['', 'Award', 'Certification', 'Milestone', 'Recognition', 'Competition', 'Training', 'Professional'];

  useEffect(() => {
    api.get(`/achievements${filter ? `?category=${filter}` : ''}`)
      .then(r => setItems(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  if (loading) return <PageLoader />;

  const categoryEmoji = { Award: '🏆', Certification: '📜', Milestone: '🎯', Recognition: '⭐', Competition: '🥇', Training: '📚', Professional: '💼' };

  return (
    <PublicLayout>
      <PageHeader label="Recognitions & Milestones" title="Achievements" subtitle="Awards, certifications, and professional milestones" />
      <section className="section-padding bg-dark-950">
        <div className="container-custom">
          <div className="flex gap-2 flex-wrap mb-10">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all ${
                  filter === c ? 'bg-primary-600 text-white' : 'border border-dark-700 text-dark-400 hover:border-primary-600 hover:text-primary-400'
                }`}>
                {c || 'All'}
              </button>
            ))}
          </div>
          {items.length === 0 ? (
            <EmptyState title="No Achievements Found" icon="🏆" />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => (
                <div key={item._id} className="card card-hover p-6 group">
                  {item.image ? (
                    <div className="img-zoom h-36 mb-4 -mx-6 -mt-6">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="text-5xl mb-4">{categoryEmoji[item.category] || '🏆'}</div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-primary-500 font-mono text-xs tracking-wider uppercase">{item.category}</span>
                    {item.year && <span className="text-dark-500 font-mono text-xs">{item.year}</span>}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-primary-400 transition-colors leading-tight">{item.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{item.description}</p>
                  {item.issuingOrganization && (
                    <div className="mt-3 text-dark-500 text-xs font-mono">Issued by: {item.issuingOrganization}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

// ===== GALLERY PAGE =====
export function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [lightbox, setLightbox] = useState(null);
  const categories = ['', 'Projects', 'Achievements', 'Team', 'Site', 'Events', 'Other'];

  useEffect(() => {
    api.get(`/gallery${filter ? `?category=${filter}` : ''}`)
      .then(r => setItems(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <PublicLayout>
      <PageHeader label="Visual Showcase" title="Gallery" subtitle="Photos from our projects, site visits, and achievements" />
      <section className="section-padding bg-dark-950">
        <div className="container-custom">
          <div className="flex gap-2 flex-wrap mb-10">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all ${
                  filter === c ? 'bg-primary-600 text-white' : 'border border-dark-700 text-dark-400 hover:border-primary-600 hover:text-primary-400'
                }`}>
                {c || 'All'}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(12)].map((_, i) => <div key={i} className="skeleton h-40 w-full"></div>)}
            </div>
          ) : items.length === 0 ? (
            <EmptyState title="Gallery Empty" description="Photos will be added soon." icon="📷" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {items.map((item, i) => (
                <div key={item._id} className="img-zoom cursor-pointer relative group aspect-square overflow-hidden bg-dark-900"
                  onClick={() => setLightbox(i)}>
                  <img src={item.url} alt={item.caption || item.alt || 'Gallery'} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    {item.caption && <p className="text-white text-xs p-3 font-medium">{item.caption}</p>}
                  </div>
                  <div className="absolute top-2 right-2 bg-dark-900/80 text-dark-400 text-xs font-mono px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.category}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white text-2xl w-10 h-10 flex items-center justify-center border border-dark-700 hover:border-primary-600">✕</button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-10 h-10 flex items-center justify-center border border-dark-700 hover:border-primary-600"
            onClick={(e) => { e.stopPropagation(); setLightbox(l => Math.max(0, l - 1)); }}>
            ←
          </button>
          <img src={items[lightbox]?.url} alt="" className="max-w-full max-h-[85vh] object-contain" onClick={e => e.stopPropagation()} />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white w-10 h-10 flex items-center justify-center border border-dark-700 hover:border-primary-600"
            onClick={(e) => { e.stopPropagation(); setLightbox(l => Math.min(items.length - 1, l + 1)); }}>
            →
          </button>
          {items[lightbox]?.caption && (
            <div className="absolute bottom-4 text-white text-sm text-center bg-dark-900/80 px-4 py-2">{items[lightbox].caption}</div>
          )}
        </div>
      )}
    </PublicLayout>
  );
}

// ===== CONTACT PAGE =====
export function ContactPage() {
  const { settings } = useSite();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <PublicLayout>
      <PageHeader label="Get In Touch" title="Contact Us" subtitle="Ready to start your next project? Let's talk." />
      <section className="section-padding bg-dark-950">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="font-heading text-3xl text-white tracking-wider mb-8">Let's Build Something Great Together</h2>
              <div className="space-y-6 mb-10">
                {settings.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-600/15 border border-primary-800/40 flex items-center justify-center shrink-0">
                      <Mail size={20} className="text-primary-500" />
                    </div>
                    <div>
                      <div className="text-dark-500 text-xs font-mono uppercase tracking-wider mb-1">Email</div>
                      <a href={`mailto:${settings.email}`} className="text-white hover:text-primary-400 transition-colors">{settings.email}</a>
                    </div>
                  </div>
                )}
                {settings.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-600/15 border border-primary-800/40 flex items-center justify-center shrink-0">
                      <Phone size={20} className="text-primary-500" />
                    </div>
                    <div>
                      <div className="text-dark-500 text-xs font-mono uppercase tracking-wider mb-1">Phone</div>
                      <a href={`tel:${settings.phone}`} className="text-white hover:text-primary-400 transition-colors">{settings.phone}</a>
                      {settings.phone2 && <div className="text-dark-400 mt-0.5">{settings.phone2}</div>}
                    </div>
                  </div>
                )}
                {(settings.address || settings.city) && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-600/15 border border-primary-800/40 flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-primary-500" />
                    </div>
                    <div>
                      <div className="text-dark-500 text-xs font-mono uppercase tracking-wider mb-1">Address</div>
                      <p className="text-white">{[settings.address, settings.city, settings.state, settings.country].filter(Boolean).join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
              {settings.mapEmbedUrl && (
                <div className="h-64 bg-dark-900 border border-dark-800 overflow-hidden">
                  <iframe src={settings.mapEmbedUrl} title="Office Location" width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="bg-dark-900 border border-dark-800 p-8">
              <h3 className="font-heading text-2xl text-white tracking-wider mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label">Name *</label>
                    <input type="text" className="input-field" placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="admin-label">Phone</label>
                    <input type="tel" className="input-field" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="admin-label">Email *</label>
                  <input type="email" className="input-field" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
                <div>
                  <label className="admin-label">Subject *</label>
                  <input type="text" className="input-field" placeholder="Project inquiry, consultation, etc." value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required />
                </div>
                <div>
                  <label className="admin-label">Message *</label>
                  <textarea className="input-field resize-none" rows={5} placeholder="Tell us about your project..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required></textarea>
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2">
                  {sending ? 'Sending...' : <>Send Message <Send size={16} /></>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

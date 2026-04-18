import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminTable, FormModal, ImageUpload, TagInput, SelectField } from '../../components/admin/AdminComponents';
import { StatusBadge } from '../../components/public/UI';
import toast from 'react-hot-toast';

const CATEGORIES = ['Structural','Residential','Commercial','Infrastructure','Industrial','Renovation','Other'];
const STATUSES   = ['Completed','Ongoing','Upcoming'];
const FORM_ID    = 'portfolio-form';

const blank = {
  title:'', category:'Structural', description:'', status:'Completed',
  clientName:'', location:'', completionDate:'', featured:false,
  technologiesUsed:[], keyHighlights:[],
};

export default function AdminPortfolio() {
  const [items,     setItems]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem,  setEditItem]  = useState(null);
  const [form,      setForm]      = useState(blank);
  const [saving,    setSaving]    = useState(false);

  // ── File state — tracked in React, NOT in DOM ──────────────────────────────
  const [selectedFiles, setSelectedFiles] = useState([]); // File[]

  const fetchItems = async () => {
    setLoading(true);
    try { const r = await api.get('/portfolio?limit=100'); setItems(r.data.data || []); }
    catch { toast.error('Failed to load portfolio'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => {
    setForm(blank); setEditItem(null); setSelectedFiles([]); setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setSelectedFiles([]);
    setForm({
      title:            item.title            || '',
      category:         item.category         || 'Structural',
      description:      item.description      || '',
      status:           item.status           || 'Completed',
      clientName:       item.clientName       || '',
      location:         item.location         || '',
      completionDate:   item.completionDate   ? item.completionDate.slice(0,10) : '',
      featured:         item.featured         || false,
      technologiesUsed: item.technologiesUsed || [],
      keyHighlights:    item.keyHighlights    || [],
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Build FormData entirely from React state — no DOM reading
      const fd = new FormData();
      fd.append('title',            form.title);
      fd.append('category',         form.category);
      fd.append('description',      form.description);
      fd.append('status',           form.status);
      fd.append('clientName',       form.clientName);
      fd.append('location',         form.location);
      fd.append('completionDate',   form.completionDate);
      fd.append('featured',         String(form.featured));
      fd.append('technologiesUsed', JSON.stringify(form.technologiesUsed));
      fd.append('keyHighlights',    JSON.stringify(form.keyHighlights));

      // Append each selected File object
      selectedFiles.forEach(f => fd.append('images', f));

      console.log('Portfolio submit — fields:', [...fd.keys()], '— files:', selectedFiles.length);

      const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (editItem) {
        await api.put(`/portfolio/${editItem._id}`, fd, cfg);
        toast.success('Portfolio item updated!');
      } else {
        await api.post('/portfolio', fd, cfg);
        toast.success('Portfolio item added!');
      }
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      console.error('Portfolio save error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    await api.delete(`/portfolio/${id}`);
    setItems(prev => prev.filter(i => i._id !== id));
  };

  const columns = [
    { key:'images', label:'Image', render: imgs =>
        imgs?.[0]?.url
          ? <img src={imgs[0].url} alt="" className="w-12 h-9 object-cover border border-dark-700" />
          : <div className="w-12 h-9 bg-dark-800 border border-dark-700 flex items-center justify-center text-dark-600 text-xs">N/A</div>
    },
    { key:'title',    label:'Title' },
    { key:'category', label:'Category', render: v => <span className="text-primary-500 font-mono text-xs">{v}</span> },
    { key:'status',   label:'Status',   render: v => <StatusBadge status={v} /> },
    { key:'location', label:'Location' },
    { key:'featured', label:'Featured', render: v => v ? <span className="text-gold-500 text-xs">★ Yes</span> : <span className="text-dark-600 text-xs">No</span> },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl text-white tracking-wider">Portfolio</h1>
          <p className="text-dark-500 text-sm mt-1">{items.length} items total</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-xs flex items-center gap-2">
          <Plus size={16} /> Add Portfolio Item
        </button>
      </div>

      <div className="admin-card overflow-hidden">
        <AdminTable columns={columns} data={items} loading={loading}
          onEdit={openEdit} onDelete={handleDelete}
          emptyMessage="No portfolio items yet. Add your first one!" />
      </div>

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
        loading={saving} formId={FORM_ID}>
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="admin-label">Project Title *</label>
              <input className="admin-input" placeholder="e.g. Skyline Tower Complex"
                value={form.title} onChange={e => setForm({...form,title:e.target.value})} required />
            </div>
            <SelectField label="Category" value={form.category}
              onChange={e => setForm({...form,category:e.target.value})} options={CATEGORIES} />
            <SelectField label="Status" value={form.status}
              onChange={e => setForm({...form,status:e.target.value})} options={STATUSES} />
          </div>

          <div>
            <label className="admin-label">Description *</label>
            <textarea className="admin-input resize-none" rows={4} placeholder="Detailed project description..."
              value={form.description} onChange={e => setForm({...form,description:e.target.value})} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Client Name</label>
              <input className="admin-input" placeholder="Optional"
                value={form.clientName} onChange={e => setForm({...form,clientName:e.target.value})} />
            </div>
            <div>
              <label className="admin-label">Location</label>
              <input className="admin-input" placeholder="e.g. Pune, Maharashtra"
                value={form.location} onChange={e => setForm({...form,location:e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Completion Date</label>
              <input type="date" className="admin-input"
                value={form.completionDate} onChange={e => setForm({...form,completionDate:e.target.value})} />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <input type="checkbox" id="featured" checked={form.featured}
                onChange={e => setForm({...form,featured:e.target.checked})}
                className="w-4 h-4 accent-primary-600" />
              <label htmlFor="featured" className="text-dark-300 text-sm cursor-pointer">Mark as Featured</label>
            </div>
          </div>

          <TagInput label="Technologies / Methods / Materials"
            value={form.technologiesUsed}
            onChange={v => setForm({...form,technologiesUsed:v})}
            placeholder="e.g. RCC, Steel, Concrete..." />

          <TagInput label="Key Highlights"
            value={form.keyHighlights}
            onChange={v => setForm({...form,keyHighlights:v})}
            placeholder="e.g. Delivered on time..." />

          <ImageUpload
            label="Project Images"
            multiple
            existingImages={editItem?.images || []}
            onFilesChange={setSelectedFiles}
          />
          {selectedFiles.length > 0 && (
            <p className="text-green-400 text-xs font-mono">
              ✓ {selectedFiles.length} image(s) ready to upload
            </p>
          )}
        </form>
      </FormModal>
    </AdminLayout>
  );
}

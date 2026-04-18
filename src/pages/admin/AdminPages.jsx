import { useEffect, useState, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminTable, FormModal, ImageUpload, TagInput, SelectField } from '../../components/admin/AdminComponents';
import { StatusBadge, ProgressBar, ConfirmModal, Spinner } from '../../components/public/UI';
import toast from 'react-hot-toast';

const CATS = ['Structural','Residential','Commercial','Infrastructure','Industrial','Renovation','Other'];

// Helper: build FormData from a plain object (text fields only)
const objToFD = (obj) => {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === null || v === undefined) return;
    fd.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
  });
  return fd;
};

// ===== COMPLETED PROJECTS =====
export function AdminCompletedProjects() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [edit, setEdit]       = useState(null);
  const [saving, setSaving]   = useState(false);
  const [photos, setPhotos]   = useState([]);
  const FORM_ID = 'completed-form';

  const blank = { name:'', category:'Structural', description:'', location:'', clientName:'',
                  scopeOfWork:'', challenges:'', results:'',
                  completionYear: new Date().getFullYear().toString(), projectValue:'' };
  const [form, setForm] = useState(blank);

  const load = async () => { setLoading(true); const r = await api.get('/projects/completed?limit=100'); setItems(r.data.data||[]); setLoading(false); };
  useEffect(()=>{ load(); },[]);

  const openEdit = (item) => {
    setEdit(item); setPhotos([]);
    setForm({ name:item.name||'', category:item.category||'Structural', description:item.description||'',
              location:item.location||'', clientName:item.clientName||'', scopeOfWork:item.scopeOfWork||'',
              challenges:item.challenges||'', results:item.results||'',
              completionYear:item.completionYear?.toString()||'', projectValue:item.projectValue||'' });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = objToFD(form);
      photos.forEach(f => fd.append('photos', f));
      const cfg = { headers:{'Content-Type':'multipart/form-data'} };
      if (edit) { await api.put(`/projects/completed/${edit._id}`, fd, cfg); toast.success('Updated!'); }
      else      { await api.post('/projects/completed', fd, cfg); toast.success('Added!'); }
      setModal(false); load();
    } catch(err){ toast.error(err.response?.data?.message||'Failed'); }
    finally{ setSaving(false); }
  };

  const cols = [
    { key:'photos',   label:'Photo',    render:v=>v?.[0]?.url?<img src={v[0].url} alt="" className="w-12 h-9 object-cover border border-dark-700"/>:<div className="w-12 h-9 bg-dark-800 border border-dark-700"/> },
    { key:'name',     label:'Name' },
    { key:'category', label:'Category', render:v=><span className="text-primary-500 font-mono text-xs">{v}</span> },
    { key:'completionYear', label:'Year', render:v=><span className="font-mono text-xs">{v}</span> },
    { key:'location', label:'Location' },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading text-3xl text-white tracking-wider">Completed Projects</h1><p className="text-dark-500 text-sm mt-1">{items.length} projects</p></div>
        <button onClick={()=>{setEdit(null);setForm(blank);setPhotos([]);setModal(true);}} className="btn-primary text-xs flex items-center gap-2"><Plus size={16}/> Add Project</button>
      </div>
      <div className="admin-card overflow-hidden">
        <AdminTable columns={cols} data={items} loading={loading} onEdit={openEdit}
          onDelete={async id=>{await api.delete(`/projects/completed/${id}`);setItems(p=>p.filter(i=>i._id!==id));}}
          emptyMessage="No completed projects yet."/>
      </div>
      <FormModal isOpen={modal} onClose={()=>setModal(false)} title={edit?'Edit Project':'Add Completed Project'} loading={saving} formId={FORM_ID}>
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
          <div><label className="admin-label">Project Name *</label><input className="admin-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} options={CATS}/>
            <div><label className="admin-label">Completion Year</label><input className="admin-input" value={form.completionYear} onChange={e=>setForm({...form,completionYear:e.target.value})}/></div>
          </div>
          <div><label className="admin-label">Description *</label><textarea className="admin-input resize-none" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="admin-label">Location</label><input className="admin-input" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></div>
            <div><label className="admin-label">Client Name</label><input className="admin-input" value={form.clientName} onChange={e=>setForm({...form,clientName:e.target.value})}/></div>
          </div>
          <div><label className="admin-label">Scope of Work</label><textarea className="admin-input resize-none" rows={2} value={form.scopeOfWork} onChange={e=>setForm({...form,scopeOfWork:e.target.value})}/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="admin-label">Challenges</label><textarea className="admin-input resize-none" rows={2} value={form.challenges} onChange={e=>setForm({...form,challenges:e.target.value})}/></div>
            <div><label className="admin-label">Results</label><textarea className="admin-input resize-none" rows={2} value={form.results} onChange={e=>setForm({...form,results:e.target.value})}/></div>
          </div>
          <div><label className="admin-label">Project Value</label><input className="admin-input" placeholder="e.g. ₹2.5 Cr" value={form.projectValue} onChange={e=>setForm({...form,projectValue:e.target.value})}/></div>
          <ImageUpload label="Project Photos" multiple existingImages={edit?.photos||[]} onFilesChange={setPhotos}/>
          {photos.length>0&&<p className="text-green-400 text-xs font-mono">✓ {photos.length} photo(s) ready</p>}
        </form>
      </FormModal>
    </AdminLayout>
  );
}

// ===== ONGOING PROJECTS =====
export function AdminOngoingProjects() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [edit, setEdit]       = useState(null);
  const [saving, setSaving]   = useState(false);
  const [images, setImages]   = useState([]);
  const FORM_ID = 'ongoing-form';

  const blank = { title:'', category:'Structural', description:'', location:'', clientName:'',
                  progressPercentage:0, currentPhase:'', startDate:'', expectedCompletionDate:'' };
  const [form, setForm] = useState(blank);

  const load = async () => { setLoading(true); const r = await api.get('/projects/ongoing?limit=100'); setItems(r.data.data||[]); setLoading(false); };
  useEffect(()=>{ load(); },[]);

  const openEdit = (item) => {
    setEdit(item); setImages([]);
    setForm({ title:item.title||'', category:item.category||'Structural', description:item.description||'',
              location:item.location||'', clientName:item.clientName||'',
              progressPercentage:item.progressPercentage||0, currentPhase:item.currentPhase||'',
              startDate:item.startDate?item.startDate.slice(0,10):'',
              expectedCompletionDate:item.expectedCompletionDate?item.expectedCompletionDate.slice(0,10):'' });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = objToFD(form);
      images.forEach(f => fd.append('images', f));
      const cfg = { headers:{'Content-Type':'multipart/form-data'} };
      if (edit) { await api.put(`/projects/ongoing/${edit._id}`, fd, cfg); toast.success('Updated!'); }
      else      { await api.post('/projects/ongoing', fd, cfg); toast.success('Added!'); }
      setModal(false); load();
    } catch(err){ toast.error(err.response?.data?.message||'Failed'); }
    finally{ setSaving(false); }
  };

  const cols = [
    { key:'images', label:'Photo', render:v=>v?.[0]?.url?<img src={v[0].url} alt="" className="w-12 h-9 object-cover border border-dark-700"/>:<div className="w-12 h-9 bg-dark-800 border border-dark-700"/> },
    { key:'title', label:'Title' },
    { key:'progressPercentage', label:'Progress', render:v=><div className="w-24"><ProgressBar percentage={v}/><span className="text-xs text-primary-400 font-mono">{v}%</span></div> },
    { key:'currentPhase', label:'Phase' },
    { key:'location', label:'Location' },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading text-3xl text-white tracking-wider">Ongoing Projects</h1><p className="text-dark-500 text-sm mt-1">{items.length} active</p></div>
        <button onClick={()=>{setEdit(null);setForm(blank);setImages([]);setModal(true);}} className="btn-primary text-xs flex items-center gap-2"><Plus size={16}/> Add Project</button>
      </div>
      <div className="admin-card overflow-hidden">
        <AdminTable columns={cols} data={items} loading={loading} onEdit={openEdit}
          onDelete={async id=>{await api.delete(`/projects/ongoing/${id}`);setItems(p=>p.filter(i=>i._id!==id));}}
          emptyMessage="No ongoing projects."/>
      </div>
      <FormModal isOpen={modal} onClose={()=>setModal(false)} title={edit?'Edit Project':'Add Ongoing Project'} loading={saving} formId={FORM_ID}>
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
          <div><label className="admin-label">Project Title *</label><input className="admin-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} options={CATS}/>
            <div>
              <label className="admin-label">Progress: {form.progressPercentage}%</label>
              <input type="range" min="0" max="100" className="w-full accent-primary-600 mt-2" value={form.progressPercentage} onChange={e=>setForm({...form,progressPercentage:e.target.value})}/>
            </div>
          </div>
          <div><label className="admin-label">Description *</label><textarea className="admin-input resize-none" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required/></div>
          <div><label className="admin-label">Current Phase</label><input className="admin-input" placeholder="e.g. Foundation Work" value={form.currentPhase} onChange={e=>setForm({...form,currentPhase:e.target.value})}/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="admin-label">Start Date</label><input type="date" className="admin-input" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})}/></div>
            <div><label className="admin-label">Expected Completion</label><input type="date" className="admin-input" value={form.expectedCompletionDate} onChange={e=>setForm({...form,expectedCompletionDate:e.target.value})}/></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="admin-label">Location</label><input className="admin-input" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></div>
            <div><label className="admin-label">Client</label><input className="admin-input" value={form.clientName} onChange={e=>setForm({...form,clientName:e.target.value})}/></div>
          </div>
          <ImageUpload label="Project Images" multiple existingImages={edit?.images||[]} onFilesChange={setImages}/>
          {images.length>0&&<p className="text-green-400 text-xs font-mono">✓ {images.length} image(s) ready</p>}
        </form>
      </FormModal>
    </AdminLayout>
  );
}

// ===== UPCOMING PROJECTS =====
export function AdminUpcomingProjects() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [edit, setEdit]       = useState(null);
  const [saving, setSaving]   = useState(false);
  const [preview, setPreview] = useState([]);
  const FORM_ID = 'upcoming-form';
  const STATUSES = ['Planning','Design Phase','Approval Pending','Coming Soon','Announced'];

  const blank = { title:'', category:'Structural', description:'', projectConcept:'',
                  estimatedStatus:'Coming Soon', location:'', expectedStartDate:'', estimatedValue:'' };
  const [form, setForm] = useState(blank);

  const load = async () => { setLoading(true); const r = await api.get('/projects/upcoming'); setItems(r.data.data||[]); setLoading(false); };
  useEffect(()=>{ load(); },[]);

  const openEdit = (item) => {
    setEdit(item); setPreview([]);
    setForm({ title:item.title||'', category:item.category||'Structural', description:item.description||'',
              projectConcept:item.projectConcept||'', estimatedStatus:item.estimatedStatus||'Coming Soon',
              location:item.location||'', expectedStartDate:item.expectedStartDate?item.expectedStartDate.slice(0,10):'',
              estimatedValue:item.estimatedValue||'' });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = objToFD(form);
      if (preview[0]) fd.append('previewImage', preview[0]);
      const cfg = { headers:{'Content-Type':'multipart/form-data'} };
      if (edit) { await api.put(`/projects/upcoming/${edit._id}`, fd, cfg); toast.success('Updated!'); }
      else      { await api.post('/projects/upcoming', fd, cfg); toast.success('Added!'); }
      setModal(false); load();
    } catch(err){ toast.error(err.response?.data?.message||'Failed'); }
    finally{ setSaving(false); }
  };

  const cols = [
    { key:'previewImage', label:'Preview', render:v=>v?<img src={v} alt="" className="w-12 h-9 object-cover border border-dark-700"/>:<div className="w-12 h-9 bg-dark-800 border border-dark-700"/> },
    { key:'title', label:'Title' },
    { key:'estimatedStatus', label:'Status', render:v=><StatusBadge status={v}/> },
    { key:'category', label:'Category', render:v=><span className="text-primary-500 font-mono text-xs">{v}</span> },
    { key:'expectedStartDate', label:'Est. Start', render:v=>v?new Date(v).toLocaleDateString():'—' },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading text-3xl text-white tracking-wider">Upcoming Projects</h1></div>
        <button onClick={()=>{setEdit(null);setForm(blank);setPreview([]);setModal(true);}} className="btn-primary text-xs flex items-center gap-2"><Plus size={16}/> Add Project</button>
      </div>
      <div className="admin-card overflow-hidden">
        <AdminTable columns={cols} data={items} loading={loading} onEdit={openEdit}
          onDelete={async id=>{await api.delete(`/projects/upcoming/${id}`);setItems(p=>p.filter(i=>i._id!==id));}}
          emptyMessage="No upcoming projects."/>
      </div>
      <FormModal isOpen={modal} onClose={()=>setModal(false)} title={edit?'Edit Project':'Add Upcoming Project'} loading={saving} formId={FORM_ID}>
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
          <div><label className="admin-label">Project Title *</label><input className="admin-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} options={CATS}/>
            <SelectField label="Status" value={form.estimatedStatus} onChange={e=>setForm({...form,estimatedStatus:e.target.value})} options={STATUSES}/>
          </div>
          <div><label className="admin-label">Description *</label><textarea className="admin-input resize-none" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required/></div>
          <div><label className="admin-label">Project Concept</label><textarea className="admin-input resize-none" rows={2} value={form.projectConcept} onChange={e=>setForm({...form,projectConcept:e.target.value})}/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="admin-label">Expected Start Date</label><input type="date" className="admin-input" value={form.expectedStartDate} onChange={e=>setForm({...form,expectedStartDate:e.target.value})}/></div>
            <div><label className="admin-label">Location</label><input className="admin-input" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></div>
          </div>
          <div><label className="admin-label">Estimated Value</label><input className="admin-input" placeholder="e.g. ₹5 Cr" value={form.estimatedValue} onChange={e=>setForm({...form,estimatedValue:e.target.value})}/></div>
          <ImageUpload label="Preview Image" preview={edit?.previewImage} onFilesChange={setPreview}/>
          {preview[0]&&<p className="text-green-400 text-xs font-mono">✓ Image ready</p>}
        </form>
      </FormModal>
    </AdminLayout>
  );
}

// ===== SERVICES =====
export function AdminServices() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [edit, setEdit]       = useState(null);
  const [saving, setSaving]   = useState(false);
  const [img, setImg]         = useState([]);
  const FORM_ID = 'service-form';
  const [form, setForm] = useState({title:'',description:'',icon:'',active:true,features:[]});

  const load = async () => { setLoading(true); const r = await api.get('/services/all'); setItems(r.data.data||[]); setLoading(false); };
  useEffect(()=>{ load(); },[]);

  const openEdit = (item) => {
    setEdit(item); setImg([]);
    setForm({title:item.title||'',description:item.description||'',icon:item.icon||'',active:item.active!==false,features:item.features||[]});
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('icon', form.icon);
      fd.append('active', String(form.active));
      fd.append('features', JSON.stringify(form.features));
      if (img[0]) fd.append('image', img[0]);
      const cfg = { headers:{'Content-Type':'multipart/form-data'} };
      if (edit) { await api.put(`/services/${edit._id}`, fd, cfg); toast.success('Updated!'); }
      else      { await api.post('/services', fd, cfg); toast.success('Added!'); }
      setModal(false); load();
    } catch(err){ toast.error(err.response?.data?.message||'Failed'); }
    finally{ setSaving(false); }
  };

  const cols = [
    { key:'icon',   label:'Icon', render:v=><span className="text-2xl">{v||'🏗️'}</span> },
    { key:'title',  label:'Title' },
    { key:'description', label:'Description', render:v=><span className="text-xs text-dark-400 line-clamp-1 max-w-xs block">{v}</span> },
    { key:'active', label:'Status', render:v=>v?<span className="status-badge status-completed">Active</span>:<span className="status-badge bg-dark-800 text-dark-400 border border-dark-700">Inactive</span> },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading text-3xl text-white tracking-wider">Services</h1></div>
        <button onClick={()=>{setEdit(null);setForm({title:'',description:'',icon:'',active:true,features:[]});setImg([]);setModal(true);}} className="btn-primary text-xs flex items-center gap-2"><Plus size={16}/> Add Service</button>
      </div>
      <div className="admin-card overflow-hidden">
        <AdminTable columns={cols} data={items} loading={loading} onEdit={openEdit}
          onDelete={async id=>{await api.delete(`/services/${id}`);setItems(p=>p.filter(i=>i._id!==id));}}/>
      </div>
      <FormModal isOpen={modal} onClose={()=>setModal(false)} title={edit?'Edit Service':'Add Service'} loading={saving} formId={FORM_ID}>
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3"><label className="admin-label">Title *</label><input className="admin-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
            <div><label className="admin-label">Emoji</label><input className="admin-input text-2xl text-center" maxLength={4} value={form.icon} onChange={e=>setForm({...form,icon:e.target.value})} placeholder="🏗️"/></div>
          </div>
          <div><label className="admin-label">Description *</label><textarea className="admin-input resize-none" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required/></div>
          <TagInput label="Features" value={form.features} onChange={v=>setForm({...form,features:v})} placeholder="Add feature and press Enter"/>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="svc-active" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})} className="w-4 h-4 accent-primary-600"/>
            <label htmlFor="svc-active" className="text-dark-300 text-sm cursor-pointer">Active on website</label>
          </div>
          <ImageUpload label="Service Image (Optional)" preview={edit?.image} onFilesChange={setImg}/>
        </form>
      </FormModal>
    </AdminLayout>
  );
}

// ===== EDUCATION =====
export function AdminEducation() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [edit, setEdit]       = useState(null);
  const [saving, setSaving]   = useState(false);
  const FORM_ID = 'education-form';
  const [form, setForm] = useState({degree:'',institution:'',year:'',description:'',grade:'',academicAchievements:'',relevantSubjects:[]});

  const load = async () => { setLoading(true); const r = await api.get('/education'); setItems(r.data.data||[]); setLoading(false); };
  useEffect(()=>{ load(); },[]);

  const openEdit = (item) => {
    setEdit(item);
    setForm({degree:item.degree||'',institution:item.institution||'',year:item.year||'',
             description:item.description||'',grade:item.grade||'',
             academicAchievements:item.academicAchievements||'',relevantSubjects:item.relevantSubjects||[]});
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      fd.append('degree', form.degree);
      fd.append('institution', form.institution);
      fd.append('year', form.year);
      fd.append('description', form.description);
      fd.append('grade', form.grade);
      fd.append('academicAchievements', form.academicAchievements);
      fd.append('relevantSubjects', JSON.stringify(form.relevantSubjects));
      const cfg = { headers:{'Content-Type':'multipart/form-data'} };
      if (edit) { await api.put(`/education/${edit._id}`, fd, cfg); toast.success('Updated!'); }
      else      { await api.post('/education', fd, cfg); toast.success('Added!'); }
      setModal(false); load();
    } catch(err){ toast.error(err.response?.data?.message||'Failed'); }
    finally{ setSaving(false); }
  };

  const cols = [
    { key:'degree',      label:'Degree' },
    { key:'institution', label:'Institution' },
    { key:'year',        label:'Year', render:v=><span className="font-mono text-xs">{v}</span> },
    { key:'grade',       label:'Grade' },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading text-3xl text-white tracking-wider">Education</h1></div>
        <button onClick={()=>{setEdit(null);setForm({degree:'',institution:'',year:'',description:'',grade:'',academicAchievements:'',relevantSubjects:[]});setModal(true);}} className="btn-primary text-xs flex items-center gap-2"><Plus size={16}/> Add Education</button>
      </div>
      <div className="admin-card overflow-hidden">
        <AdminTable columns={cols} data={items} loading={loading} onEdit={openEdit}
          onDelete={async id=>{await api.delete(`/education/${id}`);setItems(p=>p.filter(i=>i._id!==id));}}
          emptyMessage="No education records yet."/>
      </div>
      <FormModal isOpen={modal} onClose={()=>setModal(false)} title={edit?'Edit Education':'Add Education'} loading={saving} formId={FORM_ID}>
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
          <div><label className="admin-label">Degree *</label><input className="admin-input" placeholder="B.E. Civil Engineering" value={form.degree} onChange={e=>setForm({...form,degree:e.target.value})} required/></div>
          <div><label className="admin-label">Institution *</label><input className="admin-input" value={form.institution} onChange={e=>setForm({...form,institution:e.target.value})} required/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="admin-label">Year *</label><input className="admin-input" placeholder="2010-2014" value={form.year} onChange={e=>setForm({...form,year:e.target.value})} required/></div>
            <div><label className="admin-label">Grade</label><input className="admin-input" value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})}/></div>
          </div>
          <div><label className="admin-label">Description</label><textarea className="admin-input resize-none" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          <TagInput label="Relevant Subjects" value={form.relevantSubjects} onChange={v=>setForm({...form,relevantSubjects:v})} placeholder="Add subject and press Enter"/>
          <div><label className="admin-label">Academic Achievements</label><textarea className="admin-input resize-none" rows={2} value={form.academicAchievements} onChange={e=>setForm({...form,academicAchievements:e.target.value})}/></div>
        </form>
      </FormModal>
    </AdminLayout>
  );
}

// ===== ACHIEVEMENTS =====
export function AdminAchievements() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [edit, setEdit]       = useState(null);
  const [saving, setSaving]   = useState(false);
  const [img, setImg]         = useState([]);
  const FORM_ID = 'achievement-form';
  const ACH_CATS = ['Award','Certification','Milestone','Recognition','Competition','Training','Professional'];
  const [form, setForm] = useState({title:'',description:'',category:'Award',year:'',issuingOrganization:'',featured:false});

  const load = async () => { setLoading(true); const r = await api.get('/achievements'); setItems(r.data.data||[]); setLoading(false); };
  useEffect(()=>{ load(); },[]);

  const openEdit = (item) => {
    setEdit(item); setImg([]);
    setForm({title:item.title||'',description:item.description||'',category:item.category||'Award',
             year:item.year||'',issuingOrganization:item.issuingOrganization||'',featured:item.featured||false});
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('year', form.year);
      fd.append('issuingOrganization', form.issuingOrganization);
      fd.append('featured', String(form.featured));
      if (img[0]) fd.append('image', img[0]);
      const cfg = { headers:{'Content-Type':'multipart/form-data'} };
      if (edit) { await api.put(`/achievements/${edit._id}`, fd, cfg); toast.success('Updated!'); }
      else      { await api.post('/achievements', fd, cfg); toast.success('Added!'); }
      setModal(false); load();
    } catch(err){ toast.error(err.response?.data?.message||'Failed'); }
    finally{ setSaving(false); }
  };

  const cols = [
    { key:'image',    label:'Image',    render:v=>v?<img src={v} alt="" className="w-10 h-10 object-cover border border-dark-700"/>:<span className="text-2xl">🏆</span> },
    { key:'title',    label:'Title' },
    { key:'category', label:'Category', render:v=><span className="text-primary-500 font-mono text-xs">{v}</span> },
    { key:'year',     label:'Year',     render:v=><span className="font-mono text-xs">{v}</span> },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading text-3xl text-white tracking-wider">Achievements</h1></div>
        <button onClick={()=>{setEdit(null);setForm({title:'',description:'',category:'Award',year:'',issuingOrganization:'',featured:false});setImg([]);setModal(true);}} className="btn-primary text-xs flex items-center gap-2"><Plus size={16}/> Add Achievement</button>
      </div>
      <div className="admin-card overflow-hidden">
        <AdminTable columns={cols} data={items} loading={loading} onEdit={openEdit}
          onDelete={async id=>{await api.delete(`/achievements/${id}`);setItems(p=>p.filter(i=>i._id!==id));}}
          emptyMessage="No achievements yet."/>
      </div>
      <FormModal isOpen={modal} onClose={()=>setModal(false)} title={edit?'Edit Achievement':'Add Achievement'} loading={saving} formId={FORM_ID}>
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
          <div><label className="admin-label">Title *</label><input className="admin-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} options={ACH_CATS}/>
            <div><label className="admin-label">Year</label><input className="admin-input" placeholder="2023" value={form.year} onChange={e=>setForm({...form,year:e.target.value})}/></div>
          </div>
          <div><label className="admin-label">Description *</label><textarea className="admin-input resize-none" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required/></div>
          <div><label className="admin-label">Issuing Organization</label><input className="admin-input" value={form.issuingOrganization} onChange={e=>setForm({...form,issuingOrganization:e.target.value})}/></div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="ach-feat" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} className="w-4 h-4 accent-primary-600"/>
            <label htmlFor="ach-feat" className="text-dark-300 text-sm cursor-pointer">Featured achievement</label>
          </div>
          <ImageUpload label="Certificate / Image" preview={edit?.image} onFilesChange={setImg}/>
          {img[0]&&<p className="text-green-400 text-xs font-mono">✓ Image ready</p>}
        </form>
      </FormModal>
    </AdminLayout>
  );
}

// ===== GALLERY =====
export function AdminGallery() {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId]   = useState(null);
  const [deleting, setDeleting]   = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [category, setCategory]   = useState('Projects');
  const [caption, setCaption]     = useState('');
  const [galleryFiles, setGalleryFiles] = useState([]);
  const GCATS = ['Projects','Achievements','Team','Site','Events','Other'];

  const load = async () => { setLoading(true); const r = await api.get('/gallery'); setItems(r.data.data||[]); setLoading(false); };
  useEffect(()=>{ load(); },[]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!galleryFiles.length) { toast.error('Please select at least one image'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      galleryFiles.forEach(f => fd.append('images', f));
      fd.append('category', category);
      fd.append('caption', caption);
      await api.post('/gallery', fd, { headers:{'Content-Type':'multipart/form-data'} });
      toast.success(`${galleryFiles.length} image(s) uploaded to Cloudinary!`);
      setCaption(''); setGalleryFiles([]);
      load();
    } catch(err){ toast.error(err.response?.data?.message||'Upload failed'); }
    finally{ setUploading(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await api.delete(`/gallery/${deleteId}`); setItems(p=>p.filter(i=>i._id!==deleteId)); toast.success('Deleted!'); }
    catch{ toast.error('Failed'); }
    finally{ setDeleting(false); setDeleteId(null); }
  };

  const handleEditSave = async (item) => {
    try { await api.put(`/gallery/${item._id}`,{caption:item.caption,category:item.category}); toast.success('Updated!'); setEditItem(null); load(); }
    catch{ toast.error('Failed'); }
  };

  return (
    <AdminLayout>
      <div className="mb-6"><h1 className="font-heading text-3xl text-white tracking-wider">Gallery</h1><p className="text-dark-500 text-sm mt-1">{items.length} images</p></div>

      {/* Upload */}
      <div className="admin-card mb-6">
        <h2 className="font-heading text-xl text-white tracking-wider mb-4 pb-3 border-b border-dark-800">Upload Images</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Category</label>
              <select className="admin-input" value={category} onChange={e=>setCategory(e.target.value)}>
                {GCATS.map(c=><option key={c} value={c} className="bg-dark-900">{c}</option>)}
              </select>
            </div>
            <div><label className="admin-label">Caption (optional)</label><input className="admin-input" placeholder="Caption for all images" value={caption} onChange={e=>setCaption(e.target.value)}/></div>
          </div>
          {/* ImageUpload tracks files in state — onFilesChange gives us File[] */}
          <ImageUpload label="Select Images" multiple onFilesChange={setGalleryFiles}/>
          {galleryFiles.length>0&&(
            <p className="text-green-400 text-xs font-mono">✓ {galleryFiles.length} image(s) selected and ready to upload</p>
          )}
          <button type="submit" disabled={uploading||!galleryFiles.length} className="btn-primary text-xs flex items-center gap-2">
            {uploading?<><Spinner size="sm"/> Uploading to Cloudinary...</>:<><Plus size={14}/> Upload {galleryFiles.length>0?`${galleryFiles.length} Image(s)`:'Images'}</>}
          </button>
        </form>
      </div>

      {/* Grid */}
      {loading?(
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[...Array(10)].map((_,i)=><div key={i} className="skeleton aspect-square"/>)}
        </div>
      ):items.length===0?(
        <div className="text-center py-12 text-dark-500"><div className="text-4xl mb-2">📷</div><p>No images yet</p></div>
      ):(
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map(item=>(
            <div key={item._id} className="relative group aspect-square bg-dark-900 border border-dark-800 overflow-hidden">
              <img src={item.url} alt={item.caption||''} className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-dark-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <div className="text-white text-[10px] font-mono bg-dark-800 px-2 py-1 w-full truncate text-center">{item.category}</div>
                {item.caption&&<div className="text-dark-300 text-[10px] truncate w-full text-center">{item.caption}</div>}
                <div className="flex gap-1 mt-1">
                  <button onClick={()=>setEditItem({...item})} className="w-7 h-7 bg-primary-600/80 hover:bg-primary-600 text-white flex items-center justify-center text-xs">✏</button>
                  <button onClick={()=>setDeleteId(item._id)} className="w-7 h-7 bg-red-700/80 hover:bg-red-600 text-white flex items-center justify-center"><Trash2 size={12}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit caption modal */}
      {editItem&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={()=>setEditItem(null)}/>
          <div className="relative bg-dark-900 border border-dark-800 p-6 w-full max-w-sm">
            <h3 className="font-heading text-xl text-white tracking-wider mb-4">Edit Image</h3>
            <img src={editItem.url} alt="" className="w-full h-40 object-cover mb-4 border border-dark-700"/>
            <div className="space-y-3">
              <div><label className="admin-label">Caption</label><input className="admin-input" value={editItem.caption||''} onChange={e=>setEditItem({...editItem,caption:e.target.value})}/></div>
              <div><label className="admin-label">Category</label>
                <select className="admin-input" value={editItem.category} onChange={e=>setEditItem({...editItem,category:e.target.value})}>
                  {GCATS.map(c=><option key={c} value={c} className="bg-dark-900">{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={()=>setEditItem(null)} className="btn-ghost flex-1 text-xs py-2">Cancel</button>
              <button onClick={()=>handleEditSave(editItem)} className="btn-primary flex-1 text-xs py-2">Save</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal isOpen={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={handleDelete} loading={deleting}/>
    </AdminLayout>
  );
}

// ===== TESTIMONIALS =====
export function AdminTestimonials() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [edit, setEdit]       = useState(null);
  const [saving, setSaving]   = useState(false);
  const [photo, setPhoto]     = useState([]);
  const FORM_ID = 'testimonial-form';
  const [form, setForm] = useState({clientName:'',feedback:'',rating:5,designation:'',company:'',projectReference:'',active:true,featured:false});

  const load = async () => { setLoading(true); const r = await api.get('/testimonials/all'); setItems(r.data.data||[]); setLoading(false); };
  useEffect(()=>{ load(); },[]);

  const openEdit = (item) => {
    setEdit(item); setPhoto([]);
    setForm({clientName:item.clientName||'',feedback:item.feedback||'',rating:item.rating||5,
             designation:item.designation||'',company:item.company||'',
             projectReference:item.projectReference||'',active:item.active!==false,featured:item.featured||false});
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      fd.append('clientName', form.clientName);
      fd.append('feedback', form.feedback);
      fd.append('rating', String(form.rating));
      fd.append('designation', form.designation);
      fd.append('company', form.company);
      fd.append('projectReference', form.projectReference);
      fd.append('active', String(form.active));
      fd.append('featured', String(form.featured));
      if (photo[0]) fd.append('photo', photo[0]);
      const cfg = { headers:{'Content-Type':'multipart/form-data'} };
      if (edit) { await api.put(`/testimonials/${edit._id}`, fd, cfg); toast.success('Updated!'); }
      else      { await api.post('/testimonials', fd, cfg); toast.success('Added!'); }
      setModal(false); load();
    } catch(err){ toast.error(err.response?.data?.message||'Failed'); }
    finally{ setSaving(false); }
  };

  const cols = [
    { key:'clientName', label:'Client' },
    { key:'rating', label:'Rating', render:v=><span className="text-gold-500 font-mono text-xs">{'★'.repeat(v)}</span> },
    { key:'company', label:'Company' },
    { key:'active', label:'Visible', render:v=>v?<span className="status-badge status-completed">Yes</span>:<span className="status-badge bg-dark-800 text-dark-400 border border-dark-700">No</span> },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading text-3xl text-white tracking-wider">Testimonials</h1></div>
        <button onClick={()=>{setEdit(null);setForm({clientName:'',feedback:'',rating:5,designation:'',company:'',projectReference:'',active:true,featured:false});setPhoto([]);setModal(true);}} className="btn-primary text-xs flex items-center gap-2"><Plus size={16}/> Add Testimonial</button>
      </div>
      <div className="admin-card overflow-hidden">
        <AdminTable columns={cols} data={items} loading={loading} onEdit={openEdit}
          onDelete={async id=>{await api.delete(`/testimonials/${id}`);setItems(p=>p.filter(i=>i._id!==id));}}
          emptyMessage="No testimonials yet."/>
      </div>
      <FormModal isOpen={modal} onClose={()=>setModal(false)} title={edit?'Edit Testimonial':'Add Testimonial'} loading={saving} formId={FORM_ID}>
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="admin-label">Client Name *</label><input className="admin-input" value={form.clientName} onChange={e=>setForm({...form,clientName:e.target.value})} required/></div>
            <div>
              <label className="admin-label">Rating: {form.rating}/5</label>
              <input type="range" min="1" max="5" className="w-full accent-primary-600 mt-2" value={form.rating} onChange={e=>setForm({...form,rating:Number(e.target.value)})}/>
            </div>
          </div>
          <div><label className="admin-label">Feedback *</label><textarea className="admin-input resize-none" rows={3} value={form.feedback} onChange={e=>setForm({...form,feedback:e.target.value})} required/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="admin-label">Designation</label><input className="admin-input" value={form.designation} onChange={e=>setForm({...form,designation:e.target.value})}/></div>
            <div><label className="admin-label">Company</label><input className="admin-input" value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/></div>
          </div>
          <div><label className="admin-label">Project Reference</label><input className="admin-input" value={form.projectReference} onChange={e=>setForm({...form,projectReference:e.target.value})}/></div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})} className="w-4 h-4 accent-primary-600"/><span className="text-dark-300 text-sm">Visible on site</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} className="w-4 h-4 accent-primary-600"/><span className="text-dark-300 text-sm">Featured</span></label>
          </div>
          <ImageUpload label="Client Photo (Optional)" preview={edit?.photo} onFilesChange={setPhoto}/>
        </form>
      </FormModal>
    </AdminLayout>
  );
}

// ===== MESSAGES =====
export function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => { setLoading(true); const r = await api.get('/contact/messages?limit=100'); setMessages(r.data.data||[]); setLoading(false); };
  useEffect(()=>{ load(); },[]);

  const markRead = async (id) => {
    try { await api.put(`/contact/messages/${id}/read`); setMessages(p=>p.map(m=>m._id===id?{...m,read:true}:m)); } catch{}
  };

  const openMessage = (msg) => { setSelected(msg); if(!msg.read) markRead(msg._id); };

  const handleDelete = async () => {
    setDeleting(true);
    try { await api.delete(`/contact/messages/${deleteId}`); setMessages(p=>p.filter(m=>m._id!==deleteId)); if(selected?._id===deleteId) setSelected(null); toast.success('Deleted!'); }
    catch{ toast.error('Failed'); }
    finally{ setDeleting(false); setDeleteId(null); }
  };

  const unread = messages.filter(m=>!m.read).length;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-heading text-3xl text-white tracking-wider">Messages</h1>
        <p className="text-dark-500 text-sm mt-1">{messages.length} total{unread>0&&<span className="text-primary-400 ml-2">• {unread} unread</span>}</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="admin-card p-0 overflow-hidden">
          {loading?<div className="flex justify-center py-12"><Spinner/></div>
          :messages.length===0?<div className="text-center py-12 text-dark-500"><div className="text-3xl mb-2">💬</div><p>No messages yet</p></div>
          :(
            <div className="divide-y divide-dark-800 max-h-[600px] overflow-y-auto">
              {messages.map(msg=>(
                <div key={msg._id}
                  className={`p-4 cursor-pointer hover:bg-dark-800/50 transition-colors flex items-start gap-3 ${selected?._id===msg._id?'bg-dark-800':''} ${!msg.read?'border-l-2 border-primary-500':''}`}
                  onClick={()=>openMessage(msg)}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${!msg.read?'bg-primary-600 text-white':'bg-dark-700 text-dark-300'}`}>
                    {msg.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-semibold ${!msg.read?'text-white':'text-dark-300'}`}>{msg.name}</span>
                      <span className="text-dark-600 text-xs font-mono shrink-0 ml-2">{new Date(msg.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</span>
                    </div>
                    <div className="text-dark-400 text-xs mb-0.5">{msg.subject}</div>
                    <div className="text-dark-600 text-xs truncate">{msg.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="admin-card">
          {selected?(
            <div>
              <div className="flex items-start justify-between mb-5 pb-4 border-b border-dark-800">
                <div>
                  <h3 className="text-white font-heading text-xl tracking-wider">{selected.name}</h3>
                  <a href={`mailto:${selected.email}`} className="text-primary-400 text-sm hover:underline">{selected.email}</a>
                  {selected.phone&&<div className="text-dark-500 text-xs mt-0.5">{selected.phone}</div>}
                </div>
                <button onClick={()=>setDeleteId(selected._id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 size={16}/></button>
              </div>
              <div className="mb-3"><div className="text-dark-500 text-xs font-mono uppercase tracking-wider mb-1">Subject</div><div className="text-white font-medium">{selected.subject}</div></div>
              <div className="mb-4"><div className="text-dark-500 text-xs font-mono uppercase tracking-wider mb-2">Message</div><div className="text-dark-200 text-sm leading-relaxed bg-dark-800 p-4 border border-dark-700">{selected.message}</div></div>
              <div className="text-dark-600 text-xs font-mono border-t border-dark-800 pt-3">Received: {new Date(selected.createdAt).toLocaleString('en-IN')}</div>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn-primary text-xs mt-4 inline-flex items-center gap-2 w-full justify-center">Reply via Email ↗</a>
            </div>
          ):(
            <div className="text-center py-12 text-dark-600"><div className="text-4xl mb-3">📩</div><p className="text-sm">Select a message to read</p></div>
          )}
        </div>
      </div>
      <ConfirmModal isOpen={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={handleDelete} loading={deleting}/>
    </AdminLayout>
  );
}

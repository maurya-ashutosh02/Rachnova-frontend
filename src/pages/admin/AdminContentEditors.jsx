import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { ImageUpload, TagInput } from '../../components/admin/AdminComponents';
import { Spinner } from '../../components/public/UI';
import toast from 'react-hot-toast';

// ===== HOME CONTENT EDITOR =====
export function AdminHomeContent() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [heroFile, setHeroFile] = useState([]); // File[]

  // Local form state so all fields are controlled
  const [form, setForm] = useState({
    heroTitle:'', heroSubtitle:'', heroTagline:'', heroCTA1:'', heroCTA2:'', heroCTA3:'',
    statsProjects:'', statsYears:'', statsClients:'', statsTeam:'',
    featuredSectionTitle:'', featuredSectionSubtitle:'',
  });

  useEffect(() => {
    api.get('/content/home').then(r => {
      const d = r.data.data;
      setData(d);
      setForm({
        heroTitle: d.heroTitle||'', heroSubtitle: d.heroSubtitle||'', heroTagline: d.heroTagline||'',
        heroCTA1: d.heroCTA1||'', heroCTA2: d.heroCTA2||'', heroCTA3: d.heroCTA3||'',
        statsProjects: d.statsProjects||'', statsYears: d.statsYears||'',
        statsClients: d.statsClients||'', statsTeam: d.statsTeam||'',
        featuredSectionTitle: d.featuredSectionTitle||'', featuredSectionSubtitle: d.featuredSectionSubtitle||'',
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (heroFile[0]) fd.append('heroImage', heroFile[0]);
      await api.put('/content/home', fd, { headers:{'Content-Type':'multipart/form-data'} });
      toast.success('Home content updated!');
      const r = await api.get('/content/home'); setData(r.data.data);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const f = (k) => ({ value: form[k]||'', onChange: e => setForm(p=>({...p,[k]:e.target.value})) });

  if (loading) return <AdminLayout><div className="flex justify-center py-12"><Spinner size="lg"/></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-heading text-3xl text-white tracking-wider">Home Content</h1>
        <p className="text-dark-500 text-sm mt-1">Manage the homepage hero section and stats</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="admin-card">
          <h2 className="font-heading text-xl text-white tracking-wider mb-5 pb-3 border-b border-dark-800">Hero Section</h2>
          <div className="space-y-4">
            <div><label className="admin-label">Hero Title *</label><input className="admin-input" {...f('heroTitle')} required/></div>
            <div><label className="admin-label">Hero Subtitle</label><textarea className="admin-input resize-none" rows={2} {...f('heroSubtitle')}/></div>
            <div><label className="admin-label">Tagline</label><input className="admin-input" {...f('heroTagline')}/></div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="admin-label">CTA Button 1</label><input className="admin-input" {...f('heroCTA1')}/></div>
              <div><label className="admin-label">CTA Button 2</label><input className="admin-input" {...f('heroCTA2')}/></div>
              <div><label className="admin-label">CTA Button 3</label><input className="admin-input" {...f('heroCTA3')}/></div>
            </div>
            <ImageUpload label="Hero Background Image" preview={data?.heroImage} onFilesChange={setHeroFile}/>
            {heroFile[0]&&<p className="text-green-400 text-xs font-mono">✓ New hero image ready to upload</p>}
          </div>
        </div>

        <div className="admin-card">
          <h2 className="font-heading text-xl text-white tracking-wider mb-5 pb-3 border-b border-dark-800">Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><label className="admin-label">Total Projects</label><input type="number" className="admin-input" {...f('statsProjects')}/></div>
            <div><label className="admin-label">Years Experience</label><input type="number" className="admin-input" {...f('statsYears')}/></div>
            <div><label className="admin-label">Happy Clients</label><input type="number" className="admin-input" {...f('statsClients')}/></div>
            <div><label className="admin-label">Team Members</label><input type="number" className="admin-input" {...f('statsTeam')}/></div>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="font-heading text-xl text-white tracking-wider mb-5 pb-3 border-b border-dark-800">Featured Projects Section</h2>
          <div className="space-y-4">
            <div><label className="admin-label">Section Title</label><input className="admin-input" {...f('featuredSectionTitle')}/></div>
            <div><label className="admin-label">Section Subtitle</label><input className="admin-input" {...f('featuredSectionSubtitle')}/></div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving?<><Spinner size="sm"/> Saving...</>:<><Save size={16}/> Save Home Content</>}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

// ===== ABOUT CONTENT EDITOR =====
export function AdminAboutContent() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [expertise,   setExpertise]   = useState([]);
  const [coreValues,  setCoreValues]  = useState([]);
  const [whyChooseUs, setWhyChooseUs] = useState([]);
  const [founderFile, setFounderFile] = useState([]);
  const [aboutFile,   setAboutFile]   = useState([]);

  const [form, setForm] = useState({
    title:'', subtitle:'', introduction:'', vision:'', mission:'', companyStory:'',
    founderName:'', founderBio:'', professionalSummary:'', yearsOfExperience:'',
  });

  useEffect(() => {
    api.get('/content/about').then(r => {
      const d = r.data.data;
      setData(d);
      setForm({
        title: d.title||'', subtitle: d.subtitle||'', introduction: d.introduction||'',
        vision: d.vision||'', mission: d.mission||'', companyStory: d.companyStory||'',
        founderName: d.founderName||'', founderBio: d.founderBio||'',
        professionalSummary: d.professionalSummary||'', yearsOfExperience: d.yearsOfExperience||'',
      });
      setExpertise(d.expertise || []);
      setCoreValues(d.coreValues?.length ? d.coreValues : [{title:'',description:'',icon:''}]);
      setWhyChooseUs(d.whyChooseUs?.length ? d.whyChooseUs : [{title:'',description:'',icon:''}]);
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      fd.append('expertise',   JSON.stringify(expertise));
      fd.append('coreValues',  JSON.stringify(coreValues));
      fd.append('whyChooseUs', JSON.stringify(whyChooseUs));
      if (founderFile[0]) fd.append('founderImage', founderFile[0]);
      if (aboutFile[0])   fd.append('aboutImage',   aboutFile[0]);
      await api.put('/content/about', fd, { headers:{'Content-Type':'multipart/form-data'} });
      toast.success('About content updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const f = (k) => ({ value: form[k]||'', onChange: e => setForm(p=>({...p,[k]:e.target.value})) });

  const addCoreValue  = () => setCoreValues(p=>[...p,{title:'',description:'',icon:''}]);
  const rmCoreValue   = (i) => setCoreValues(p=>p.filter((_,idx)=>idx!==i));
  const upCoreValue   = (i,field,val) => setCoreValues(p=>p.map((v,idx)=>idx===i?{...v,[field]:val}:v));
  const addWhyUs      = () => setWhyChooseUs(p=>[...p,{title:'',description:'',icon:''}]);
  const rmWhyUs       = (i) => setWhyChooseUs(p=>p.filter((_,idx)=>idx!==i));
  const upWhyUs       = (i,field,val) => setWhyChooseUs(p=>p.map((v,idx)=>idx===i?{...v,[field]:val}:v));

  if (loading) return <AdminLayout><div className="flex justify-center py-12"><Spinner size="lg"/></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-heading text-3xl text-white tracking-wider">About Content</h1>
        <p className="text-dark-500 text-sm mt-1">Manage the About Us section</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="admin-card">
          <h2 className="font-heading text-xl text-white tracking-wider mb-5 pb-3 border-b border-dark-800">Basic Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="admin-label">Page Title</label><input className="admin-input" {...f('title')}/></div>
              <div><label className="admin-label">Subtitle</label><input className="admin-input" {...f('subtitle')}/></div>
            </div>
            <div><label className="admin-label">Introduction</label><textarea className="admin-input resize-none" rows={4} {...f('introduction')}/></div>
            <div><label className="admin-label">Company Story</label><textarea className="admin-input resize-none" rows={4} {...f('companyStory')}/></div>
            <div><label className="admin-label">Years of Experience</label><input type="number" className="admin-input w-40" {...f('yearsOfExperience')}/></div>
            <ImageUpload label="About Section Image" preview={data?.aboutImage} onFilesChange={setAboutFile}/>
            {aboutFile[0]&&<p className="text-green-400 text-xs font-mono">✓ About image ready</p>}
          </div>
        </div>

        <div className="admin-card">
          <h2 className="font-heading text-xl text-white tracking-wider mb-5 pb-3 border-b border-dark-800">Vision & Mission</h2>
          <div className="space-y-4">
            <div><label className="admin-label">Vision</label><textarea className="admin-input resize-none" rows={3} {...f('vision')}/></div>
            <div><label className="admin-label">Mission</label><textarea className="admin-input resize-none" rows={3} {...f('mission')}/></div>
            <div><label className="admin-label">Professional Summary</label><textarea className="admin-input resize-none" rows={3} {...f('professionalSummary')}/></div>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="font-heading text-xl text-white tracking-wider mb-5 pb-3 border-b border-dark-800">Founder / Leader</h2>
          <div className="space-y-4">
            <div><label className="admin-label">Founder Name</label><input className="admin-input" {...f('founderName')}/></div>
            <div><label className="admin-label">Founder Bio</label><textarea className="admin-input resize-none" rows={4} {...f('founderBio')}/></div>
            <ImageUpload label="Founder Photo" preview={data?.founderImage} onFilesChange={setFounderFile}/>
            {founderFile[0]&&<p className="text-green-400 text-xs font-mono">✓ Founder photo ready</p>}
          </div>
        </div>

        <div className="admin-card">
          <h2 className="font-heading text-xl text-white tracking-wider mb-5 pb-3 border-b border-dark-800">Areas of Expertise</h2>
          <TagInput value={expertise} onChange={setExpertise} placeholder="Add expertise and press Enter"/>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-dark-800">
            <h2 className="font-heading text-xl text-white tracking-wider">Core Values</h2>
            <button type="button" onClick={addCoreValue} className="btn-ghost text-xs px-4 py-2">+ Add Value</button>
          </div>
          <div className="space-y-3">
            {coreValues.map((val,i)=>(
              <div key={i} className="grid grid-cols-12 gap-3 items-start p-3 bg-dark-800 border border-dark-700">
                <div className="col-span-1"><label className="admin-label">Icon</label><input className="admin-input text-center text-xl p-1" maxLength={4} value={val.icon} onChange={e=>upCoreValue(i,'icon',e.target.value)} placeholder="🏛"/></div>
                <div className="col-span-4"><label className="admin-label">Title</label><input className="admin-input" value={val.title} onChange={e=>upCoreValue(i,'title',e.target.value)}/></div>
                <div className="col-span-6"><label className="admin-label">Description</label><input className="admin-input" value={val.description} onChange={e=>upCoreValue(i,'description',e.target.value)}/></div>
                <div className="col-span-1 pt-5"><button type="button" onClick={()=>rmCoreValue(i)} className="text-red-500 hover:text-red-400 p-1">✕</button></div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-dark-800">
            <h2 className="font-heading text-xl text-white tracking-wider">Why Choose Us</h2>
            <button type="button" onClick={addWhyUs} className="btn-ghost text-xs px-4 py-2">+ Add Reason</button>
          </div>
          <div className="space-y-3">
            {whyChooseUs.map((item,i)=>(
              <div key={i} className="grid grid-cols-12 gap-3 items-start p-3 bg-dark-800 border border-dark-700">
                <div className="col-span-1"><label className="admin-label">Icon</label><input className="admin-input text-center text-xl p-1" maxLength={4} value={item.icon} onChange={e=>upWhyUs(i,'icon',e.target.value)} placeholder="✅"/></div>
                <div className="col-span-4"><label className="admin-label">Title</label><input className="admin-input" value={item.title} onChange={e=>upWhyUs(i,'title',e.target.value)}/></div>
                <div className="col-span-6"><label className="admin-label">Description</label><input className="admin-input" value={item.description} onChange={e=>upWhyUs(i,'description',e.target.value)}/></div>
                <div className="col-span-1 pt-5"><button type="button" onClick={()=>rmWhyUs(i)} className="text-red-500 hover:text-red-400 p-1">✕</button></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving?<><Spinner size="sm"/> Saving...</>:<><Save size={16}/> Save About Content</>}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

// ===== SITE SETTINGS EDITOR =====
export function AdminSettings() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [logoFile, setLogoFile] = useState([]);

  const [form, setForm] = useState({
    siteName:'', siteTagline:'', footerText:'', email:'', phone:'', phone2:'', address:'',
    city:'', state:'', country:'', mapEmbedUrl:'', facebookUrl:'', instagramUrl:'',
    linkedinUrl:'', twitterUrl:'', youtubeUrl:'', whatsappNumber:'',
    metaDescription:'', metaKeywords:'',
  });

  useEffect(() => {
    api.get('/content/settings').then(r => {
      const d = r.data.data;
      setData(d);
      setForm({
        siteName: d.siteName||'', siteTagline: d.siteTagline||'', footerText: d.footerText||'',
        email: d.email||'', phone: d.phone||'', phone2: d.phone2||'', address: d.address||'',
        city: d.city||'', state: d.state||'', country: d.country||'',
        mapEmbedUrl: d.mapEmbedUrl||'', facebookUrl: d.facebookUrl||'',
        instagramUrl: d.instagramUrl||'', linkedinUrl: d.linkedinUrl||'',
        twitterUrl: d.twitterUrl||'', youtubeUrl: d.youtubeUrl||'',
        whatsappNumber: d.whatsappNumber||'', metaDescription: d.metaDescription||'',
        metaKeywords: d.metaKeywords||'',
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (logoFile[0]) fd.append('logo', logoFile[0]);
      await api.put('/content/settings', fd, { headers:{'Content-Type':'multipart/form-data'} });
      toast.success('Settings saved!');
      const r = await api.get('/content/settings'); setData(r.data.data);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const f = (k) => ({ value: form[k]||'', onChange: e => setForm(p=>({...p,[k]:e.target.value})) });

  if (loading) return <AdminLayout><div className="flex justify-center py-12"><Spinner size="lg"/></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-heading text-3xl text-white tracking-wider">Site Settings</h1>
        <p className="text-dark-500 text-sm mt-1">Contact details, social links, site identity</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="admin-card">
          <h2 className="font-heading text-xl text-white tracking-wider mb-5 pb-3 border-b border-dark-800">Site Identity</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="admin-label">Site Name</label><input className="admin-input" {...f('siteName')}/></div>
              <div><label className="admin-label">Tagline</label><input className="admin-input" {...f('siteTagline')}/></div>
            </div>
            <div><label className="admin-label">Footer Text</label><input className="admin-input" {...f('footerText')}/></div>
            <ImageUpload label="Site Logo" preview={data?.logo} onFilesChange={setLogoFile}/>
            {logoFile[0]&&<p className="text-green-400 text-xs font-mono">✓ Logo ready to upload</p>}
          </div>
        </div>

        <div className="admin-card">
          <h2 className="font-heading text-xl text-white tracking-wider mb-5 pb-3 border-b border-dark-800">Contact Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="admin-label">Primary Email</label><input type="email" className="admin-input" {...f('email')}/></div>
              <div><label className="admin-label">Primary Phone</label><input className="admin-input" {...f('phone')}/></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="admin-label">Secondary Phone</label><input className="admin-input" {...f('phone2')}/></div>
              <div><label className="admin-label">WhatsApp Number</label><input className="admin-input" placeholder="+919876543210" {...f('whatsappNumber')}/></div>
            </div>
            <div><label className="admin-label">Street Address</label><input className="admin-input" {...f('address')}/></div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="admin-label">City</label><input className="admin-input" {...f('city')}/></div>
              <div><label className="admin-label">State</label><input className="admin-input" {...f('state')}/></div>
              <div><label className="admin-label">Country</label><input className="admin-input" {...f('country')}/></div>
            </div>
            <div><label className="admin-label">Google Maps Embed URL</label><input className="admin-input" placeholder="https://maps.google.com/maps?q=..." {...f('mapEmbedUrl')}/></div>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="font-heading text-xl text-white tracking-wider mb-5 pb-3 border-b border-dark-800">Social Media</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="admin-label">Facebook URL</label><input className="admin-input" {...f('facebookUrl')}/></div>
            <div><label className="admin-label">Instagram URL</label><input className="admin-input" {...f('instagramUrl')}/></div>
            <div><label className="admin-label">LinkedIn URL</label><input className="admin-input" {...f('linkedinUrl')}/></div>
            <div><label className="admin-label">Twitter / X URL</label><input className="admin-input" {...f('twitterUrl')}/></div>
            <div><label className="admin-label">YouTube URL</label><input className="admin-input" {...f('youtubeUrl')}/></div>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="font-heading text-xl text-white tracking-wider mb-5 pb-3 border-b border-dark-800">SEO</h2>
          <div className="space-y-4">
            <div><label className="admin-label">Meta Description</label><textarea className="admin-input resize-none" rows={2} {...f('metaDescription')}/></div>
            <div><label className="admin-label">Meta Keywords</label><input className="admin-input" placeholder="construction, engineering..." {...f('metaKeywords')}/></div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving?<><Spinner size="sm"/> Saving...</>:<><Save size={16}/> Save Settings</>}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

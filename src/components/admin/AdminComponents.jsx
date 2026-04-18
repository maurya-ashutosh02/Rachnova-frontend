import { useState, useRef } from 'react';
import { Upload, X, Plus, Trash2, Edit2, Save, ChevronDown } from 'lucide-react';
import { Spinner, ConfirmModal } from '../public/UI';
import toast from 'react-hot-toast';

// ============================================================
// ImageUpload
// - Tracks File objects in React state (NOT in DOM)
// - Works for both click-select AND drag-and-drop
// - Calls onFilesChange(File[]) whenever selection changes
// - Parent uses these File objects to build FormData manually
// ============================================================
export function ImageUpload({
  label,
  name,
  multiple = false,
  preview,           // existing single image URL (for edit)
  existingImages = [], // existing multiple images [{url, publicId}] (for edit)
  onFilesChange,     // (files: File[]) => void  — parent tracks this
}) {
  const [dragging, setDragging]   = useState(false);
  const [files, setFiles]         = useState([]); // File objects
  const [previews, setPreviews]   = useState([]); // blob URL strings
  const inputRef = useRef();

  const addFiles = (incoming) => {
    const arr = Array.from(incoming).filter(f => f.type.startsWith('image/'));
    if (!arr.length) return;
    const merged = multiple ? [...files, ...arr] : arr;
    // revoke old blob URLs to avoid memory leaks
    previews.forEach(u => URL.revokeObjectURL(u));
    const urls = merged.map(f => URL.createObjectURL(f));
    setFiles(merged);
    setPreviews(urls);
    onFilesChange?.(merged);
  };

  const removeFile = (i) => {
    URL.revokeObjectURL(previews[i]);
    const newFiles    = files.filter((_, idx) => idx !== i);
    const newPreviews = previews.filter((_, idx) => idx !== i);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onFilesChange?.(newFiles);
    // clear native input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    addFiles(e.target.files);
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div>
      {label && <label className="admin-label">{label}</label>}

      {/* Dropzone */}
      <div
        className={`border-2 border-dashed transition-colors cursor-pointer p-6 text-center
          ${dragging ? 'border-primary-500 bg-primary-600/5' : 'border-dark-700 hover:border-primary-700'}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={openPicker}
      >
        <Upload size={24} className="mx-auto mb-2 text-dark-500" />
        <p className="text-dark-400 text-sm">
          Drop images here or <span className="text-primary-400">click to browse</span>
        </p>
        <p className="text-dark-600 text-xs mt-1">
          {multiple ? 'Multiple files supported' : 'Single file'} · Max 10 MB each · JPG PNG WebP GIF
        </p>
        {/* Native input — only used to open file picker; files tracked in state */}
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {/* Newly selected previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
          {previews.map((url, i) => (
            <div key={i} className="relative aspect-square group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={e => { e.stopPropagation(); removeFile(i); }}
                className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X size={10} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-green-900/80 text-green-300 text-[10px] text-center py-0.5">
                New
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Current single image (edit mode) */}
      {!multiple && preview && previews.length === 0 && (
        <div className="mt-3 relative w-32 h-24 group">
          <img src={preview} alt="Current" className="w-full h-full object-cover border border-dark-700" />
          <div className="absolute inset-0 bg-dark-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs">Current</span>
          </div>
        </div>
      )}

      {/* Existing multiple images (edit mode) */}
      {multiple && existingImages.length > 0 && (
        <div className="mt-3">
          <div className="text-dark-500 text-xs font-mono uppercase tracking-wider mb-2">
            Existing Images ({existingImages.length})
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {existingImages.map((img, i) => (
              <div key={i} className="relative aspect-square">
                <img
                  src={img.url || img}
                  alt=""
                  className="w-full h-full object-cover border border-dark-700"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== Tag Input =====
export function TagInput({ label, value = [], onChange, placeholder = 'Type and press Enter' }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setInput('');
  };

  const removeTag = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div>
      {label && <label className="admin-label">{label}</label>}
      <div className="border border-dark-700 bg-dark-800 p-2 min-h-[44px] flex flex-wrap gap-1.5 focus-within:border-primary-600 transition-colors">
        {value.map((tag, i) => (
          <span key={i} className="flex items-center gap-1 bg-dark-700 border border-dark-600 text-dark-200 text-xs px-2 py-1">
            {tag}
            <button type="button" onClick={() => removeTag(i)} className="text-dark-500 hover:text-red-400">
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          type="text"
          className="flex-1 min-w-24 bg-transparent text-white text-sm outline-none placeholder-dark-600 py-1 px-1"
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); addTag(); }
            if (e.key === ',' && input.trim()) { e.preventDefault(); addTag(); }
          }}
          onBlur={addTag}
        />
      </div>
      <p className="text-dark-600 text-xs mt-1">Press Enter or comma to add</p>
    </div>
  );
}

// ===== Generic Admin Table =====
export function AdminTable({ columns, data, onEdit, onDelete, loading, emptyMessage = 'No items yet' }) {
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete(deleteId);
      toast.success('Deleted successfully');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  }

  if (!data?.length) {
    return (
      <div className="text-center py-12 text-dark-500">
        <div className="text-4xl mb-3">📋</div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-800">
              {columns.map(col => (
                <th key={col.key} className="text-left px-4 py-3 text-dark-500 font-mono text-xs uppercase tracking-wider whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              <th className="text-right px-4 py-3 text-dark-500 font-mono text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row._id || i} className="border-b border-dark-900 hover:bg-dark-900/50 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-dark-300 max-w-xs">
                    {col.render ? col.render(row[col.key], row) : (
                      <span className="truncate block">{row[col.key] || '—'}</span>
                    )}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <button onClick={() => onEdit(row)}
                        className="p-1.5 text-dark-400 hover:text-primary-400 hover:bg-primary-900/20 transition-colors">
                        <Edit2 size={14} />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => setDeleteId(row._id)}
                        className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-900/20 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} loading={deleting} />
    </>
  );
}

// ===== Form Modal =====
// NOT a <form> element — children supply their own <form id={formId}>
// Save button links to that form via the HTML `form` attribute
export function FormModal({ isOpen, onClose, title, children, loading, submitLabel = 'Save', formId = 'admin-modal-form' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-16 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-dark-900 border border-dark-800 w-full max-w-2xl shadow-2xl my-4 animate-fade-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-800">
          <h3 className="font-heading text-xl text-white tracking-wider">{title}</h3>
          <button type="button" onClick={onClose} className="text-dark-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5 max-h-[65vh] overflow-y-auto">
          {children}
        </div>
        <div className="px-6 py-4 border-t border-dark-800 flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="btn-ghost text-xs px-5 py-2.5">Cancel</button>
          <button type="submit" form={formId} disabled={loading}
            className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2">
            {loading && <Spinner size="sm" />}
            <Save size={14} />
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Select Field =====
export function SelectField({ label, name, value, onChange, options, required }) {
  return (
    <div>
      {label && <label className="admin-label">{label}</label>}
      <div className="relative">
        <select name={name} value={value} onChange={onChange} required={required}
          className="admin-input appearance-none pr-8 cursor-pointer">
          {options.map(opt => (
            <option key={opt.value ?? opt} value={opt.value ?? opt} className="bg-dark-900">
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 pointer-events-none" />
      </div>
    </div>
  );
}

import { useRef, useState } from 'react';
import api from '../../../services/api';
import { fileUrl } from '../formShared';

export default function DocumentUpload({
  applicationId,
  files,
  storageBase,
  onUploaded,
  onDeleted,
  readOnly = false,
}) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const uploadOne = async (file) => {
    const fd = new FormData();
    fd.append('files', file);
    const { data } = await api.post(`/application-forms/${applicationId}/upload`, fd);
    return data;
  };

  const handleFiles = async (fileList) => {
    if (readOnly || !fileList?.length) return;
    setError('');
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const res = await uploadOne(file);
        if (res?.file) onUploaded?.(res.file);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const remove = async (fileId) => {
    if (readOnly) return;
    if (!window.confirm('Delete this file?')) return;
    try {
      await api.delete(`/application-forms/files/${fileId}`);
      onDeleted?.(fileId);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const iconFor = (type) => {
    const ext = String(type || '').toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return null;
    if (ext === 'pdf') return '/assets/images/pdf.png';
    if (['doc', 'docx'].includes(ext)) return '/assets/images/word.png';
    return '/assets/images/txt.png';
  };

  return (
    <>
      {!readOnly && (
        <div
          className={`dropzone-react${drag ? ' dragover' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="mb-3">
            <i className="display-4 text-muted mdi mdi-upload-network-outline" />
          </div>
          <h4>{uploading ? 'Uploading…' : 'Drop files here or click to upload.'}</h4>
        </div>
      )}
      {error ? <div className="alert alert-danger mt-2">{error}</div> : null}
      <div className="uploaded-files-grid mt-3">
        {(files || []).map((file) => {
          const url = fileUrl(storageBase, file.url || file.file_path || file.path);
          const icon = iconFor(file.file_type || file.type);
          const name = file.file_name || file.name;
          return (
            <div className="uploaded-file-item" key={file.id}>
              <div className="file-card">
                {!readOnly && (
                  <button type="button" className="file-del" onClick={() => remove(file.id)} title="Delete">
                    ×
                  </button>
                )}
                <a href={url} target="_blank" rel="noreferrer">
                  {icon ? (
                    <div className="file-icon-wrap">
                      <img src={icon} alt="" width={36} height={36} />
                    </div>
                  ) : (
                    <img src={url} className="file-thumb" alt={name} />
                  )}
                </a>
                <div className="file-name" title={name}>
                  {name || 'Document'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

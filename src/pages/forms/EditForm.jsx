import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import PageSkeleton from '../../components/PageSkeleton';
import FormSections from './components/FormSections';
import {
  FORM_PAGE_STYLES,
  buildFormPayload,
  initStateFromPayload,
  profileUrl,
  syncApplicantSignature,
} from './formShared';
import { showErrorPopup, showSuccessPopup } from '../../utils/popups';

export default function EditForm() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const extraCompanyId = searchParams.get('extra_company_id') || '';
  const imageInputRef = useRef(null);
  const extraFileInputRef = useRef(null);
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [addCompanyId, setAddCompanyId] = useState('');
  const [addCompanyFiles, setAddCompanyFiles] = useState([]);
  const [addingCompany, setAddingCompany] = useState(false);

  const [addCompanyDrag, setAddCompanyDrag] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/application-forms/${id}/edit`, {
        params: extraCompanyId ? { extra_company_id: extraCompanyId } : {},
      });
      setState(initStateFromPayload(data));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load edit form');
    } finally {
      setLoading(false);
    }
  }, [id, extraCompanyId]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (name, value) => {
    setState((prev) => ({ ...prev, fields: { ...prev.fields, [name]: value } }));
  };
  const setSig = (name, value) => {
    setState((prev) => ({
      ...prev,
      fields: syncApplicantSignature(prev.fields, name, value),
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!state?.applicationId) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const fd = buildFormPayload(state, { includeCompanyId: true });
      const { data } = await api.post(`/application-forms/${state.applicationId}/update`, fd);
      const msg = data.message || 'Application updated successfully!';
      setSuccess(msg);
      await showSuccessPopup({
        title: 'Form Updated!',
        text: msg,
        confirmText: 'Great',
      });
      await load();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors && Object.values(err.response.data.errors).flat().join(' ')) ||
        'Update failed';
      setError(msg);
      await showErrorPopup({
        title: 'Update Failed',
        text: msg,
      });
    } finally {
      setSaving(false);
    }
  };

  const updateImage = async (file) => {
    if (!file || !state?.userId) return;
    const fd = new FormData();
    fd.append('profile_image', file);
    try {
      const { data } = await api.post(`/application-forms/users/${state.userId}/image`, fd);
      if (data.success) {
        setSuccess(data.message || 'Profile image updated');
        setField('profile', data.profile_path || state.fields.profile);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Image update failed');
    }
  };

  const toggleMember = async () => {
    const isMember = state.fields.for_members === 'yes';
    const path = isMember
      ? `/application-forms/${state.userId}/remove-from-members`
      : `/application-forms/${state.userId}/add-to-members`;
    try {
      const { data } = await api.post(path);
      setSuccess(data.message || 'Updated');
      setField('for_members', isMember ? 'no' : 'yes');
    } catch (err) {
      setError(err.response?.data?.message || 'Member update failed');
    }
  };

  const usedCompanyIds = useMemo(() => {
    if (!state) return [];
    const ids = [state.primaryCompanyId, ...(state.extraCompanies || []).map((c) => c.company_id)];
    return ids.filter(Boolean).map((v) => String(v));
  }, [state]);

  const attachedCompanies = useMemo(() => {
    if (!state) return [];
    const rows = [];
    if (state.primaryCompanyId || state.primaryCompanyName) {
      rows.push({
        key: 'primary',
        company_id: state.primaryCompanyId,
        company_name: state.primaryCompanyName || 'Primary company',
        label: 'Primary',
      });
    }
    (state.extraCompanies || []).forEach((c) => {
      rows.push({
        key: `extra-${c.id}`,
        company_id: c.company_id,
        company_name: c.company_name || 'Company',
        label: 'Added',
      });
    });
    return rows;
  }, [state]);

  const addPendingFiles = (fileList) => {
    const incoming = Array.from(fileList || []).map((file) => ({
      file,
      previewUrl: file.type?.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));
    if (!incoming.length) return;
    setAddCompanyFiles((prev) => [...prev, ...incoming]);
  };

  const removePendingFile = (idx) => {
    setAddCompanyFiles((prev) => {
      const next = [...prev];
      const [removed] = next.splice(idx, 1);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return next;
    });
  };

  const closeAddCompanyModal = () => {
    setShowAddCompany(false);
    setAddCompanyId('');
    setAddCompanyFiles((prev) => {
      prev.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
      return [];
    });
    setAddCompanyDrag(false);
  };

  const iconForPending = (file) => {
    const ext = String(file.name.split('.').pop() || '').toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return null;
    if (ext === 'pdf') return '/assets/images/pdf.png';
    if (['doc', 'docx'].includes(ext)) return '/assets/images/word.png';
    return '/assets/images/txt.png';
  };

  const submitAddCompany = async () => {
    if (!addCompanyId || !state?.applicationId) return;
    setAddingCompany(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('company_id', addCompanyId);
      if (state.extraCompanyId) fd.append('copy_from_extra_company_id', state.extraCompanyId);
      addCompanyFiles.forEach((item) => fd.append('files[]', item.file));
      const { data } = await api.post(`/application-forms/${state.applicationId}/extra-companies`, fd);
      closeAddCompanyModal();
      await showSuccessPopup({
        title: 'Company added',
        text: data.message || 'Company added to this application.',
        confirmText: 'OK',
      });
      const next = {};
      if (data.extra_company?.id) next.extra_company_id = String(data.extra_company.id);
      setSearchParams(next);
    } catch (err) {
      await showErrorPopup({
        title: 'Could not add company',
        text: err.response?.data?.message || 'Failed to add company.',
      });
    } finally {
      setAddingCompany(false);
    }
  };

  if (loading) {
    return <PageSkeleton variant="form" />;
  }

  if (!state) {
    return (
      <div className="pc-container">
        <div className="pc-content">
          <div className="alert alert-danger">{error || 'Form not found'}</div>
          <Link to="/application-forms">Back to list</Link>
        </div>
      </div>
    );
  }

  const photo = profileUrl(state.profileImgBase, state.fields.profile);
  const isMember = state.fields.for_members === 'yes';

  return (
    <div className="pc-container">
      <style>{FORM_PAGE_STYLES}</style>
      <div className="pc-content driver-app-form edit-form-page">
        <div className="page-header">
          <div className="page-block">
            <div className="row align-items-center">
              <div className="col-md-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/application-forms">Application Forms</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Edit Application
                  </li>
                </ul>
              </div>
              <div className="col-md-12">
                <div className="page-header-title">
                  <h2 className="mb-0">Edit Application</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error ? <div className="alert alert-danger">{error}</div> : null}
        {success ? <div className="alert alert-success">{success}</div> : null}

        <div className="action-bar mainrowheader">
          <button
            type="button"
            className="btn-bar"
            onClick={() => {
              document.body.classList.add('printing-app-form');
              const cleanup = () => {
                document.body.classList.remove('printing-app-form');
                window.removeEventListener('afterprint', cleanup);
              };
              window.addEventListener('afterprint', cleanup);
              const imgs = Array.from(document.querySelectorAll('.driver-app-form img'));
              Promise.all(
                imgs.map((img) =>
                  img.complete
                    ? Promise.resolve()
                    : new Promise((resolve) => {
                        img.addEventListener('load', resolve, { once: true });
                        img.addEventListener('error', resolve, { once: true });
                      })
                )
              ).then(() => setTimeout(() => window.print(), 100));
            }}
          >
            Print Form
          </button>
          <button type="button" className="btn-bar" onClick={() => imageInputRef.current?.click()}>
            Update Applicant Image
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => updateImage(e.target.files?.[0])}
          />
          <button
            type="button"
            className={`btn-bar ${isMember ? 'btn-bar-danger' : 'btn-bar-green'}`}
            onClick={toggleMember}
          >
            {isMember ? 'Remove From Member List' : 'Add To Member List'}
          </button>
          <button type="button" className="btn-bar" onClick={() => setShowAddCompany(true)}>
            Add another Company
          </button>
        </div>

        <div className="applicant-card mainapplicationcart">
          {photo ? (
            <img src={photo} className="applicant-photo" alt="Profile" />
          ) : (
            <div className="applicant-photo-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3b5a8a" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
          <div className="applicant-info">
            <div className="applicant-tag">Driver Application</div>
            <div className="applicant-name">{state.fields.driver_name}</div>
            <div className="applicant-address">📍 {state.fields.address}</div>
            <div className="applicant-company">
              Applying For: {state.fields.company_display || state.fields.appcompany_name}
            </div>
          </div>
        </div>

        <form onSubmit={submit}>
          <FormSections
            mode="edit"
            state={state}
            setState={setState}
            activeStep={null}
            setField={setField}
            setSig={setSig}
            onFollowUpRefresh={load}
            onDriverEvaluationRefresh={load}
          />
          <div className="form-fixed-actions">
            <button type="submit" className="btn-submit-main" disabled={saving}>
              {saving ? 'Saving…' : 'Update Application'}
            </button>
          </div>
        </form>
      </div>

      {showAddCompany ? (
        <div className="modal show d-block quiz-modal-overlay" tabIndex={-1}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content add-company-modal">
              <div className="modal-header">
                <h5 className="modal-title">Add another Company</h5>
                <button type="button" className="btn-close" onClick={closeAddCompanyModal} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="field-label">Already on this application</label>
                  {attachedCompanies.length ? (
                    <div className="attached-company-list">
                      {attachedCompanies.map((c) => (
                        <div className="attached-company-chip" key={c.key}>
                          {c.company_name}
                          <span>{c.label}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                      No companies attached yet.
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <label className="field-label" htmlFor="add_company_id">
                    Select company
                  </label>
                  <select
                    id="add_company_id"
                    className="field-select"
                    value={addCompanyId}
                    onChange={(e) => setAddCompanyId(e.target.value)}
                  >
                    <option value="">Select a company…</option>
                    {(state.companies || []).map((c) => {
                      const used = usedCompanyIds.includes(String(c.id));
                      return (
                        <option key={c.id} value={c.id} disabled={used}>
                          {c.company_name}
                          {used ? ' (already added)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                  Existing documents from this application will be copied. You can also upload additional
                  files below.
                </p>

                <div
                  className={`dropzone-react${addCompanyDrag ? ' dragover' : ''}`}
                  onClick={() => extraFileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setAddCompanyDrag(true);
                  }}
                  onDragLeave={() => setAddCompanyDrag(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setAddCompanyDrag(false);
                    addPendingFiles(e.dataTransfer.files);
                  }}
                >
                  <input
                    ref={extraFileInputRef}
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      addPendingFiles(e.target.files);
                      e.target.value = '';
                    }}
                  />
                  <div className="mb-3">
                    <i className="display-4 text-muted mdi mdi-upload-network-outline" />
                  </div>
                  <h4>Drop files here or click to upload.</h4>
                </div>

                {addCompanyFiles.length ? (
                  <div className="uploaded-files-grid mt-3">
                    {addCompanyFiles.map((item, idx) => {
                      const icon = iconForPending(item.file);
                      return (
                        <div className="uploaded-file-item" key={`${item.file.name}-${idx}`}>
                          <div className="file-card">
                            <button
                              type="button"
                              className="file-del"
                              title="Remove"
                              onClick={() => removePendingFile(idx)}
                            >
                              ×
                            </button>
                            {item.previewUrl && !icon ? (
                              <img src={item.previewUrl} className="file-thumb" alt={item.file.name} />
                            ) : (
                              <div className="file-icon-wrap">
                                <img src={icon} alt="" width={36} height={36} />
                              </div>
                            )}
                            <div className="file-name" title={item.file.name}>
                              {item.file.name}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeAddCompanyModal}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!addCompanyId || usedCompanyIds.includes(String(addCompanyId)) || addingCompany}
                  onClick={submitAddCompany}
                >
                  {addingCompany ? 'Adding…' : 'Add Company'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

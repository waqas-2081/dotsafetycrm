import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import PageSkeleton from '../../components/PageSkeleton';
import FormSections from './components/FormSections';
import {
  FORM_PAGE_STYLES,
  buildFormPayload,
  initStateFromPayload,
  profileUrl,
} from './formShared';
import { showErrorPopup, showSuccessPopup } from '../../utils/popups';

export default function EditForm() {
  const { id } = useParams();
  const imageInputRef = useRef(null);
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/application-forms/${id}/edit`);
      setState(initStateFromPayload(data));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load edit form');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (name, value) => {
    setState((prev) => ({ ...prev, fields: { ...prev.fields, [name]: value } }));
  };
  const setSig = (name, value) => setField(name, value);

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
              // Wait for profile / signature images so they render in print
              const imgs = Array.from(document.querySelectorAll('.driver-app-form img'));
              Promise.all(
                imgs.map(
                  (img) =>
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
          />
          <div className="form-fixed-actions">
            <button type="submit" className="btn-submit-main" disabled={saving}>
              {saving ? 'Saving…' : 'Update Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

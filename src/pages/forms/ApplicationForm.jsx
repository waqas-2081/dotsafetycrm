import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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

export default function ApplicationForm() {
  const { id } = useParams();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/application-forms/${id}/form`);
      setState(initStateFromPayload(data));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load application form');
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
      const fd = buildFormPayload(state);
      const { data } = await api.post(`/application-forms/${state.applicationId}/submit`, fd);
      const msg = data.message || 'Form submitted successfully!';
      setSuccess(msg);
      await showSuccessPopup({
        title: 'Form Submitted!',
        text: msg,
        confirmText: 'Great',
      });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors && Object.values(err.response.data.errors).flat().join(' ')) ||
        'Submit failed';
      setError(msg);
      await showErrorPopup({
        title: 'Submit Failed',
        text: msg,
      });
    } finally {
      setSaving(false);
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

  return (
    <div className="pc-container">
      <style>{FORM_PAGE_STYLES}</style>
      <div className="pc-content driver-app-form px-2">
        <div className="page-header mb-3">
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
                    Driver Application
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {error ? <div className="alert alert-danger">{error}</div> : null}
        {success ? <div className="alert alert-success">{success}</div> : null}

        <div className="form-meta-card">
          {photo ? (
            <img src={photo} className="meta-photo" alt="Profile" />
          ) : (
            <div className="meta-photo-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b5a8a" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
          <div className="meta-info">
            <div className="meta-tag">Driver Application</div>
            <h1>Driver&apos;s Application</h1>
            <h3>{state.fields.driver_name}</h3>
            <p>{state.fields.address}</p>
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Applying For: {state.fields.appcompany_name}
            </h2>
          </div>
        </div>

        <form className="step-form-content" onSubmit={submit}>
          <FormSections
            mode="fill"
            state={state}
            setState={setState}
            activeStep={null}
            setField={setField}
            setSig={setSig}
          />
          <div className="form-fixed-actions">
            <button type="submit" className="btn-submit-main" disabled={saving}>
              {saving ? 'Submitting…' : 'Submit Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

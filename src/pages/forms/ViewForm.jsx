import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import PageSkeleton from '../../components/PageSkeleton';
import FormSections from './components/FormSections';
import {
  FORM_PAGE_STYLES,
  initStateFromPayload,
  profileUrl,
} from './formShared';

export default function ViewForm() {
  const { id } = useParams();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/application-forms/${id}/view`);
      setState(initStateFromPayload(data));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load view form');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

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
      <div className="pc-content driver-app-form">
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
                    View Application
                  </li>
                </ul>
              </div>
              <div className="col-md-12">
                <div className="page-header-title d-flex align-items-center gap-2 flex-wrap">
                  <h2 className="mb-0">View Application</h2>
                  <Link className="btn-bar" to={`/edit-form/${id}`}>
                    Edit
                  </Link>
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
                      setTimeout(() => window.print(), 50);
                    }}
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error ? <div className="alert alert-danger">{error}</div> : null}

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
            <h2>Applying For: {state.fields.appcompany_name}</h2>
          </div>
        </div>

        <FormSections
          mode="view"
          state={state}
          setState={setState}
          activeStep={null}
          setField={() => {}}
          setSig={() => {}}
        />
      </div>
    </div>
  );
}

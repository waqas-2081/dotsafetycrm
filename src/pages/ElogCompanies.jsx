import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { TableSkeleton } from '../components/PageSkeleton';

const PAGE_STYLES = `
        .ec-card { border: 1px solid #dfe8f7; box-shadow: 0 8px 24px rgba(17,54,126,0.06); }
        .ec-table-wrap { overflow-x: auto; overflow-y: hidden; scrollbar-width: thin; scrollbar-color: #c5cfdd transparent; }
        .ec-table-wrap::-webkit-scrollbar { height: 8px; }
        .ec-table-wrap::-webkit-scrollbar-track { background: transparent; }
        .ec-table-wrap::-webkit-scrollbar-thumb { background: linear-gradient(90deg, #cdd6e4 0%, #b8c4d6 100%); border-radius: 20px; }
        .ec-table { min-width: 700px; margin-bottom: 0; }
        .ec-table thead th { background: #f3f8ff; color: #42506b; font-weight: 600; border-color: #e3ebf8; white-space: nowrap; border-right: 1px solid #dfe8f7; }
        .ec-table tbody td { border-color: #edf2fa; color: #4a5873; vertical-align: middle; border-right: 1px solid #e6edf9; }
        .ec-table thead th:first-child, .ec-table tbody td:first-child { border-left: 1px solid #dfe8f7; }
        .ec-table thead th:last-child, .ec-table tbody td:last-child { border-right: 1px solid #dfe8f7; }
        .ec-table tbody tr:hover { background: #f9fcff; }
        .ec-index { width: 64px; color: #6b7892; font-weight: 600; }
        .ec-name { font-weight: 600; color: #2c3a55; }
        .ec-badge-active   { display: inline-flex; align-items: center; gap: 5px; padding: 0.22rem 0.6rem; border-radius: 20px; background: #e6f9f1; color: #1a8a5a; font-size: 12px; font-weight: 700; border: 1px solid #b6e8d4; }
        .ec-badge-inactive { display: inline-flex; align-items: center; gap: 5px; padding: 0.22rem 0.6rem; border-radius: 20px; background: #fef2f2; color: #b94040; font-size: 12px; font-weight: 700; border: 1px solid #f5c6c6; }
        .ec-badge-active::before   { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #1ea56f; }
        .ec-badge-inactive::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #e05252; }
        .ec-btn-edit   { width: 32px; height: 32px; border: 0; border-radius: 6px; background: #113f93; color: #fff; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
        .ec-btn-edit:hover { background: #0b2f6f; }
        .ec-btn-delete { width: 32px; height: 32px; border: 0; border-radius: 6px; background: #f0f2f8; color: #c0392b; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
        .ec-btn-delete:hover { background: #fde8e8; }
        .ec-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 1rem; border-top: 1px solid #e8eef9; background: #fff; flex-wrap: wrap; }
        .ec-result { color: #5f6e8d; font-weight: 600; }
        .ec-pagination .page-link { color: #55698e; border-color: #e3ebf8; background: #f9fbff; font-weight: 600; }
        .ec-pagination .page-item.active .page-link { background: #dbeaff; border-color: #c6dcff; color: #184da8; }
        .ec-pagination .page-item.disabled .page-link { color: #aab4c8; }
        .ec-toolbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; padding: 1rem 1.25rem; border-bottom: 1px solid #e8eef9; }
        .ec-search-wrap { position: relative; max-width: 280px; width: 100%; }
        .ec-search-wrap .ec-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #9aaccc; pointer-events: none; }
        .ec-search-wrap input { padding-left: 32px; border-radius: 8px; border: 1px solid #dde6f5; background: #f7faff; color: #3a4d72; font-size: 14px; }
        .ec-search-wrap input:focus { border-color: #8db0e8; box-shadow: 0 0 0 3px rgba(100,150,220,0.12); background: #fff; }
        .ec-filter-select { border-radius: 8px; border: 1px solid #dde6f5; background: #f7faff; color: #3a4d72; font-size: 14px; padding: 0.375rem 0.75rem; }
        .ec-filter-select:focus { border-color: #8db0e8; box-shadow: 0 0 0 3px rgba(100,150,220,0.12); outline: none; }
        .ec-btn-add { background: #113f93; color: #fff; border: 0; border-radius: 8px; padding: 0.4rem 1rem; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: background .15s; }
        .ec-btn-add:hover { background: #0b2f6f; color: #fff; }
        .ec-modal .modal-header { background: #f3f8ff; border-bottom: 1px solid #e3ebf8; }
        .ec-modal .modal-title { font-weight: 700; color: #1e3260; }
        .ec-modal .modal-footer { background: #fafcff; border-top: 1px solid #e3ebf8; }
        .ec-modal label { font-weight: 600; color: #42506b; font-size: 13px; margin-bottom: 4px; }
        .ec-modal .form-control, .ec-modal .form-select { border-radius: 8px; border: 1px solid #dde6f5; background: #f7faff; font-size: 14px; color: #3a4d72; }
        .ec-modal .form-control:focus, .ec-modal .form-select:focus { border-color: #8db0e8; box-shadow: 0 0 0 3px rgba(100,150,220,0.12); background: #fff; }
        .ec-modal .btn-primary { background: #113f93; border-color: #113f93; font-weight: 600; border-radius: 8px; }
        .ec-modal .btn-primary:hover { background: #0b2f6f; border-color: #0b2f6f; }
        .ec-modal .btn-secondary { border-radius: 8px; font-weight: 600; }
        .ec-modal-danger .modal-header { background: #fff5f5; border-bottom: 1px solid #fdd; }
        .ec-modal-danger .modal-title { color: #b94040; }
        .ec-modal-danger .btn-danger { border-radius: 8px; font-weight: 600; }
`;

function getBootstrapModal(el) {
  if (!el || !window.bootstrap?.Modal) return null;
  return window.bootstrap.Modal.getOrCreateInstance(el);
}

export default function ElogCompanies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const page = Number(searchParams.get('page') || 1);

  const [companies, setCompanies] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState(null);
  const [searchInput, setSearchInput] = useState(search);

  const [addName, setAddName] = useState('');
  const [addStatus, setAddStatus] = useState('active');
  const [addErrors, setAddErrors] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState('active');
  const [editErrors, setEditErrors] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const addModalRef = useRef(null);
  const editModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/elog-companies', {
        params: {
          search: search || undefined,
          status: status || undefined,
          page,
        },
      });
      setCompanies(data.data || []);
      setMeta(data.meta || null);
    } catch {
      setFlash({ type: 'error', message: 'Failed to load E-Log companies.' });
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const updateParams = (next) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) params.delete(key);
      else params.set(key, String(value));
    });
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim(), page: 1, status });
  };

  const openAdd = () => {
    setAddName('');
    setAddStatus('active');
    setAddErrors([]);
    getBootstrapModal(addModalRef.current)?.show();
  };

  const openEdit = (company) => {
    setEditId(company.id);
    setEditName(company.company_name);
    setEditStatus(company.status);
    setEditErrors([]);
    getBootstrapModal(editModalRef.current)?.show();
  };

  const openDelete = (company) => {
    setDeleteTarget(company);
    getBootstrapModal(deleteModalRef.current)?.show();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAddErrors([]);
    try {
      const { data } = await api.post('/elog-companies', {
        company_name: addName,
        status: addStatus,
      });
      getBootstrapModal(addModalRef.current)?.hide();
      setFlash({ type: 'success', message: data.message });
      load();
    } catch (err) {
      const msgs = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat()
        : [err.response?.data?.message || 'Failed to create company.'];
      setAddErrors(msgs);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setEditErrors([]);
    try {
      const { data } = await api.put(`/elog-companies/${editId}`, {
        company_name: editName,
        status: editStatus,
      });
      getBootstrapModal(editModalRef.current)?.hide();
      setFlash({ type: 'success', message: data.message });
      load();
    } catch (err) {
      const msgs = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat()
        : [err.response?.data?.message || 'Failed to update company.'];
      setEditErrors(msgs);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      const { data } = await api.delete(`/elog-companies/${deleteTarget.id}`);
      getBootstrapModal(deleteModalRef.current)?.hide();
      setFlash({ type: 'success', message: data.message });
      setDeleteTarget(null);
      load();
    } catch {
      setFlash({ type: 'error', message: 'Failed to delete company.' });
    } finally {
      setSaving(false);
    }
  };

  const goPage = (p) => updateParams({ page: p, search, status });

  const pageNumbers = () => {
    if (!meta) return [];
    const pages = [];
    const start = Math.max(1, (meta.current_page || 1) - 2);
    const end = Math.min(meta.last_page || 1, (meta.current_page || 1) + 2);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  };

  return (
    <>
      <style>{PAGE_STYLES}</style>
      <div className="pc-container">
        <div className="pc-content">
          <div className="page-header">
            <div className="page-block">
              <div className="row align-items-center">
                <div className="col-md-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      E-Log Companies
                    </li>
                  </ul>
                </div>
                <div className="col-md-12">
                  <div className="page-header-title">
                    <h2 className="mb-0">E-Log Companies</h2>
                    <p className="text-muted mb-0">Manage E-Log company records</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {flash && (
            <div
              className={`alert alert-${flash.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`}
              role="alert"
            >
              {flash.message}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setFlash(null)}
              />
            </div>
          )}

          <div className="card ec-card">
            <div className="ec-toolbar">
              <form
                onSubmit={handleSearchSubmit}
                className="d-flex align-items-center gap-2 flex-wrap"
              >
                <div className="ec-search-wrap">
                  <span className="ec-search-icon">
                    <i className="ph-duotone ph-magnifying-glass" style={{ fontSize: 15 }} />
                  </span>
                  <input
                    type="text"
                    name="search"
                    className="form-control form-control-sm"
                    placeholder="Search company..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <select
                  name="status"
                  className="ec-filter-select form-select form-select-sm"
                  style={{ width: 'auto' }}
                  value={status}
                  onChange={(e) =>
                    updateParams({ status: e.target.value, page: 1, search: searchInput })
                  }
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {(search || status) && (
                  <Link
                    to="/elog-companies"
                    className="btn btn-sm btn-outline-secondary"
                    style={{ borderRadius: 8 }}
                  >
                    Clear
                  </Link>
                )}
              </form>

              <button type="button" className="ec-btn-add" onClick={openAdd}>
                <i className="ph-duotone ph-plus" /> Add Company
              </button>
            </div>

            <div className="card-body p-0">
              <div className="ec-table-wrap">
                <table className="table ec-table">
                  <thead>
                    <tr>
                      <th className="ec-index">Serial No</th>
                      <th>Company Name</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-0">
                          <TableSkeleton rows={8} cols={5} />
                        </td>
                      </tr>
                    ) : companies.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-5">
                          <i
                            className="ph-duotone ph-buildings"
                            style={{ fontSize: '2.5rem', color: '#b0bad0' }}
                          />
                          <p className="mt-2 mb-0 text-muted">No E-Log companies found.</p>
                        </td>
                      </tr>
                    ) : (
                      companies.map((company, idx) => {
                        const serial =
                          ((meta?.current_page || 1) - 1) * (meta?.per_page || 15) + idx + 1;
                        return (
                          <tr key={company.id}>
                            <td className="ec-index">{serial}</td>
                            <td className="ec-name">{company.company_name}</td>
                            <td>
                              {company.status === 'active' ? (
                                <span className="ec-badge-active">Active</span>
                              ) : (
                                <span className="ec-badge-inactive">Inactive</span>
                              )}
                            </td>
                            <td>{company.created_at_formatted}</td>
                            <td>{company.updated_at_formatted}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <button
                                  type="button"
                                  className="ec-btn-edit"
                                  title="Edit"
                                  onClick={() => openEdit(company)}
                                >
                                  <i
                                    className="ph-duotone ph-pencil-simple"
                                    style={{ fontSize: 15 }}
                                  />
                                </button>
                                <button
                                  type="button"
                                  className="ec-btn-delete"
                                  title="Delete"
                                  onClick={() => openDelete(company)}
                                >
                                  <i className="ph-duotone ph-trash" style={{ fontSize: 15 }} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {meta && meta.total > 0 && (
              <div className="ec-footer">
                <span className="ec-result">
                  Showing {meta.from}–{meta.to} of {meta.total} results
                </span>
                <nav>
                  <ul className="pagination ec-pagination mb-0">
                    <li className={`page-item${meta.current_page <= 1 ? ' disabled' : ''}`}>
                      <button
                        type="button"
                        className="page-link"
                        disabled={meta.current_page <= 1}
                        onClick={() => goPage(meta.current_page - 1)}
                      >
                        ‹
                      </button>
                    </li>
                    {pageNumbers().map((p) => (
                      <li
                        key={p}
                        className={`page-item${p === meta.current_page ? ' active' : ''}`}
                      >
                        <button type="button" className="page-link" onClick={() => goPage(p)}>
                          {p}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item${meta.current_page >= meta.last_page ? ' disabled' : ''}`}
                    >
                      <button
                        type="button"
                        className="page-link"
                        disabled={meta.current_page >= meta.last_page}
                        onClick={() => goPage(meta.current_page + 1)}
                      >
                        ›
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="modal fade ec-modal"
        id="addCompanyModal"
        tabIndex={-1}
        aria-labelledby="addCompanyModalLabel"
        aria-hidden="true"
        ref={addModalRef}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addCompanyModalLabel">
                <i className="ph-duotone ph-buildings me-2" style={{ color: '#113f93' }} />
                Add E-Log Company
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <form onSubmit={handleAdd} id="addCompanyForm">
              <div className="modal-body">
                {addErrors.length > 0 && (
                  <div className="alert alert-danger alert-dismissible fade show py-2 mb-3">
                    <ul className="mb-0 ps-3" style={{ fontSize: 13 }}>
                      {addErrors.map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="btn-close btn-close-sm"
                      onClick={() => setAddErrors([])}
                    />
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="add_company_name">
                    Company Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="add_company_name"
                    name="company_name"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div className="mb-1">
                  <label htmlFor="add_status">
                    Status <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="add_status"
                    name="status"
                    value={addStatus}
                    onChange={(e) => setAddStatus(e.target.value)}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  <i className="ph-duotone ph-plus me-1" /> Add Company
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal fade ec-modal"
        id="editCompanyModal"
        tabIndex={-1}
        aria-labelledby="editCompanyModalLabel"
        aria-hidden="true"
        ref={editModalRef}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editCompanyModalLabel">
                <i className="ph-duotone ph-pencil-simple me-2" style={{ color: '#113f93' }} />
                Edit E-Log Company
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <form onSubmit={handleEdit} id="editCompanyForm">
              <div className="modal-body">
                {editErrors.length > 0 && (
                  <div className="alert alert-danger alert-dismissible fade show py-2 mb-3">
                    <ul className="mb-0 ps-3" style={{ fontSize: 13 }}>
                      {editErrors.map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="btn-close btn-close-sm"
                      onClick={() => setEditErrors([])}
                    />
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="edit_company_name">
                    Company Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edit_company_name"
                    name="company_name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div className="mb-1">
                  <label htmlFor="edit_status">
                    Status <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="edit_status"
                    name="status"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  <i className="ph-duotone ph-floppy-disk me-1" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal fade ec-modal ec-modal-danger"
        id="deleteCompanyModal"
        tabIndex={-1}
        aria-labelledby="deleteCompanyModalLabel"
        aria-hidden="true"
        ref={deleteModalRef}
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteCompanyModalLabel">
                <i className="ph-duotone ph-warning me-2" />
                Confirm Delete
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body text-center py-4">
              <i className="ph-duotone ph-trash" style={{ fontSize: '2.5rem', color: '#e05252' }} />
              <p className="mt-3 mb-1" style={{ fontSize: 14, color: '#4a5873' }}>
                Are you sure you want to delete
              </p>
              <p
                className="fw-700 mb-0"
                id="deleteCompanyName"
                style={{ color: '#2c3a55', fontSize: 15, fontWeight: 700 }}
              >
                {deleteTarget?.company_name}
              </p>
              <p className="text-muted mt-1" style={{ fontSize: 12 }}>
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer justify-content-center gap-2">
              <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                disabled={saving}
                onClick={handleDelete}
              >
                <i className="ph-duotone ph-trash me-1" /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

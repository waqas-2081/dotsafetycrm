import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { TableSkeleton } from '../../components/PageSkeleton';

const INDEX_STYLES = `
.cmp-shell {
    border: 1px solid #dfe8f7;
    box-shadow: 0 8px 24px rgba(17, 54, 126, 0.06);
}
.cmp-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
    padding: 1rem;
    border-bottom: 1px solid #e8eef9;
    background: #f7faff;
}
.cmp-btn-add {
    background: #d9e9ff;
    border-color: #c8ddff;
    color: #174ea6;
    border-radius: 7px;
    font-weight: 600;
    padding: 0.56rem 0.95rem;
}
.cmp-btn-add:hover {
    background: #c9ddfb;
    border-color: #b8d2fb;
    color: #123f8a;
}
.cmp-search-wrap {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.cmp-search {
    width: 100%;
    max-width: 250px;
    height: 44px;
    border: 1px solid #dbe7fa;
    border-radius: 8px;
    background: #f2f7ff;
}
.cmp-search:focus {
    border-color: #c3d7f8;
    box-shadow: 0 0 0 2px rgba(11, 58, 146, 0.1);
    background: #fff;
}
.cmp-search-spinner {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
}
.cmp-table-wrap {
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: #c5cfdd transparent;
}
.cmp-table-wrap::-webkit-scrollbar { height: 8px; }
.cmp-table-wrap::-webkit-scrollbar-track { background: transparent; }
.cmp-table-wrap::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, #cdd6e4 0%, #b8c4d6 100%);
    border-radius: 20px;
}
.cmp-table {
    min-width: 1050px;
    margin-bottom: 0;
}
.cmp-table thead th {
    background: #f3f8ff;
    color: #42506b;
    font-weight: 600;
    border-color: #e3ebf8;
    white-space: nowrap;
    border-right: 1px solid #dfe8f7;
}
.cmp-table tbody td {
    border-color: #edf2fa;
    vertical-align: middle;
    color: #4a5873;
    border-right: 1px solid #e6edf9;
}
.cmp-table thead th:first-child,
.cmp-table tbody td:first-child { border-left: 1px solid #dfe8f7; }
.cmp-table thead th:last-child,
.cmp-table tbody td:last-child { border-right: 1px solid #dfe8f7; }
.cmp-table tbody tr:hover { background: #f9fcff; }
.cmp-index { width: 50px; color: #6b7892; font-weight: 600; }
.cmp-name { font-weight: 600; color: #2c3a55; }
.cmp-contact { color: #4f5e7b; line-height: 1.25; }
.cmp-email, .cmp-phone { white-space: nowrap; }
.sortable {
    cursor: pointer;
    user-select: none;
    position: relative;
    padding-right: 26px !important;
}
.sortable:hover { background: #eaf1fd !important; }
.sort-icon {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    flex-direction: column;
    gap: 1px;
}
.sort-arrow { font-size: 10px; color: #b0bad0; line-height: 1; }
.sortable.sorting-asc .sort-arrow-up,
.sortable.sorting-desc .sort-arrow-down { color: #113f93; }
.cmp-action {
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 6px;
    color: #fff;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
}
.cmp-action:last-child { margin-right: 0; }
.cmp-action-edit { background: #113f93; }
.cmp-action-edit:hover { background: #0b2f6f; color: #fff; }
.cmp-action-delete { background: #ffdedd; color: #e65c5c; }
.cmp-action-delete:hover { background: #ffc9c7; color: #dc3545; }
.cmp-table-footer {
    padding: 0.85rem 1rem;
    border-top: 1px solid #e8eef9;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
}
.cmp-table-footer .pagination { margin: 0; justify-content: flex-end; }
.cmp-table-footer .page-item .page-link {
    color: #174ea6;
    border: 1px solid #dbe7fa;
    background: #fff;
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    min-width: 38px;
    text-align: center;
}
.cmp-table-footer .page-item.active .page-link,
.cmp-table-footer .page-item .page-link:hover {
    color: #fff;
    background: #113f93;
    border-color: #113f93;
}
.cmp-table-footer .page-item.disabled .page-link {
    color: #8692af;
    background: #f9fbff;
    border-color: #e8effa;
}
.cmp-modal .modal-header {
    background: #f7faff;
    border-bottom: 1px solid #e8eef9;
}
.cmp-modal .modal-title { color: #2c3a55; font-weight: 600; }
.cmp-modal .modal-footer {
    background: #f7faff;
    border-top: 1px solid #e8eef9;
}
`;

function SortHeader({ label, field, sort, direction, onSort }) {
  const sortingClass =
    sort === field ? ` sorting-${direction || 'asc'}` : '';
  return (
    <th
      className={`sortable${sortingClass}`}
      data-sort={field}
      onClick={() => onSort(field)}
    >
      {label}
      <span className="sort-icon">
        <i className="mdi mdi-chevron-up sort-arrow sort-arrow-up"></i>
        <i className="mdi mdi-chevron-down sort-arrow sort-arrow-down"></i>
      </span>
    </th>
  );
}

export default function CompaniesIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'id';
  const direction = searchParams.get('direction') || 'desc';
  const page = Number(searchParams.get('page') || 1);

  const [companies, setCompanies] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(search);
  const [searching, setSearching] = useState(false);
  const location = useLocation();
  const [flash, setFlash] = useState(() =>
    location.state?.success
      ? { type: 'success', message: location.state.success }
      : null
  );
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const debounceRef = useRef(null);

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/companies', {
        params: {
          search: search || undefined,
          sort,
          direction,
          page,
        },
      });
      setCompanies(data.data || []);
      setMeta(data.meta || null);
    } catch {
      setFlash({ type: 'error', message: 'Failed to load companies.' });
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [search, sort, direction, page]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const updateParams = (next) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    setSearchParams(params);
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length > 0) setSearching(true);
    debounceRef.current = setTimeout(() => {
      setSearching(false);
      updateParams({
        search: value.trim() || '',
        page: 1,
        sort,
        direction,
      });
    }, 800);
  };

  const handleSort = (field) => {
    const newDirection = field === sort && direction === 'asc' ? 'desc' : 'asc';
    updateParams({ sort: field, direction: newDirection, search, page: 1 });
  };

  const clearSearch = () => {
    setSearchInput('');
    updateParams({ search: '', page: 1, sort, direction });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/companies/${deleteTarget.id}`);
      setFlash({
        type: 'success',
        message: 'Company deleted successfully.',
      });
      setDeleteTarget(null);
      loadCompanies();
    } catch {
      setFlash({ type: 'error', message: 'Failed to delete company.' });
    } finally {
      setDeleting(false);
    }
  };

  const pageNumbers = () => {
    if (!meta) return [];
    const pages = [];
    const last = meta.last_page || 1;
    const current = meta.current_page || 1;
    const start = Math.max(1, current - 2);
    const end = Math.min(last, current + 2);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  };

  return (
    <>
      <style>{INDEX_STYLES}</style>
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
                      Companies
                    </li>
                  </ul>
                </div>
                <div className="col-md-12">
                  <div className="page-header-title">
                    <h2 className="mb-0">Companies</h2>
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
              ></button>
            </div>
          )}

          {search && meta && (
            <div className="alert alert-info alert-dismissible fade show" role="alert">
              <i className="ph-duotone ph-info me-1"></i>
              Showing results for: <strong>&quot;{search}&quot;</strong>
              <span className="text-muted">
                ({meta.total} result{meta.total !== 1 ? 's' : ''} found)
              </span>
              <button
                type="button"
                className="btn-close"
                aria-label="Clear search"
                onClick={clearSearch}
              ></button>
            </div>
          )}

          <div className="card cmp-shell">
            <div className="cmp-toolbar">
              <Link to="/companies/create" className="btn btn-primary cmp-btn-add">
                <i className="ph-duotone ph-plus me-1"></i>Add New Company
              </Link>

              <div className="cmp-search-wrap">
                <div className="position-relative">
                  <input
                    type="text"
                    id="companySearch"
                    className="form-control cmp-search"
                    placeholder="Search companies..."
                    value={searchInput}
                    autoComplete="off"
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                  {searching && (
                    <div className="cmp-search-spinner">
                      <div
                        className="spinner-border spinner-border-sm text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Searching...</span>
                      </div>
                    </div>
                  )}
                </div>
                {search && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    title="Clear search"
                    onClick={clearSearch}
                  >
                    <i className="ph-duotone ph-x"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="cmp-table-wrap">
              <table className="table cmp-table">
                <thead>
                  <tr>
                    <th className="cmp-index">Serial No</th>
                    <SortHeader
                      label="Company Name"
                      field="company_name"
                      sort={sort}
                      direction={direction}
                      onSort={handleSort}
                    />
                    <SortHeader
                      label="Contact Person"
                      field="contact_name"
                      sort={sort}
                      direction={direction}
                      onSort={handleSort}
                    />
                    <SortHeader
                      label="Email"
                      field="email"
                      sort={sort}
                      direction={direction}
                      onSort={handleSort}
                    />
                    <SortHeader
                      label="Phone"
                      field="telephone"
                      sort={sort}
                      direction={direction}
                      onSort={handleSort}
                    />
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-0">
                        <TableSkeleton rows={8} cols={6} />
                      </td>
                    </tr>
                  ) : companies.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-5">
                        <i
                          className="ph-duotone ph-buildings"
                          style={{ fontSize: '2.5rem', color: '#b0bad0' }}
                        ></i>
                        <p className="mt-2 mb-0 text-muted">
                          {search ? (
                            <>
                              No companies match <strong>&quot;{search}&quot;</strong>
                              {' — '}
                              <button
                                type="button"
                                className="btn btn-link p-0 align-baseline"
                                onClick={clearSearch}
                              >
                                clear search
                              </button>
                            </>
                          ) : (
                            <>
                              No companies yet.{' '}
                              <Link to="/companies/create">Add one now.</Link>
                            </>
                          )}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    companies.map((company, index) => {
                      const serial =
                        ((meta?.current_page || 1) - 1) * (meta?.per_page || 100) +
                        index +
                        1;
                      return (
                        <tr key={company.id}>
                          <td className="cmp-index">{serial}</td>
                          <td className="cmp-name">{company.company_name}</td>
                          <td className="cmp-contact">
                            {company.contact_name ||
                              company.contact_person ||
                              'N/A'}
                          </td>
                          <td className="cmp-email">{company.email || 'N/A'}</td>
                          <td className="cmp-phone">
                            {company.telephone || company.phone || 'N/A'}
                          </td>
                          <td>
                            <Link
                              to={`/companies/${company.id}/edit`}
                              className="cmp-action cmp-action-edit"
                              title="Edit Company"
                            >
                              <i className="ph-duotone ph-pencil-simple"></i>
                            </Link>
                            <button
                              type="button"
                              className="cmp-action cmp-action-delete"
                              title="Delete Company"
                              onClick={() => setDeleteTarget(company)}
                            >
                              <i className="ph-duotone ph-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {meta && companies.length > 0 && (
              <div className="cmp-table-footer">
                <p className="text-muted mb-0 small">
                  Showing {meta.from}–{meta.to} of {meta.total} companies
                </p>
                <ul className="pagination">
                  <li className={`page-item${meta.current_page <= 1 ? ' disabled' : ''}`}>
                    <button
                      type="button"
                      className="page-link"
                      disabled={meta.current_page <= 1}
                      onClick={() => updateParams({ page: meta.current_page - 1 })}
                    >
                      ‹
                    </button>
                  </li>
                  {pageNumbers().map((p) => (
                    <li
                      key={p}
                      className={`page-item${p === meta.current_page ? ' active' : ''}`}
                    >
                      <button
                        type="button"
                        className="page-link"
                        onClick={() => updateParams({ page: p })}
                      >
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
                      onClick={() => updateParams({ page: meta.current_page + 1 })}
                    >
                      ›
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {deleteTarget && (
        <div
          className="modal fade show cmp-modal"
          style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}
          tabIndex={-1}
          role="dialog"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setDeleteTarget(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete{' '}
                  <strong>{deleteTarget.company_name}</strong>?
                </p>
                <p className="text-muted small mb-0">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={deleting}
                  onClick={handleDelete}
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

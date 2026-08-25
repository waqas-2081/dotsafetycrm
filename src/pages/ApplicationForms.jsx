import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { TableSkeleton } from '../components/PageSkeleton';

const PAGE_STYLES = `
    .app-forms-card {
        border: 1px solid #e5edf9;
        box-shadow: 0 8px 24px rgba(44, 87, 188, 0.07);
    }

    .app-forms-search {
        min-width: 250px;
        max-width: 320px;
    }

    .app-forms-search .form-control {
        height: 50px;
        border: 0;
        border-radius: 8px;
        background: #f1f2f4;
        color: #1f2a44;
        padding: 0.85rem 1rem;
        box-shadow: none;
    }

    .app-forms-search .form-control::placeholder {
        color: #475569;
        opacity: 1;
    }

    .app-forms-search .form-control:focus {
        background: #eceef2;
        box-shadow: 0 0 0 2px rgba(61, 90, 241, 0.12);
    }

    .app-table-wrap {
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: thin;
        scrollbar-color: #c5cfdd transparent;
    }

    .app-table-wrap::-webkit-scrollbar { height: 8px; }
    .app-table-wrap::-webkit-scrollbar-track { background: transparent; }
    .app-table-wrap::-webkit-scrollbar-thumb {
        background: linear-gradient(90deg, #cdd6e4 0%, #b8c4d6 100%);
        border-radius: 20px;
    }

    .app-forms-table {
        min-width: 1380px;
        margin-bottom: 0;
    }

    .app-forms-table thead th {
        background: #f4f8ff;
        color: #344767;
        font-weight: 600;
        border-color: #e4ebf7;
        white-space: nowrap;
        border-right: 1px solid #dfe8f7;
        position: relative;
        padding-right: 28px;
    }

    .app-forms-table tbody td {
        vertical-align: middle;
        border-color: #eef2f9;
        border-right: 1px solid #e6edf9;
    }

    .app-forms-table thead th:first-child,
    .app-forms-table tbody td:first-child { border-left: 1px solid #dfe8f7; }
    .app-forms-table thead th:last-child,
    .app-forms-table tbody td:last-child { border-right: 1px solid #dfe8f7; }
    .app-forms-table tbody tr:hover { background: #f9fbff; }

    .app-code { font-weight: 700; color: #3d5af1; letter-spacing: 0.2px; }
    .app-company, .app-name { font-weight: 600; color: #1f2a44; line-height: 1.25; }
    .app-email { color: #56627a; }

    .sortable {
        cursor: pointer;
        user-select: none;
    }
    .sortable:hover { background-color: #eaf0fb; }
    .sort-icon {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        display: inline-flex;
        flex-direction: column;
        gap: 1px;
    }
    .sort-arrow { font-size: 10px; color: #aab4c8; line-height: 1; }
    .sortable.sorting-asc .sort-arrow-up,
    .sortable.sorting-desc .sort-arrow-down { color: #3d5af1; }

    .status-pill {
        display: inline-block;
        padding: 0.26rem 0.55rem;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.2px;
    }
    .status-pill.status-muted    { background: #5d6a7a; color: #fff; }
    .status-pill.status-not-verified { background: #fee2e2; color: #b91c1c; }
    .status-pill.status-all-verified { background: #dcfce7; color: #166534; }

    .action-btn {
        width: 36px;
        height: 36px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        border: 0;
        color: #fff;
        margin-right: 4px;
        font-size: 16px;
        line-height: 1;
        transition: transform 0.15s ease, filter 0.15s ease;
        text-decoration: none;
    }
    .action-btn:last-child { margin-right: 0; }
    .action-btn:hover { transform: translateY(-1px); filter: brightness(0.95); color: #fff; }
    .action-btn.btn-login-soft   { background: #12357f; }
    .action-btn.btn-print-soft   { background: #0a2763; }
    .action-btn.btn-edit-soft    { background: #e0b107; }
    .action-btn.btn-logs-soft    { background: #e0b107; }
    .action-btn.btn-danger-soft  { background: #f9dcd8; color: #ea6f66; }
    .action-btn:disabled         { opacity: 0.55; cursor: not-allowed; }

    .ui-alert-overlay {
        position: fixed;
        inset: 0;
        background: rgba(17, 24, 39, 0.36);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1080;
        padding: 16px;
    }
    .ui-alert-overlay.show { display: flex; }
    .ui-alert-box {
        width: 100%;
        max-width: 400px;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
    }
    .ui-alert-body {
        padding: 18px 24px 20px;
        text-align: center;
        border-bottom: 1px solid #e5e7eb;
    }
    .ui-alert-icon {
        width: 48px;
        height: 48px;
        margin: 0 auto 14px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        line-height: 1;
        font-weight: 700;
    }
    .ui-alert-icon.success { background: #49c887; color: #fff; }
    .ui-alert-icon.error   { background: #ef4444; color: #fff; }
    .ui-alert-message { font-size: 18px; color: #1f2937; line-height: 1.35; margin: 0; }
    .ui-alert-footer { text-align: center; padding: 14px 16px 16px; background: #fff; }
    .ui-alert-btn {
        border: 0;
        border-radius: 4px;
        background: #07258b;
        color: #fff;
        font-weight: 600;
        min-width: 62px;
        padding: 8px 14px;
    }
    .ui-alert-btn:hover { filter: brightness(0.95); }

    @media print {
        .print-personal-only .personal-info-section[style*="display: block"],
        .print-personal-only .personal-info-section[style*="display: block"] * {
            visibility: visible !important;
            display: block !important;
        }
        .print-personal-only .personal-info-section[style*="display: block"] {
            position: absolute; left: 0; top: 0; width: 100%;
            background: white; padding: 20px;
        }
        .print-personal-only .personal-info-section[style*="display: block"] .info-item {
            margin-bottom: 8px; padding: 5px 0;
            border-bottom: 1px dotted #ccc;
            display: block !important; visibility: visible !important;
            font-size: 17px;
        }
        .print-personal-only .personal-info-section[style*="display: block"] .info-item strong {
            display: inline-block; width: 150px; color: #333; visibility: visible !important;
        }
        .print-personal-only .personal-info-section[style*="display: block"] .col-md-6 {
            width: 50%; float: left; padding: 0 10px;
            display: block !important; visibility: visible !important;
        }
        .print-personal-only .personal-info-section[style*="display: block"] .row::after {
            content: ""; display: table; clear: both;
        }
        .app-forms-table { display: none; }
    }

    .timeline { position: relative; padding: 0; list-style: none; }
    .timeline-item { position: relative; padding-left: 32px; margin-bottom: 18px; }
    .timeline-marker {
        position: absolute; left: 0; top: 4px;
        width: 14px; height: 14px; border-radius: 50%;
        background: #3d5af1; border: 2px solid #fff;
        box-shadow: 0 0 0 2px #3d5af1;
    }
    .timeline-content { background: #f8faff; border-radius: 8px; padding: 12px 16px; }
    .timeline-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
    .timeline-time { font-size: 12px; color: #6b7a99; }
    .timeline-description { font-size: 13px; color: #374151; }
    .activity-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
    .timeline-details { background: #fff; border-radius: 6px; padding: 8px 12px; margin-top: 8px; font-size: 12px; }
    .detail-row { display: flex; gap: 8px; margin-bottom: 4px; }
    .detail-label { font-weight: 600; color: #6b7a99; min-width: 110px; }
    .detail-value { color: #374151; }
    .user-info { font-size: 12px; color: #6b7a99; margin-top: 8px; display: flex; align-items: center; gap: 4px; }
    .metadata-item { display: inline-block; background: #f1f5f9; border-radius: 4px; padding: 2px 8px; font-size: 11px; margin: 2px; }
    .exp-scroll { max-height: 300px; overflow-y: auto; }
`;

const ACTIVITY_LABELS = {
  status_change: 'Status Change',
  member_change: 'Member Change',
  form_update: 'Form Update',
  email_sent: 'Email Sent',
  file_upload: 'File Upload',
  file_delete: 'File Delete',
  employment_verification: 'Employment Verification',
  form_created: 'Form Created',
  form_deleted: 'Form Deleted',
  login: 'Login',
};

const ACTIVITY_COLORS = {
  status_change: '#28a745',
  member_change: '#17a2b8',
  form_update: '#ffc107',
  email_sent: '#6f42c1',
  file_upload: '#20c997',
  file_delete: '#dc3545',
  employment_verification: '#fd7e14',
  default: '#6c757d',
};

const SOURCE_BADGE_COLORS = {
  samsara: '#1e5fd4',
  motive: '#0d7a5e',
  monarch: '#8a6000',
  hos247: '#c0392b',
};

function pillClassFromBadge(badgeClass) {
  switch (badgeClass) {
    case 'badge-secondary':
      return 'status-muted';
    case 'badge-danger':
      return 'status-not-verified';
    case 'badge-success':
      return 'status-all-verified';
    default:
      return 'status-muted';
  }
}

function formatRelativeTime(ds) {
  const d = new Date(ds);
  const now = new Date();
  const diff = now - d;
  const s = Math.floor(diff / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const dd = Math.floor(h / 24);
  if (s < 60) return 'Just now';
  if (m < 60) return `${m} minute${m !== 1 ? 's' : ''} ago`;
  if (h < 24) return `${h} hour${h !== 1 ? 's' : ''} ago`;
  if (dd < 7) return `${dd} day${dd !== 1 ? 's' : ''} ago`;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getBootstrapModal(el) {
  if (!el || !window.bootstrap?.Modal) return null;
  return window.bootstrap.Modal.getOrCreateInstance(el);
}

function SortHeader({ label, field, sort, direction, onSort }) {
  const sortingClass = sort === field ? `sorting-${direction || 'asc'}` : '';
  return (
    <th className={`sortable ${sortingClass}`} data-sort={field} onClick={() => onSort(field)}>
      {label}
      <span className="sort-icon">
        <i className="ph-duotone ph-caret-up sort-arrow sort-arrow-up"></i>
        <i className="ph-duotone ph-caret-down sort-arrow sort-arrow-down"></i>
      </span>
    </th>
  );
}

function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.last_page <= 1) return null;

  const { current_page, last_page } = pagination;
  const pages = [];
  const windowSize = 2;
  for (let i = 1; i <= last_page; i++) {
    if (
      i === 1 ||
      i === last_page ||
      (i >= current_page - windowSize && i <= current_page + windowSize)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  return (
    <nav>
      <ul className="pagination mb-0">
        <li className={`page-item${current_page <= 1 ? ' disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            disabled={current_page <= 1}
            onClick={() => onPageChange(current_page - 1)}
          >
            ‹
          </button>
        </li>
        {pages.map((p, idx) =>
          p === '…' ? (
            <li key={`e-${idx}`} className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          ) : (
            <li key={p} className={`page-item${p === current_page ? ' active' : ''}`}>
              <button type="button" className="page-link" onClick={() => onPageChange(p)}>
                {p}
              </button>
            </li>
          )
        )}
        <li className={`page-item${current_page >= last_page ? ' disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            disabled={current_page >= last_page}
            onClick={() => onPageChange(current_page + 1)}
          >
            ›
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default function ApplicationForms() {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [canDelete, setCanDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('created_at');
  const [direction, setDirection] = useState('desc');
  const [page, setPage] = useState(1);
  const [searchSpinner, setSearchSpinner] = useState(false);

  const [uiAlert, setUiAlert] = useState({ show: false, type: 'success', message: '' });

  const [loginApp, setLoginApp] = useState(null);
  const [deleteApp, setDeleteApp] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [logsDriverName, setLogsDriverName] = useState('');
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState('');
  const [logs, setLogs] = useState(null);

  const [hosDriverName, setHosDriverName] = useState('');
  const [hosLoading, setHosLoading] = useState(false);
  const [hosError, setHosError] = useState('');
  const [hosRows, setHosRows] = useState(null);

  const loginModalRef = useRef(null);
  const deleteModalRef = useRef(null);
  const logsModalRef = useRef(null);
  const hosModalRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceRef = useRef(null);
  const printCleanupRef = useRef(null);

  const showUiAlert = useCallback((type, message) => {
    setUiAlert({ show: true, type, message });
  }, []);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/application-forms', {
        params: {
          search: search || undefined,
          sort,
          direction,
          page,
        },
      });
      setApplications(data.applications || []);
      setPagination(data.pagination || null);
      setCanDelete(!!data.can_delete);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications.');
      setApplications([]);
    } finally {
      setLoading(false);
      setSearchSpinner(false);
    }
  }, [search, sort, direction, page]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (printCleanupRef.current) {
        window.removeEventListener('afterprint', printCleanupRef.current);
      }
    };
  }, []);

  const handleSearchInput = (value) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length > 0) setSearchSpinner(true);
    debounceRef.current = setTimeout(() => {
      setSearchSpinner(false);
      setPage(1);
      if (value.trim().length === 0) {
        setSearch('');
      } else {
        setSearch(value.trim());
      }
    }, 800);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const handleSort = (field) => {
    setPage(1);
    if (field === sort && direction === 'asc') {
      setDirection('desc');
    } else if (field === sort) {
      setDirection('asc');
    } else {
      setSort(field);
      setDirection('asc');
    }
  };

  const handleToggle = async (app, kind, checked) => {
    const userId = app.user_id;
    const urls = {
      member: {
        add: `/application-forms/${userId}/add-to-members`,
        remove: `/application-forms/${userId}/remove-from-members`,
        field: 'for_members',
      },
      future: {
        add: `/application-forms/${userId}/add-to-future-members`,
        remove: `/application-forms/${userId}/remove-from-future-members`,
        field: 'future_member_list',
      },
      active: {
        add: `/application-forms/${userId}/activate`,
        remove: `/application-forms/${userId}/deactivate`,
        field: 'is_active',
      },
    };
    const cfg = urls[kind];
    const url = checked ? cfg.add : cfg.remove;

    setApplications((prev) =>
      prev.map((a) =>
        a.id === app.id ? { ...a, [cfg.field]: checked ? 'yes' : 'no', _toggling: kind } : a
      )
    );

    try {
      const { data } = await api.post(url);
      if (data.success) {
        showUiAlert('success', data.message);
        setApplications((prev) =>
          prev.map((a) => {
            if (a.id !== app.id) return a;
            const next = { ...a, _toggling: null };
            if (data.for_members !== undefined) next.for_members = data.for_members;
            if (data.future_member_list !== undefined) next.future_member_list = data.future_member_list;
            if (data.is_active !== undefined) next.is_active = data.is_active;
            return next;
          })
        );
      } else {
        setApplications((prev) =>
          prev.map((a) =>
            a.id === app.id
              ? { ...a, [cfg.field]: checked ? 'no' : 'yes', _toggling: null }
              : a
          )
        );
        showUiAlert('error', data.message || 'Action failed.');
      }
    } catch {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === app.id
            ? { ...a, [cfg.field]: checked ? 'no' : 'yes', _toggling: null }
            : a
        )
      );
      showUiAlert('error', 'An error occurred. Please try again.');
    }
  };

  const openLoginModal = (app) => {
    setLoginApp(app);
    requestAnimationFrame(() => getBootstrapModal(loginModalRef.current)?.show());
  };

  const openDeleteModal = (app) => {
    setDeleteApp(app);
    requestAnimationFrame(() => getBootstrapModal(deleteModalRef.current)?.show());
  };

  const confirmDelete = async () => {
    if (!deleteApp) return;
    setDeleting(true);
    try {
      const { data } = await api.delete(`/application-forms/${deleteApp.id}`);
      getBootstrapModal(deleteModalRef.current)?.hide();
      setSuccess(data.message || 'Application deleted successfully!.');
      setDeleteApp(null);
      fetchList();
    } catch (err) {
      showUiAlert('error', err.response?.data?.message || 'Failed to delete application.');
    } finally {
      setDeleting(false);
    }
  };

  const printPersonalInfo = (applicationId) => {
    document.querySelectorAll('.personal-info-section').forEach((s) => {
      s.style.display = 'none';
    });
    const section = document.getElementById(`personalInfo-${applicationId}`);
    if (!section) {
      alert('Error: Could not find the personal information to print.');
      return;
    }

    section.style.display = 'block';
    const originalTitle = document.title;
    document.title = 'Personal Information';
    document.body.classList.add('print-personal-only');

    setTimeout(() => window.print(), 200);

    const cleanup = () => {
      document.body.classList.remove('print-personal-only');
      document.title = originalTitle;
      section.style.display = 'none';
    };
    printCleanupRef.current = cleanup;
    window.addEventListener('afterprint', cleanup, { once: true });
    setTimeout(cleanup, 3000);
  };

  const openActivityLogs = async (app) => {
    setLogsDriverName(app.driver_name);
    setLogsLoading(true);
    setLogsError('');
    setLogs(null);
    requestAnimationFrame(() => getBootstrapModal(logsModalRef.current)?.show());

    try {
      const { data } = await api.get(`/application-forms/${app.id}/activity-logs`);
      if (!data.success) {
        setLogsError(data.message || 'Failed to load activity logs');
        setLogs([]);
      } else {
        setLogs(data.logs || []);
      }
    } catch {
      setLogsError('An error occurred while loading activity logs');
      setLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  const openHosViolations = async (app) => {
    setHosDriverName(app.driver_name);
    setHosLoading(true);
    setHosError('');
    setHosRows(null);
    requestAnimationFrame(() => getBootstrapModal(hosModalRef.current)?.show());

    try {
      const { data } = await api.get(`/application-forms/hos-violations/${app.user_id}`);
      if (!data.success) {
        setHosError(data.message || 'Failed to load violations.');
        setHosRows([]);
      } else {
        setHosRows(data.violations || []);
      }
    } catch {
      setHosError('An error occurred while loading violations.');
      setHosRows([]);
    } finally {
      setHosLoading(false);
    }
  };

  const printFields = (app) => [
    ['Full Name', app.driver_name],
    ['Company Name', app.company_name],
    ['Driver Type', app.driver_type],
    ['Address', app.driver_address],
    ['City', app.driver_city],
    ['State', app.driver_state],
    ['Zip', app.driver_zipcode],
    ['Driver Phone', app.driver_phone],
    ['Alternate Phone', app.alternate_phone],
    ['Driver SSN', app.driver_ssn],
    ['Date Of Birth', app.date_of_birth],
    ['License Number', app.license_number],
    ['License State', app.license_state],
    ['License Class', app.license_class],
    ['License Expiry', app.license_expiry],
    ['Medical Card #', app.medicalcard_number],
    ['Medical Card Exp', app.medicalcard_expiry],
    ['Visa Number', app.visa_number],
    ['Visa Expiry', app.visa_expiry],
  ];

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
                      Application Forms
                    </li>
                  </ul>
                </div>
                <div className="col-md-12">
                  <div className="page-header-title d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <h2 className="mb-0">Application Forms</h2>
                    <form
                      className="d-flex gap-2 app-forms-search"
                      id="searchForm"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!searchInput.trim()) {
                          clearSearch();
                        } else {
                          setPage(1);
                          setSearch(searchInput.trim());
                        }
                      }}
                    >
                      <div className="position-relative w-100">
                        <input
                          type="text"
                          id="searchInput"
                          ref={searchInputRef}
                          className="form-control"
                          placeholder="Search applications..."
                          value={searchInput}
                          onChange={(e) => handleSearchInput(e.target.value)}
                        />
                        <div
                          id="searchSpinner"
                          className="position-absolute top-50 end-0 translate-middle-y me-2"
                          style={{ display: searchSpinner ? 'block' : 'none' }}
                        >
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Searching...</span>
                          </div>
                        </div>
                      </div>
                      {search ? (
                        <button
                          type="button"
                          className="btn btn-outline-secondary d-flex align-items-center"
                          onClick={clearSearch}
                        >
                          <i className="ph-duotone ph-x"></i>
                        </button>
                      ) : null}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error ? <div className="alert alert-danger">{error}</div> : null}
          {success ? <div className="alert alert-success">{success}</div> : null}

          {search ? (
            <div className="alert alert-info mb-3">
              <i className="ph-duotone ph-info me-1"></i>
              Showing results for: <strong>&quot;{search}&quot;</strong>
              <span className="text-muted">
                ({pagination?.total ?? 0} results found)
              </span>
            </div>
          ) : null}

          <div className="card app-forms-card">
            <div className="card-body p-0">
              {loading ? (
                <TableSkeleton rows={10} cols={7} />
              ) : applications.length > 0 ? (
                <>
                  <div className="app-table-wrap">
                    <table className="table table-hover app-forms-table">
                      <thead>
                        <tr>
                          <SortHeader
                            label="Code"
                            field="driver_id"
                            sort={sort}
                            direction={direction}
                            onSort={handleSort}
                          />
                          <SortHeader
                            label="Company"
                            field="company_name"
                            sort={sort}
                            direction={direction}
                            onSort={handleSort}
                          />
                          <SortHeader
                            label="Name"
                            field="driver_name"
                            sort={sort}
                            direction={direction}
                            onSort={handleSort}
                          />
                          <SortHeader
                            label="Email / CLD"
                            field="email"
                            sort={sort}
                            direction={direction}
                            onSort={handleSort}
                          />
                          <th>Future Member List</th>
                          <th>Member List</th>
                          <th>Active</th>
                          <th>Verification Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((application) => {
                          const hosCount = application.hos_count || 0;
                          const badge = application.employment_verification_badge || {
                            text: 'N/A',
                            class: 'badge-secondary',
                          };
                          return (
                            <tr key={application.id} className="applicationrow">
                              <td>
                                <span className="app-code">{application.driver_id}</span>
                              </td>
                              <td className="app-company">
                                <a
                                  href={`https://admin.dotsafetyservice.com/companies/${application.company_id}/edit`}
                                  style={{ color: '#1f2a44', textDecoration: 'none' }}
                                >
                                  {application.company_name}
                                </a>
                              </td>
                              <td className="app-name">
                                {application.driver_name}
                                {hosCount > 0 ? (
                                  <>
                                    <br />
                                    <button
                                      type="button"
                                      className="btn btn-sm py-0 px-2 mt-1 view-hos-btn"
                                      style={{
                                        fontSize: 11,
                                        borderRadius: 999,
                                        backgroundColor: '#12357f',
                                        color: '#fff',
                                      }}
                                      onClick={() => openHosViolations(application)}
                                    >
                                      {hosCount} HOS violation{hosCount !== 1 ? 's' : ''}
                                    </button>
                                  </>
                                ) : null}
                              </td>
                              <td className="app-email">
                                {application.user ? application.user.email : 'N/A'}
                                <br />
                                <small>{application.driver_type}</small>
                              </td>
                              <td>
                                <div className="form-check form-switch d-flex justify-content-center">
                                  <input
                                    className="form-check-input future-member-toggle"
                                    type="checkbox"
                                    id={`futureMemberToggle-${application.id}`}
                                    checked={application.future_member_list === 'yes'}
                                    disabled={application._toggling === 'future'}
                                    onChange={(e) =>
                                      handleToggle(application, 'future', e.target.checked)
                                    }
                                  />
                                  <label
                                    className="form-check-label visually-hidden"
                                    htmlFor={`futureMemberToggle-${application.id}`}
                                  >
                                    Toggle Future Member
                                  </label>
                                </div>
                              </td>
                              <td>
                                <div className="form-check form-switch d-flex justify-content-center">
                                  <input
                                    className="form-check-input member-toggle"
                                    type="checkbox"
                                    id={`memberToggle-${application.id}`}
                                    checked={application.for_members === 'yes'}
                                    disabled={application._toggling === 'member'}
                                    onChange={(e) =>
                                      handleToggle(application, 'member', e.target.checked)
                                    }
                                  />
                                  <label
                                    className="form-check-label visually-hidden"
                                    htmlFor={`memberToggle-${application.id}`}
                                  >
                                    Toggle Member
                                  </label>
                                </div>
                              </td>
                              <td>
                                <div className="form-check form-switch d-flex justify-content-center">
                                  <input
                                    className="form-check-input active-toggle"
                                    type="checkbox"
                                    id={`activeToggle-${application.id}`}
                                    checked={application.is_active === 'yes'}
                                    disabled={application._toggling === 'active'}
                                    onChange={(e) =>
                                      handleToggle(application, 'active', e.target.checked)
                                    }
                                  />
                                  <label
                                    className="form-check-label visually-hidden"
                                    htmlFor={`activeToggle-${application.id}`}
                                  >
                                    Toggle Active
                                  </label>
                                </div>
                              </td>
                              <td>
                                <span className={`status-pill ${pillClassFromBadge(badge.class)}`}>
                                  {badge.text}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex align-items-center flex-nowrap">
                                  <button
                                    type="button"
                                    className="action-btn btn-login-soft"
                                    title="View Login Details"
                                    onClick={() => openLoginModal(application)}
                                  >
                                    <i className="ph-duotone ph-sign-in"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="action-btn btn-print-soft"
                                    title="Print Personal Information"
                                    onClick={() => printPersonalInfo(application.id)}
                                  >
                                    <i className="ph-duotone ph-printer"></i>
                                  </button>
                                  {application.user ? (
                                    <Link
                                      to={`/edit-form/${application.user.id}`}
                                      className="action-btn btn-edit-soft"
                                      title="Edit Application"
                                    >
                                      <i className="ph-duotone ph-pencil-simple"></i>
                                    </Link>
                                  ) : (
                                    <button
                                      className="action-btn btn-edit-soft"
                                      title="User not found"
                                      disabled
                                    >
                                      <i className="ph-duotone ph-pencil-simple"></i>
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    className="action-btn btn-logs-soft view-logs-btn"
                                    title="View Edit Logs"
                                    onClick={() => openActivityLogs(application)}
                                  >
                                    <i className="ph-duotone ph-clock-counter-clockwise"></i>
                                  </button>
                                  {canDelete ? (
                                    <button
                                      type="button"
                                      className="action-btn btn-danger-soft"
                                      title="Delete Application"
                                      onClick={() => openDeleteModal(application)}
                                    >
                                      <i className="ph-duotone ph-trash"></i>
                                    </button>
                                  ) : null}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {applications.map((application) => (
                    <div
                      key={`print-${application.id}`}
                      className="personal-info-section"
                      id={`personalInfo-${application.id}`}
                      style={{ display: 'none' }}
                    >
                      <div className="info-section mb-4">
                        <div className="row">
                          {printFields(application).map(([label, value]) => (
                            <div className="col-md-6" key={label}>
                              <div className="info-item">
                                <strong>{label}:</strong>
                                <br />
                                {value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="d-flex justify-content-between align-items-center px-3 py-3">
                    <p className="text-muted mb-0 small">
                      Showing {pagination?.from} to {pagination?.to} of {pagination?.total} results
                    </p>
                    <Pagination pagination={pagination} onPageChange={setPage} />
                  </div>
                </>
              ) : (
                <div className="text-center py-5">
                  <i
                    className="ph-duotone ph-magnifying-glass"
                    style={{ fontSize: '3rem', color: '#aab4c8' }}
                  ></i>
                  {search ? (
                    <>
                      <h5 className="mt-3">No applications found</h5>
                      <p className="text-muted">No applications match &quot;{search}&quot;</p>
                      <button type="button" className="btn btn-primary" onClick={clearSearch}>
                        <i className="ph-duotone ph-arrow-left me-1"></i> Back to all applications
                      </button>
                    </>
                  ) : (
                    <>
                      <h5 className="mt-3">No applications available</h5>
                      <p className="text-muted">No applications have been submitted yet.</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* UI Alert Overlay */}
      <div
        className={`ui-alert-overlay${uiAlert.show ? ' show' : ''}`}
        id="uiAlertOverlay"
        role="dialog"
        aria-modal="true"
        aria-hidden={!uiAlert.show}
        onClick={(e) => {
          if (e.target === e.currentTarget) setUiAlert((a) => ({ ...a, show: false }));
        }}
      >
        <div className="ui-alert-box">
          <div className="ui-alert-body">
            <div className={`ui-alert-icon ${uiAlert.type === 'success' ? 'success' : 'error'}`}>
              {uiAlert.type === 'success' ? '\u2713' : '\u2717'}
            </div>
            <p className="ui-alert-message">{uiAlert.message}</p>
          </div>
          <div className="ui-alert-footer">
            <button
              type="button"
              className="ui-alert-btn"
              onClick={() => setUiAlert((a) => ({ ...a, show: false }))}
            >
              OK
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <div className="modal fade" id="loginModal" tabIndex={-1} aria-hidden="true" ref={loginModalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Login Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <strong>Email:</strong> {loginApp?.user ? loginApp.user.email : 'N/A'}
              </div>
              <div className="mb-3">
                <strong>Password:</strong>{' '}
                {loginApp?.user?.password_text ? (
                  loginApp.user.password_text
                ) : (
                  <span className="text-muted">Password not available</span>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true" ref={deleteModalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Deletion</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">Are you sure you want to delete this application?</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={deleting}
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Logs Modal */}
      <div
        className="modal fade"
        id="activityLogsModal"
        tabIndex={-1}
        aria-hidden="true"
        ref={logsModalRef}
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h5 className="modal-title">Activity Logs</h5>
                <p className="text-muted mb-0 small">
                  {logsDriverName ? `Driver: ${logsDriverName}` : ''}
                </p>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {logsLoading ? (
                <TableSkeleton rows={5} cols={4} />
              ) : null}
              {logsError ? (
                <div className="alert alert-danger">
                  <i className="ph-duotone ph-warning-circle me-2"></i>
                  <span>{logsError}</span>
                </div>
              ) : null}
              {!logsLoading && !logsError && logs && logs.length === 0 ? (
                <div className="text-center py-5">
                  <i className="ph-duotone ph-info" style={{ fontSize: '2.5rem', color: '#aab4c8' }}></i>
                  <h6 className="mt-3">No Activity Logs Found</h6>
                  <p className="text-muted">
                    There are no recorded activities for this application yet.
                  </p>
                </div>
              ) : null}
              {!logsLoading && logs && logs.length > 0 ? (
                <>
                  <div className="mb-3 text-end">
                    <span className="badge bg-secondary">
                      {logs.length} log{logs.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="timeline">
                    {logs.map((log, idx) => {
                      const type = log.activity_type || 'default';
                      const label = ACTIVITY_LABELS[type] || 'Activity';
                      const color = ACTIVITY_COLORS[type] || ACTIVITY_COLORS.default;
                      const meta = log.metadata && typeof log.metadata === 'object' ? log.metadata : {};
                      const metaEntries = Object.entries(meta).filter(
                        ([k]) => k !== 'driver_name' && k !== 'application_id'
                      );
                      return (
                        <div className="timeline-item" key={log.id || idx}>
                          <div className="timeline-marker"></div>
                          <div className="timeline-content">
                            <div className="timeline-header">
                              <h6 className="mb-0">
                                <span
                                  className="activity-badge"
                                  style={{ background: color, color: '#fff' }}
                                >
                                  {label}
                                </span>
                              </h6>
                              <span className="timeline-time">
                                <i className="ph-duotone ph-clock me-1"></i>
                                {formatRelativeTime(log.created_at)}
                              </span>
                            </div>
                            {log.description ? (
                              <p className="timeline-description mb-2">{log.description}</p>
                            ) : null}
                            {log.old_value || log.new_value ? (
                              <div className="timeline-details">
                                {log.old_value ? (
                                  <div className="detail-row">
                                    <span className="detail-label">Previous Value:</span>
                                    <span className="detail-value">{log.old_value}</span>
                                  </div>
                                ) : null}
                                {log.new_value ? (
                                  <div className="detail-row">
                                    <span className="detail-label">New Value:</span>
                                    <span className="detail-value">{log.new_value}</span>
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                            {metaEntries.length > 0 ? (
                              <div className="mt-2">
                                {metaEntries.map(([k, v]) => (
                                  <span className="metadata-item" key={k}>
                                    <strong>{k}:</strong> {String(v)}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                            <div className="user-info">
                              <i className="ph-duotone ph-user me-1"></i>
                              <strong>{log.user_name}</strong>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HOS Violations Modal */}
      <div
        className="modal fade"
        id="hosViolationsModal"
        tabIndex={-1}
        aria-hidden="true"
        ref={hosModalRef}
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div
              className="modal-header"
              style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a6e)', color: '#fff' }}
            >
              <div>
                <h5 className="modal-title" style={{ color: '#fff' }}>
                  HOS Violations
                </h5>
                <p className="mb-0 small" style={{ color: '#90bfff' }}>
                  {hosDriverName ? `Driver: ${hosDriverName}` : ''}
                </p>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body p-0">
              {hosLoading ? (
                <TableSkeleton rows={5} cols={4} />
              ) : null}
              {hosError ? <div className="alert alert-danger m-3">{hosError}</div> : null}
              {!hosLoading && !hosError && hosRows && hosRows.length === 0 ? (
                <div className="text-center py-5">
                  <i
                    className="ph-duotone ph-check-circle"
                    style={{ fontSize: '2.5rem', color: '#aab4c8' }}
                  ></i>
                  <h6 className="mt-3">No HOS Violations Found</h6>
                </div>
              ) : null}
              {!hosLoading && hosRows && hosRows.length > 0 ? (
                <div className="p-3">
                  <div className="table-responsive">
                    <table className="table table-hover table-sm">
                      <thead style={{ background: '#f4f8ff' }}>
                        <tr>
                          <th>Source</th>
                          <th>Import</th>
                          <th>Date</th>
                          <th>Violation / Type</th>
                          <th>Tags</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hosRows.map((row, idx) => {
                          const color = SOURCE_BADGE_COLORS[row.source] || '#6b80a3';
                          let details = '';
                          if (row.source === 'motive') {
                            details = [
                              row.start ? `Start: ${row.start}` : '',
                              row.end ? `End: ${row.end}` : '',
                              row.duration_mins != null ? `Duration: ${row.duration_mins} mins` : '',
                            ]
                              .filter(Boolean)
                              .join(' \u00a0|\u00a0 ');
                          } else if (row.source === 'monarch') {
                            details = row.username ? `Username: ${row.username}` : '';
                          } else if (row.source === 'hos247') {
                            details = [
                              row.hours_drove ? `Hours Drove: ${row.hours_drove}` : '',
                              row.form_and_manner ? `Form & Manner: ${row.form_and_manner}` : '',
                            ]
                              .filter(Boolean)
                              .join(' \u00a0|\u00a0 ');
                          } else if (row.source === 'samsara') {
                            details = row.tags ? `${row.tags}` : '';
                          }
                          return (
                            <tr key={`${row.source}-${row.id || idx}`}>
                              <td>
                                <span
                                  style={{
                                    background: color,
                                    color: '#fff',
                                    padding: '2px 8px',
                                    borderRadius: 999,
                                    fontSize: 11,
                                    fontWeight: 700,
                                  }}
                                >
                                  {(row.source || '').toUpperCase()}
                                </span>
                              </td>
                              <td style={{ fontSize: 12, color: '#56627a' }}>
                                {row.import_name || ''}
                              </td>
                              <td style={{ whiteSpace: 'nowrap' }}>
                                {(row.date || '').split('T')[0]}
                              </td>
                              <td>
                                <strong>{row.violation || row.violation_type || ''}</strong>
                              </td>
                              <td style={{ fontSize: 12, color: '#56627a' }}>{details}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-muted small mb-0">
                    Showing {hosRows.length} violation{hosRows.length !== 1 ? 's' : ''}
                  </p>
                </div>
              ) : null}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

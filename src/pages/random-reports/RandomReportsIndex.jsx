import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { TableSkeleton } from '../../components/PageSkeleton';

const PAGE_STYLES = `
    :root {
        --rr-blue-950: #0d1f3c;
        --rr-blue-900: #1a3260;
        --rr-blue-700: #174ea6;
        --rr-blue-500: #3b7de9;
        --rr-blue-200: #c6ddff;
        --rr-blue-100: #d8e9ff;
        --rr-blue-50:  #f2f7ff;
        --rr-blue-25:  #f8faff;
        --rr-border:   #dde8f8;
        --rr-border-2: #e3ecfb;
        --rr-text-dark: #1f2a44;
        --rr-text-mid:  #2f3b52;
        --rr-text-muted:#6173a1;
        --rr-green:     #17a673;
        --rr-red:       #ef4444;
        --rr-shadow:    0 10px 24px rgba(22,66,145,0.08);
    }
    .rr-card {
        border: 1px solid var(--rr-border);
        box-shadow: var(--rr-shadow);
        border-radius: 12px;
        overflow: hidden;
    }
    .rr-card .card-header {
        background: #f3f8ff;
        border-bottom: 1px solid var(--rr-border-2);
        padding: 1rem 1.4rem;
    }
    .rr-title {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--rr-text-dark);
        letter-spacing: -.01em;
    }
    .rr-label {
        font-weight: 600;
        color: var(--rr-text-mid);
        margin-bottom: .5rem;
        font-size: .875rem;
    }
    .rr-required { color: var(--rr-red); }
    .rr-input,
    .rr-select {
        height: 48px;
        border: 1px solid #d8e5f8;
        border-radius: 8px;
        background: var(--rr-blue-50);
        color: var(--rr-text-dark);
        box-shadow: none;
        font-size: .9rem;
        transition: border-color .18s, box-shadow .18s, background .18s;
    }
    .rr-input:focus,
    .rr-select:focus {
        background: #fff;
        border-color: #b7cef3;
        box-shadow: 0 0 0 3px rgba(66,104,193,.13);
        outline: none;
    }
    .rr-input[readonly] { background: #edf3fc; color: var(--rr-text-muted); }
    .rr-select {
        -webkit-appearance: none;
        appearance: none;
        padding-right: 2.25rem;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364758b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right .85rem center;
        background-size: 14px;
    }
    .rr-section-title {
        color: var(--rr-text-muted);
        font-weight: 700;
        font-size: .8rem;
        text-transform: uppercase;
        letter-spacing: .06em;
        margin-bottom: .9rem;
    }
    .rr-company-row {
        border: 1px solid var(--rr-border-2);
        border-radius: 12px;
        padding: 1.25rem;
        background: var(--rr-blue-25);
        transition: box-shadow .2s;
        position: relative;
    }
    .rr-company-row:hover { box-shadow: 0 4px 16px rgba(22,66,145,.07); }
    .rr-row-badge {
        position: absolute;
        top: -1px;
        left: 1.25rem;
        background: var(--rr-blue-700);
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        padding: 2px 10px;
        border-radius: 0 0 6px 6px;
        letter-spacing: .04em;
        text-transform: uppercase;
    }
    .rr-total-wrap {
        display: inline-flex;
        align-items: center;
        gap: .4rem;
        font-size: .82rem;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 20px;
        background: #e6f9f1;
        color: var(--rr-green);
        border: 1px solid #b2e8d2;
        transition: background .2s, color .2s, border-color .2s;
    }
    .rr-total-wrap.is-error {
        background: #fef2f2;
        color: var(--rr-red);
        border-color: #fca5a5;
    }
    .rr-btn-add {
        height: 44px;
        border-radius: 8px;
        font-weight: 600;
        font-size: .875rem;
        background: var(--rr-blue-100);
        border-color: var(--rr-blue-200);
        color: var(--rr-blue-700);
        display: inline-flex;
        align-items: center;
        gap: .4rem;
        padding: 0 1.2rem;
        transition: background .18s, border-color .18s, color .18s;
    }
    .rr-btn-add:hover {
        background: #c9ddfb;
        border-color: #b7d2fb;
        color: #123f8a;
    }
    .rr-btn-generate {
        height: 44px;
        border-radius: 8px;
        font-weight: 700;
        font-size: .875rem;
        background: var(--rr-blue-700);
        border-color: var(--rr-blue-700);
        color: #fff;
        display: inline-flex;
        align-items: center;
        gap: .4rem;
        padding: 0 1.4rem;
        transition: background .18s;
    }
    .rr-btn-generate:hover { background: #123f8a; border-color: #123f8a; color: #fff; }
    .rr-btn-remove {
        height: 44px;
        min-width: 90px;
        border-radius: 8px;
        font-weight: 600;
        font-size: .82rem;
        background: #ff887e;
        border-color: #ff887e;
        color: #fff;
        transition: background .18s;
    }
    .rr-btn-remove:hover  { background: #fa6e62; border-color: #fa6e62; color: #fff; }
    .rr-btn-remove:disabled {
        background: #e2e8f0;
        border-color: #e2e8f0;
        color: #94a3b8;
        cursor: not-allowed;
    }
    .rr-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: .75rem;
        margin-top: 1.25rem;
        padding-top: 1.25rem;
        border-top: 1px solid var(--rr-border-2);
    }
    @media (max-width:768px) {
        .rr-actions { flex-direction: column; align-items: stretch; }
        .rr-btn-add, .rr-btn-generate { justify-content: center; }
    }
    .rr-history-table thead th {
        background: #f4f7fc;
        color: #405170;
        font-weight: 700;
        font-size: .8rem;
        text-transform: uppercase;
        letter-spacing: .05em;
        white-space: nowrap;
        border-color: #e5ecf7;
    }
    .rr-history-table tbody td {
        border-color: #edf2fa;
        vertical-align: middle;
        font-size: .875rem;
        color: var(--rr-text-dark);
    }
    .rr-history-table tbody tr:hover td { background: var(--rr-blue-25); }
    .rr-chip-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        border-radius: 6px;
        padding: 5px 11px;
        font-size: 11px;
        font-weight: 700;
        border: 0;
        color: #fff;
        text-decoration: none;
        letter-spacing: .02em;
        transition: opacity .15s, transform .1s;
        white-space: nowrap;
        cursor: pointer;
    }
    .rr-chip-btn:hover { opacity: .87; transform: translateY(-1px); color: #fff; }
    .rr-chip-view     { background: #1ca8dd; }
    .rr-chip-download { background: #35c67a; }
    .rr-chip-delete   { background: #ff7769; }
    .rr-chip-delete:hover { color: #fff; }
    .rr-actions-cell { display: flex; gap: 6px; flex-wrap: nowrap; align-items: center; }
    .rr-alert-success { background: #e6f9f1; border: 1px solid #b2e8d2; color: #0f6848; border-radius: 8px; }
    .rr-alert-error   { background: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; border-radius: 8px; }
    .pagination .page-link {
        border-color: var(--rr-border);
        color: var(--rr-blue-700);
        font-size: .82rem;
    }
    .pagination .page-item.active .page-link {
        background: var(--rr-blue-700);
        border-color: var(--rr-blue-700);
    }
    .rr-empty {
        text-align: center;
        padding: 3rem 1rem;
        color: var(--rr-text-muted);
    }
    .rr-empty svg { opacity: .35; margin-bottom: 1rem; }
    .rr-empty p { font-size: .9rem; margin: 0; }
`;

function emptyRow() {
  return {
    company_id: '',
    percentage: '',
    alcohol: '33.33',
    drugs: '33.33',
    both: '33.34',
    active_drivers: 0,
  };
}

function rowTotal(row) {
  return (
    (parseFloat(row.alcohol) || 0) +
    (parseFloat(row.drugs) || 0) +
    (parseFloat(row.both) || 0)
  );
}

async function downloadBlob(url, fallbackName) {
  const res = await api.get(url, { responseType: 'blob' });
  const disposition = res.headers['content-disposition'] || '';
  const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  const filename = match ? match[1].replace(/['"]/g, '') : fallbackName;
  const blobUrl = URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
}

export default function RandomReportsIndex() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);

  const [companies, setCompanies] = useState([]);
  const [reports, setReports] = useState([]);
  const [meta, setMeta] = useState(null);
  const [rows, setRows] = useState([emptyRow()]);
  const [reportName, setReportName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [flash, setFlash] = useState(null);
  const [errors, setErrors] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/random-reports', { params: { page } });
      setCompanies(data.companies || []);
      setReports(data.data || []);
      setMeta(data.meta || null);
    } catch {
      setFlash({ type: 'error', message: 'Failed to load random reports.' });
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const updateRow = (index, patch) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const fetchDriverCount = async (index, companyId) => {
    if (!companyId) {
      updateRow(index, { active_drivers: 0 });
      return;
    }
    updateRow(index, { active_drivers: '…' });
    try {
      const { data } = await api.get('/random-reports/company-drivers', {
        params: { company_id: companyId },
      });
      updateRow(index, {
        active_drivers: data.success ? data.driver_count : 0,
      });
    } catch {
      updateRow(index, { active_drivers: 0 });
    }
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (index) => {
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setErrors([]);

    for (let i = 0; i < rows.length; i += 1) {
      const total = rowTotal(rows[i]);
      if (Math.abs(total - 100) > 0.01) {
        const company = companies.find((c) => String(c.id) === String(rows[i].company_id));
        const name = company?.company_name || `Company ${i + 1}`;
        alert(
          `Test type distribution for "${name}" must total exactly 100%. Current total: ${total.toFixed(2)}%`
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/random-reports/generate', {
        report_name: reportName,
        companies: rows.map((r) => ({
          company_id: Number(r.company_id),
          percentage: Number(r.percentage),
          alcohol: Number(r.alcohol),
          drugs: Number(r.drugs),
          both: Number(r.both),
        })),
      });
      if (data.success) {
        navigate(`/random-reports/${data.report_id}`, {
          state: { success: data.message },
        });
      } else {
        setFlash({ type: 'error', message: data.message || 'Failed to generate report.' });
      }
    } catch (err) {
      const msgs = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat()
        : [err.response?.data?.message || 'Failed to generate report.'];
      setErrors(msgs);
      setFlash({ type: 'error', message: msgs[0] });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Delete this report? This cannot be undone.')) return;
    try {
      const { data } = await api.delete(`/random-reports/${reportId}`);
      setFlash({ type: 'success', message: data.message || 'Random report deleted successfully!' });
      load();
    } catch {
      setFlash({ type: 'error', message: 'Failed to delete report.' });
    }
  };

  const handleDownloadAll = async (reportId) => {
    try {
      await downloadBlob(
        `/random-reports/${reportId}/download-all`,
        `random_report_${reportId}_all_companies.zip`
      );
    } catch {
      setFlash({ type: 'error', message: 'Failed to download PDFs.' });
    }
  };

  const goPage = (p) => {
    const params = new URLSearchParams(searchParams);
    if (p <= 1) params.delete('page');
    else params.set('page', String(p));
    setSearchParams(params);
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
                      Random Reports
                    </li>
                  </ul>
                </div>
                <div className="col-md-12">
                  <div className="page-header-title">
                    <h2 className="mb-0">Random Reports</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {flash?.type === 'success' && (
            <div className="alert rr-alert-success mb-3 px-4 py-3">
              <i className="ph-duotone ph-check-circle me-2" />
              {flash.message}
            </div>
          )}
          {flash?.type === 'error' && (
            <div className="alert rr-alert-error mb-3 px-4 py-3">
              <i className="ph-duotone ph-warning-circle me-2" />
              {flash.message}
            </div>
          )}
          {errors.length > 0 && (
            <div className="alert rr-alert-error mb-3 px-4 py-3">
              <ul className="mb-0 ps-3">
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="card rr-card mb-4">
            <div className="card-header">
              <h5 className="rr-title">Generate New Random Report</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleGenerate} id="randomReportForm">
                <div className="row g-3 mb-4">
                  <div className="col-lg-12">
                    <label className="rr-label" htmlFor="report_name">
                      Report Name <span className="rr-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="report_name"
                      name="report_name"
                      className="form-control rr-input"
                      placeholder="e.g. Random Selection 2nd Quarter 2026"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div id="companyRows">
                  {rows.map((row, idx) => {
                    const total = Number(rowTotal(row).toFixed(2));
                    const ok = Math.abs(total - 100) <= 0.01;
                    return (
                      <div key={idx} className="rr-company-row mb-3" data-row={idx}>
                        <span className="rr-row-badge">Company {idx + 1}</span>
                        <h6 className="rr-section-title mt-3">
                          Company Selection &amp; Configuration
                        </h6>
                        <div className="row g-3">
                          <div className="col-xl-4 col-lg-6">
                            <label className="rr-label">
                              Company <span className="rr-required">*</span>
                            </label>
                            <select
                              className="form-select rr-select company-select"
                              name={`companies[${idx}][company_id]`}
                              required
                              style={{ width: '100%' }}
                              value={row.company_id}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateRow(idx, { company_id: val });
                                fetchDriverCount(idx, val);
                              }}
                            >
                              <option value="">Select Company</option>
                              {companies.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.company_name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-xl-3 col-lg-6">
                            <label className="rr-label">
                              Driver Selection (%) <span className="rr-required">*</span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              className="form-control rr-input"
                              name={`companies[${idx}][percentage]`}
                              required
                              value={row.percentage}
                              onChange={(e) => updateRow(idx, { percentage: e.target.value })}
                            />
                          </div>
                          <div className="col-xl-3 col-lg-6">
                            <label className="rr-label">Active Drivers</label>
                            <input
                              type="text"
                              value={row.active_drivers}
                              className="form-control rr-input active-drivers"
                              readOnly
                            />
                          </div>
                          <div className="col-xl-2 col-lg-6 d-flex align-items-end">
                            <button
                              type="button"
                              className="btn rr-btn-remove remove-company"
                              disabled={rows.length === 1}
                              onClick={() => removeRow(idx)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <h6 className="rr-section-title mt-4">
                          Test Type Distribution for this Company (%)
                        </h6>
                        <div className="row g-3">
                          <div className="col-md-4">
                            <label className="rr-label">
                              Alcohol <span className="rr-required">*</span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              className="form-control rr-input alcohol-input"
                              name={`companies[${idx}][alcohol]`}
                              required
                              value={row.alcohol}
                              onChange={(e) => updateRow(idx, { alcohol: e.target.value })}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="rr-label">
                              Drugs <span className="rr-required">*</span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              className="form-control rr-input drugs-input"
                              name={`companies[${idx}][drugs]`}
                              required
                              value={row.drugs}
                              onChange={(e) => updateRow(idx, { drugs: e.target.value })}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="rr-label">
                              Both <span className="rr-required">*</span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              className="form-control rr-input both-input"
                              name={`companies[${idx}][both]`}
                              required
                              value={row.both}
                              onChange={(e) => updateRow(idx, { both: e.target.value })}
                            />
                          </div>
                          <div className="col-12">
                            <span className={`rr-total-wrap${ok ? '' : ' is-error'}`}>
                              <i
                                className={`ph-duotone ${ok ? 'ph-check-circle' : 'ph-warning-circle'}`}
                              />
                              Total:{' '}
                              <strong className="rr-total-value">{total.toFixed(2)}%</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="rr-actions">
                  <button type="button" className="btn rr-btn-add" id="addCompany" onClick={addRow}>
                    <i className="ph-duotone ph-plus-circle" />
                    Add Another Company
                  </button>
                  <button type="submit" className="btn rr-btn-generate" disabled={submitting}>
                    <i className="ph-duotone ph-file-arrow-up" />
                    {submitting ? 'Generating...' : 'Generate Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card rr-card">
            <div className="card-header">
              <h5 className="rr-title">Previous Reports</h5>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <TableSkeleton rows={8} cols={5} />
              ) : reports.length > 0 ? (
                <div className="table-responsive">
                  <table className="table rr-history-table mb-0">
                    <thead>
                      <tr>
                        <th>Report Name</th>
                        <th>Generated Date</th>
                        <th>Generated By</th>
                        <th>Total Drivers</th>
                        <th>Companies</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report) => {
                        const cnt = report.companies_count || 0;
                        return (
                          <tr key={report.id}>
                            <td>{report.report_name}</td>
                            <td>{report.generated_at_formatted}</td>
                            <td>{report.generated_by}</td>
                            <td>{report.total_drivers_selected}</td>
                            <td>
                              {cnt} {cnt === 1 ? 'company' : 'companies'}
                            </td>
                            <td>
                              <div className="rr-actions-cell">
                                <Link
                                  to={`/random-reports/${report.id}`}
                                  className="rr-chip-btn rr-chip-view"
                                >
                                  <i className="ph-duotone ph-eye" /> View
                                </Link>
                                <button
                                  type="button"
                                  className="rr-chip-btn rr-chip-download"
                                  onClick={() => handleDownloadAll(report.id)}
                                >
                                  <i className="ph-duotone ph-download-simple" /> Download All PDFs
                                </button>
                                <button
                                  type="button"
                                  className="rr-chip-btn rr-chip-delete"
                                  onClick={() => handleDelete(report.id)}
                                >
                                  <i className="ph-duotone ph-trash" /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rr-empty">
                  <svg
                    width="48"
                    height="48"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#6173a1"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-3-3v6M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM19.5 17.625a4.125 4.125 0 11-8.25 0 4.125 4.125 0 018.25 0z"
                    />
                  </svg>
                  <p>No reports generated yet. Use the form above to create your first report.</p>
                </div>
              )}
            </div>
            {meta && meta.total > 0 && (
              <div
                className="card-footer bg-white border-top"
                style={{ borderColor: 'var(--rr-border-2)' }}
              >
                <ul className="pagination mb-0 justify-content-end">
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
                  {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === meta.last_page ||
                        Math.abs(p - meta.current_page) <= 2
                    )
                    .map((p) => (
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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

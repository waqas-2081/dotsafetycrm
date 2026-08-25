import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import api from '../../services/api';
import PageSkeleton from '../../components/PageSkeleton';

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
        --rr-yellow:    #d97706;
        --rr-cyan:      #0891b2;
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
    .rr-meta-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 1rem;
        padding: 1.25rem 1.4rem;
        background: var(--rr-blue-25);
        border-bottom: 1px solid var(--rr-border-2);
    }
    .rr-meta-label {
        font-size: .72rem;
        font-weight: 700;
        color: var(--rr-text-muted);
        text-transform: uppercase;
        letter-spacing: .07em;
        margin-bottom: .3rem;
    }
    .rr-meta-value {
        font-size: .95rem;
        font-weight: 700;
        color: var(--rr-text-dark);
    }
    .rr-btn-back {
        height: 40px;
        border-radius: 8px;
        font-weight: 600;
        font-size: .82rem;
        background: var(--rr-blue-50);
        border: 1px solid var(--rr-border);
        color: var(--rr-text-muted);
        display: inline-flex;
        align-items: center;
        gap: .4rem;
        padding: 0 1rem;
        text-decoration: none;
        transition: background .18s, color .18s;
    }
    .rr-btn-back:hover { background: #e8f0fc; color: var(--rr-blue-700); }
    .rr-btn-dl {
        height: 40px;
        border-radius: 8px;
        font-weight: 700;
        font-size: .82rem;
        background: var(--rr-green);
        border: 1px solid var(--rr-green);
        color: #fff;
        display: inline-flex;
        align-items: center;
        gap: .4rem;
        padding: 0 1.1rem;
        text-decoration: none;
        transition: background .18s;
        cursor: pointer;
    }
    .rr-btn-dl:hover { background: #139e6c; color: #fff; }
    .rr-btn-dl-sm {
        height: 36px;
        border-radius: 7px;
        font-weight: 700;
        font-size: .78rem;
        background: var(--rr-blue-700);
        border: 1px solid var(--rr-blue-700);
        color: #fff;
        display: inline-flex;
        align-items: center;
        gap: .35rem;
        padding: 0 .9rem;
        text-decoration: none;
        transition: background .18s;
        cursor: pointer;
    }
    .rr-btn-dl-sm:hover { background: #123f8a; color: #fff; }
    .rr-summary-bar {
        padding: .9rem 1.4rem;
        border-bottom: 1px solid var(--rr-border-2);
    }
    .rr-stats { display: flex; gap: .75rem; flex-wrap: wrap; }
    .rr-stat {
        display: flex;
        align-items: center;
        gap: .5rem;
        padding: .45rem .9rem;
        border-radius: 8px;
        font-size: .82rem;
        font-weight: 600;
        border: 1px solid transparent;
    }
    .rr-stat-alcohol { background: #fef2f2; border-color: #fca5a5; color: #991b1b; }
    .rr-stat-drugs   { background: #fffbeb; border-color: #fcd34d; color: #92400e; }
    .rr-stat-both    { background: #ecfeff; border-color: #a5f3fc; color: #155e75; }
    .rr-stat-total   { background: #f0fdf4; border-color: #86efac; color: #166534; }
    .rr-stat-number  { font-size: 1.05rem; font-weight: 800; }
    .rr-company-card {
        border: 1px solid var(--rr-border);
        border-radius: 12px;
        box-shadow: var(--rr-shadow);
        overflow: hidden;
        margin-bottom: 1.25rem;
    }
    .rr-company-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem 1.4rem;
        background: #f3f8ff;
        border-bottom: 1px solid var(--rr-border-2);
        flex-wrap: wrap;
    }
    .rr-company-name {
        font-size: 1rem;
        font-weight: 700;
        color: var(--rr-text-dark);
        margin: 0;
    }
    .rr-company-meta {
        font-size: .75rem;
        color: var(--rr-text-muted);
        margin: .2rem 0 0;
        line-height: 1.5;
    }
    .rr-drivers-table thead th {
        background: #f4f7fc;
        color: #405170;
        font-weight: 700;
        font-size: .78rem;
        text-transform: uppercase;
        letter-spacing: .05em;
        white-space: nowrap;
        border-color: #e5ecf7;
        padding: .75rem 1rem;
    }
    .rr-drivers-table tbody td {
        border-color: #edf2fa;
        vertical-align: middle;
        font-size: .875rem;
        color: var(--rr-text-dark);
        padding: .7rem 1rem;
    }
    .rr-drivers-table tbody tr:hover td { background: var(--rr-blue-25); }
    .rr-empty-row td {
        text-align: center;
        color: var(--rr-text-muted);
        font-style: italic;
        font-size: .85rem;
        padding: 1.5rem 1rem !important;
        background: var(--rr-blue-25) !important;
    }
    .rr-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        border-radius: 5px;
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: .05em;
        white-space: nowrap;
    }
    .rr-badge-alcohol { background: #dc3545; color: #fff; }
    .rr-badge-drugs   { background: #ffc107; color: #212529; }
    .rr-badge-both    { background: #0891b2; color: #fff; }
    .rr-alert-success {
        background: #e6f9f1;
        border: 1px solid #b2e8d2;
        color: #0f6848;
        border-radius: 8px;
    }
`;

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

function TestBadge({ type }) {
  if (type === 'alcohol') {
    return <span className="rr-badge rr-badge-alcohol">Alcohol Test</span>;
  }
  if (type === 'drugs') {
    return <span className="rr-badge rr-badge-drugs">Drug Test</span>;
  }
  if (type === 'both') {
    return <span className="rr-badge rr-badge-both">Both Tests</span>;
  }
  return null;
}

export default function RandomReportsShow() {
  const { id } = useParams();
  const location = useLocation();
  const [report, setReport] = useState(null);
  const [overall, setOverall] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState(() =>
    location.state?.success ? { type: 'success', message: location.state.success } : null
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/random-reports/${id}`);
      setReport(data.report);
      setOverall(data.overall);
      setCompanies(data.companies || []);
    } catch {
      setFlash({ type: 'error', message: 'Failed to load report.' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDownloadAll = async () => {
    try {
      await downloadBlob(
        `/random-reports/${id}/download-all`,
        `random_report_${id}_all_companies.zip`
      );
    } catch {
      setFlash({ type: 'error', message: 'Failed to download PDFs.' });
    }
  };

  const handleDownloadPdf = async (companyName) => {
    try {
      await downloadBlob(
        `/random-reports/${id}/pdf?company=${encodeURIComponent(companyName)}`,
        `random_report_${id}_${companyName}.pdf`
      );
    } catch {
      setFlash({ type: 'error', message: 'Failed to download PDF.' });
    }
  };

  if (loading) {
    return <PageSkeleton variant="detail" />;
  }

  if (!report) {
    return (
      <div className="pc-container">
        <div className="pc-content py-5 text-center text-muted">Report not found.</div>
      </div>
    );
  }

  const cnt = report.companies_count || 0;

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
                    <li className="breadcrumb-item">
                      <Link to="/random-reports">Random Reports</Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      {report.report_name}
                    </li>
                  </ul>
                </div>
                <div className="col-md-12">
                  <div className="page-header-title">
                    <h2 className="mb-0">{report.report_name}</h2>
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

          <div className="card rr-card mb-4">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
              <h5 className="rr-title">Report Summary</h5>
              <div className="d-flex gap-2 flex-wrap">
                <button type="button" className="rr-btn-dl" onClick={handleDownloadAll}>
                  <i className="ph-duotone ph-download-simple" />
                  Download All PDFs
                </button>
                <Link to="/random-reports" className="rr-btn-back">
                  <i className="ph-duotone ph-arrow-left" />
                  Back to Reports
                </Link>
              </div>
            </div>

            <div className="rr-meta-grid">
              <div className="rr-meta-item">
                <div className="rr-meta-label">Generated Date</div>
                <div className="rr-meta-value">{report.generated_at_date}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--rr-text-muted)' }}>
                  {report.generated_at_time}
                </div>
              </div>
              <div className="rr-meta-item">
                <div className="rr-meta-label">Generated By</div>
                <div className="rr-meta-value">{report.generated_by}</div>
              </div>
              <div className="rr-meta-item">
                <div className="rr-meta-label">Total Drivers Selected</div>
                <div className="rr-meta-value">{report.total_drivers_selected}</div>
              </div>
              <div className="rr-meta-item">
                <div className="rr-meta-label">Companies Included</div>
                <div className="rr-meta-value">
                  {cnt} {cnt === 1 ? 'Company' : 'Companies'}
                </div>
              </div>
              <div className="rr-meta-item">
                <div className="rr-meta-label">Report ID</div>
                <div className="rr-meta-value" style={{ fontFamily: 'monospace' }}>
                  #{report.id}
                </div>
              </div>
            </div>

            <div className="rr-summary-bar">
              <div className="rr-meta-label mb-2">Overall Test Distribution</div>
              <div className="rr-stats">
                <div className="rr-stat rr-stat-alcohol">
                  <span className="rr-stat-number">{overall?.alcohol ?? 0}</span>
                  <span>Alcohol Tests</span>
                </div>
                <div className="rr-stat rr-stat-drugs">
                  <span className="rr-stat-number">{overall?.drugs ?? 0}</span>
                  <span>Drug Tests</span>
                </div>
                <div className="rr-stat rr-stat-both">
                  <span className="rr-stat-number">{overall?.both ?? 0}</span>
                  <span>Both Tests</span>
                </div>
                <div className="rr-stat rr-stat-total">
                  <span className="rr-stat-number">{report.total_drivers_selected}</span>
                  <span>Total Drivers</span>
                </div>
              </div>
            </div>
          </div>

          {companies.map((company) => {
            const drivers = company.drivers || [];
            return (
              <div className="rr-company-card" key={company.company_name}>
                <div className="rr-company-header">
                  <div>
                    <h5 className="rr-company-name">{company.company_name}</h5>
                    <p className="rr-company-meta">
                      {drivers.length} driver(s) selected for testing
                      &nbsp;·&nbsp;
                      Selection rate: <strong>{company.percentage}%</strong>
                      &nbsp;·&nbsp;
                      Distribution: Alcohol <strong>{company.alcohol}%</strong>, Drugs{' '}
                      <strong>{company.drugs}%</strong>, Both <strong>{company.both}%</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rr-btn-dl-sm"
                    onClick={() => handleDownloadPdf(company.company_name)}
                  >
                    <i className="ph-duotone ph-file-pdf" />
                    Download PDF
                  </button>
                </div>

                <div className="rr-summary-bar">
                  <div className="rr-stats">
                    <div className="rr-stat rr-stat-alcohol">
                      <span className="rr-stat-number">{company.alcohol_count}</span>
                      <span>Alcohol</span>
                    </div>
                    <div className="rr-stat rr-stat-drugs">
                      <span className="rr-stat-number">{company.drugs_count}</span>
                      <span>Drugs</span>
                    </div>
                    <div className="rr-stat rr-stat-both">
                      <span className="rr-stat-number">{company.both_count}</span>
                      <span>Both</span>
                    </div>
                    <div className="rr-stat rr-stat-total">
                      <span className="rr-stat-number">{drivers.length}</span>
                      <span>Total</span>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table rr-drivers-table mb-0">
                    <thead>
                      <tr>
                        <th width="4%">#</th>
                        <th width="22%">Driver Name</th>
                        <th width="17%">Phone</th>
                        <th width="30%">Address</th>
                        <th width="15%">Driver Type</th>
                        <th width="12%">Test Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drivers.length === 0 ? (
                        <tr className="rr-empty-row">
                          <td colSpan={6}>
                            No drivers selected for this company (0% selection rate)
                          </td>
                        </tr>
                      ) : (
                        drivers.map((driver) => (
                          <tr key={`${company.company_name}-${driver.index}`}>
                            <td className="text-muted" style={{ fontSize: '.78rem' }}>
                              {driver.index}
                            </td>
                            <td style={{ fontWeight: 600 }}>{driver.driver_name}</td>
                            <td>{driver.driver_phone}</td>
                            <td style={{ fontSize: '.82rem', color: 'var(--rr-text-muted)' }}>
                              {driver.driver_address}
                            </td>
                            <td style={{ fontSize: '.82rem' }}>{driver.driver_type}</td>
                            <td>
                              <TestBadge type={driver.test_type} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

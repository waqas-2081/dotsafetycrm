import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { TableSkeleton } from '../components/PageSkeleton';

const PAGE_STYLES = `
  .sms-card { border: 1px solid #dfe8f7; box-shadow: 0 8px 24px rgba(17,54,126,0.06); }
  .sms-toolbar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; padding:1rem 1.25rem; border-bottom:1px solid #e8eef9; }
  .sms-search-wrap { position:relative; max-width:280px; width:100%; }
  .sms-search-wrap .sms-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#9aaccc; pointer-events:none; }
  .sms-search-wrap input { padding-left:32px; border-radius:8px; border:1px solid #dde6f5; background:#f7faff; color:#3a4d72; font-size:14px; height:38px; }
  .sms-search-wrap input:focus { border-color:#8db0e8; box-shadow:0 0 0 3px rgba(100,150,220,0.12); background:#fff; outline:none; }
  .sms-filter-select { border-radius:8px; border:1px solid #dde6f5; background:#f7faff; color:#3a4d72; font-size:14px; padding:0.4rem 0.75rem; height:38px; }
  .sms-table-wrap { overflow-x:auto; }
  .sms-table { min-width:980px; margin-bottom:0; }
  .sms-table thead th { background:#f3f8ff; color:#42506b; font-weight:600; border-color:#e3ebf8; white-space:nowrap; }
  .sms-table tbody td { border-color:#edf2fa; color:#4a5873; vertical-align:middle; }
  .sms-table tbody tr:hover { background:#f9fcff; }
  .sms-phone { font-weight:700; color:#1e3260; font-variant-numeric:tabular-nums; white-space:nowrap; }
  .sms-driver { font-weight:600; color:#2c3a55; }
  .sms-driver a { color:#184da8; text-decoration:none; }
  .sms-driver a:hover { text-decoration:underline; }
  .sms-body { max-width:360px; font-size:13px; line-height:1.45; color:#3a4d72; white-space:pre-wrap; word-break:break-word; }
  .sms-time { white-space:nowrap; font-size:13px; color:#5f6e8d; }
  .sms-badge { display:inline-flex; align-items:center; padding:0.2rem 0.55rem; border-radius:20px; font-size:11px; font-weight:700; text-transform:capitalize; border:1px solid transparent; }
  .sms-badge-delivered, .sms-badge-sent { background:#e6f9f1; color:#1a8a5a; border-color:#b6e8d4; }
  .sms-badge-queued, .sms-badge-sending { background:#fff8e6; color:#9a6b00; border-color:#f0d080; }
  .sms-badge-delivery_failed, .sms-badge-sending_failed, .sms-badge-failed { background:#fef2f2; color:#b94040; border-color:#f5c6c6; }
  .sms-badge-outbound { background:#eef4ff; color:#184da8; border-color:#c6dcff; }
  .sms-badge-inbound { background:#f3eefc; color:#6b3fa0; border-color:#dbcaf5; }
  .sms-footer { display:flex; align-items:center; justify-content:space-between; gap:0.75rem; padding:1rem; border-top:1px solid #e8eef9; flex-wrap:wrap; }
  .sms-note { font-size:12px; color:#6b80a3; padding:0 1.25rem 1rem; }
  .sms-empty { padding:3rem 1.5rem; text-align:center; color:#6b80a3; }
`;

function statusClass(status) {
  const s = String(status || '').toLowerCase().replace(/\s+/g, '_');
  if (['delivered', 'sent'].includes(s)) return 'sms-badge-delivered';
  if (['queued', 'sending', 'sending_started'].includes(s)) return 'sms-badge-queued';
  if (s.includes('fail') || s.includes('error')) return 'sms-badge-delivery_failed';
  return 'sms-badge-queued';
}

export default function SmsLogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const direction = searchParams.get('direction') || 'outbound';
  const page = Number(searchParams.get('page') || 1);

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [telnyx, setTelnyx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState(search);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/sms-logs', {
        params: {
          search: search || undefined,
          direction: direction || undefined,
          page,
        },
      });
      setRows(data.data || []);
      setMeta(data.meta || null);
      setTelnyx(data.telnyx || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load SMS logs.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [search, direction, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput === search) return;
      const next = new URLSearchParams(searchParams);
      if (searchInput) next.set('search', searchInput);
      else next.delete('search');
      next.set('page', '1');
      setSearchParams(next);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  const goPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
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
                      SMS Logs
                    </li>
                  </ul>
                </div>
                <div className="col-md-12">
                  <div className="page-header-title">
                    <h2 className="mb-0">SMS Logs</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error ? <div className="alert alert-danger">{error}</div> : null}

          <div className="card sms-card">
            <div className="sms-toolbar">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="sms-search-wrap">
                  <i className="ph-duotone ph-magnifying-glass sms-search-icon" />
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search phone, driver, message…"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <select
                  className="sms-filter-select"
                  value={direction}
                  onChange={(e) => setParam('direction', e.target.value)}
                >
                  <option value="outbound">Outbound</option>
                  <option value="inbound">Inbound</option>
                  <option value="">All directions</option>
                </select>
              </div>
              <div className="text-muted small">
                {telnyx?.from_number ? (
                  <>
                    From number: <strong>{telnyx.from_number}</strong>
                  </>
                ) : (
                  'Telnyx from-number not configured'
                )}
              </div>
            </div>

            {loading ? (
              <div className="p-3">
                <TableSkeleton rows={8} cols={6} />
              </div>
            ) : rows.length === 0 ? (
              <div className="sms-empty">
                <p className="mb-1 fw-semibold">No SMS logs yet</p>
                <p className="mb-0 small">
                  Messages appear here when Telnyx accepts a send (API response) and when delivery
                  webhooks update status.
                </p>
              </div>
            ) : (
              <div className="sms-table-wrap">
                <table className="table table-hover sms-table">
                  <thead>
                    <tr>
                      <th>Date / Time</th>
                      <th>To</th>
                      <th>Linked user</th>
                      <th>Direction</th>
                      <th>Status</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td className="sms-time">{row.sent_at || '—'}</td>
                        <td className="sms-phone">{row.to_number || '—'}</td>
                        <td className="sms-driver">
                          {row.user_id ? (
                            <Link to={`/edit-form/${row.user_id}`}>
                              {row.driver_name || `User #${row.user_id}`}
                            </Link>
                          ) : (
                            row.driver_name || <span className="text-muted">Not linked</span>
                          )}
                        </td>
                        <td>
                          <span className={`sms-badge sms-badge-${row.direction || 'outbound'}`}>
                            {row.direction || 'outbound'}
                          </span>
                        </td>
                        <td>
                          <span className={`sms-badge ${statusClass(row.status)}`}>
                            {row.status || 'unknown'}
                          </span>
                        </td>
                        <td>
                          <div className="sms-body">{row.body || '—'}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {meta && meta.total > 0 ? (
              <div className="sms-footer">
                <div className="text-muted small">
                  Showing {meta.from}–{meta.to} of {meta.total}
                </div>
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item${meta.current_page <= 1 ? ' disabled' : ''}`}>
                      <button
                        type="button"
                        className="page-link"
                        disabled={meta.current_page <= 1}
                        onClick={() => goPage(meta.current_page - 1)}
                      >
                        Prev
                      </button>
                    </li>
                    <li className="page-item disabled">
                      <span className="page-link">
                        {meta.current_page} / {meta.last_page}
                      </span>
                    </li>
                    <li className={`page-item${meta.current_page >= meta.last_page ? ' disabled' : ''}`}>
                      <button
                        type="button"
                        className="page-link"
                        disabled={meta.current_page >= meta.last_page}
                        onClick={() => goPage(meta.current_page + 1)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            ) : null}

            {telnyx?.note ? <p className="sms-note mb-0">{telnyx.note}</p> : null}
          </div>
        </div>
      </div>
    </>
  );
}

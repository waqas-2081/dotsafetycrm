import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { TableSkeleton } from '../../components/PageSkeleton';

const PAGE_STYLES = `
        .pm-card { border: 1px solid #dfe8f7; box-shadow: 0 8px 24px rgba(17,54,126,0.06); }
        .pm-table-wrap { overflow-x: auto; overflow-y: hidden; scrollbar-width: thin; scrollbar-color: #c5cfdd transparent; }
        .pm-table-wrap::-webkit-scrollbar { height: 8px; }
        .pm-table-wrap::-webkit-scrollbar-track { background: transparent; }
        .pm-table-wrap::-webkit-scrollbar-thumb { background: linear-gradient(90deg, #cdd6e4 0%, #b8c4d6 100%); border-radius: 20px; }
        .pm-table { min-width: 1080px; margin-bottom: 0; }
        .pm-table thead th { background: #f3f8ff; color: #42506b; font-weight: 600; border-color: #e3ebf8; white-space: nowrap; border-right: 1px solid #dfe8f7; }
        .pm-table tbody td { border-color: #edf2fa; color: #4a5873; vertical-align: middle; border-right: 1px solid #e6edf9; }
        .pm-table thead th:first-child, .pm-table tbody td:first-child { border-left: 1px solid #dfe8f7; }
        .pm-table thead th:last-child, .pm-table tbody td:last-child { border-right: 1px solid #dfe8f7; }
        .pm-table tbody tr:hover { background: #f9fcff; }
        .pm-index { width: 54px; color: #6b7892; font-weight: 600; }
        .pm-name { font-weight: 600; color: #2c3a55; }
        .pm-email { white-space: nowrap; }
        .pm-badge { display: inline-flex; align-items: center; justify-content: center; padding: 0.2rem 0.45rem; border-radius: 6px; background: #13a5c5; color: #fff; font-size: 11px; font-weight: 700; }
        .pm-spent { color: #1ea56f; font-weight: 700; white-space: nowrap; }
        .pm-action { width: 34px; height: 34px; border: 0; border-radius: 6px; background: #113f93; color: #fff; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; }
        .pm-action:hover { background: #0b2f6f; color: #fff; }
        .pm-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 1rem; border-top: 1px solid #e8eef9; background: #fff; flex-wrap: wrap; }
        .pm-result { color: #5f6e8d; font-weight: 600; }
        .pm-pagination .page-link { color: #55698e; border-color: #e3ebf8; background: #f9fbff; font-weight: 600; }
        .pm-pagination .page-item.active .page-link { background: #dbeaff; border-color: #c6dcff; color: #184da8; }
        .pm-pagination .page-item.disabled .page-link { color: #aab4c8; }
`;

function formatMoney(n) {
  return Number(n || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function MembersIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const [members, setMembers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/members', { params: { page } });
      setMembers(data.data || []);
      setMeta(data.meta || null);
    } catch {
      setFlash({ type: 'error', message: 'Failed to load members.' });
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

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
                      Paid Members
                    </li>
                  </ul>
                </div>
                <div className="col-md-12">
                  <div className="page-header-title">
                    <h2 className="mb-0">Paid Members</h2>
                    <p className="text-muted mb-0">Manage and view member activities</p>
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

          <div className="card pm-card">
            <div className="card-body p-0">
              <div className="pm-table-wrap">
                <table className="table pm-table">
                  <thead>
                    <tr>
                      <th className="pm-index">Serial No</th>
                      <th>Member Name</th>
                      <th>Email</th>
                      <th>Join Date</th>
                      <th>Total Reveals</th>
                      <th>Total Spent</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="p-0">
                          <TableSkeleton rows={8} cols={6} />
                        </td>
                      </tr>
                    ) : members.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-5">
                          <i
                            className="ph-duotone ph-users"
                            style={{ fontSize: '2.5rem', color: '#b0bad0' }}
                          />
                          <p className="mt-2 mb-0 text-muted">No paid members found.</p>
                        </td>
                      </tr>
                    ) : (
                      members.map((member, idx) => {
                        const serial =
                          ((meta?.current_page || 1) - 1) * (meta?.per_page || 20) + idx + 1;
                        return (
                          <tr key={member.id}>
                            <td className="pm-index">{serial}</td>
                            <td className="pm-name">{member.name}</td>
                            <td className="pm-email">{member.email}</td>
                            <td>{member.created_at_formatted}</td>
                            <td>
                              <span className="pm-badge">
                                {member.total_reveals ?? 0} reveals
                              </span>
                            </td>
                            <td className="pm-spent">${formatMoney(member.total_spent)}</td>
                            <td>
                              <Link
                                to={`/members/${member.id}/history`}
                                className="pm-action"
                                title="View History"
                              >
                                <i className="ph-duotone ph-eye" />
                              </Link>
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
              <div className="pm-footer">
                <span className="pm-result">
                  Showing {meta.from}–{meta.to} of {meta.total} results
                </span>
                <nav>
                  <ul className="pagination pm-pagination mb-0">
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
    </>
  );
}

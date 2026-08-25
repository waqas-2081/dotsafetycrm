import { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import PageSkeleton from '../../components/PageSkeleton';

const PROFILE_IMG_URL = import.meta.env.VITE_PROFILE_IMG_URL || '';

const PAGE_STYLES = `
        .pm-card { border: 1px solid #dfe8f7; box-shadow: 0 8px 24px rgba(17,54,126,0.06); }
        .pm-info-box {
            display: flex;
            align-items: center;
            gap: 1.25rem;
            padding: 1.5rem;
            border-bottom: 1px solid #e8eef9;
            flex-wrap: wrap;
        }
        .pm-avatar {
            width: 64px; height: 64px;
            border-radius: 50%;
            background: linear-gradient(135deg, #113f93 0%, #13a5c5 100%);
            display: flex; align-items: center; justify-content: center;
            font-size: 26px; color: #fff; font-weight: 700;
            flex-shrink: 0; overflow: hidden;
        }
        .pm-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
        .pm-info-name { font-size: 1.15rem; font-weight: 700; color: #2a3955; margin-bottom: 0.15rem; }
        .pm-info-email { color: #60708f; font-size: 0.875rem; }
        .pm-info-meta { display: flex; gap: 0.5rem; margin-top: 0.4rem; flex-wrap: wrap; }
        .pm-tag { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 11px; font-weight: 700; }
        .pm-tag-blue  { background: #e8f0ff; color: #184da8; }
        .pm-tag-teal  { background: #e0f7fb; color: #0e7a93; }
        .pm-tag-green { background: #e3f9f0; color: #1a8057; }
        .pm-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 1rem;
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid #e8eef9;
        }
        .pm-stat { background: #f7faff; border: 1px solid #e3ebf8; border-radius: 10px; padding: 1rem 1.1rem; }
        .pm-stat-label { font-size: 11px; font-weight: 600; color: #7a8ba8; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.35rem; }
        .pm-stat-value { font-size: 1.5rem; font-weight: 700; color: #2a3955; line-height: 1; }
        .pm-stat-value.green { color: #1ea56f; }
        .pm-tabs-wrap {
            padding: 1rem 1.5rem 0;
            border-bottom: 1px solid #e8eef9;
            background: #f7faff;
        }
        .pm-tabs.nav-tabs {
            border: none;
            gap: 0.25rem;
        }
        .pm-tabs .nav-link {
            border: 1px solid transparent;
            border-radius: 8px 8px 0 0;
            color: #5c6f8f;
            background: transparent;
            padding: 0.6rem 1.1rem;
            font-weight: 600;
            font-size: 0.875rem;
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            transition: all 0.15s;
            cursor: pointer;
            text-decoration: none;
        }
        .pm-tabs .nav-link:hover { background: #eef4ff; color: #1f4f99; border-color: #d5e4ff; }
        .pm-tabs .nav-link.active {
            background: #fff;
            border-color: #dbe7fa #dbe7fa #fff;
            color: #174ea6;
            box-shadow: 0 -2px 6px rgba(17,63,147,0.06);
        }
        .pm-tab-badge {
            display: inline-flex; align-items: center; justify-content: center;
            padding: 0.1rem 0.45rem; border-radius: 5px;
            font-size: 10px; font-weight: 700;
        }
        .pm-tab-badge-teal  { background: #13a5c5; color: #fff; }
        .pm-tab-badge-amber { background: #ffc107; color: #212529; }
        .pm-table-wrap { overflow-x: auto; overflow-y: hidden; scrollbar-width: thin; scrollbar-color: #c5cfdd transparent; }
        .pm-table-wrap::-webkit-scrollbar { height: 8px; }
        .pm-table-wrap::-webkit-scrollbar-track { background: transparent; }
        .pm-table-wrap::-webkit-scrollbar-thumb { background: linear-gradient(90deg,#cdd6e4 0%,#b8c4d6 100%); border-radius: 20px; }
        .pm-table { min-width: 760px; margin-bottom: 0; }
        .pm-table thead th { background: #f3f8ff; color: #42506b; font-weight: 600; border-color: #e3ebf8; white-space: nowrap; border-right: 1px solid #dfe8f7; }
        .pm-table tbody td { border-color: #edf2fa; color: #4a5873; vertical-align: middle; border-right: 1px solid #e6edf9; }
        .pm-table thead th:first-child, .pm-table tbody td:first-child { border-left: 1px solid #dfe8f7; }
        .pm-table thead th:last-child,  .pm-table tbody td:last-child  { border-right: 1px solid #dfe8f7; }
        .pm-table tbody tr:hover { background: #f9fcff; }
        .pm-index { width: 54px; color: #6b7892; font-weight: 600; }
        .pm-badge { display: inline-flex; align-items: center; justify-content: center; padding: 0.2rem 0.55rem; border-radius: 6px; font-size: 11px; font-weight: 700; gap: 0.25rem; }
        .pm-badge-revealed { background: #e3f9f0; color: #1a8057; }
        .pm-badge-debit    { background: #fff0f0; color: #c0392b; }
        .pm-badge-credit   { background: #e3f9f0; color: #1a8057; }
        .pm-spent  { color: #c0392b; font-weight: 700; white-space: nowrap; }
        .pm-credit { color: #1ea56f; font-weight: 700; white-space: nowrap; }
        .pm-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.85rem 1.5rem; border-top: 1px solid #e8eef9; background: #fff; flex-wrap: wrap; }
        .pm-result { color: #5f6e8d; font-weight: 600; font-size: 0.875rem; }
        .pm-footer .pagination { margin: 0; }
        .pm-footer .page-item .page-link { color: #55698e; border-color: #e3ebf8; background: #f9fbff; font-weight: 600; padding: 0.35rem 0.75rem; border-radius: 6px; min-width: 38px; text-align: center; }
        .pm-footer .page-item.active .page-link { background: #dbeaff; border-color: #c6dcff; color: #184da8; }
        .pm-footer .page-item.disabled .page-link { color: #aab4c8; }
        .pm-back { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 1rem; border-radius: 8px; background: #113f93; color: #fff; font-weight: 600; font-size: 0.875rem; text-decoration: none; border: 0; transition: background 0.15s; }
        .pm-back:hover { background: #0b2f6f; color: #fff; }
`;

function formatMoney(n) {
  return Number(n || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function Pagination({ meta, pageKey, searchParams, setSearchParams }) {
  if (!meta || !meta.total) return null;
  const pages = [];
  const start = Math.max(1, (meta.current_page || 1) - 2);
  const end = Math.min(meta.last_page || 1, (meta.current_page || 1) + 2);
  for (let i = start; i <= end; i += 1) pages.push(i);

  const goPage = (p) => {
    const params = new URLSearchParams(searchParams);
    if (p <= 1) params.delete(pageKey);
    else params.set(pageKey, String(p));
    setSearchParams(params);
  };

  return (
    <div className="pm-footer">
      <span className="pm-result">
        Showing {meta.from}–{meta.to} of {meta.total} results
      </span>
      <ul className="pagination mb-0">
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
        {pages.map((p) => (
          <li key={p} className={`page-item${p === meta.current_page ? ' active' : ''}`}>
            <button type="button" className="page-link" onClick={() => goPage(p)}>
              {p}
            </button>
          </li>
        ))}
        <li className={`page-item${meta.current_page >= meta.last_page ? ' disabled' : ''}`}>
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
  );
}

export default function MembersHistory() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'driver-history';
  const driverPage = Number(searchParams.get('driver_page') || 1);
  const walletPage = Number(searchParams.get('wallet_page') || 1);

  const [member, setMember] = useState(null);
  const [stats, setStats] = useState(null);
  const [driverHistory, setDriverHistory] = useState({ data: [], meta: null });
  const [walletHistory, setWalletHistory] = useState({ data: [], meta: null });
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/members/${id}/history`, {
        params: {
          tab: activeTab,
          driver_page: driverPage,
          wallet_page: walletPage,
        },
      });
      setMember(data.member);
      setStats(data.stats);
      setDriverHistory(data.driver_history || { data: [], meta: null });
      setWalletHistory(data.wallet_history || { data: [], meta: null });
    } catch {
      setFlash({ type: 'error', message: 'Failed to load member history.' });
    } finally {
      setLoading(false);
    }
  }, [id, activeTab, driverPage, walletPage]);

  useEffect(() => {
    load();
  }, [load]);

  const setTab = (tab) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    setSearchParams(params);
  };

  if (loading && !member) {
    return <PageSkeleton variant="detail" />;
  }

  if (!member) {
    return (
      <div className="pc-container">
        <div className="pc-content py-5 text-center text-muted">Member not found.</div>
      </div>
    );
  }

  const initial = (member.name || '?').charAt(0).toUpperCase();
  const profileSrc = member.profile ? `${PROFILE_IMG_URL}${member.profile}` : null;

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
                      <Link to="/members">Paid Members</Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      {member.name}
                    </li>
                  </ul>
                </div>
                <div className="col-md-12 d-flex align-items-center justify-content-between flex-wrap gap-2 mt-1">
                  <div>
                    <h2 className="mb-0">Member History</h2>
                    <p className="text-muted mb-0">
                      Transaction history &amp; activity overview for {member.name}
                    </p>
                  </div>
                  <Link to="/members" className="pm-back">
                    <i className="ph-duotone ph-arrow-left" /> Back to Members
                  </Link>
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
            <div className="pm-info-box">
              <div className="pm-avatar">
                {profileSrc ? <img src={profileSrc} alt={member.name} /> : initial}
              </div>
              <div>
                <div className="pm-info-name">{member.name}</div>
                <div className="pm-info-email">{member.email}</div>
                <div className="pm-info-meta">
                  <span className="pm-tag pm-tag-blue">
                    <i className="ph-duotone ph-calendar" />
                    Joined: {member.created_at_formatted}
                  </span>
                  {member.phone && (
                    <span className="pm-tag pm-tag-teal">
                      <i className="ph-duotone ph-phone" />
                      {member.phone}
                    </span>
                  )}
                  <span className="pm-tag pm-tag-green">
                    <i className="ph-duotone ph-check-circle" />
                    Paid Member
                  </span>
                </div>
              </div>
            </div>

            <div className="pm-stats">
              <div className="pm-stat">
                <div className="pm-stat-label">Total Reveals</div>
                <div className="pm-stat-value">{stats?.total_reveals ?? 0}</div>
              </div>
              <div className="pm-stat">
                <div className="pm-stat-label">Total Spent</div>
                <div className="pm-stat-value green">${formatMoney(stats?.total_spent)}</div>
              </div>
              <div className="pm-stat">
                <div className="pm-stat-label">Total Credits</div>
                <div className="pm-stat-value green">${formatMoney(stats?.total_credits)}</div>
              </div>
              <div className="pm-stat">
                <div className="pm-stat-label">Wallet Balance</div>
                <div className="pm-stat-value">${formatMoney(stats?.current_balance)}</div>
              </div>
            </div>

            <div className="pm-tabs-wrap">
              <ul className="nav nav-tabs pm-tabs" id="historyTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    className={`nav-link${activeTab === 'driver-history' ? ' active' : ''}`}
                    onClick={() => setTab('driver-history')}
                  >
                    <i className="ph-duotone ph-steering-wheel" />
                    Driver Details History
                    <span className="pm-tab-badge pm-tab-badge-teal">
                      {driverHistory.meta?.total ?? 0}
                    </span>
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    className={`nav-link${activeTab === 'wallet-history' ? ' active' : ''}`}
                    onClick={() => setTab('wallet-history')}
                  >
                    <i className="ph-duotone ph-wallet" />
                    Wallet Transactions
                    <span className="pm-tab-badge pm-tab-badge-amber">
                      {walletHistory.meta?.total ?? 0}
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            {activeTab === 'driver-history' && (
              <>
                <div className="card-body p-0">
                  <div className="pm-table-wrap">
                    <table className="table pm-table">
                      <thead>
                        <tr>
                          <th className="pm-index">Serial No</th>
                          <th>Driver Name</th>
                          <th>Company</th>
                          <th>Amount Paid</th>
                          <th>Revealed Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(driverHistory.data || []).length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-5">
                              <i
                                className="ph-duotone ph-clock-clockwise"
                                style={{ fontSize: '2.5rem', color: '#b0bad0' }}
                              />
                              <p className="mt-2 mb-0 text-muted">
                                No driver history found for this member.
                              </p>
                            </td>
                          </tr>
                        ) : (
                          (driverHistory.data || []).map((record, idx) => {
                            const serial =
                              ((driverHistory.meta?.current_page || 1) - 1) *
                                (driverHistory.meta?.per_page || 20) +
                              idx +
                              1;
                            return (
                              <tr key={record.id}>
                                <td className="pm-index">{serial}</td>
                                <td style={{ fontWeight: 600, color: '#2c3a55' }}>
                                  {record.driver_name}
                                </td>
                                <td>{record.company_name}</td>
                                <td className="pm-credit">${formatMoney(record.amount_paid)}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>
                                  {record.revealed_at_formatted}
                                </td>
                                <td>
                                  <span className="pm-badge pm-badge-revealed">
                                    <i className="ph-duotone ph-check-circle" /> Revealed
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {(driverHistory.data || []).length > 0 && (
                  <Pagination
                    meta={driverHistory.meta}
                    pageKey="driver_page"
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                  />
                )}
              </>
            )}

            {activeTab === 'wallet-history' && (
              <>
                <div className="card-body p-0">
                  <div className="pm-table-wrap">
                    <table className="table pm-table">
                      <thead>
                        <tr>
                          <th className="pm-index">Serial No</th>
                          <th>Transaction Type</th>
                          <th>Amount</th>
                          <th>Balance Before</th>
                          <th>Balance After</th>
                          <th>Description</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(walletHistory.data || []).length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-5">
                              <i
                                className="ph-duotone ph-wallet"
                                style={{ fontSize: '2.5rem', color: '#b0bad0' }}
                              />
                              <p className="mt-2 mb-0 text-muted">
                                No wallet transactions found for this member.
                              </p>
                            </td>
                          </tr>
                        ) : (
                          (walletHistory.data || []).map((transaction, idx) => {
                            const serial =
                              ((walletHistory.meta?.current_page || 1) - 1) *
                                (walletHistory.meta?.per_page || 20) +
                              idx +
                              1;
                            const isDebit = transaction.type === 'debit';
                            return (
                              <tr key={transaction.id}>
                                <td className="pm-index">{serial}</td>
                                <td>
                                  {isDebit ? (
                                    <span className="pm-badge pm-badge-debit">
                                      <i className="ph-duotone ph-arrow-up-right" /> Debit
                                    </span>
                                  ) : (
                                    <span className="pm-badge pm-badge-credit">
                                      <i className="ph-duotone ph-arrow-down-left" /> Credit
                                    </span>
                                  )}
                                </td>
                                <td className={isDebit ? 'pm-spent' : 'pm-credit'}>
                                  {isDebit ? '-' : '+'}${formatMoney(transaction.amount)}
                                </td>
                                <td>${formatMoney(transaction.balance_before)}</td>
                                <td>${formatMoney(transaction.balance_after)}</td>
                                <td>{transaction.description}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>
                                  {transaction.created_at_formatted}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {(walletHistory.data || []).length > 0 && (
                  <Pagination
                    meta={walletHistory.meta}
                    pageKey="wallet_page"
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

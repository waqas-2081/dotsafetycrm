import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageSkeleton from '../components/PageSkeleton';

function docBadgeClass(documentType) {
  switch (documentType) {
    case 'License':
      return 'bg-light-primary text-primary';
    case 'Medical Card':
      return 'bg-light-success text-success';
    case 'Visa':
      return 'bg-light-warning text-warning';
    default:
      return 'bg-light-secondary text-secondary';
  }
}

function ExpiryMeta({ days, date }) {
  if (days < 0) {
    return <span className="text-danger fw-semibold text-sm">EXPIRED ({date})</span>;
  }
  if (days === 0) {
    return <span className="badge bg-light-warning text-warning">TODAY</span>;
  }
  return <span className="text-warning fw-semibold text-sm">{days}d ({date})</span>;
}

function StatCard({ to, children }) {
  return (
    <Link to={to} className="dashboard-stat-link text-decoration-none">
      <div className="card statistics-card-1 overflow-hidden h-100 dashboard-stat-card">
        {children}
      </div>
    </Link>
  );
}

function DriverPanel({ label, icon, color, items }) {
  const count = items?.length || 0;
  const cardBorder =
    color === 'danger' ? 'border-danger-subtle bg-light-danger' : 'border-warning-subtle bg-light-warning';
  const btnClass = color === 'danger' ? 'btn-outline-danger' : 'btn-outline-secondary';

  return (
    <div className="col-md-6">
      <div className="card h-100 border exp-status-card">
        <div className="card-body">
          <div className="d-flex align-items-center mb-2">
            <div className={`avtar avtar-s bg-light-${color} me-2`}>
              <i className={`ph-duotone ${icon} text-${color}`}></i>
            </div>
            <h6 className="mb-0">{label}</h6>
          </div>
          <h4 className={`${count > 0 ? `text-${color}` : ''} mb-3`}>
            <i className="ph-duotone ph-user me-1"></i>
            {count}
          </h4>
          {count > 0 ? (
            <div className="exp-scroll">
              {items.map((n, idx) => (
                <div key={`${n.user_id}-${n.document_type}-${idx}`} className={`card ${cardBorder} bg-opacity-10 mb-2 exp-item`}>
                  <div className="card-body py-3">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div>
                        <h6 className="mb-1">{n.driver_name}</h6>
                        <span className={`badge ${docBadgeClass(n.document_type)}`}>{n.document_type}</span>
                      </div>
                      <ExpiryMeta days={n.days_until_expiry} date={n.expiry_date} />
                    </div>
                    <Link to={`/edit-form/${n.user_id}`} className={`btn btn-sm ${btnClass} mt-2`}>
                      <i className="ph-duotone ph-eye me-1"></i>View Application
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center text-center exp-empty">
              <i className="ph-duotone ph-check-circle text-success" style={{ fontSize: 34 }}></i>
              <p className="text-muted mb-0 mt-2">No documents expiring</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CompanyPanel({ label, icon, color, items }) {
  const count = items?.length || 0;
  const cardBorder =
    color === 'danger' ? 'border-danger-subtle bg-light-danger' : 'border-warning-subtle bg-light-warning';
  const btnClass = color === 'danger' ? 'btn-outline-danger' : 'btn-outline-secondary';

  return (
    <div className="col-md-6">
      <div className="card h-100 border exp-status-card">
        <div className="card-body">
          <div className="d-flex align-items-center mb-2">
            <div className={`avtar avtar-s bg-light-${color} me-2`}>
              <i className={`ph-duotone ${icon} text-${color}`}></i>
            </div>
            <h6 className="mb-0">{label}</h6>
          </div>
          <h4 className={`${count > 0 ? `text-${color}` : ''} mb-3`}>
            <i className="ph-duotone ph-buildings me-1"></i>
            {count}
          </h4>
          {count > 0 ? (
            <div className="exp-scroll">
              {items.map((n, idx) => (
                <div key={`${n.company_id}-${n.document_type}-${idx}`} className={`card ${cardBorder} bg-opacity-10 mb-2 exp-item`}>
                  <div className="card-body py-3">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div>
                        <h6 className="mb-1">{n.company_name}</h6>
                        <span className="badge bg-light-primary text-primary">{n.document_type}</span>
                      </div>
                      {n.days_until_expiry < 0 ? (
                        <span className="text-danger fw-semibold text-sm">EXPIRED ({n.expiry_date})</span>
                      ) : n.days_until_expiry === 0 ? (
                        <span className="text-warning fw-semibold text-sm">TODAY</span>
                      ) : (
                        <span className="text-warning fw-semibold text-sm">
                          {n.days_until_expiry}d ({n.expiry_date})
                        </span>
                      )}
                    </div>
                    <Link to={`/companies/${n.company_id}/edit`} className={`btn btn-sm ${btnClass} mt-2`}>
                      <i className="ph-duotone ph-eye me-1"></i>View Company
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center text-center exp-empty">
              <i className="ph-duotone ph-check-circle text-success" style={{ fontSize: 34 }}></i>
              <p className="text-muted mb-0 mt-2">No documents expiring</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UnitPanel({ label, icon, color, items }) {
  const count = items?.length || 0;
  const cardBorder =
    color === 'danger' ? 'border-danger-subtle bg-light-danger' : 'border-warning-subtle bg-light-warning';
  const btnClass = color === 'danger' ? 'btn-outline-danger' : 'btn-outline-secondary';

  return (
    <div className="col-md-6">
      <div className="card h-100 border exp-status-card">
        <div className="card-body">
          <div className="d-flex align-items-center mb-2">
            <div className={`avtar avtar-s bg-light-${color} me-2`}>
              <i className={`ph-duotone ${icon} text-${color}`}></i>
            </div>
            <h6 className="mb-0">{label}</h6>
          </div>
          <h4 className={`${count > 0 ? `text-${color}` : ''} mb-3`}>
            <i className="ph-duotone ph-truck me-1"></i>
            {count}
          </h4>
          {count > 0 ? (
            <div className="exp-scroll">
              {items.map((n, idx) => (
                <div key={`${n.company_id}-${n.unit_number}-${idx}`} className={`card ${cardBorder} bg-opacity-10 mb-2 exp-item`}>
                  <div className="card-body py-3">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div>
                        <h6 className="mb-1">{n.company_name}</h6>
                        <span className="badge bg-light-secondary text-secondary">
                          Unit {n.unit_number} &bull; {n.unit_type}
                        </span>
                        {n.vin !== 'N/A' && (
                          <small className="d-block text-muted mt-1">VIN: {n.vin}</small>
                        )}
                      </div>
                      <ExpiryMeta days={n.days_until_expiry} date={n.expiry_date} />
                    </div>
                    <Link to={`/companies/${n.company_id}/edit`} className={`btn btn-sm ${btnClass} mt-2`}>
                      <i className="ph-duotone ph-eye me-1"></i>View Company
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center text-center exp-empty">
              <i className="ph-duotone ph-check-circle text-success" style={{ fontSize: 34 }}></i>
              <p className="text-muted mb-0 mt-2">No units expiring</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { isAdmin, isUser } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [telnyxConfigured, setTelnyxConfigured] = useState(false);
  const [smsSaving, setSmsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    api
      .get('/dashboard', { signal: controller.signal })
      .then((res) => {
        if (!cancelled) {
          setData(res.data);
          setSmsEnabled(!!res.data?.sms_settings?.driver_sms_enabled);
          setTelnyxConfigured(!!res.data?.sms_settings?.telnyx_configured);
        }
      })
      .catch((err) => {
        if (cancelled || err?.code === 'ERR_CANCELED') return;
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load dashboard');
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const toggleDriverSms = async () => {
    setSmsSaving(true);
    try {
      const { data: response } = await api.put('/sms-settings', {
        driver_sms_enabled: !smsEnabled,
      });
      setSmsEnabled(!!response.driver_sms_enabled);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update SMS settings.');
    } finally {
      setSmsSaving(false);
    }
  };

  if (error) {
    return (
      <div className="pc-container">
        <div className="pc-content">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return <PageSkeleton variant="dashboard" />;
  }

  const stats = data.stats || {};
  const driver = data.driver_notifications || {};
  const company = data.company_notifications || {};
  const unit = data.unit_notifications || {};

  return (
    <div className="pc-container">
      <div className="pc-content">
        <div className="page-header">
          <div className="page-block">
            <div className="row align-items-center">
              <div className="col-md-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item" aria-current="page">
                    Dashboard
                  </li>
                </ul>
              </div>
              <div className="col-md-12">
                <div className="page-header-title d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <h2 className="mb-0">Dashboard</h2>
                  {isAdmin && (
                    <div className="dashboard-sms-toggle">
                      <span className={`dashboard-sms-status ${smsEnabled ? 'is-on' : 'is-off'}`}>
                        Driver SMS: {smsEnabled ? 'On' : 'Off'}
                      </span>
                      <button
                        type="button"
                        className={`btn btn-sm ${smsEnabled ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        onClick={toggleDriverSms}
                        disabled={smsSaving}
                      >
                        {smsSaving ? 'Saving...' : smsEnabled ? 'Turn Off SMS' : 'Turn On SMS'}
                      </button>
                      {!telnyxConfigured && (
                        <span className="text-muted small">Telnyx not configured in .env</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isUser && (
          <>
            {data.has_unverified_employment && (
              <div className="alert alert-danger d-flex align-items-center gap-3 mb-4" role="alert">
                <i className="ph-duotone ph-warning-circle f-24 flex-shrink-0"></i>
                <div>
                  <h6 className="mb-1 text-white">Employment Verification Required</h6>
                  <p className="mb-0">
                    Your previous employment records are pending verification. Please ensure all employment
                    information is accurate and complete.{' '}
                    <Link
                      to={`/form/${data.user_id}`}
                      className="text-white fw-semibold text-decoration-underline"
                    >
                      Review Application Form
                    </Link>
                  </p>
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-md-4">
                <div className="card statistics-card-1 overflow-hidden">
                  <div className="card-body">
                    <img
                      src="/assets/images/widget/img-status-4.svg"
                      alt="img"
                      className="img-fluid img-bg"
                    />
                    <h5 className="mb-4">Application Form</h5>
                    <p className="text-muted mb-2 text-sm mt-3">
                      <Link to={`/form/${data.user_id}`}>Complete Your Application Form &#8593;</Link>
                    </p>
                    <div className="progress" style={{ height: 7 }}>
                      <div
                        className="progress-bar bg-brand-color-3"
                        role="progressbar"
                        style={{ width: '62%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {isAdmin && (
          <>
            <div className="dashboard-stats-grid">
              <StatCard to="/application-forms">
                <div className="card-body">
                  <img
                    src="/assets/images/widget/img-status-4.svg"
                    alt=""
                    className="img-fluid img-bg"
                  />
                  <h5 className="mb-4">Total Forms</h5>
                  <div className="d-flex align-items-center mt-3">
                    <h3 className="f-w-300 d-flex align-items-center m-b-0">{stats.total_forms}</h3>
                  </div>
                  <p className="text-muted mb-2 text-sm mt-3">View All &#8593;</p>
                  <div className="progress" style={{ height: 7 }}>
                    <div
                      className="progress-bar bg-brand-color-3"
                      role="progressbar"
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>
              </StatCard>

              {stats.show_total_members && (
                <StatCard to="/members">
                  <div className="card-body">
                    <img
                      src="/assets/images/widget/img-status-5.svg"
                      alt=""
                      className="img-fluid img-bg"
                    />
                    <h5 className="mb-4">Total Members</h5>
                    <div className="d-flex align-items-center mt-3">
                      <h3 className="f-w-300 d-flex align-items-center m-b-0">{stats.total_members}</h3>
                    </div>
                    <p className="text-muted mb-2 text-sm mt-3">View All &#8593;</p>
                    <div className="progress" style={{ height: 7 }}>
                      <div
                        className="progress-bar bg-brand-color-3"
                        role="progressbar"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                  </div>
                </StatCard>
              )}

              <StatCard to="/companies">
                <div className="card-body">
                  <img
                    src="/assets/images/widget/img-status-6.svg"
                    alt=""
                    className="img-fluid img-bg"
                  />
                  <h5 className="mb-4">Total Companies</h5>
                  <div className="d-flex align-items-center mt-3">
                    <h3 className="f-w-300 d-flex align-items-center m-b-0">{stats.total_companies}</h3>
                  </div>
                  <p className="text-opacity-75 mb-2 text-sm mt-3">View All &#8593;</p>
                  <div className="progress bg-opacity-10" style={{ height: 7 }}>
                    <div className="progress-bar" role="progressbar" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </StatCard>

              <StatCard to="/application-forms?is_active=yes">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <div className="avtar avtar-s bg-light-success me-2">
                      <i className="ph-duotone ph-check-circle text-success"></i>
                    </div>
                    <h5 className="mb-0">Total Active Drivers</h5>
                  </div>
                  <div className="d-flex align-items-center mt-3">
                    <h3 className="f-w-300 text-success d-flex align-items-center m-b-0">
                      {stats.total_active_drivers}
                    </h3>
                  </div>
                  <p className="text-muted mb-2 text-sm mt-3">View All &#8593;</p>
                  <div className="progress" style={{ height: 7 }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>
              </StatCard>

              <StatCard to="/application-forms?is_active=no">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <div className="avtar avtar-s bg-light-danger me-2">
                      <i className="ph-duotone ph-x-circle text-danger"></i>
                    </div>
                    <h5 className="mb-0">Total Inactive Drivers</h5>
                  </div>
                  <div className="d-flex align-items-center mt-3">
                    <h3 className="f-w-300 text-danger d-flex align-items-center m-b-0">
                      {stats.total_inactive_drivers}
                    </h3>
                  </div>
                  <p className="text-muted mb-2 text-sm mt-3">View All &#8593;</p>
                  <div className="progress" style={{ height: 7 }}>
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>
              </StatCard>

              <StatCard to="/application-forms?english_capable=1">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <div className="avtar avtar-s bg-light-info me-2">
                      <i className="ph-duotone ph-translate text-info"></i>
                    </div>
                    <h5 className="mb-0">Total English Capable</h5>
                  </div>
                  <div className="d-flex align-items-center mt-3">
                    <h3 className="f-w-300 text-info d-flex align-items-center m-b-0">
                      {stats.total_english_capable}
                    </h3>
                  </div>
                  <p className="text-muted mb-2 text-sm mt-3">View All &#8593;</p>
                  <div className="progress" style={{ height: 7 }}>
                    <div className="progress-bar bg-info" role="progressbar" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </StatCard>

              <StatCard to="/application-forms?document_type=cdl">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <div className="avtar avtar-s bg-light-primary me-2">
                      <i className="ph-duotone ph-identification-card text-primary"></i>
                    </div>
                    <h5 className="mb-0">Total CDLs</h5>
                  </div>
                  <div className="d-flex align-items-center mt-3">
                    <h3 className="f-w-300 text-primary d-flex align-items-center m-b-0">
                      {stats.total_cdls}
                    </h3>
                  </div>
                  <p className="text-muted mb-2 text-sm mt-3">View All &#8593;</p>
                  <div className="progress" style={{ height: 7 }}>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>
              </StatCard>

              <StatCard to="/application-forms?document_type=b1">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <div className="avtar avtar-s bg-light-warning me-2">
                      <i className="ph-duotone ph-file-text text-warning"></i>
                    </div>
                    <h5 className="mb-0">Total B1s</h5>
                  </div>
                  <div className="d-flex align-items-center mt-3">
                    <h3 className="f-w-300 text-warning d-flex align-items-center m-b-0">
                      {stats.total_b1s}
                    </h3>
                  </div>
                  <p className="text-muted mb-2 text-sm mt-3">View All &#8593;</p>
                  <div className="progress" style={{ height: 7 }}>
                    <div
                      className="progress-bar bg-warning"
                      role="progressbar"
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>
              </StatCard>
            </div>

            <div className="col-12 exp-module">
              <div className="card exp-shell">
                <div className="card-body pb-2">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2 exp-headline">
                    <div>
                      <h5 className="mb-1">Document Expiration Control Center</h5>
                      <p className="text-muted mb-0">
                        Track expiring driver, company and unit records in one place.
                      </p>
                    </div>
                    <span className="badge bg-light-primary text-primary">Live Monitoring</span>
                  </div>

                  <ul className="nav nav-tabs exp-tabs" id="expirationTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="driver-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#driver-pane"
                        type="button"
                        role="tab"
                      >
                        <i className="ph-duotone ph-user me-1"></i> Driver Documents Expiration Notifications
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="company-docs-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#company-docs-pane"
                        type="button"
                        role="tab"
                      >
                        <i className="ph-duotone ph-buildings me-1"></i> Company Documents Expiration
                        Notifications
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="unit-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#unit-pane"
                        type="button"
                        role="tab"
                      >
                        <i className="ph-duotone ph-truck me-1"></i> Company Unit Expiration
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content mt-3" id="expirationTabsContent">
                    <div className="tab-pane fade show active" id="driver-pane" role="tabpanel" tabIndex={0}>
                      <div className="row g-3">
                        <DriverPanel
                          label="Expiring Today / Already Expired"
                          icon="ph-warning"
                          color="danger"
                          items={driver.today}
                        />
                        <DriverPanel
                          label="Expiring in 1 Week"
                          icon="ph-alarm"
                          color="danger"
                          items={driver['1week']}
                        />
                        <DriverPanel
                          label="Expiring in 3 Weeks"
                          icon="ph-clock-countdown"
                          color="warning"
                          items={driver['3weeks']}
                        />
                        <DriverPanel
                          label="Expiring in 4 Weeks"
                          icon="ph-clock-countdown"
                          color="warning"
                          items={driver['4weeks']}
                        />

                        <div className="col-12">
                          <div className="card exp-feature-card">
                            <div className="card-body">
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <div className="avtar avtar-s bg-light-primary">
                                  <i className="ph-duotone ph-file-text text-primary"></i>
                                </div>
                                <h6 className="exp-feature-title mb-0">
                                  CONSTANCIA LFD — Expiring in 30 Days or Already Expired
                                </h6>
                              </div>
                              <div className="d-flex align-items-center gap-2 mb-3">
                                <i className="ph-duotone ph-user text-primary f-24"></i>
                                <h3 className="exp-feature-count">{driver.constancia_lfd?.length || 0}</h3>
                              </div>
                              {(driver.constancia_lfd?.length || 0) > 0 ? (
                                <div className="exp-scroll-lg">
                                  {driver.constancia_lfd.map((n, idx) => {
                                    const isExpired = n.days_until_expiry < 0;
                                    const cardBorder = isExpired
                                      ? 'border-danger-subtle bg-light-danger'
                                      : 'border-warning-subtle bg-light-warning';
                                    const btnClass = isExpired
                                      ? 'btn-outline-danger'
                                      : 'btn-outline-secondary';
                                    return (
                                      <div
                                        key={`lfd-${n.user_id}-${idx}`}
                                        className={`card exp-item ${cardBorder} bg-opacity-10 mb-2`}
                                      >
                                        <div className="card-body py-3">
                                          <div className="d-flex justify-content-between align-items-start gap-2">
                                            <div>
                                              <h6 className="mb-1">{n.driver_name}</h6>
                                              <span className="badge bg-light-info text-info">
                                                CONSTANCIA LFD
                                              </span>
                                            </div>
                                            <ExpiryMeta days={n.days_until_expiry} date={n.expiry_date} />
                                          </div>
                                          <Link
                                            to={`/edit-form/${n.user_id}`}
                                            className={`btn btn-sm ${btnClass} mt-2`}
                                          >
                                            <i className="ph-duotone ph-eye me-1"></i>View Application
                                          </Link>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="d-flex flex-column align-items-center justify-content-center text-center exp-empty">
                                  <i
                                    className="ph-duotone ph-check-circle text-success"
                                    style={{ fontSize: 34 }}
                                  ></i>
                                  <p className="text-muted mb-0 mt-2">
                                    No CONSTANCIA LFD expiring within 30 days
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="tab-pane fade" id="company-docs-pane" role="tabpanel" tabIndex={0}>
                      <div className="row g-3">
                        <CompanyPanel
                          label="Expiring Today / Already Expired"
                          icon="ph-warning"
                          color="danger"
                          items={company.today}
                        />
                        <CompanyPanel
                          label="Expiring in 1 Week"
                          icon="ph-alarm"
                          color="danger"
                          items={company['1week']}
                        />
                        <CompanyPanel
                          label="Expiring in 3 Weeks"
                          icon="ph-clock-countdown"
                          color="warning"
                          items={company['3weeks']}
                        />
                        <CompanyPanel
                          label="Expiring in 4 Weeks"
                          icon="ph-clock-countdown"
                          color="warning"
                          items={company['4weeks']}
                        />
                      </div>
                    </div>

                    <div className="tab-pane fade" id="unit-pane" role="tabpanel" tabIndex={0}>
                      <div className="row g-3">
                        <UnitPanel
                          label="Expiring Today / Already Expired"
                          icon="ph-warning"
                          color="danger"
                          items={unit.today}
                        />
                        <UnitPanel
                          label="Expiring in 1 Week"
                          icon="ph-alarm"
                          color="danger"
                          items={unit['1week']}
                        />
                        <UnitPanel
                          label="Expiring in 3 Weeks"
                          icon="ph-clock-countdown"
                          color="warning"
                          items={unit['3weeks']}
                        />
                        <UnitPanel
                          label="Expiring in 4 Weeks"
                          icon="ph-clock-countdown"
                          color="warning"
                          items={unit['4weeks']}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

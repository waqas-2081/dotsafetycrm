import { useMemo, useState } from 'react';
import api from '../../services/api';

const HOS_HINTS = {
  samsara: {
    violations: 'Expected columns: Driver, Violation Type, Date, Tags',
    disconnection: 'Expected columns: Source, Details, Start Time, Duration, Status, Type',
    unidentified:
      'Expected columns: Vehicle, Unassigned Time, Unassigned Distance, Unassigned Segments, Pending Segments, Tags',
  },
  motive: {
    violations: 'Expected columns: Driver, Driver ID, Violation, Start, End, Duration (mins)',
    disconnection:
      'Expected columns: Vehicle, Disconnect Time, Disconnect Location, Disconnect Odometer, Reconnect Time, Reconnect Location, Reconnect Odometer, Distance, Status',
    unidentified:
      'Expected columns: Date, Status, Carrier, Home Base, Tractor, Trailer 1, Trailer 2, Trailer 3',
  },
  monarch: {
    violations: 'Expected columns: Driver, UserName, Date, Violation',
    disconnection:
      'Expected columns: Driver Before Jump, Status Before Jump, Location Before Jump, Date Time Before Jump, Driver After Jump, Status After Jump, Location After Jump, Distance (Miles), Time Elapsed',
    unidentified: 'Expected columns: Date, Status, Carrier, Home Base, Tractor, Trailer 1',
  },
  hos247: {
    violations: 'Expected columns: Date, Driver, Hours Drove, Violations, Form & Manner',
  },
};

function fmtDate(d) {
  if (!d) return '—';
  const raw = String(d).substring(0, 10);
  const p = raw.split('-');
  if (p.length !== 3) return d;
  return `${p[1]}/${p[2]}/${p[0]}`;
}

function fmtDateTime(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}

function ViolHeaders({ source }) {
  if (source === 'samsara') {
    return (
      <>
        <th>Driver</th>
        <th>Violation Type</th>
        <th>Date</th>
        <th>Tags</th>
      </>
    );
  }
  if (source === 'motive') {
    return (
      <>
        <th>Driver</th>
        <th>ELD ID</th>
        <th>Violation</th>
        <th>Start</th>
        <th>End</th>
        <th>Duration (mins)</th>
      </>
    );
  }
  if (source === 'monarch') {
    return (
      <>
        <th>Driver</th>
        <th>UserName</th>
        <th>Date</th>
        <th>Violation</th>
      </>
    );
  }
  return (
    <>
      <th>Date</th>
      <th>Driver</th>
      <th>Hours Drove</th>
      <th>Violations</th>
      <th>Form & Manner</th>
    </>
  );
}

function ViolCells({ source, row }) {
  if (source === 'samsara') {
    return (
      <>
        <td>{row.driver_name || '—'}</td>
        <td>{row.violation_type || '—'}</td>
        <td>{fmtDate(row.date)}</td>
        <td>{row.tags || '—'}</td>
      </>
    );
  }
  if (source === 'motive') {
    return (
      <>
        <td>{row.driver_name || '—'}</td>
        <td>{row.driver_eld_id || '—'}</td>
        <td>{row.violation || '—'}</td>
        <td>{fmtDateTime(row.start)}</td>
        <td>{fmtDateTime(row.end)}</td>
        <td>{row.duration_mins || '—'}</td>
      </>
    );
  }
  if (source === 'monarch') {
    return (
      <>
        <td>{row.driver_name || '—'}</td>
        <td>{row.username || '—'}</td>
        <td>{fmtDateTime(row.date)}</td>
        <td>{row.violation || '—'}</td>
      </>
    );
  }
  return (
    <>
      <td>{row.date || '—'}</td>
      <td>{row.driver_name || '—'}</td>
      <td>{row.hours_drove || '—'}</td>
      <td>{row.violations || '—'}</td>
      <td>{row.form_and_manner || '—'}</td>
    </>
  );
}

function ImportList({
  companyId,
  source,
  sourceLabel,
  type,
  imports,
  onRefresh,
}) {
  const [alert, setAlert] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const typePath =
    type === 'violations'
      ? 'violations'
      : type === 'disconnection'
        ? 'disconnection'
        : 'unidentified';

  const title =
    type === 'violations'
      ? 'HOS Violations'
      : type === 'disconnection'
        ? 'Disconnection Report'
        : 'Unidentified Log Report';

  const handleImport = async () => {
    if (!importFile) {
      setAlert({ type: 'danger', message: 'Please select a file.' });
      return;
    }
    setImporting(true);
    try {
      const fd = new FormData();
      fd.append('file', importFile);
      fd.append('source', source);
      await api.post(`/companies/${companyId}/hos/${typePath}/import`, fd);
      setImportOpen(false);
      setImportFile(null);
      setAlert({ type: 'success', message: `${title} imported successfully.` });
      onRefresh?.();
    } catch {
      setAlert({ type: 'danger', message: 'Import failed. Please try again.' });
    } finally {
      setImporting(false);
    }
  };

  const handleDeleteImport = async (importId) => {
    if (!window.confirm('Delete this entire import and all its rows?')) return;
    try {
      await api.delete(`/companies/${companyId}/hos/${typePath}/imports/${importId}`);
      setAlert({ type: 'success', message: 'Import deleted.' });
      onRefresh?.();
    } catch {
      setAlert({ type: 'danger', message: 'Failed to delete import.' });
    }
  };

  const handleDeleteRow = async (importId, rowId) => {
    if (!window.confirm('Delete this row?')) return;
    try {
      await api.delete(
        `/companies/${companyId}/hos/${typePath}/imports/${importId}/rows/${rowId}`
      );
      onRefresh?.();
    } catch {
      window.alert('Failed to delete row.');
    }
  };

  const downloadImport = async (importId) => {
    try {
      const response = await api.get(
        `/companies/${companyId}/hos/${typePath}/imports/${importId}/download`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `hos-${typePath}-${importId}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      window.alert('Download failed.');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h6 className="mb-0 fw-bold" style={{ color: '#36445e' }}>
          {sourceLabel} — {title} Imports
        </h6>
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-primary ac-btn-save btn-import-hos"
            style={{ marginTop: 0 }}
            onClick={() => setImportOpen(true)}
          >
            <i className="ph-duotone ph-upload-simple me-1"></i> Import Excel / CSV
          </button>
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} py-2`} role="alert">
          {alert.message}
        </div>
      )}

      <div>
        {(!imports || imports.length === 0) && (
          <div className="text-muted small py-3 text-center">
            No {title} imported yet for {sourceLabel}.
          </div>
        )}
        {(imports || []).map((imp) => {
          const rows = imp.rows || [];
          return (
            <div
              className="hos-import-card"
              key={imp.id}
              data-import-id={imp.id}
              data-source={source}
            >
              <div className="hos-import-header">
                <div>
                  <strong>{imp.import_name}</strong>
                  <span className="hos-import-meta">
                    {rows.length} row(s) · imported{' '}
                    {imp.imported_at ? fmtDateTime(imp.imported_at) : '—'}
                  </span>
                </div>
                <div className="hos-import-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    title="Download CSV"
                    onClick={() => downloadImport(imp.id)}
                  >
                    <i className="ph-duotone ph-download-simple"></i> Download
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteImport(imp.id)}
                  >
                    <i className="ph-duotone ph-trash"></i> Delete Import
                  </button>
                </div>
              </div>
              <div className="table-responsive mt-2">
                <table className="table hos-data-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th></th>
                      {type === 'violations' ? (
                        <ViolHeaders source={source} />
                      ) : (
                        <th>Data</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-muted text-center py-2">
                          No rows in this import.
                        </td>
                      </tr>
                    ) : (
                      rows.map((row) => (
                        <tr key={row.id} data-row-id={row.id}>
                          <td className="text-nowrap">
                            <button
                              type="button"
                              className="btn btn-xs btn-outline-danger"
                              onClick={() => handleDeleteRow(imp.id, row.id)}
                            >
                              <i className="ph-duotone ph-trash"></i>
                            </button>
                          </td>
                          {type === 'violations' ? (
                            <ViolCells source={source} row={row} />
                          ) : (
                            <td>
                              <code style={{ fontSize: 11 }}>
                                {JSON.stringify(row).slice(0, 180)}
                                {JSON.stringify(row).length > 180 ? '…' : ''}
                              </code>
                            </td>
                          )}
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

      {importOpen && (
        <div
          className="modal fade show"
          style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ background: '#f0f5ff', borderBottom: '1px solid #dde8f8' }}
              >
                <h5 className="modal-title fw-bold" style={{ color: '#174ea6' }}>
                  Import {title} — {sourceLabel}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setImportOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="ac-label">Select Excel or CSV File</label>
                  <input
                    type="file"
                    className="form-control ac-file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  />
                  <div className="ac-form-note mt-1">
                    {HOS_HINTS[source]?.[type] || ''}
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid #dde8f8' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setImportOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={importing}
                  onClick={handleImport}
                >
                  <i className="ph-duotone ph-upload-simple me-1"></i>{' '}
                  {importing ? 'Importing…' : 'Upload & Import'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HosCompanyPanel({
  companyId,
  source,
  sourceLabel,
  hosImports,
  discImports,
  unidImports,
  showDisc,
  showUnid,
  onRefresh,
}) {
  const [subTab, setSubTab] = useState('violations');

  const filteredHos = useMemo(
    () => (hosImports || []).filter((i) => i.source === source),
    [hosImports, source]
  );
  const filteredDisc = useMemo(
    () => (discImports || []).filter((i) => i.source === source),
    [discImports, source]
  );
  const filteredUnid = useMemo(
    () => (unidImports || []).filter((i) => i.source === source),
    [unidImports, source]
  );

  return (
    <>
      <ul
        className="nav nav-tabs hos-sub-tabs mb-0 mt-3"
        id={`hosSubTabs-${source}`}
        role="tablist"
      >
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link${subTab === 'violations' ? ' active' : ''}`}
            type="button"
            role="tab"
            onClick={() => setSubTab('violations')}
          >
            HOS Violations
          </button>
        </li>
        {showDisc && (
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link${subTab === 'disconnection' ? ' active' : ''}`}
              type="button"
              role="tab"
              onClick={() => setSubTab('disconnection')}
            >
              Disconnection Report
            </button>
          </li>
        )}
        {showUnid && (
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link${subTab === 'unidentified' ? ' active' : ''}`}
              type="button"
              role="tab"
              onClick={() => setSubTab('unidentified')}
            >
              Unidentified Log Report
            </button>
          </li>
        )}
      </ul>

      <div
        className="tab-content hos-sub-content"
        style={{
          border: '1px solid #dde8f8',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          padding: '14px 14px 10px',
        }}
      >
        {subTab === 'violations' && (
          <ImportList
            companyId={companyId}
            source={source}
            sourceLabel={sourceLabel}
            type="violations"
            imports={filteredHos}
            onRefresh={onRefresh}
          />
        )}
        {showDisc && subTab === 'disconnection' && (
          <ImportList
            companyId={companyId}
            source={source}
            sourceLabel={sourceLabel}
            type="disconnection"
            imports={filteredDisc}
            onRefresh={onRefresh}
          />
        )}
        {showUnid && subTab === 'unidentified' && (
          <ImportList
            companyId={companyId}
            source={source}
            sourceLabel={sourceLabel}
            type="unidentified"
            imports={filteredUnid}
            onRefresh={onRefresh}
          />
        )}
      </div>
    </>
  );
}

export { fmtDate };

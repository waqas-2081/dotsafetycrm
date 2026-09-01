import { useEffect, useState } from 'react';
import api from '../../../services/api';
import SectionCard from './SectionCard';
import { fileUrl } from '../formShared';

function formatDateInput(value) {
  if (!value) return '';
  return String(value).substring(0, 10);
}

function mapEntry(entry) {
  return {
    id: entry.id,
    isNew: false,
    date: formatDateInput(entry.followup_date),
    status: entry.status || 'inactive',
    details: entry.details || '',
    addedBy: entry.added_by_user_name || 'N/A',
    files: Array.isArray(entry.files) ? entry.files : [],
  };
}

function emptyEntry() {
  return {
    id: null,
    isNew: true,
    date: '',
    status: 'inactive',
    details: '',
    addedBy: '',
    files: [],
  };
}

export default function FollowUpProgramBlock({
  applicationId,
  initialEntries,
  storageBase,
  onRefresh,
}) {
  const [programEnabled, setProgramEnabled] = useState((initialEntries || []).length > 0);
  const [entries, setEntries] = useState([]);
  const [logsOpen, setLogsOpen] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [pendingFiles, setPendingFiles] = useState({});

  useEffect(() => {
    const mapped = (initialEntries || []).map(mapEntry);
    setEntries(mapped);
    setProgramEnabled(mapped.length > 0);
  }, [initialEntries]);

  const addEntry = () => {
    setEntries((prev) => [...prev, emptyEntry()]);
    setProgramEnabled(true);
  };

  const removeNewEntry = (index) => {
    setEntries((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setProgramEnabled(false);
      return next;
    });
  };

  const updateEntry = (index, patch) => {
    setEntries((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const saveEntry = async (index) => {
    const entry = entries[index];
    if (!entry.date) {
      window.alert('Please fill in Date before saving.');
      return;
    }
    setSavingId(entry.id || `new-${index}`);
    try {
      const { data } = await api.post(`/follow-up/save/${applicationId}`, {
        program_enabled: 'yes',
        entries: [
          {
            id: entry.isNew ? null : entry.id,
            date: entry.date,
            status: entry.status,
            details: entry.details,
          },
        ],
      });
      if (!data.success) {
        window.alert(data.message || 'Save failed.');
        return;
      }
      if (entry.isNew) {
        await onRefresh?.();
      } else {
        window.alert('Entry saved successfully.');
      }
    } catch {
      window.alert('An error occurred. Please try again.');
    } finally {
      setSavingId(null);
    }
  };

  const deleteEntry = async (index) => {
    const entry = entries[index];
    if (entry.isNew) {
      removeNewEntry(index);
      return;
    }
    if (!window.confirm('Delete this follow up entry? This cannot be undone.')) return;
    try {
      const { data } = await api.delete(`/follow-up/delete-entry/${entry.id}`);
      if (data.success) {
        setEntries((prev) => {
          const next = prev.filter((_, i) => i !== index);
          if (next.length === 0) setProgramEnabled(false);
          return next;
        });
      } else {
        window.alert(data.message || 'Delete failed.');
      }
    } catch {
      window.alert('Delete error.');
    }
  };

  const uploadFiles = async (index, fileList) => {
    const entry = entries[index];
    if (!entry?.id || entry.isNew) {
      window.alert('Save the entry first to upload files.');
      return;
    }
    if (!fileList?.length) {
      window.alert('Please select at least one file.');
      return;
    }
    setUploadingId(entry.id);
    try {
      for (const file of Array.from(fileList)) {
        const fd = new FormData();
        fd.append('file', file);
        const { data } = await api.post(`/follow-up/upload-file/${entry.id}`, fd);
        if (data.success && data.file) {
          setEntries((prev) =>
            prev.map((row, i) =>
              i === index
                ? {
                    ...row,
                    files: [
                      ...row.files,
                      {
                        id: data.file.id,
                        file_name: data.file.file_name,
                        file_path: data.file.file_path,
                      },
                    ],
                  }
                : row
            )
          );
        } else {
          window.alert(data.message || 'File upload failed.');
        }
      }
    } catch {
      window.alert('File upload error.');
    } finally {
      setUploadingId(null);
    }
  };

  const deleteFile = async (entryIndex, fileId) => {
    if (!window.confirm('Delete this file?')) return;
    try {
      const { data } = await api.delete(`/follow-up/delete-file/${fileId}`);
      if (data.success) {
        setEntries((prev) =>
          prev.map((row, i) =>
            i === entryIndex
              ? { ...row, files: row.files.filter((f) => f.id !== fileId) }
              : row
          )
        );
      } else {
        window.alert(data.message || 'Delete failed.');
      }
    } catch {
      window.alert('Delete error.');
    }
  };

  const viewLogs = async (entryId) => {
    setLogsOpen(true);
    setLogsLoading(true);
    setLogs([]);
    try {
      const { data } = await api.get(`/follow-up/logs/${entryId}`);
      if (data.success) setLogs(data.logs || []);
    } catch {
      setLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  return (
    <>
      <SectionCard title="Follow Up Program" iconBg="#1e5fd4" className="followup-section printnone">
        <div className="field form-full" style={{ marginBottom: '1rem' }}>
          <label className="field-label">Enable Follow Up Program for this driver?</label>
          <div className="radio-options" style={{ display: 'flex', gap: '1.25rem', marginTop: '0.35rem' }}>
            <label>
              <input
                type="radio"
                name="followup_program_enabled"
                checked={programEnabled}
                onChange={() => {
                  setProgramEnabled(true);
                  if (entries.length === 0) addEntry();
                }}
              />{' '}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="followup_program_enabled"
                checked={!programEnabled}
                onChange={() => setProgramEnabled(false)}
              />{' '}
              No
            </label>
          </div>
        </div>

        {programEnabled ? (
          <>
            {entries.map((entry, index) => (
              <div
                key={entry.isNew ? `new-${index}` : entry.id}
                className="followup-entry-card"
                style={{
                  border: '1px solid var(--border, #dde8f8)',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  background: '#fafcff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <strong style={{ fontSize: '13px', color: '#5c6f8f' }}>Entry #{index + 1}</strong>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!entry.isNew ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-info"
                        onClick={() => viewLogs(entry.id)}
                      >
                        <i className="ph-duotone ph-clock-counter-clockwise me-1"></i> Logs
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteEntry(index)}
                    >
                      <i className="ph-duotone ph-trash me-1"></i> Delete
                    </button>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label className="field-label">Date</label>
                    <input
                      type="date"
                      className="field-input"
                      value={entry.date}
                      onChange={(e) => updateEntry(index, { date: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label className="field-label">Office Visit</label>
                    <select
                      className="field-input"
                      value={entry.status}
                      onChange={(e) => updateEntry(index, { status: e.target.value })}
                    >
                      <option value="inactive">Inactive</option>
                      <option value="active">Active</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">Added By</label>
                    <input
                      className="field-input"
                      value={entry.isNew ? '' : entry.addedBy}
                      readOnly
                      placeholder={entry.isNew ? 'Set after save' : ''}
                    />
                  </div>
                  <div className="field form-full">
                    <label className="field-label">Remarks</label>
                    <textarea
                      className="field-input"
                      rows={2}
                      value={entry.details}
                      onChange={(e) => updateEntry(index, { details: e.target.value })}
                    />
                  </div>
                </div>

                {entry.status === 'active' ? (
                  <div style={{ marginTop: '1rem' }}>
                    <label className="field-label">
                      <strong>Attachments</strong>
                    </label>
                    <div style={{ marginBottom: '0.5rem' }}>
                      {entry.files.length === 0 ? (
                        <p className="text-muted small mb-0">No attachments yet.</p>
                      ) : (
                        entry.files.map((file) => (
                          <div
                            key={file.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              marginBottom: '0.35rem',
                            }}
                          >
                            <a
                              href={fileUrl(storageBase, file.file_path)}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-info"
                            >
                              <i className="ph-duotone ph-eye me-1"></i> {file.file_name}
                            </a>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteFile(index, file.id)}
                            >
                              <i className="ph-duotone ph-trash"></i>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    {entry.isNew ? (
                      <p className="text-muted small">Save the entry first to upload files.</p>
                    ) : (
                      <div className="input-group">
                        <input
                          type="file"
                          className="form-control"
                          multiple
                          onChange={(e) =>
                            setPendingFiles((prev) => ({
                              ...prev,
                              [index]: e.target.files,
                            }))
                          }
                        />
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={uploadingId === entry.id}
                          onClick={() => {
                            uploadFiles(index, pendingFiles[index]);
                            setPendingFiles((prev) => ({ ...prev, [index]: null }));
                          }}
                        >
                          <i className="ph-duotone ph-upload-simple me-1"></i>
                          {uploadingId === entry.id ? 'Uploading…' : 'Upload'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}

                <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    disabled={savingId === (entry.id || `new-${index}`)}
                    onClick={() => saveEntry(index)}
                  >
                    <i className="ph-duotone ph-floppy-disk me-1"></i>{' '}
                    {savingId === (entry.id || `new-${index}`) ? 'Saving…' : 'Save Entry'}
                  </button>
                </div>
              </div>
            ))}

            <button type="button" className="btn btn-outline-primary btn-sm" onClick={addEntry}>
              <i className="ph-duotone ph-plus me-1"></i> Add Entry
            </button>
          </>
        ) : null}
      </SectionCard>

      {logsOpen ? (
        <div className="modal show d-block quiz-modal-overlay" tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title text-white mb-0">
                  <i className="ph-duotone ph-clock-counter-clockwise me-2"></i>
                  Follow Up Change Logs
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setLogsOpen(false)}
                />
              </div>
              <div className="modal-body">
                {logsLoading ? (
                  <div className="text-center py-3">Loading…</div>
                ) : logs.length === 0 ? (
                  <div className="alert alert-info mb-0">No logs found for this entry.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered mb-0">
                      <thead>
                        <tr>
                          <th>Changed By</th>
                          <th>Field</th>
                          <th>Old Value</th>
                          <th>New Value</th>
                          <th>When</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log) => (
                          <tr key={log.id}>
                            <td>{log.changed_by_user_name || 'System'}</td>
                            <td>
                              <code>{log.field_changed}</code>
                            </td>
                            <td>{log.old_value ?? '—'}</td>
                            <td>{log.new_value ?? '—'}</td>
                            <td style={{ whiteSpace: 'nowrap', fontSize: '12px' }}>
                              {log.changed_at}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setLogsOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

import { useState } from 'react';
import api from '../../../services/api';
import { fileUrl } from '../formShared';
import { showErrorPopup, showSuccessPopup } from '../../../utils/popups';

function minConstanciaDate() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
}

/**
 * Constancia LFD date + document upload / email — matches edit-form.blade.php
 */
export default function ConstanciaLfdBlock({
  mode,
  readOnly,
  constanciaLfd,
  constanciaLfdFile,
  pendingFile,
  applicationId,
  driverName,
  driverEmail,
  storageBase,
  onDateChange,
  onFileSelect,
  onFileDeleted,
}) {
  const [showSendModal, setShowSendModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const hasSavedFile = !!constanciaLfdFile;
  const hasPendingFile = !!pendingFile;
  const showDocumentSection = !!constanciaLfd;
  const fileUrlView = hasSavedFile ? fileUrl(storageBase, constanciaLfdFile) : null;

  const handleDelete = async () => {
    if (!applicationId || !hasSavedFile) return;
    if (!window.confirm('Are you sure you want to delete the CONSTANCIA LFD document?')) return;
    setDeleting(true);
    try {
      const { data } = await api.delete(`/application-forms/${applicationId}/constancia-lfd-file`);
      if (data.success) {
        await showSuccessPopup({ title: 'Deleted', text: data.message || 'Document deleted.' });
        onFileDeleted?.();
      } else {
        await showErrorPopup({ title: 'Delete Failed', text: data.message || 'Could not delete document.' });
      }
    } catch (err) {
      await showErrorPopup({
        title: 'Delete Failed',
        text: err.response?.data?.message || 'An error occurred while deleting the document.',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleSend = async () => {
    if (!applicationId) return;
    setSending(true);
    try {
      const { data } = await api.post(`/application-forms/${applicationId}/send-constancia-lfd`);
      if (data.success) {
        setShowSendModal(false);
        await showSuccessPopup({
          title: 'Email Sent',
          text: data.message || `CONSTANCIA LFD document sent successfully to ${driverEmail}`,
        });
      } else {
        await showErrorPopup({ title: 'Send Failed', text: data.message || 'Could not send email.' });
      }
    } catch (err) {
      await showErrorPopup({
        title: 'Send Failed',
        text: err.response?.data?.message || 'An error occurred while sending the document.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="form-grid printnone" style={{ marginTop: '1.25rem' }}>
        <div className="field form-full">
          <label className="field-label">Constancia LFD</label>
          <input
            type="date"
            className="field-input"
            value={constanciaLfd}
            min={minConstanciaDate()}
            disabled={readOnly}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </div>

      {showDocumentSection ? (
        <>
          <div className="divider" />
          <div className="field printnone">
            <label className="field-label">
              Constancia LFD Document
              {hasSavedFile ? (
                <span className="badge-verified ms-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Document Uploaded
                </span>
              ) : null}
            </label>

            {hasSavedFile && !readOnly && mode === 'edit' ? (
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.75rem' }} className="printnone">
                <a
                  href={fileUrlView}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-bar"
                  style={{ borderColor: '#1e5fd4', color: '#1e5fd4' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  View File
                </a>
                <button
                  type="button"
                  className="btn-bar"
                  style={{ borderColor: '#0d7a5e', color: '#0d7a5e' }}
                  onClick={() => setShowSendModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Send To Driver
                </button>
                <button
                  type="button"
                  className="btn-bar"
                  style={{ borderColor: '#c0392b', color: '#c0392b' }}
                  disabled={deleting}
                  onClick={handleDelete}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  </svg>
                  {deleting ? 'Deleting…' : 'Delete File'}
                </button>
              </div>
            ) : null}

            {hasSavedFile && readOnly ? (
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.75rem' }} className="printnone">
                <a
                  href={fileUrlView}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-bar"
                  style={{ borderColor: '#1e5fd4', color: '#1e5fd4' }}
                >
                  View File
                </a>
              </div>
            ) : null}

            {!readOnly && mode === 'edit' ? (
              <>
                <input
                  type="file"
                  className="form-control"
                  name="constancia_lfd_file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
                />
                {hasPendingFile ? (
                  <small className="text-muted d-block mt-1">
                    Selected: {pendingFile.name} — save the form to upload.
                  </small>
                ) : null}
                <small className="text-muted">Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max: 5MB)</small>
              </>
            ) : null}
          </div>
        </>
      ) : null}

      {showSendModal ? (
        <div className="modal show d-block quiz-modal-overlay" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title text-white mb-0">Send CONSTANCIA LFD Document</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowSendModal(false)} />
              </div>
              <div className="modal-body">
                <p className="mb-3">This will send the CONSTANCIA LFD document to the driver via email.</p>
                <div className="alert alert-info mb-0">
                  <strong>Driver Name:</strong> {driverName}
                  <br />
                  <strong>Driver Email:</strong> {driverEmail}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={() => setShowSendModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" disabled={sending} onClick={handleSend}>
                  {sending ? 'Sending…' : 'Send Email'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

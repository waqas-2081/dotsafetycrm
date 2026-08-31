import { useEffect, useState } from 'react';
import api from '../../../services/api';
import { showErrorPopup, showSuccessPopup } from '../../../utils/popups';

export const EMPLOYMENT_VERIFICATION_REASONS = [
  'Initial Request For Verification',
  'Follow Up Email #1',
  'Follow Up Email #2',
];

const MAX_EMAILS = 3;

function formatDateTime(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function EmploymentVerificationBlock({ mode, employment, onUpdate }) {
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const canManage = mode === 'edit' && employment?.id && employment.id !== 'new';
  const emailCount = Number(employment?.email_send_count || 0);
  const canSendMore = emailCount < MAX_EMAILS && !employment?.is_employment_verified;
  const nextReason = EMPLOYMENT_VERIFICATION_REASONS[emailCount] || null;
  const hasEmail = !!employment?.prev_emp_email;

  useEffect(() => {
    setHistory([]);
    setHistoryOpen(false);
  }, [employment?.id]);

  const loadHistory = async () => {
    if (!employment?.id) return;
    setHistoryLoading(true);
    try {
      const { data } = await api.get(`/application-forms/employment/${employment.id}/email-history`);
      if (data.success) {
        setHistory(data.history || []);
      }
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const toggleHistory = async () => {
    const next = !historyOpen;
    setHistoryOpen(next);
    if (next && history.length === 0) {
      await loadHistory();
    }
  };

  const sendEmail = async () => {
    if (!employment?.id || !nextReason) return;
    if (!hasEmail) {
      await showErrorPopup({
        title: 'Email Required',
        text: 'This employment record does not have an email address.',
      });
      return;
    }

    const label = emailCount === 0 ? 'verification' : 'follow-up';
    if (!window.confirm(`Send ${label} email to ${employment.prev_emp_email}?`)) return;

    setSending(true);
    try {
      const { data } = await api.post(`/application-forms/employment/${employment.id}/send-verification`, {
        reason_for_sending: nextReason,
      });

      if (data.success) {
        onUpdate?.({
          is_verification_sent: true,
          request_id: data.request_id || employment.request_id,
          email_send_count: data.email_count ?? emailCount + 1,
        });
        await showSuccessPopup({
          title: 'Email Sent',
          text: data.message || 'Verification email sent successfully.',
        });
        if (historyOpen) {
          await loadHistory();
        }
      } else {
        await showErrorPopup({
          title: 'Send Failed',
          text: data.message || 'Could not send verification email.',
        });
      }
    } catch (err) {
      await showErrorPopup({
        title: 'Send Failed',
        text: err.response?.data?.message || 'Could not send verification email.',
      });
    } finally {
      setSending(false);
    }
  };

  const manualVerify = async () => {
    if (!employment?.id) return;
    if (!window.confirm('Mark this employment record as manually verified?')) return;

    setVerifying(true);
    try {
      const { data } = await api.post(`/application-forms/employment/${employment.id}/manual-verify`, {
        verification_notes: 'Manually verified by admin',
      });

      if (data.success) {
        onUpdate?.({
          is_employment_verified: true,
          is_verification_sent: true,
          request_id: data.request_id || employment.request_id,
        });
        await showSuccessPopup({
          title: 'Verified',
          text: data.message || 'Employment verified successfully.',
        });
        if (historyOpen) {
          await loadHistory();
        }
      } else {
        await showErrorPopup({
          title: 'Verification Failed',
          text: data.message || 'Could not verify employment.',
        });
      }
    } catch (err) {
      await showErrorPopup({
        title: 'Verification Failed',
        text: err.response?.data?.message || 'Could not verify employment.',
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="verification-section" style={{ borderTop: '1px solid var(--border)', marginTop: '.75rem', paddingTop: '.75rem' }}>
      <p style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--navy)', margin: '0 0 .35rem' }}>
        Employment Verification
      </p>

      <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
        {employment.is_employment_verified ? (
          <span className="badge-verified">Verified</span>
        ) : employment.is_verification_sent ? (
          <span className="badge-pending">⏳ Verification Email Sent</span>
        ) : (
          <span className="badge-pending">Pending Verification</span>
        )}
        <small style={{ color: 'var(--muted)', fontSize: '.72rem' }}>
          Emails sent: {emailCount} / {MAX_EMAILS}
        </small>
      </div>

      {employment.request_id ? (
        <small style={{ display: 'block', color: 'var(--muted)', fontSize: '.72rem', marginBottom: '.5rem' }}>
          Request ID: {employment.request_id}
        </small>
      ) : null}

      {canManage && !employment.is_employment_verified ? (
        <div className="d-flex flex-wrap gap-2 mb-2">
          {canSendMore && nextReason ? (
            <button
              type="button"
              className="btn btn-sm btn-primary"
              disabled={sending || !hasEmail}
              onClick={sendEmail}
            >
              {sending
                ? 'Sending…'
                : emailCount === 0
                  ? 'Send Verification Email'
                  : `Send Follow-Up Email #${emailCount}`}
            </button>
          ) : (
            <small style={{ color: 'var(--muted)' }}>Email send limit reached for this record.</small>
          )}
          <button
            type="button"
            className="btn btn-sm btn-outline-success"
            disabled={verifying}
            onClick={manualVerify}
          >
            {verifying ? 'Verifying…' : 'Manual Verify'}
          </button>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={toggleHistory}>
            {historyOpen ? 'Hide Email History' : 'View Email History'}
          </button>
        </div>
      ) : null}

      {!hasEmail && canManage && !employment.is_employment_verified ? (
        <small style={{ display: 'block', color: '#b45309', fontSize: '.72rem', marginBottom: '.5rem' }}>
          Add a company email before sending verification messages.
        </small>
      ) : null}

      {historyOpen ? (
        <div style={{ marginTop: '.5rem' }}>
          {historyLoading ? (
            <small style={{ color: 'var(--muted)' }}>Loading email history…</small>
          ) : history.length === 0 ? (
            <small style={{ color: 'var(--muted)' }}>No emails sent yet.</small>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0" style={{ fontSize: '.75rem' }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Reason</th>
                    <th>Sent To</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row) => (
                    <tr key={row.id}>
                      <td>{formatDateTime(row.sent_at)}</td>
                      <td>{row.reason_for_sending || '—'}</td>
                      <td>{row.sent_to_email || '—'}</td>
                      <td>{row.status || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

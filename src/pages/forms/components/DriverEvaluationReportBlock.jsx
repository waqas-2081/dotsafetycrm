import { useEffect, useState } from 'react';
import api from '../../../services/api';
import SectionCard from './SectionCard';

const COLUMNS = [
  { key: 'driver_name', label: 'Driver Name', readOnly: true },
  { key: 'clearinghouse', label: 'Clearinghouse' },
  { key: 'psp_report', label: 'PSP Report' },
  { key: 'driver_license', label: 'Driver License' },
  { key: 'apto_mx', label: 'Apto MX' },
  { key: 'medical_card', label: 'Medical Card' },
  { key: 'mvr', label: 'MVR' },
  { key: 'drug_test_result', label: 'DRUG TEST RESULT' },
];

function mapEntry(entry, driverName) {
  return {
    id: entry.id,
    isNew: false,
    driver_name: entry.driver_name || driverName || '',
    clearinghouse: entry.clearinghouse || '',
    psp_report: entry.psp_report || '',
    driver_license: entry.driver_license || '',
    apto_mx: entry.apto_mx || '',
    medical_card: entry.medical_card || '',
    mvr: entry.mvr || '',
    drug_test_result: entry.drug_test_result || '',
  };
}

function emptyEntry(driverName) {
  return {
    id: null,
    isNew: true,
    driver_name: driverName || '',
    clearinghouse: '',
    psp_report: '',
    driver_license: '',
    apto_mx: '',
    medical_card: '',
    mvr: '',
    drug_test_result: '',
  };
}

export default function DriverEvaluationReportBlock({
  applicationId,
  driverName,
  initialEntries,
  onRefresh,
}) {
  const [entries, setEntries] = useState([]);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const mapped = (initialEntries || []).map((entry) => mapEntry(entry, driverName));
    setEntries(mapped.length ? mapped : [emptyEntry(driverName)]);
  }, [initialEntries, driverName]);

  const addEntry = () => {
    setEntries((prev) => [...prev, emptyEntry(driverName)]);
  };

  const removeNewEntry = (index) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEntry = (index, key, value) => {
    setEntries((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
  };

  const saveEntry = async (index) => {
    const entry = entries[index];
    setSavingId(entry.id || `new-${index}`);
    try {
      const { data } = await api.post(`/driver-evaluation/save/${applicationId}`, {
        entries: [
          {
            id: entry.isNew ? null : entry.id,
            clearinghouse: entry.clearinghouse,
            psp_report: entry.psp_report,
            driver_license: entry.driver_license,
            apto_mx: entry.apto_mx,
            medical_card: entry.medical_card,
            mvr: entry.mvr,
            drug_test_result: entry.drug_test_result,
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
    if (!window.confirm('Delete this evaluation report entry? This cannot be undone.')) return;
    try {
      const { data } = await api.delete(`/driver-evaluation/delete-entry/${entry.id}`);
      if (data.success) {
        setEntries((prev) => {
          const next = prev.filter((_, i) => i !== index);
          return next.length ? next : [emptyEntry(driverName)];
        });
      } else {
        window.alert(data.message || 'Delete failed.');
      }
    } catch {
      window.alert('Delete error.');
    }
  };

  return (
    <SectionCard title="Driver Evaluation Report" iconBg="#1a5276" className="driver-eval-section printnone">
      <div className="table-responsive">
        <table className="table table-bordered align-middle mb-3" style={{ minWidth: '960px' }}>
          <thead style={{ background: '#f0f6ff' }}>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} style={{ fontSize: '12px', whiteSpace: 'nowrap', padding: '0.65rem 0.5rem' }}>
                  {col.label}
                </th>
              ))}
              <th style={{ width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.isNew ? `new-${index}` : entry.id}>
                {COLUMNS.map((col) => (
                  <td key={col.key} style={{ padding: '0.4rem' }}>
                    <input
                      className="field-input"
                      style={{ fontSize: '12px', padding: '0.35rem 0.5rem' }}
                      value={entry[col.key]}
                      readOnly={col.readOnly}
                      onChange={
                        col.readOnly
                          ? undefined
                          : (e) => updateEntry(index, col.key, e.target.value)
                      }
                    />
                  </td>
                ))}
                <td style={{ padding: '0.4rem', whiteSpace: 'nowrap' }}>
                  <button
                    type="button"
                    className="btn btn-success btn-sm me-1"
                    disabled={savingId === (entry.id || `new-${index}`)}
                    onClick={() => saveEntry(index)}
                    title="Save entry"
                  >
                    <i className="ph-duotone ph-floppy-disk"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteEntry(index)}
                    title="Delete entry"
                  >
                    <i className="ph-duotone ph-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn btn-outline-primary btn-sm" onClick={addEntry}>
        <i className="ph-duotone ph-plus me-1"></i> Add Entry
      </button>
    </SectionCard>
  );
}

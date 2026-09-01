import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import PageSkeleton from '../../components/PageSkeleton';
import HosCompanyPanel, { fmtDate } from './HosCompanyPanel';

const EDIT_STYLES = `
.ac-shell { border: 1px solid #dfe8f7; box-shadow: 0 8px 24px rgba(17, 54, 126, 0.06); }
.ac-body { padding: 1.2rem 1.2rem 1.35rem; }
.ac-tabs.nav-tabs {
    border: 1px solid #dfe7f6; border-radius: 12px; padding: 0.45rem;
    background: #f6faff; margin-bottom: 1.1rem; gap: 0.5rem;
}
.ac-tabs .nav-link {
    border: 1px solid transparent; border-radius: 10px; color: #5c6f8f;
    background: transparent; padding: 0.66rem 1.25rem; font-weight: 600;
    transition: all 0.18s ease; position: relative;
}
.ac-tabs .nav-link.active {
    background: linear-gradient(180deg, #e9f3ff 0%, #d8eaff 100%);
    border-color: #c2dbff; color: #174ea6;
    box-shadow: 0 6px 14px rgba(22, 78, 166, 0.16);
}
.ac-tabs .nav-link.active::after {
    content: ''; position: absolute; left: 10px; right: 10px; bottom: -7px;
    height: 3px; border-radius: 999px; background: #2f74de;
}
.ac-tabs .nav-link:hover { background: #e9f3ff; border-color: #cfe1ff; color: #1f4f99; }
.ac-label { font-weight: 600; color: #36445e; margin-bottom: 0.45rem; display: block; }
.ac-required { color: #ef4444; }
.ac-input, .ac-textarea, .ac-file {
    border: 1px solid #dbe7fa; border-radius: 7px; background: #f4f8ff;
    box-shadow: none; color: #253755;
}
.ac-input, .ac-file { height: 44px; }
.ac-textarea { min-height: 86px; resize: vertical; }
.ac-input:focus, .ac-textarea:focus, .ac-file:focus {
    border-color: #bfd4f7; box-shadow: 0 0 0 2px rgba(17, 63, 147, 0.1); background: #fff;
}
.ac-btn-save {
    margin-top: 0.9rem; background: #d9e9ff; border-color: #c8ddff; color: #174ea6;
    border-radius: 6px; font-weight: 600; padding: 0.45rem 0.8rem;
}
.ac-btn-save:hover { background: #c9ddfb; border-color: #b8d2fb; color: #123f8a; }
.ac-form-note { font-size: 12px; color: #7a889f; margin-top: 0.28rem; }
.section-card {
    border: 1px solid #e0e9f5; border-radius: 10px; padding: 1rem;
    margin-bottom: 1rem; background: #fefefe; position: relative;
}
.section-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e9eef5;
}
.remove-section { color: #dc3545; cursor: pointer; font-size: 14px; font-weight: 600; }
.file-list .file-item, .unit-doc-list .unit-doc-item {
    display: flex; align-items: center; justify-content: space-between;
    gap: 0.75rem; padding: 0.35rem 0; border-bottom: 1px solid #eef3fb;
}
.insp-table thead th {
    background: #eef3fd; color: #4a5b7e; font-weight: 700; font-size: 12px;
    white-space: nowrap;
}
.insp-view-btn {
    border: 0; background: #e8f0ff; color: #174ea6; width: 30px; height: 30px;
    border-radius: 6px;
}
.insp-status-fail { color: #dc3545; font-size: 18px; }
.insp-status-pass { color: #198754; font-size: 18px; }
.insp-active-badge {
    display: inline-block; padding: 0.2rem 0.5rem; border-radius: 999px;
    font-size: 11px; font-weight: 700;
}
.insp-active-yes { background: #d1e7dd; color: #0f5132; }
.insp-active-no { background: #f8d7da; color: #842029; }
.insp-file-btn {
    border: 0; background: #fff3cd; color: #856404; width: 30px; height: 30px;
    border-radius: 6px; margin-right: 4px;
}
#hos-pane table button { padding: 2px 4px; font-size: 6px; border-radius: 6px; }
#hos-pane table button i { font-size: 14px; }
.hos-company-tabs { border-bottom: 2px solid #c5d4f0; margin-bottom: 0 !important; }
.hos-company-tabs .nav-link {
    font-size:13px;font-weight:700;color:#4a5b7e;border:1px solid transparent;
    padding:9px 20px;border-radius:8px 8px 0 0;background:#eef3fd;margin-right:3px;
}
.hos-company-tabs .nav-link.active {
    color:#fff;background:#174ea6;border-color:#174ea6 #174ea6 #fff;
}
.hos-company-content {
    border:1px solid #c5d4f0;border-top:none;border-radius:0 0 10px 10px;
    padding:18px 16px 16px;background:#fff;
}
.hos-sub-tabs { border-bottom:2px solid #dde8f8; }
.hos-sub-tabs .nav-link {
    font-size:13px;font-weight:600;color:#6b7a99;border:none;
    padding:8px 18px;border-radius:6px 6px 0 0;
}
.hos-sub-tabs .nav-link.active {
    color:#174ea6;background:#eef3fd;border-bottom:2px solid #174ea6;
}
.hos-import-card {
    border:1px solid #dde8f8;border-radius:10px;padding:14px 16px;
    margin-bottom:16px;background:#f8fbff;
}
.hos-import-header {
    display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;
}
.hos-import-header strong { font-size:13.5px;color:#1e2d4a;display:block; }
.hos-import-meta { font-size:11.5px;color:#8a9ab5;margin-top:2px;display:block; }
.hos-data-table { font-size:12.5px;background:#fff;border-radius:6px; }
.hos-data-table thead th {
    background:#eef3fd;color:#4a5b7e;font-weight:700;font-size:11px;
    text-transform:uppercase;letter-spacing:.03em;border-bottom:1px solid #dde8f8;white-space:nowrap;
}
.hos-import-actions { display:flex;gap:6px;align-items:center;flex-wrap:wrap; }
.hos-filter-panel {
    border:1px solid #dde8f8;border-radius:10px;padding:14px 16px;background:#f8fbff;
}
.manual-row-card {
    background:#fff;border:1px solid #dde8f8;border-radius:8px;padding:12px 14px;
    margin-bottom:10px;position:relative;
}
.manual-row-remove {
    position:absolute;top:8px;right:10px;color:#e53935;cursor:pointer;
    background:none;border:none;font-size:16px;line-height:1;
}
.btn-xs { padding:0.15rem 0.4rem;font-size:0.75rem;line-height:1.2;border-radius:4px; }
`;

const DOC_FIELDS = [
  ['insurance', 'Insurance'],
  ['mcs_150', 'MCS-150'],
  ['texas_fleet', 'Texas Fleet'],
  ['scac', 'SCAC'],
  ['tx_dmv', 'TX DMV'],
  ['ucr', 'UCR'],
  ['form_2290', '2290'],
  ['ifta', 'IFTA'],
  ['kentucky', 'Kentucky'],
];

const SOURCE_LABELS = {
  samsara: 'Samsara',
  motive: 'Motive',
  monarch: 'Monarch',
  hos247: 'HOS247',
};

const EMPTY_UNIT = {
  type: '',
  unit_number: '',
  vin: '',
  year: '',
  make: '',
  model: '',
  due_date: '',
  notes: '',
  documents: [],
  newFiles: [],
  removeDocs: [],
};

function basename(path) {
  if (!path) return '';
  return String(path).split('/').pop();
}

/** Document links use /storage/... not /public/storage/... */
function companyDocumentUrl(storageBase, filePath) {
  if (!filePath) return '#';
  const base = String(storageBase || '').replace(/\/$/, '');
  const path = String(filePath).replace(/^\/+/, '');
  return `${base}/${path}`.replace('/public/storage/', '/storage/');
}

export default function CompanyEdit() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('company-info-pane');
  const [company, setCompany] = useState(null);
  const [elogCompanies, setElogCompanies] = useState([]);
  const [hosImports, setHosImports] = useState([]);
  const [discImports, setDiscImports] = useState([]);
  const [unidImports, setUnidImports] = useState([]);
  const [activeHosSource, setActiveHosSource] = useState(null);
  const [storageBase, setStorageBase] = useState('');
  const [form, setForm] = useState({});
  const [dueDates, setDueDates] = useState({});
  const [docFiles, setDocFiles] = useState({});
  const [removeFiles, setRemoveFiles] = useState({});
  const [units, setUnits] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [hosSourceTab, setHosSourceTab] = useState('samsara');

  // Inspection modal state
  const [inspModalOpen, setInspModalOpen] = useState(false);
  const [inspEditMode, setInspEditMode] = useState(false);
  const [currentInspId, setCurrentInspId] = useState(null);
  const [inspForm, setInspForm] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [attachOpen, setAttachOpen] = useState(false);
  const [attachInsp, setAttachInsp] = useState(null);
  const [attachFiles, setAttachFiles] = useState([]);

  const loadEdit = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/companies/${id}/edit`);
      setCompany(data.company);
      setElogCompanies(data.elog_companies || []);
      setHosImports(data.hos_imports || []);
      setDiscImports(data.disc_imports || []);
      setUnidImports(data.unid_imports || []);
      setActiveHosSource(data.active_hos_source || null);
      setStorageBase(data.storage_base || '');
      setInspections(data.company?.inspections || []);

      const c = data.company || {};
      setForm({
        company_name: c.company_name || '',
        contact_name: c.contact_name || '',
        email: c.email || '',
        telephone: c.telephone || '',
        der: c.der || '',
        usdot: c.usdot || '',
        mc: c.mc || '',
        pin_sms: c.pin_sms || '',
        clearing_house: c.clearing_house || '',
        fmcsa_portal: c.fmcsa_portal || '',
        e_logs: c.e_logs || '',
        address: c.address || '',
        notes: c.notes || '',
        number_of_units: c.number_of_units ?? 0,
      });

      const dates = {};
      DOC_FIELDS.forEach(([key]) => {
        dates[`${key}_due_date`] = c[`${key}_due_date`] || '';
      });
      setDueDates(dates);

      const existingUnits = Array.isArray(c.units) ? c.units : [];
      const count = parseInt(c.number_of_units, 10) || existingUnits.length || 0;
      const nextUnits = Array.from({ length: count }, (_, i) => {
        const u = existingUnits[i] || {};
        const docs =
          Array.isArray(u.documents) && u.documents.length
            ? u.documents
            : u.document
              ? [u.document]
              : [];
        return {
          ...EMPTY_UNIT,
          type: u.type || '',
          unit_number: u.unit_number || '',
          vin: u.vin || '',
          year: u.year || '',
          make: u.make || '',
          model: u.model || '',
          due_date: u.due_date || '',
          notes: u.notes || '',
          documents: docs,
          newFiles: [],
          removeDocs: [],
        };
      });
      setUnits(nextUnits);
    } catch {
      setErrors(['Failed to load company.']);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEdit();
  }, [loadEdit]);

  useEffect(() => {
    if (activeHosSource) setHosSourceTab(activeHosSource);
  }, [activeHosSource]);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const syncUnitCount = (count) => {
    const n = Math.max(0, parseInt(count, 10) || 0);
    setForm((prev) => ({ ...prev, number_of_units: n }));
    setUnits((prev) => {
      if (n === prev.length) return prev;
      if (n > prev.length) {
        return [
          ...prev,
          ...Array.from({ length: n - prev.length }, () => ({ ...EMPTY_UNIT })),
        ];
      }
      return prev.slice(0, n);
    });
  };

  const setUnitField = (index, name, value) => {
    setUnits((prev) =>
      prev.map((u, i) => (i === index ? { ...u, [name]: value } : u))
    );
  };

  const toggleRemoveDoc = (field, path) => {
    setRemoveFiles((prev) => {
      const list = prev[field] || [];
      return {
        ...prev,
        [field]: list.includes(path)
          ? list.filter((p) => p !== path)
          : [...list, path],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('_method', 'PUT');
      fd.append('active_tab', activeTab);
      Object.entries(form).forEach(([key, value]) => fd.append(key, value ?? ''));

      DOC_FIELDS.forEach(([key]) => {
        fd.append(`${key}_due_date`, dueDates[`${key}_due_date`] || '');
        (docFiles[`${key}_file`] || []).forEach((file) =>
          fd.append(`${key}_file[]`, file)
        );
        (removeFiles[`${key}_file`] || []).forEach((path) =>
          fd.append(`remove_${key}_file[]`, path)
        );
      });

      (docFiles.miscellaneous_file || []).forEach((file) =>
        fd.append('miscellaneous_file[]', file)
      );
      (removeFiles.miscellaneous_file || []).forEach((path) =>
        fd.append('remove_miscellaneous_file[]', path)
      );

      units.forEach((unit, i) => {
        ['type', 'unit_number', 'vin', 'year', 'make', 'model', 'due_date', 'notes'].forEach(
          (field) => fd.append(`units[${i}][${field}]`, unit[field] ?? '')
        );
        (unit.newFiles || []).forEach((file) =>
          fd.append(`units[${i}][document][]`, file)
        );
        (unit.removeDocs || []).forEach((path) =>
          fd.append(`remove_unit_document[${i}][]`, path)
        );
      });

      await api.post(`/companies/${id}`, fd);
      setSuccess('Company updated successfully.');
      await loadEdit();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(Object.values(data.errors).flat());
      else setErrors([data?.message || 'Failed to update company.']);
    } finally {
      setSubmitting(false);
    }
  };

  const loadDrivers = async (q = '') => {
    try {
      const { data } = await api.get('/companies/drivers/search', {
        params: { q, company_id: id },
      });
      setDrivers(data.results || []);
    } catch {
      setDrivers([]);
    }
  };

  const openAddInspection = () => {
    setInspEditMode(false);
    setCurrentInspId(null);
    setInspForm({
      report_number: '',
      status: 'fail',
      inspection_date: '',
      fmcsa_post_date: '',
      inspection_level: '',
      oos_violations_count: 0,
      driver_id: '',
      driver_name: '',
      unit_number: '',
      vin: '',
      vehicle_plate: '',
      hm: '',
    });
    loadDrivers();
    setInspModalOpen(true);
  };

  const saveInspection = async () => {
    const driver = drivers.find((d) => String(d.id) === String(inspForm.driver_id));
    const payload = {
      ...inspForm,
      driver_name: driver?.text || inspForm.driver_name || '',
      oos_violations_count: parseInt(inspForm.oos_violations_count, 10) || 0,
    };
    try {
      if (inspEditMode && currentInspId) {
        const { data } = await api.put(
          `/companies/${id}/inspections/${currentInspId}`,
          payload
        );
        setInspections((prev) =>
          prev.map((row) => (row.id === data.inspection.id ? data.inspection : row))
        );
      } else {
        const { data } = await api.post(`/companies/${id}/inspections`, payload);
        setInspections((prev) => [data.inspection, ...prev]);
      }
      setInspModalOpen(false);
    } catch {
      window.alert('Error saving inspection.');
    }
  };

  const deleteInspection = async (inspId) => {
    if (!window.confirm('Delete this inspection?')) return;
    try {
      await api.delete(`/companies/${id}/inspections/${inspId}`);
      setInspections((prev) => prev.filter((r) => r.id !== inspId));
    } catch {
      window.alert('Failed to delete inspection.');
    }
  };

  const viewInspection = async (inspId) => {
    try {
      const { data } = await api.get(`/companies/${id}/inspections/${inspId}`);
      setDetailData(data);
      setCurrentInspId(inspId);
      setDetailOpen(true);
    } catch {
      window.alert('Failed to load inspection.');
    }
  };

  const openAttach = async (inspId) => {
    try {
      const { data } = await api.get(`/companies/${id}/inspections/${inspId}`);
      setAttachInsp(data.inspection);
      setCurrentInspId(inspId);
      setAttachFiles([]);
      setAttachOpen(true);
    } catch {
      window.alert('Failed to load inspection files.');
    }
  };

  const uploadAttachFiles = async () => {
    if (!attachFiles.length) return;
    const fd = new FormData();
    attachFiles.forEach((f) => fd.append('files[]', f));
    try {
      const { data } = await api.post(
        `/companies/${id}/inspections/${currentInspId}/files`,
        fd
      );
      setAttachInsp(data.inspection);
      setInspections((prev) =>
        prev.map((row) => (row.id === data.inspection.id ? data.inspection : row))
      );
      setAttachFiles([]);
    } catch {
      window.alert('Upload failed.');
    }
  };

  const deleteAttachFile = async (filePath) => {
    try {
      const { data } = await api.delete(
        `/companies/${id}/inspections/${currentInspId}/files`,
        { data: { file_path: filePath } }
      );
      setAttachInsp(data.inspection);
      setInspections((prev) =>
        prev.map((row) => (row.id === data.inspection.id ? data.inspection : row))
      );
    } catch {
      window.alert('Failed to delete file.');
    }
  };

  const existingFileList = (field) => {
    const files = company?.[field];
    return Array.isArray(files) ? files : [];
  };

  const tabs = [
    { id: 'company-info-pane', label: 'Company Information' },
    { id: 'document-management-pane', label: 'Document Management' },
    { id: 'unit-details-pane', label: 'Unit Details' },
    { id: 'inspections-pane', label: 'Inspections' },
    { id: 'hos-pane', label: 'Hours Of Service Violations' },
  ];

  const unitOptions = useMemo(
    () => units.filter((u) => u.unit_number),
    [units]
  );

  if (loading) {
    return <PageSkeleton variant="form" />;
  }

  if (!company) {
    return (
      <div className="pc-container">
        <div className="pc-content py-5 text-center text-danger">Company not found.</div>
      </div>
    );
  }

  return (
    <>
      <style>{EDIT_STYLES}</style>
      <link rel="stylesheet" href="/assets/css/companiesedit.css" />

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
                      <Link to="/companies">Companies</Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      Edit Company
                    </li>
                  </ul>
                </div>
                <div className="col-md-12">
                  <div className="page-header-title">
                    <h2 className="mb-0">Edit Company — {company.company_name}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <ul className="mb-0">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
              <button type="button" className="btn-close" onClick={() => setErrors([])}></button>
            </div>
          )}
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
            </div>
          )}

          <div className="card ac-shell">
            <div className="ac-body">
              <form id="companyForm" onSubmit={handleSubmit}>
                <input type="hidden" name="active_tab" value={activeTab} />

                <div className="d-flex gap-2 mb-2">
                  <button
                    type="submit"
                    className="btn btn-primary ac-btn-save"
                    style={{ marginTop: 0 }}
                    disabled={submitting}
                  >
                    {submitting ? 'Updating...' : 'Update Company'}
                  </button>
                  <Link
                    to="/companies"
                    className="btn btn-secondary ac-btn-save"
                    style={{ marginTop: 0 }}
                  >
                    Cancel
                  </Link>
                </div>

                <ul className="nav nav-tabs ac-tabs" id="companyTabs" role="tablist">
                  {tabs.map((tab) => (
                    <li className="nav-item" role="presentation" key={tab.id}>
                      <button
                        className={`nav-link${activeTab === tab.id ? ' active' : ''}`}
                        type="button"
                        role="tab"
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="tab-content">
                  {activeTab === 'company-info-pane' && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="ac-label">
                          Company Name <span className="ac-required">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control ac-input"
                          value={form.company_name}
                          required
                          onChange={(e) => setField('company_name', e.target.value)}
                        />
                      </div>
                      {[
                        ['contact_name', 'Contact Person'],
                        ['email', 'Email Address'],
                        ['telephone', 'Phone Number'],
                        ['der', 'DER'],
                        ['usdot', 'US DOT'],
                        ['mc', 'MC'],
                        ['pin_sms', 'Pin SMS'],
                        ['clearing_house', 'Clearing House'],
                        ['fmcsa_portal', 'FMCSA Portal'],
                        ['address', 'Address'],
                      ].map(([name, label]) => (
                        <div className="col-md-6" key={name}>
                          <label className="ac-label">{label}</label>
                          <input
                            type={name === 'email' ? 'email' : 'text'}
                            className="form-control ac-input"
                            value={form[name] || ''}
                            onChange={(e) => setField(name, e.target.value)}
                          />
                        </div>
                      ))}
                      <div className="col-md-6">
                        <label className="ac-label">E-Logs</label>
                        <select
                          className="form-control ac-input"
                          value={form.e_logs || ''}
                          onChange={(e) => setField('e_logs', e.target.value)}
                        >
                          <option value="">-- Select E-Log Provider --</option>
                          {elogCompanies.map((elog) => (
                            <option key={elog.id} value={elog.company_name}>
                              {elog.company_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="ac-label">Notes</label>
                        <textarea
                          className="form-control ac-textarea"
                          value={form.notes || ''}
                          onChange={(e) => setField('notes', e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {activeTab === 'document-management-pane' && (
                    <div className="row g-3">
                      {DOC_FIELDS.map(([key, label]) => {
                        const fileField = `${key}_file`;
                        const existing = existingFileList(fileField);
                        return (
                          <div key={key} style={{ display: 'contents' }}>
                            <div className="col-md-6">
                              <label className="ac-label">{label} Due Date</label>
                              <input
                                type="date"
                                className="form-control ac-input"
                                value={dueDates[`${key}_due_date`] || ''}
                                onChange={(e) =>
                                  setDueDates((prev) => ({
                                    ...prev,
                                    [`${key}_due_date`]: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="ac-label">{label} Documents</label>
                              {existing.length > 0 && (
                                <div className="file-list mb-2">
                                  {existing.map((filePath) => (
                                    <div className="file-item" key={filePath}>
                                      <a
                                        href={companyDocumentUrl(storageBase, filePath)}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <i className="ph-duotone ph-file me-1"></i>
                                        {basename(filePath)}
                                      </a>
                                      <label>
                                        <input
                                          type="checkbox"
                                          checked={(removeFiles[fileField] || []).includes(
                                            filePath
                                          )}
                                          onChange={() =>
                                            toggleRemoveDoc(fileField, filePath)
                                          }
                                        />
                                        <span> Remove</span>
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <input
                                type="file"
                                className="form-control ac-file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                multiple
                                onChange={(e) =>
                                  setDocFiles((prev) => ({
                                    ...prev,
                                    [fileField]: Array.from(e.target.files || []),
                                  }))
                                }
                              />
                              <div className="ac-form-note">
                                {existing.length
                                  ? 'Add more files, or check "Remove" above to delete existing ones.'
                                  : 'You can select multiple files.'}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="col-12">
                        <hr className="my-1" />
                      </div>
                      <div className="col-12">
                        <label className="ac-label">Miscellaneous Documents</label>
                        {existingFileList('miscellaneous_file').length > 0 && (
                          <div className="file-list mb-2">
                            {existingFileList('miscellaneous_file').map((filePath) => (
                              <div className="file-item" key={filePath}>
                                <a
                                  href={companyDocumentUrl(storageBase, filePath)}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <i className="ph-duotone ph-file me-1"></i>
                                  {basename(filePath)}
                                </a>
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={(
                                      removeFiles.miscellaneous_file || []
                                    ).includes(filePath)}
                                    onChange={() =>
                                      toggleRemoveDoc('miscellaneous_file', filePath)
                                    }
                                  />
                                  <span> Remove</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                        <input
                          type="file"
                          className="form-control ac-file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          multiple
                          onChange={(e) =>
                            setDocFiles((prev) => ({
                              ...prev,
                              miscellaneous_file: Array.from(e.target.files || []),
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'unit-details-pane' && (
                    <>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="ac-label">Number of Sections</label>
                          <input
                            type="number"
                            className="form-control ac-input"
                            value={form.number_of_units}
                            min={0}
                            onChange={(e) => syncUnitCount(e.target.value)}
                          />
                          <div className="ac-form-note">
                            Set how many company units/sections should be tracked.
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        {units.map((unit, i) => (
                          <div className="section-card" key={i}>
                            <div className="section-header">
                              <strong>Section {i + 1}</strong>
                              <span
                                className="remove-section"
                                onClick={() => {
                                  if (
                                    !window.confirm(
                                      'Are you sure you want to remove this section?'
                                    )
                                  )
                                    return;
                                  setUnits((prev) => prev.filter((_, idx) => idx !== i));
                                  setForm((prev) => ({
                                    ...prev,
                                    number_of_units: Math.max(
                                      0,
                                      (parseInt(prev.number_of_units, 10) || 0) - 1
                                    ),
                                  }));
                                }}
                              >
                                Remove
                              </span>
                            </div>
                            <div className="row g-3">
                              <div className="col-md-4">
                                <label className="ac-label">Type</label>
                                <select
                                  className="form-control ac-input"
                                  value={unit.type}
                                  onChange={(e) => setUnitField(i, 'type', e.target.value)}
                                >
                                  <option value="">Select Type</option>
                                  <option value="Truck">Truck</option>
                                  <option value="Trailer">Trailer</option>
                                </select>
                              </div>
                              <div className="col-md-4">
                                <label className="ac-label">Unit Number</label>
                                <input
                                  type="text"
                                  className="form-control ac-input"
                                  value={unit.unit_number}
                                  onChange={(e) =>
                                    setUnitField(i, 'unit_number', e.target.value)
                                  }
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="ac-label">VIN Number</label>
                                <input
                                  type="text"
                                  className="form-control ac-input"
                                  value={unit.vin}
                                  onChange={(e) => setUnitField(i, 'vin', e.target.value)}
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="ac-label">Year</label>
                                <input
                                  type="text"
                                  className="form-control ac-input"
                                  value={unit.year}
                                  onChange={(e) => setUnitField(i, 'year', e.target.value)}
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="ac-label">Make</label>
                                <input
                                  type="text"
                                  className="form-control ac-input"
                                  value={unit.make}
                                  onChange={(e) => setUnitField(i, 'make', e.target.value)}
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="ac-label">Model</label>
                                <input
                                  type="text"
                                  className="form-control ac-input"
                                  value={unit.model}
                                  onChange={(e) => setUnitField(i, 'model', e.target.value)}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="ac-label">Due Date</label>
                                <input
                                  type="date"
                                  className="form-control ac-input"
                                  value={unit.due_date || ''}
                                  onChange={(e) =>
                                    setUnitField(i, 'due_date', e.target.value)
                                  }
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="ac-label">Documents</label>
                                {unit.documents?.length > 0 && (
                                  <div className="unit-doc-list mb-1">
                                    {unit.documents.map((docPath) => (
                                      <div className="unit-doc-item" key={docPath}>
                                        <a
                                          href={companyDocumentUrl(storageBase, docPath)}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          <i className="ph-duotone ph-file me-1"></i>
                                          {basename(docPath)}
                                        </a>
                                        <label>
                                          <input
                                            type="checkbox"
                                            checked={(unit.removeDocs || []).includes(
                                              docPath
                                            )}
                                            onChange={() => {
                                              const list = unit.removeDocs || [];
                                              setUnitField(
                                                i,
                                                'removeDocs',
                                                list.includes(docPath)
                                                  ? list.filter((p) => p !== docPath)
                                                  : [...list, docPath]
                                              );
                                            }}
                                          />
                                          <span> Remove</span>
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <input
                                  type="file"
                                  className="form-control ac-file"
                                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                  multiple
                                  onChange={(e) =>
                                    setUnitField(
                                      i,
                                      'newFiles',
                                      Array.from(e.target.files || [])
                                    )
                                  }
                                />
                                <div className="ac-form-note">You can select multiple files.</div>
                              </div>
                              <div className="col-12">
                                <label className="ac-label">Notes</label>
                                <textarea
                                  className="form-control ac-textarea"
                                  value={unit.notes}
                                  onChange={(e) => setUnitField(i, 'notes', e.target.value)}
                                ></textarea>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {activeTab === 'inspections-pane' && (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 fw-bold" style={{ color: '#36445e' }}>
                          Inspection Reports
                        </h6>
                        <button
                          type="button"
                          className="btn btn-primary ac-btn-save"
                          style={{ marginTop: 0 }}
                          onClick={openAddInspection}
                        >
                          <i className="ph-duotone ph-plus me-1"></i> Add Inspection
                        </button>
                      </div>
                      <div className="table-responsive">
                        <table className="table insp-table align-middle mb-0">
                          <thead>
                            <tr>
                              <th>View</th>
                              <th>Status</th>
                              <th>Active</th>
                              <th>Report #</th>
                              <th>Inspection Date</th>
                              <th>FMCSA Post Date</th>
                              <th>Inspection Level</th>
                              <th># OOS Viol</th>
                              <th>Driver</th>
                              <th>Unit #</th>
                              <th>VIN</th>
                              <th>Veh Plate #</th>
                              <th>HM</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inspections.length === 0 ? (
                              <tr>
                                <td colSpan={14} className="text-center text-muted py-4">
                                  No inspection reports yet.
                                </td>
                              </tr>
                            ) : (
                              inspections.map((insp) => (
                                <tr key={insp.id} data-id={insp.id}>
                                  <td>
                                    <button
                                      type="button"
                                      className="insp-view-btn"
                                      onClick={() => viewInspection(insp.id)}
                                    >
                                      <i className="ph-duotone ph-magnifying-glass"></i>
                                    </button>
                                  </td>
                                  <td>
                                    {insp.status === 'fail' ? (
                                      <i
                                        className="ph-duotone ph-warning insp-status-fail"
                                        title="Fail"
                                      ></i>
                                    ) : (
                                      <i
                                        className="ph-duotone ph-check-circle insp-status-pass"
                                        title="Pass"
                                      ></i>
                                    )}
                                  </td>
                                  <td>
                                    {insp.is_active ? (
                                      <span className="insp-active-badge insp-active-yes">
                                        Active
                                      </span>
                                    ) : (
                                      <span className="insp-active-badge insp-active-no">
                                        Inactive
                                      </span>
                                    )}
                                  </td>
                                  <td>{insp.report_number || '—'}</td>
                                  <td>{fmtDate(insp.inspection_date)}</td>
                                  <td>{fmtDate(insp.fmcsa_post_date)}</td>
                                  <td>{insp.inspection_level || '—'}</td>
                                  <td>{insp.oos_violations_count}</td>
                                  <td>{insp.driver_name || '—'}</td>
                                  <td>{insp.unit_number || '—'}</td>
                                  <td>{insp.vin || '—'}</td>
                                  <td>{insp.vehicle_plate || '—'}</td>
                                  <td>{insp.hm ? 'Yes' : 'No'}</td>
                                  <td className="text-nowrap">
                                    <button
                                      type="button"
                                      className="insp-file-btn"
                                      title="Attach Files"
                                      onClick={() => openAttach(insp.id)}
                                    >
                                      <i className="ph-duotone ph-paperclip"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => deleteInspection(insp.id)}
                                    >
                                      <i className="ph-duotone ph-trash"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {activeTab === 'hos-pane' && (
                    <div id="hos-pane">
                      {activeHosSource ? (
                        <HosCompanyPanel
                          companyId={id}
                          companyEmail={company?.email}
                          source={activeHosSource}
                          sourceLabel={SOURCE_LABELS[activeHosSource] || activeHosSource}
                          hosImports={hosImports}
                          discImports={discImports}
                          unidImports={unidImports}
                          showDisc={activeHosSource !== 'hos247'}
                          showUnid={activeHosSource !== 'hos247'}
                          onRefresh={loadEdit}
                        />
                      ) : (
                        <>
                          {!company.e_logs ? (
                            <div className="alert alert-warning mb-3" role="alert">
                              <i className="ph-duotone ph-warning me-1"></i>
                              No E-Log provider is set for this company. Showing all sources.
                              Set the <strong>E-Logs</strong> field in the{' '}
                              <strong>Company Information</strong> tab to filter this view.
                            </div>
                          ) : (
                            <div className="alert alert-info mb-3" role="alert">
                              <i className="ph-duotone ph-info me-1"></i>
                              The E-Log provider &quot;<strong>{company.e_logs}</strong>&quot; is
                              not mapped to a known HOS source. Showing all sources.
                            </div>
                          )}

                          <ul
                            className="nav nav-tabs hos-company-tabs mb-0"
                            role="tablist"
                          >
                            {['samsara', 'motive', 'monarch', 'hos247'].map((src) => (
                              <li className="nav-item" role="presentation" key={src}>
                                <button
                                  className={`nav-link${hosSourceTab === src ? ' active' : ''}`}
                                  type="button"
                                  role="tab"
                                  onClick={() => setHosSourceTab(src)}
                                >
                                  {SOURCE_LABELS[src]}
                                </button>
                              </li>
                            ))}
                          </ul>
                          <div className="tab-content hos-company-content">
                            <HosCompanyPanel
                              companyId={id}
                              companyEmail={company?.email}
                              source={hosSourceTab}
                              sourceLabel={SOURCE_LABELS[hosSourceTab]}
                              hosImports={hosImports}
                              discImports={discImports}
                              unidImports={unidImports}
                              showDisc={hosSourceTab !== 'hos247'}
                              showUnid={hosSourceTab !== 'hos247'}
                              onRefresh={loadEdit}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="btn btn-primary ac-btn-save"
                    disabled={submitting}
                  >
                    {submitting ? 'Updating...' : 'Update Company'}
                  </button>
                  <Link to="/companies" className="btn btn-secondary ac-btn-save">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Inspection Modal */}
      {inspModalOpen && (
        <div
          className="modal fade show"
          style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ background: '#f0f5ff', borderBottom: '1px solid #dde8f8' }}
              >
                <h5 className="modal-title fw-bold" style={{ color: '#174ea6' }}>
                  {inspEditMode ? 'Edit Inspection Report' : 'Add Inspection Report'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setInspModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="ac-label">Report #</label>
                    <input
                      type="text"
                      className="form-control ac-input"
                      value={inspForm.report_number || ''}
                      onChange={(e) =>
                        setInspForm((p) => ({ ...p, report_number: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="ac-label">Status</label>
                    <select
                      className="form-control ac-input"
                      value={inspForm.status || 'fail'}
                      onChange={(e) =>
                        setInspForm((p) => ({ ...p, status: e.target.value }))
                      }
                    >
                      <option value="fail">Fail</option>
                      <option value="pass">Pass</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="ac-label">Inspection Date</label>
                    <input
                      type="date"
                      className="form-control ac-input"
                      value={inspForm.inspection_date || ''}
                      onChange={(e) =>
                        setInspForm((p) => ({ ...p, inspection_date: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="ac-label">FMCSA Post Date</label>
                    <input
                      type="date"
                      className="form-control ac-input"
                      value={inspForm.fmcsa_post_date || ''}
                      onChange={(e) =>
                        setInspForm((p) => ({ ...p, fmcsa_post_date: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="ac-label">Inspection Level</label>
                    <input
                      type="text"
                      className="form-control ac-input"
                      value={inspForm.inspection_level || ''}
                      onChange={(e) =>
                        setInspForm((p) => ({ ...p, inspection_level: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="ac-label"># OOS Violations</label>
                    <input
                      type="number"
                      className="form-control ac-input"
                      min={0}
                      value={inspForm.oos_violations_count || 0}
                      onChange={(e) =>
                        setInspForm((p) => ({
                          ...p,
                          oos_violations_count: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="ac-label">Driver</label>
                    <select
                      className="form-control ac-input"
                      value={inspForm.driver_id || ''}
                      onFocus={() => loadDrivers()}
                      onChange={(e) =>
                        setInspForm((p) => ({ ...p, driver_id: e.target.value }))
                      }
                    >
                      <option value="">Search driver...</option>
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.text}
                        </option>
                      ))}
                    </select>
                    <div className="ac-form-note">
                      Only drivers associated with this company are shown.
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="ac-label">Unit Number</label>
                    <select
                      className="form-control ac-input"
                      value={inspForm.unit_number || ''}
                      onChange={(e) => {
                        const unit = unitOptions.find(
                          (u) => u.unit_number === e.target.value
                        );
                        setInspForm((p) => ({
                          ...p,
                          unit_number: e.target.value,
                          vin: unit?.vin || p.vin,
                        }));
                      }}
                    >
                      <option value="">-- Select Unit --</option>
                      {unitOptions.map((u) => (
                        <option key={u.unit_number} value={u.unit_number}>
                          {u.unit_number}
                          {u.type ? ` (${u.type})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="ac-label">VIN</label>
                    <input
                      type="text"
                      className="form-control ac-input"
                      value={inspForm.vin || ''}
                      onChange={(e) => setInspForm((p) => ({ ...p, vin: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-8">
                    <label className="ac-label">Vehicle Plate #</label>
                    <input
                      type="text"
                      className="form-control ac-input"
                      value={inspForm.vehicle_plate || ''}
                      onChange={(e) =>
                        setInspForm((p) => ({ ...p, vehicle_plate: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="ac-label">HM</label>
                    <input
                      type="text"
                      className="form-control ac-input"
                      value={inspForm.hm || ''}
                      onChange={(e) => setInspForm((p) => ({ ...p, hm: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid #dde8f8' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setInspModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={saveInspection}>
                  Save Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inspection Detail Modal */}
      {detailOpen && detailData && (
        <div
          className="modal fade show"
          style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ background: '#f0f5ff', borderBottom: '1px solid #dde8f8' }}
              >
                <h5 className="modal-title fw-bold" style={{ color: '#174ea6' }}>
                  Inspection Report — {detailData.inspection?.report_number}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDetailOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <div
                    className="fw-bold mb-1"
                    style={{
                      fontSize: 12,
                      color: '#7a889f',
                      textTransform: 'uppercase',
                      letterSpacing: '.04em',
                    }}
                  >
                    Company
                  </div>
                  <div className="row g-2">
                    <div className="col-md-4">
                      Company Name:{' '}
                      <strong>{detailData.company?.company_name || '—'}</strong>
                    </div>
                    <div className="col-md-4">
                      Address: <strong>{detailData.company?.address || '—'}</strong>
                    </div>
                    <div className="col-md-4">
                      US DOT: <strong>{detailData.company?.usdot || '—'}</strong>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div
                    className="fw-bold mb-1"
                    style={{
                      fontSize: 12,
                      color: '#7a889f',
                      textTransform: 'uppercase',
                      letterSpacing: '.04em',
                    }}
                  >
                    Inspection
                  </div>
                  <div className="row g-2">
                    <div className="col-md-3">
                      Status: <strong>{detailData.inspection?.status}</strong>
                    </div>
                    <div className="col-md-3">
                      Date:{' '}
                      <strong>{fmtDate(detailData.inspection?.inspection_date)}</strong>
                    </div>
                    <div className="col-md-3">
                      Level: <strong>{detailData.inspection?.inspection_level || '—'}</strong>
                    </div>
                    <div className="col-md-3">
                      OOS:{' '}
                      <strong>{detailData.inspection?.oos_violations_count}</strong>
                    </div>
                  </div>
                  <div className="mt-2">
                    <button
                      type="button"
                      className="btn btn-sm ac-btn-save"
                      style={{ marginTop: 0 }}
                      onClick={() => {
                        const insp = detailData.inspection;
                        setInspEditMode(true);
                        setCurrentInspId(insp.id);
                        setInspForm({
                          report_number: insp.report_number || '',
                          status: insp.status || 'fail',
                          inspection_date: insp.inspection_date || '',
                          fmcsa_post_date: insp.fmcsa_post_date || '',
                          inspection_level: insp.inspection_level || '',
                          oos_violations_count: insp.oos_violations_count || 0,
                          driver_id: insp.driver_id || '',
                          driver_name: insp.driver_name || '',
                          unit_number: insp.unit_number || '',
                          vin: insp.vin || '',
                          vehicle_plate: insp.vehicle_plate || '',
                          hm: insp.hm || '',
                        });
                        loadDrivers();
                        setDetailOpen(false);
                        setInspModalOpen(true);
                      }}
                    >
                      <i className="ph-duotone ph-pencil me-1"></i> Edit Report
                    </button>
                  </div>
                </div>
                <h6 className="fw-bold mt-3" style={{ color: '#36445e' }}>
                  Violations
                </h6>
                {(detailData.inspection?.violations || []).length === 0 ? (
                  <p className="text-muted small">No violations recorded.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Unit</th>
                          <th>Code</th>
                          <th>OOS</th>
                          <th>Category</th>
                          <th>Discovered</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailData.inspection.violations.map((v) => (
                          <tr key={v.id}>
                            <td>{v.unit || '—'}</td>
                            <td>{v.violation_code || '—'}</td>
                            <td>{v.oos ? 'Yes' : 'No'}</td>
                            <td>{v.violations_category || '—'}</td>
                            <td>{v.violations_discovered || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attach Files Modal */}
      {attachOpen && attachInsp && (
        <div
          className="modal fade show"
          style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ background: '#f0f5ff', borderBottom: '1px solid #dde8f8' }}
              >
                <h5 className="modal-title fw-bold" style={{ color: '#174ea6' }}>
                  Attach Files — {attachInsp.report_number}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setAttachOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="ac-label">Already Attached</label>
                  {(attachInsp.attached_files || []).length === 0 ? (
                    <p className="text-muted small mb-0">No files attached yet.</p>
                  ) : (
                    <ul className="list-unstyled mb-0">
                      {(attachInsp.attached_files || []).map((path) => (
                        <li
                          key={path}
                          className="d-flex justify-content-between align-items-center py-1"
                        >
                          <a
                            href={`${storageBase.replace('/storage', '')}/storage/${path}`.replace(
                              'public/storage',
                              'storage'
                            )}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {basename(path)}
                          </a>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteAttachFile(path)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <hr />
                <div>
                  <label className="ac-label">Add New Files</label>
                  <input
                    type="file"
                    className="form-control ac-file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => setAttachFiles(Array.from(e.target.files || []))}
                  />
                  <div className="ac-form-note">
                    When at least one file is attached, the inspection becomes Active
                    automatically.
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid #dde8f8' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setAttachOpen(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={uploadAttachFiles}
                >
                  <i className="ph-duotone ph-upload-simple me-1"></i> Upload Selected Files
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

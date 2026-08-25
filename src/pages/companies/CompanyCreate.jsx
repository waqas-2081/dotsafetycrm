import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CREATE_STYLES = `
.ac-shell { border: 1px solid #dfe8f7; box-shadow: 0 8px 24px rgba(17, 54, 126, 0.06); }
.ac-body { padding: 1.2rem 1.2rem 1.35rem; }
.ac-tabs.nav-tabs {
    border: 1px solid #dfe7f6;
    border-radius: 12px;
    padding: 0.45rem;
    background: #f6faff;
    margin-bottom: 1.1rem;
    gap: 0.5rem;
}
.ac-tabs .nav-link {
    border: 1px solid transparent;
    border-radius: 10px;
    color: #5c6f8f;
    background: transparent;
    padding: 0.66rem 1.25rem;
    font-weight: 600;
    transition: all 0.18s ease;
    position: relative;
}
.ac-tabs .nav-link.active {
    background: linear-gradient(180deg, #e9f3ff 0%, #d8eaff 100%);
    border-color: #c2dbff;
    color: #174ea6;
    box-shadow: 0 6px 14px rgba(22, 78, 166, 0.16);
}
.ac-tabs .nav-link.active::after {
    content: '';
    position: absolute;
    left: 10px; right: 10px; bottom: -7px;
    height: 3px;
    border-radius: 999px;
    background: #2f74de;
}
.ac-tabs .nav-link:hover { background: #e9f3ff; border-color: #cfe1ff; color: #1f4f99; }
.ac-label { font-weight: 600; color: #36445e; margin-bottom: 0.45rem; display: block; }
.ac-required { color: #ef4444; }
.ac-input, .ac-textarea, .ac-file {
    border: 1px solid #dbe7fa;
    border-radius: 7px;
    background: #f4f8ff;
    box-shadow: none;
    color: #253755;
}
.ac-input, .ac-file { height: 44px; }
.ac-textarea { min-height: 86px; resize: vertical; }
.ac-input:focus, .ac-textarea:focus, .ac-file:focus {
    border-color: #bfd4f7;
    box-shadow: 0 0 0 2px rgba(17, 63, 147, 0.1);
    background: #fff;
}
.ac-btn-save {
    margin-top: 0.9rem;
    background: #d9e9ff;
    border-color: #c8ddff;
    color: #174ea6;
    border-radius: 6px;
    font-weight: 600;
    padding: 0.45rem 0.8rem;
}
.ac-btn-save:hover { background: #c9ddfb; border-color: #b8d2fb; color: #123f8a; }
.ac-form-note { font-size: 12px; color: #7a889f; margin-top: 0.28rem; }
.section-card {
    border: 1px solid #e0e9f5;
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1rem;
    background: #fefefe;
    position: relative;
}
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e9eef5;
}
.remove-section {
    color: #dc3545;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
}
.remove-section:hover { color: #bb2d3b; }
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

const EMPTY_UNIT = {
  type: '',
  unit_number: '',
  vin: '',
  year: '',
  make: '',
  model: '',
  due_date: '',
  notes: '',
  document: null,
};

const INITIAL_FORM = {
  company_name: '',
  contact_name: '',
  email: '',
  telephone: '',
  der: '',
  usdot: '',
  mc: '',
  pin_sms: '',
  clearing_house: '',
  fmcsa_portal: '',
  e_logs: '',
  address: '',
  notes: '',
  number_of_units: 0,
};

export default function CompanyCreate() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('company-info-pane');
  const [form, setForm] = useState(INITIAL_FORM);
  const [dueDates, setDueDates] = useState({});
  const [docFiles, setDocFiles] = useState({});
  const [units, setUnits] = useState([]);
  const [errors, setErrors] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const count = parseInt(form.number_of_units, 10) || 0;
    setUnits((prev) => {
      if (count === prev.length) return prev;
      if (count > prev.length) {
        return [
          ...prev,
          ...Array.from({ length: count - prev.length }, () => ({ ...EMPTY_UNIT })),
        ];
      }
      return prev.slice(0, count);
    });
  }, [form.number_of_units]);

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const setUnitField = (index, name, value) => {
    setUnits((prev) =>
      prev.map((u, i) => (i === index ? { ...u, [name]: value } : u))
    );
  };

  const removeSection = (index) => {
    if (!window.confirm('Are you sure you want to remove this section?')) return;
    setUnits((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({
      ...prev,
      number_of_units: Math.max(0, (parseInt(prev.number_of_units, 10) || 0) - 1),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setFieldErrors({});
    setSubmitting(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value ?? '');
      });

      DOC_FIELDS.forEach(([key]) => {
        if (dueDates[`${key}_due_date`]) {
          fd.append(`${key}_due_date`, dueDates[`${key}_due_date`]);
        }
        const files = docFiles[`${key}_file`] || [];
        files.forEach((file) => fd.append(`${key}_file[]`, file));
      });

      units.forEach((unit, i) => {
        ['type', 'unit_number', 'vin', 'year', 'make', 'model', 'due_date', 'notes'].forEach(
          (field) => {
            fd.append(`units[${i}][${field}]`, unit[field] ?? '');
          }
        );
        if (unit.document) {
          fd.append(`units[${i}][document]`, unit.document);
        }
      });

      await api.post('/companies', fd);
      navigate('/companies', {
        state: { success: 'Company created successfully.' },
      });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setFieldErrors(data.errors);
        setErrors(Object.values(data.errors).flat());
      } else {
        setErrors([data?.message || 'Failed to create company.']);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: 'company-info-pane', label: 'Company Information' },
    { id: 'document-management-pane', label: 'Document Management' },
    { id: 'unit-details-pane', label: 'Unit Details' },
  ];

  return (
    <>
      <style>{CREATE_STYLES}</style>
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
                      Add New Company
                    </li>
                  </ul>
                </div>
                <div className="col-md-12">
                  <div className="page-header-title">
                    <h2 className="mb-0">Add New Company</h2>
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
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setErrors([])}
              ></button>
            </div>
          )}

          <div className="card ac-shell">
            <div className="ac-body">
              <form id="companyForm" onSubmit={handleSubmit}>
                <ul className="nav nav-tabs ac-tabs" id="addCompanyTabs" role="tablist">
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
                    <div className="tab-pane fade show active" role="tabpanel">
                      <div className="row g-3">
                        {[
                          ['company_name', 'Company Name', true, 'text', 'Enter company name'],
                          ['contact_name', 'Contact Person', false, 'text', 'Enter contact person name'],
                          ['email', 'Email Address', false, 'email', 'Enter email address'],
                          ['telephone', 'Phone Number', false, 'text', 'Enter phone number'],
                          ['der', 'DER', false, 'text', 'Enter DER'],
                          ['usdot', 'US DOT', false, 'text', 'Enter US DOT'],
                          ['mc', 'MC', false, 'text', 'Enter MC'],
                          ['pin_sms', 'Pin SMS', false, 'text', 'Enter Pin SMS'],
                          ['clearing_house', 'Clearing House', false, 'text', 'Enter Clearing House'],
                          ['fmcsa_portal', 'FMCSA Portal', false, 'text', 'Enter FMCSA Portal'],
                          ['e_logs', 'E-Logs', false, 'text', 'Enter E-Logs'],
                          ['address', 'Address', false, 'text', 'Enter Address'],
                        ].map(([name, label, required, type, placeholder]) => (
                          <div className="col-md-6" key={name}>
                            <label className="ac-label">
                              {label}{' '}
                              {required && <span className="ac-required">*</span>}
                            </label>
                            <input
                              type={type}
                              name={name}
                              className={`form-control ac-input${fieldErrors[name] ? ' is-invalid' : ''}`}
                              placeholder={placeholder}
                              value={form[name]}
                              required={required}
                              onChange={(e) => setField(name, e.target.value)}
                            />
                            {fieldErrors[name] && (
                              <div className="invalid-feedback">{fieldErrors[name][0]}</div>
                            )}
                          </div>
                        ))}
                        <div className="col-12">
                          <label className="ac-label">Notes</label>
                          <textarea
                            name="notes"
                            className="form-control ac-textarea"
                            placeholder="Enter notes"
                            value={form.notes}
                            onChange={(e) => setField('notes', e.target.value)}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'document-management-pane' && (
                    <div className="tab-pane fade show active" role="tabpanel">
                      <div className="row g-3">
                        {DOC_FIELDS.map(([key, label]) => (
                          <div className="contents" key={key} style={{ display: 'contents' }}>
                            <div className="col-md-6">
                              <label className="ac-label">{label} Due Date</label>
                              <input
                                type="date"
                                name={`${key}_due_date`}
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
                              <input
                                type="file"
                                name={`${key}_file[]`}
                                className="form-control ac-file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                multiple
                                onChange={(e) =>
                                  setDocFiles((prev) => ({
                                    ...prev,
                                    [`${key}_file`]: Array.from(e.target.files || []),
                                  }))
                                }
                              />
                              <div className="ac-form-note">You can select multiple files.</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'unit-details-pane' && (
                    <div className="tab-pane fade show active" role="tabpanel">
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="ac-label">Number of Sections</label>
                          <input
                            type="number"
                            name="number_of_units"
                            id="numberOfSections"
                            className="form-control ac-input"
                            value={form.number_of_units}
                            min={0}
                            onChange={(e) => setField('number_of_units', e.target.value)}
                          />
                          <div className="ac-form-note">
                            Set how many company units/sections should be tracked.
                          </div>
                        </div>
                      </div>
                      <div id="sectionsContainer" className="mt-3">
                        {units.map((unit, i) => (
                          <div className="section-card" key={i}>
                            <div className="section-header">
                              <strong>Section {i + 1}</strong>
                              <span
                                className="remove-section"
                                onClick={() => removeSection(i)}
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
                                  placeholder="Enter unit number"
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
                                  placeholder="Enter VIN number"
                                  value={unit.vin}
                                  onChange={(e) => setUnitField(i, 'vin', e.target.value)}
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="ac-label">Year</label>
                                <input
                                  type="text"
                                  className="form-control ac-input"
                                  placeholder="Year"
                                  value={unit.year}
                                  onChange={(e) => setUnitField(i, 'year', e.target.value)}
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="ac-label">Make</label>
                                <input
                                  type="text"
                                  className="form-control ac-input"
                                  placeholder="Make"
                                  value={unit.make}
                                  onChange={(e) => setUnitField(i, 'make', e.target.value)}
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="ac-label">Model</label>
                                <input
                                  type="text"
                                  className="form-control ac-input"
                                  placeholder="Model"
                                  value={unit.model}
                                  onChange={(e) => setUnitField(i, 'model', e.target.value)}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="ac-label">Due Date</label>
                                <input
                                  type="date"
                                  className="form-control ac-input"
                                  value={unit.due_date}
                                  onChange={(e) =>
                                    setUnitField(i, 'due_date', e.target.value)
                                  }
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="ac-label">Document</label>
                                <input
                                  type="file"
                                  className="form-control ac-file"
                                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                  onChange={(e) =>
                                    setUnitField(i, 'document', e.target.files?.[0] || null)
                                  }
                                />
                              </div>
                              <div className="col-12">
                                <label className="ac-label">Notes</label>
                                <textarea
                                  className="form-control ac-textarea"
                                  placeholder="Section notes"
                                  value={unit.notes}
                                  onChange={(e) => setUnitField(i, 'notes', e.target.value)}
                                ></textarea>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="btn btn-primary ac-btn-save"
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : 'Save Company'}
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
    </>
  );
}

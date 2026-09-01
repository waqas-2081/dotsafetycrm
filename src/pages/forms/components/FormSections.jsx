import { useState } from 'react';
import SignatureField from './SignatureField';
import SectionCard from './SectionCard';
import DocumentUpload from './DocumentUpload';
import ConstanciaLfdBlock from './ConstanciaLfdBlock';
import FollowUpProgramBlock from './FollowUpProgramBlock';
import EmploymentVerificationBlock from './EmploymentVerificationBlock';
import QuizSection from './QuizSection';
import {
  DISCIPLINARY_VIOLATIONS,
  DRIVER_TYPES,
  emptyAccident,
  emptyConviction,
  emptyEmployment,
  emptyExperience,
} from '../formShared';

function Field({ label, children, full }) {
  return (
    <div className={`field${full ? ' form-full' : ''}`}>
      {label ? <label className="field-label">{label}</label> : null}
      {children}
    </div>
  );
}

function isVisaValid(visa) {
  const v = String(visa || '').trim();
  if (!v) return false;
  return !['na', 'n/a'].includes(v.toLowerCase());
}

function RadioGroup({ question, name, value, onChange, options = ['Yes', 'No'], readOnly }) {
  return (
    <div className="radio-group">
      <p>{question}</p>
      <div className="radio-options">
        {options.map((opt) => (
          <label key={opt}>
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              disabled={readOnly}
              onChange={() => onChange(name, opt)}
            />{' '}
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

/**
 * Full application form sections matching Blade structure (all steps).
 * mode: 'fill' | 'edit' | 'view'
 */
export default function FormSections({
  mode,
  state,
  setState,
  activeStep,
  setField,
  setSig,
  onFollowUpRefresh,
}) {
  const readOnly = mode === 'view';
  const f = state.fields;
  const companies = state.companies || [];

  const updateRow = (key, index, patch) => {
    setState((prev) => {
      const rows = [...prev[key]];
      rows[index] = { ...rows[index], ...patch };
      return { ...prev, [key]: rows };
    });
  };

  const addRow = (key, factory) => {
    setState((prev) => ({ ...prev, [key]: [...prev[key], factory()] }));
  };

  const removeRow = (key, index) => {
    setState((prev) => {
      const rows = prev[key].filter((_, i) => i !== index);
      return { ...prev, [key]: rows.length ? rows : [factoryDefault(key)] };
    });
  };

  function factoryDefault(key) {
    if (key === 'experiences') return emptyExperience();
    if (key === 'accidents') return emptyAccident();
    if (key === 'convictions') return emptyConviction();
    return emptyEmployment(f.driver_type);
  }

  const onCompanySelect = (index, companyName) => {
    const company = companies.find((c) => c.company_name === companyName);
    updateRow('employments', index, {
      prev_company_name: companyName,
      prev_contact_person: company?.contact_name || '',
      prev_emp_email: company?.email || '',
      prev_emp_phone: company?.telephone || '',
      prev_emp_address: company?.address || state.employments[index]?.prev_emp_address || '',
    });
  };

  const show = (step) => activeStep === null || activeStep === step;

  return (
    <>
      {/* STEP 0 — Authorization */}
      {show(0) && (
        <div className="step-content" data-step-content="0">
          <SectionCard title="Authorization" iconBg="#c9a84c">
            <div className="auth-box">
              <p>
                I authorize you to make such investigations and inquiries of my personal, employment, financial or
                medical history and other related matters as may be necessary in arriving at an employment decision.
                Generally, inquiries regarding medical history will be made only if a conditional offer has been
                extended. I hereby release employers, schools, health care providers and other persons from all liability
                in responding to inquiries and releasing information in connection with my application. I understand that
                false or misleading information given in my application or interview(s) may result in discharge. I
                understand, also, that I am required to abide by all rules and regulations of:
              </p>
              <p style={{ fontWeight: 700, color: 'var(--accent)' }}>{f.appcompany_name}</p>
              <p>
                I understand that information I provide regarding current and/or previous employers may be used, and those
                employer(s) will be contacted, for the purpose of investigating my safety performance history as required
                by 49 CFR 391.23 (d) and (e). I understand that I:
              </p>
              <ul>
                <li>Review information provided by previous employers;</li>
                <li>
                  Have errors in the information corrected by previous employers and for those previous employers to
                  resend the corrected information to the prospective employer; and
                </li>
                <li>
                  Have a rebuttal statement attached to the alleged erroneous information, if the previous employer(s)
                  and I cannot agree on the accuracy of the information.
                </li>
              </ul>
            </div>
            <div className="signature-row">
              <SignatureField
                name="auth_signature"
                value={f.auth_signature}
                onChange={setSig}
                label="Sign Here"
                readOnly={readOnly}
              />
              <Field label="Date">
                <input
                  type="date"
                  className="field-input"
                  name="application_date"
                  value={f.application_date}
                  disabled={readOnly}
                  onChange={(e) => setField('application_date', e.target.value)}
                />
              </Field>
            </div>
          </SectionCard>
        </div>
      )}

      {/* STEP 1 — Personal */}
      {show(1) && (
        <div className="step-content" data-step-content="1">
          <SectionCard
            title="Personal Information"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
          >
            <div className="form-grid">
              <Field label="Full Name">
                <input className="field-input" value={f.driver_name} disabled={readOnly} onChange={(e) => setField('driver_name', e.target.value)} />
              </Field>
              <Field label="Email Address">
                <input className="field-input" value={f.email_address} disabled={readOnly} onChange={(e) => setField('email_address', e.target.value)} />
              </Field>
              <Field label="Company Name">
                {mode === 'edit' && companies.length ? (
                  <select
                    className="field-select"
                    value={f.company_id || ''}
                    disabled={readOnly}
                    onChange={(e) => {
                      const id = e.target.value;
                      const c = companies.find((x) => String(x.id) === String(id));
                      setField('company_id', id);
                      if (c) setField('appcompany_name', c.company_name);
                    }}
                  >
                    <option value="">Select company…</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input className="field-input" value={f.appcompany_name} disabled={readOnly} onChange={(e) => setField('appcompany_name', e.target.value)} />
                )}
              </Field>
              <Field label="Driver Type">
                <select className="field-select" value={f.driver_type} disabled={readOnly} onChange={(e) => setField('driver_type', e.target.value)}>
                  <option value="">Select…</option>
                  {DRIVER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Address / Dirección">
                <input className="field-input" value={f.address} disabled={readOnly} onChange={(e) => setField('address', e.target.value)} />
              </Field>
              <Field label="City / Ciudad">
                <input className="field-input" value={f.city} disabled={readOnly} onChange={(e) => setField('city', e.target.value)} />
              </Field>
              <Field label="State / Estado">
                <input className="field-input" value={f.state} disabled={readOnly} onChange={(e) => setField('state', e.target.value)} />
              </Field>
              <Field label="ZIP / Codigo Postal">
                <input className="field-input" value={f.zip} disabled={readOnly} onChange={(e) => setField('zip', e.target.value)} />
              </Field>
              <Field label="Phone Number / Numero Telefono">
                <input type="tel" className="field-input" value={f.phone} disabled={readOnly} onChange={(e) => setField('phone', e.target.value)} />
              </Field>
              <Field label="Alternate Phone / Otro Telefono">
                <input type="tel" className="field-input" value={f.alternatephone} disabled={readOnly} onChange={(e) => setField('alternatephone', e.target.value)} />
              </Field>
              <Field label="Social Security / Seguro Social">
                <input className="field-input" value={f.ssn} disabled={readOnly} onChange={(e) => setField('ssn', e.target.value)} />
              </Field>
              <Field label="Date of Birth / Fecha de Nacimiento">
                <input type="date" className="field-input" value={f.dob} disabled={readOnly} onChange={(e) => setField('dob', e.target.value)} />
              </Field>
            </div>
            <div className="divider" />
            <div className="form-grid-4" style={{ marginTop: '1rem' }}>
              <Field label="License Number">
                <input className="field-input" value={f.license_number} disabled={readOnly} onChange={(e) => setField('license_number', e.target.value)} />
              </Field>
              <Field label="License State">
                <input className="field-input" value={f.license_state} disabled={readOnly} onChange={(e) => setField('license_state', e.target.value)} />
              </Field>
              <Field label="License Class">
                <input className="field-input" value={f.license_class} disabled={readOnly} onChange={(e) => setField('license_class', e.target.value)} />
              </Field>
              <Field label="License Expiration">
                <input type="date" className="field-input" value={f.license_expiry} disabled={readOnly} onChange={(e) => setField('license_expiry', e.target.value)} />
              </Field>
            </div>
            <div className="form-grid" style={{ marginTop: '1rem' }}>
              <Field label="Medico / Apto">
                <input className="field-input" value={f.medicalcard_number} disabled={readOnly} onChange={(e) => setField('medicalcard_number', e.target.value)} />
              </Field>
              <Field label="Medical Card Expiration">
                <input type="date" className="field-input" value={f.medicalcard_expiry} disabled={readOnly} onChange={(e) => setField('medicalcard_expiry', e.target.value)} />
              </Field>
              <Field label="Visa #">
                <input className="field-input" value={f.visa_number} disabled={readOnly} onChange={(e) => setField('visa_number', e.target.value)} />
              </Field>
              <Field label="Visa Expiration Date">
                <input type="date" className="field-input" value={f.visa_expiry} disabled={readOnly} onChange={(e) => setField('visa_expiry', e.target.value)} />
              </Field>
            </div>
            {(isVisaValid(f.visa_number) || f.constancia_lfd || f.constancia_lfd_file) ? (
              <ConstanciaLfdBlock
                mode={mode}
                readOnly={readOnly}
                constanciaLfd={f.constancia_lfd}
                constanciaLfdFile={f.constancia_lfd_file}
                pendingFile={state.constanciaLfdPendingFile}
                applicationId={state.applicationId}
                driverName={f.driver_name}
                driverEmail={f.email_address}
                storageBase={state.storageBase}
                onDateChange={(value) => setField('constancia_lfd', value)}
                onFileSelect={(file) =>
                  setState((prev) => ({ ...prev, constanciaLfdPendingFile: file }))
                }
                onFileDeleted={() => {
                  setField('constancia_lfd_file', '');
                  setState((prev) => ({ ...prev, constanciaLfdPendingFile: null }));
                }}
              />
            ) : null}
          </SectionCard>

          <SectionCard title="Driving Experience" iconBg="#1e5fd4" className="print-keep-together">
            <div className="repeat-section">
              <div className="repeat-main">
                {state.experiences.map((row, i) => (
                  <div className="repeat-row" key={i}>
                    <div className="form-grid-3">
                      <Field label="Type of Equipment">
                        <input className="field-input" value={row.type_of_equipment} disabled={readOnly} onChange={(e) => updateRow('experiences', i, { type_of_equipment: e.target.value })} />
                      </Field>
                      <Field label="Years of Experience">
                        <input className="field-input" value={row.years_of_experience} disabled={readOnly} onChange={(e) => updateRow('experiences', i, { years_of_experience: e.target.value })} />
                      </Field>
                      <Field label="Miles Driven">
                        <input className="field-input" value={row.miles_driven} disabled={readOnly} onChange={(e) => updateRow('experiences', i, { miles_driven: e.target.value })} />
                      </Field>
                    </div>
                    {!readOnly && state.experiences.length > 1 && (
                      <button type="button" className="btn-remove-row" onClick={() => removeRow('experiences', i)}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {!readOnly && (
                <button type="button" className="btn-add-row" onClick={() => addRow('experiences', emptyExperience)}>
                  + Add Row
                </button>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title={
              <>
                Accident Records <span style={{ fontWeight: 400, color: 'var(--muted)', fontSize: '.8rem' }}>(Previous Three Years)</span>
              </>
            }
            iconBg="#c0392b"
            className="print-keep-together"
          >
            <div className="repeat-section">
              {state.accidents.map((row, i) => (
                <div className="repeat-row" key={i}>
                  <div className="form-grid-4">
                    <Field label="Accident Date">
                      <input type="date" className="field-input" value={row.accident_date} disabled={readOnly} onChange={(e) => updateRow('accidents', i, { accident_date: e.target.value })} />
                    </Field>
                    <Field label="Type of Accident">
                      <input className="field-input" value={row.type_of_accident} disabled={readOnly} onChange={(e) => updateRow('accidents', i, { type_of_accident: e.target.value })} />
                    </Field>
                    <Field label="Fatalities">
                      <input className="field-input" value={row.fatalities} disabled={readOnly} onChange={(e) => updateRow('accidents', i, { fatalities: e.target.value })} />
                    </Field>
                    <Field label="Injuries">
                      <input className="field-input" value={row.injuries} disabled={readOnly} onChange={(e) => updateRow('accidents', i, { injuries: e.target.value })} />
                    </Field>
                  </div>
                  {!readOnly && state.accidents.length > 1 && (
                    <button type="button" className="btn-remove-row" onClick={() => removeRow('accidents', i)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {!readOnly && (
                <button type="button" className="btn-add-row" onClick={() => addRow('accidents', emptyAccident)}>
                  + Add Row
                </button>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title={
              <>
                Traffic Convictions{' '}
                <span style={{ fontWeight: 400, color: 'var(--muted)', fontSize: '.8rem' }}>
                  (Previous Three Years — Excluding Parking Violations)
                </span>
              </>
            }
            iconBg="#8a6000"
            className="print-keep-together"
          >
            {state.convictions.map((row, i) => (
              <div className="repeat-row" key={i}>
                <div className="form-grid-3">
                  <Field label="Location">
                    <input className="field-input" value={row.conviction_location} disabled={readOnly} onChange={(e) => updateRow('convictions', i, { conviction_location: e.target.value })} />
                  </Field>
                  <Field label="Date">
                    <input type="date" className="field-input" value={row.conviction_date} disabled={readOnly} onChange={(e) => updateRow('convictions', i, { conviction_date: e.target.value })} />
                  </Field>
                  <Field label="Charge">
                    <input className="field-input" value={row.conviction_charge} disabled={readOnly} onChange={(e) => updateRow('convictions', i, { conviction_charge: e.target.value })} />
                  </Field>
                </div>
                {!readOnly && state.convictions.length > 1 && (
                  <button type="button" className="btn-remove-row" onClick={() => removeRow('convictions', i)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            {!readOnly && (
              <button type="button" className="btn-add-row" onClick={() => addRow('convictions', emptyConviction)}>
                + Add Row
              </button>
            )}
          </SectionCard>

          <SectionCard title="License and Criminal Background" iconBg="#4a1d8a" className="print-keep-together">
            <div className="form-grid" style={{ marginBottom: '1.25rem' }}>
              <RadioGroup
                question="A. Have you ever been denied a license, permit or privilege to operate a motor vehicle?"
                name="denied_license"
                value={f.denied_license}
                onChange={setField}
                readOnly={readOnly}
              />
              <RadioGroup
                question="B. Has any license, permit, or privilege ever been suspended or revoked?"
                name="license_suspended"
                value={f.license_suspended}
                onChange={setField}
                readOnly={readOnly}
              />
            </div>
            <Field label='If the answer to either A or B is "YES", provide details:'>
              <textarea className="field-textarea" value={f.suspended_explain} disabled={readOnly} onChange={(e) => setField('suspended_explain', e.target.value)} />
            </Field>
            <div style={{ margin: '1.25rem 0' }}>
              <RadioGroup
                question="C. Have you ever been arrested and/or convicted of a misdemeanor or felony?"
                name="arrested_convicted"
                value={f.arrested_convicted}
                onChange={setField}
                readOnly={readOnly}
              />
            </div>
            <Field label='If the answer to C is "YES", please explain:'>
              <textarea className="field-textarea" value={f.conviction_explanation} disabled={readOnly} onChange={(e) => setField('conviction_explanation', e.target.value)} />
            </Field>
          </SectionCard>

          <SectionCard title="Emergency Contact Information" iconBg="#0d7a5e" className="print-keep-together">
            <div className="form-grid-3">
              <Field label="Name">
                <input className="field-input" value={f.emergency_name} disabled={readOnly} onChange={(e) => setField('emergency_name', e.target.value)} />
              </Field>
              <Field label="Phone Number">
                <input className="field-input" value={f.emergency_phone} disabled={readOnly} onChange={(e) => setField('emergency_phone', e.target.value)} />
              </Field>
              <Field label="Relationship">
                <input className="field-input" value={f.emergency_relation} disabled={readOnly} onChange={(e) => setField('emergency_relation', e.target.value)} />
              </Field>
            </div>
          </SectionCard>
        </div>
      )}

      {/* STEP 2 — Previous Employment */}
      {show(2) && (
        <div className="step-content" data-step-content="2">
          <SectionCard title="Previous Employment" iconBg="#1e5fd4">
            <div className="auth-box">
              <p>
                All driver applicants to drive in interstate or intrastate commerce must provide the following information
                on all employers during the preceding 3 years. List complete mailing address, street number, city, state
                and zip code. Applicants to drive a commercial motor vehicle* in intrastate or interstate commerce shall
                also provide an additional 7 years&apos; information on those employers for whom the applicant operated
                such vehicle.
              </p>
              <p>
                <strong>LIST ALL EMPLOYMENT FOR LAST 10 YEARS — PLEASE ACCOUNT FOR ALL TIME.</strong>
              </p>
            </div>
            {state.employments.map((emp, i) => (
              <div className="employment-item" key={emp.id || i} data-employment-id={emp.id}>
                <div className="employment-item-header">
                  <span style={{ fontSize: '.85rem', fontWeight: 700, color: '#fff' }}>
                    Employment Record #{i + 1}
                  </span>
                  {!readOnly && state.employments.length > 1 && (
                    <button type="button" className="btn-delete-emp" onClick={() => removeRow('employments', i)}>
                      Remove
                    </button>
                  )}
                </div>
                <div className="employment-item-body">
                  <div className="form-grid-3">
                    <Field label="Name of Company">
                      <select
                        className="field-select company-dropdown"
                        value={emp.prev_company_name}
                        disabled={readOnly}
                        onChange={(e) => onCompanySelect(i, e.target.value)}
                      >
                        <option value="">Select a company...</option>
                        {companies.map((c) => (
                          <option key={c.id || c.company_name} value={c.company_name}>
                            {c.company_name}
                          </option>
                        ))}
                        {emp.prev_company_name &&
                          !companies.some((c) => c.company_name === emp.prev_company_name) && (
                            <option value={emp.prev_company_name}>{emp.prev_company_name}</option>
                          )}
                      </select>
                    </Field>
                    <Field label="Contact Person">
                      <input className="field-input" value={emp.prev_contact_person} readOnly />
                    </Field>
                    <Field label="Phone">
                      <input type="tel" className="field-input" value={emp.prev_emp_phone} readOnly />
                    </Field>
                  </div>
                  <div className="form-grid-3">
                    <Field label="Email">
                      <input type="email" className="field-input" value={emp.prev_emp_email} readOnly />
                    </Field>
                    <Field label="Address">
                      <input className="field-input" value={emp.prev_emp_address} disabled={readOnly} onChange={(e) => updateRow('employments', i, { prev_emp_address: e.target.value })} />
                    </Field>
                    <Field label="City">
                      <input className="field-input" value={emp.prev_emp_city} disabled={readOnly} onChange={(e) => updateRow('employments', i, { prev_emp_city: e.target.value })} />
                    </Field>
                  </div>
                  <div className="form-grid-3">
                    <Field label="State & Zip">
                      <input className="field-input" value={emp.prev_emp_statezip} disabled={readOnly} onChange={(e) => updateRow('employments', i, { prev_emp_statezip: e.target.value })} />
                    </Field>
                    <Field label="Position Held">
                      <input className="field-input" value={emp.prev_position_held} disabled={readOnly} onChange={(e) => updateRow('employments', i, { prev_position_held: e.target.value })} />
                    </Field>
                    <div />
                  </div>
                  <div className="form-grid-3">
                    <Field label="From">
                      <input type="date" className="field-input" value={emp.prev_from_date} disabled={readOnly} onChange={(e) => updateRow('employments', i, { prev_from_date: e.target.value })} />
                    </Field>
                    <Field label="To">
                      <input type="date" className="field-input" value={emp.prev_to_date} disabled={readOnly} onChange={(e) => updateRow('employments', i, { prev_to_date: e.target.value })} />
                    </Field>
                    <Field label="Reason for Leaving">
                      <input className="field-input" value={emp.prev_leaving_reason} disabled={readOnly} onChange={(e) => updateRow('employments', i, { prev_leaving_reason: e.target.value })} />
                    </Field>
                  </div>
                  <div className="form-grid-3">
                    <Field label="Type of Trailer">
                      <input className="field-input" value={emp.prev_trailer_type} disabled={readOnly} onChange={(e) => updateRow('employments', i, { prev_trailer_type: e.target.value })} />
                    </Field>
                    <Field label="Subject to FMCSRs?">
                      <select className="field-select" value={emp.prev_fmcsa} disabled={readOnly} onChange={(e) => updateRow('employments', i, { prev_fmcsa: e.target.value })}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </Field>
                    <Field label="Safety-sensitive function?">
                      <select className="field-select" value={emp.prev_dot_regulated} disabled={readOnly} onChange={(e) => updateRow('employments', i, { prev_dot_regulated: e.target.value })}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </Field>
                  </div>
                  {emp.id && emp.id !== 'new' ? (
                    <EmploymentVerificationBlock
                      mode={mode}
                      employment={emp}
                      onUpdate={(patch) => updateRow('employments', i, patch)}
                    />
                  ) : null}
                </div>
              </div>
            ))}
            {!readOnly && (
              <button
                type="button"
                className="btn-add-row"
                style={{ marginBottom: '1rem' }}
                onClick={() => addRow('employments', () => emptyEmployment(f.driver_type))}
              >
                + Add Row
              </button>
            )}
            <div className="print-keep-together employment-cert-block">
              <div className="auth-box" style={{ marginBottom: '1rem' }}>
                <p>
                  Includes vehicles having a GVWR of 26,001 lbs. or more, vehicles designed to transport 15 or more
                  passengers, or any size vehicle used to transport hazardous materials in a quantity requiring placarding.
                </p>
                <p>
                  <strong>
                    This certifies that this application was completed by me, and that all entries on it and information in
                    it are true and complete to the best of my knowledge.
                  </strong>
                </p>
              </div>
              <div className="signature-row">
                <SignatureField name="prevemp_signature" value={f.prevemp_signature} onChange={setSig} label="Signature of Applicant" readOnly={readOnly} />
                <Field label="Date">
                  <input type="date" className="field-input" value={f.application_date} disabled={readOnly} onChange={(e) => setField('application_date', e.target.value)} />
                </Field>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* STEP 3 — Fair Credit */}
      {show(3) && (
        <div className="step-content" data-step-content="3">
          <SectionCard title="Fair Credit Reporting Act Disclosure Statement" iconBg="#4a1d8a">
            <div className="auth-box">
              <p>
                In accordance with the provisions of Section 604 (b)(2)(A) of the Fair Credit Reporting Act, Public Law
                91-508, as amended by the Consumer Credit Reporting Act of 1996 (Title II, Subtitle D, Chapter I, of Public
                Law 104-208), you are being informed that reports verifying your previous employment, previous drug and
                alcohol test results, and your driving record may be obtained on you for employment/contract purposes.
                These reports are required by Sections 382.413, 391.23, and 391.25, of the Federal Motor Carrier Safety
                Regulations.
              </p>
            </div>
            <div className="signature-row" style={{ marginBottom: '1.25rem' }}>
              <SignatureField name="credreport_signature" value={f.credreport_signature} onChange={setSig} label="Signature of Applicant" readOnly={readOnly} />
              <Field label="Date">
                <input type="date" className="field-input" value={f.application_date} disabled={readOnly} readOnly />
              </Field>
            </div>
            <div className="form-grid">
              <Field label="Print Name">
                <input className="field-input" value={f.driver_name} readOnly />
              </Field>
              <Field label="Social Security Number">
                <input className="field-input" value={f.ssn} readOnly />
              </Field>
            </div>
          </SectionCard>
        </div>
      )}

      {/* STEP 4 — Violations certification */}
      {show(4) && (
        <div className="step-content" data-step-content="4">
          <SectionCard title="Motor Vehicle Driver's Certification Of Violations" iconBg="#c0392b">
            <div className="auth-box" style={{ marginBottom: '1.25rem' }}>
              <p>
                I certify that the following is a true and complete list of traffic violations (other than parking
                violations) for which I have been convicted or forfeited bond or collateral during the past 12 months.
              </p>
              <p>
                If no violations are listed above, I certify that I have not been convicted or forfeited bond or collateral
                on account of any violation required to be listed during the past 12 months.
              </p>
            </div>
            <div className="signature-row" style={{ marginBottom: '1.5rem' }}>
              <SignatureField name="violation_signature" value={f.violation_signature} onChange={setSig} label="Signature of Applicant" readOnly={readOnly} />
              <Field label="Date of Certification">
                <input type="date" className="field-input" value={f.violation_cert_date} disabled={readOnly} onChange={(e) => setField('violation_cert_date', e.target.value)} />
              </Field>
            </div>
            <div className="form-grid" style={{ marginBottom: '1.25rem' }}>
              <Field label="Motor Carrier's Name">
                <input className="field-input" value={f.appcompany_name} readOnly />
              </Field>
              <SignatureField name="violation_review_signature" value={f.violation_review_signature} onChange={setSig} label="Reviewed By Signature" readOnly={readOnly} />
            </div>
            <Field label="Title">
              <input className="field-input" value={f.violation_cert_reviewer} disabled={readOnly} onChange={(e) => setField('violation_cert_reviewer', e.target.value)} />
            </Field>
            <div className="divider" />
            <p style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--navy)', margin: '1.25rem 0 .75rem' }}>
              US Department Of Transportation Motor Carrier Safety Program Annual Review Of Driving Record 391.25
            </p>
            <div className="form-grid" style={{ marginBottom: '1rem' }}>
              <Field label="Name">
                <input className="field-input" value={f.driver_name} readOnly />
              </Field>
              <Field label="SSN">
                <input className="field-input" value={f.ssn} readOnly />
              </Field>
            </div>
            <div className="auth-box" style={{ marginBottom: '1.25rem' }}>
              <p>
                This day I reviewed the driving record of the above named driver in accordance with 391.25 of the Federal
                Motor Carrier Safety Regulations…
              </p>
            </div>
            <div className="signature-row">
              <div className="sig-box">
                <span className="field-label">Date of Review</span>
                <input type="date" className="field-input" value={f.safety_prog_date} disabled={readOnly} onChange={(e) => setField('safety_prog_date', e.target.value)} style={{ marginBottom: '.75rem' }} />
                <label className="field-label">Motor Carrier&apos;s Name</label>
                <input className="field-input" value={f.safety_prog_carrier || f.appcompany_name} readOnly />
              </div>
              <SignatureField name="safety_review_signature" value={f.safety_review_signature} onChange={setSig} label="Reviewed By Signature" readOnly={readOnly} />
            </div>
            <Field label="Reviewed By: Title">
              <input className="field-input" value={f.safety_prog_reviewer} disabled={readOnly} onChange={(e) => setField('safety_prog_reviewer', e.target.value)} />
            </Field>
          </SectionCard>
        </div>
      )}

      {/* STEP 5 — Drug & Alcohol */}
      {show(5) && (
        <div className="step-content" data-step-content="5">
          <SectionCard title="Previous Pre-Employment Drug & Alcohol Statement" iconBg="#0d7a5e">
            <div className="auth-box" style={{ marginBottom: '1.25rem' }}>
              <p>
                Sec. 40.25(j) As the employer, you must also ask the employee whether he or she has tested positive, or
                refused to test, on any pre-employment drug or alcohol test…
              </p>
            </div>
            <div className="form-grid" style={{ marginBottom: '1.25rem' }}>
              <Field label="Prospective Employee Name">
                <input className="field-input" value={f.driver_name} readOnly />
              </Field>
              <Field label="Social Security Number">
                <input className="field-input" value={f.ssn} readOnly />
              </Field>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <RadioGroup
                question="Have you tested positive, or refused to test, on any pre-employment drug or alcohol test administered by an employer to which you applied for, but did not obtain, safety-sensitive transportation work covered by DOT agency drug and alcohol testing rules during the past two years?"
                name="alcohol_test"
                value={f.alcohol_test}
                onChange={setField}
                readOnly={readOnly}
              />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <RadioGroup
                question="If you answered yes, can you provide/obtain proof that you've successfully completed the DOT return-to-duty requirements?"
                name="return_duty_require"
                value={f.return_duty_require}
                onChange={setField}
                options={['Yes', 'No', 'Not Applicable']}
                readOnly={readOnly}
              />
            </div>
            <div className="signature-row" style={{ marginBottom: '1.5rem' }}>
              <SignatureField name="alcohol_signature" value={f.alcohol_signature} onChange={setSig} label="Signature of Applicant" readOnly={readOnly} />
              <Field label="Date">
                <input type="date" className="field-input" value={f.alcohol_state_date} disabled={readOnly} onChange={(e) => setField('alcohol_state_date', e.target.value)} />
              </Field>
            </div>
            <div className="signature-row">
              <SignatureField name="alcohol_witness_signature" value={f.alcohol_witness_signature} onChange={setSig} label="Witness By (Signature)" readOnly={readOnly} />
              <Field label="Date">
                <input type="date" className="field-input" value={f.alcohol_witness_date} disabled={readOnly} onChange={(e) => setField('alcohol_witness_date', e.target.value)} />
              </Field>
            </div>
          </SectionCard>

          {mode === 'edit' ? (
            <FollowUpProgramBlock
              applicationId={state.applicationId}
              initialEntries={state.followUpEntries}
              storageBase={state.storageBase}
              onRefresh={onFollowUpRefresh}
            />
          ) : null}

          <SectionCard title="Acknowledgement & Employee Commitment" iconBg="#0d7a5e">
            <div className="auth-box" style={{ marginBottom: '1.25rem' }}>
              <p>
                I, the undersigned, certify that I have read and understand Statement of Policy on Drug and Alcohol Abuse
                and have received a copy of the policy.
              </p>
              <p>
                By accepting employment with the Company, I also consent to submit to urine, breath or saliva for the
                testing of alcohol, drugs, and controlled substances…
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', alignItems: 'end' }}>
              <SignatureField name="commitment_signature" value={f.commitment_signature} onChange={setSig} label="Prospective Employee Signature" readOnly={readOnly} />
              <Field label="Prospective Employee Name">
                <input className="field-input" value={f.driver_name} readOnly />
              </Field>
              <Field label="Date">
                <input type="date" className="field-input" value={f.application_date} readOnly />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Consent For DOT Mandated Controlled Substance And Alcohol Test" iconBg="#c0392b">
            <div className="auth-box" style={{ marginBottom: '1.25rem' }}>
              <p>The Federal Motor Carrier Safety Regulations, Section 382.113…</p>
              <ul>
                <li>382.301 Pre-Employment testing</li>
                <li>382.302 Post-Accident Testing</li>
                <li>382.305 Random Testing</li>
                <li>382.306 Reasonable Suspicion Testing</li>
              </ul>
              <p>
                <strong>I have read and understand the above conditions.</strong>
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', alignItems: 'end', marginBottom: '1.25rem' }}>
              <SignatureField name="dot_consent_signature" value={f.dot_consent_signature} onChange={setSig} label="Applicant's Signature" readOnly={readOnly} />
              <Field label="Applicant's Name">
                <input className="field-input" value={f.driver_name} readOnly />
              </Field>
              <Field label="Date">
                <input type="date" className="field-input" value={f.application_date} readOnly />
              </Field>
            </div>
            <div className="form-grid">
              <Field label="Company Representative's Name">
                <input className="field-input" value={f.consent_rep_name} disabled={readOnly} onChange={(e) => setField('consent_rep_name', e.target.value)} />
              </Field>
              <Field label="Date">
                <input type="date" className="field-input" value={f.consent_rep_date} disabled={readOnly} onChange={(e) => setField('consent_rep_date', e.target.value)} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Drug & Alcohol Policy" iconBg="#8a6000">
            <div className="auth-box" style={{ marginBottom: '1.25rem' }}>
              <p>
                {f.appcompany_name} HAS A ZERO TOLERANCE ON DRUGS AND ALCOHOL, THE DRUG AND ALCOHOL POLICIES, REGULATIONS
                OF THE DEPARTMENT OF TRANSPORTATION (D.O.T.) 49 CFR 382.6019 (D)…
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', alignItems: 'end', marginBottom: '1.5rem' }}>
              <SignatureField name="drug_policy_signature" value={f.drug_policy_signature} onChange={setSig} label="Employee Signature" readOnly={readOnly} />
              <Field label="Employee Name">
                <input className="field-input" value={f.driver_name} readOnly />
              </Field>
              <Field label="Date">
                <input type="date" className="field-input" value={f.application_date} readOnly />
              </Field>
            </div>
            <div className="divider" />
            <p style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--navy)', margin: '1.25rem 0 .5rem', textTransform: 'uppercase' }}>
              Important Disclosure Regarding Background Reports From The PSP Online Service
            </p>
            <div className="auth-box" style={{ marginBottom: '1.25rem' }}>
              <p>
                In connection with your application for employment with <strong>{f.appcompany_name}</strong> (&quot;Prospective
                Employer&quot;), Prospective Employer may obtain reports regarding your driving and safety inspection history
                from FMCSA…
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', alignItems: 'end', marginBottom: '1.25rem' }}>
              <SignatureField name="account_auth_signature" value={f.account_auth_signature} onChange={setSig} label="Employee Signature" readOnly={readOnly} />
              <Field label="Date">
                <input type="date" className="field-input" value={f.application_date} readOnly />
              </Field>
              <Field label="Name (Please Print)">
                <input className="field-input" value={f.driver_name} readOnly />
              </Field>
            </div>
            <div className="divider" />
            <p style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--navy)', margin: '1.25rem 0 .75rem', textTransform: 'uppercase' }}>
              General Consent For Limited Queries Of The FMCSA Drug & Alcohol Clearinghouse
            </p>
            <div className="auth-box" style={{ marginBottom: '1.25rem' }}>
              <p>
                I, <strong>{f.driver_name}</strong> hereby provide consent to <strong>{f.appcompany_name}</strong> to
                conduct a limited query of the FMCSA Commercial Driver&apos;s License Drug and Alcohol Clearinghouse…
              </p>
            </div>
            <div className="signature-row">
              <SignatureField name="fmcsa_signature" value={f.fmcsa_signature} onChange={setSig} label="Employee Signature" readOnly={readOnly} />
              <Field label="Date">
                <input type="date" className="field-input" value={f.application_date} readOnly />
              </Field>
            </div>
          </SectionCard>
        </div>
      )}

      {/* STEP 6 — Disciplinary */}
      {show(6) && (
        <div className="step-content" data-step-content="6">
          <SectionCard title="Driver Disciplinary Policies" iconBg="#c0392b">
            <div className="auth-box" style={{ marginBottom: '1.25rem' }}>
              <p>
                <strong>TERMINATION OF YOUR SAFETY CLEARANCE WILL OCCUR IMMEDIATELY:</strong>
              </p>
              <ul>
                <li>If you are found to use or possess drugs which will impair the safe operation of your vehicle.</li>
                <li>If you are under the influence of alcohol or drugs when you report for work.</li>
                <li>If you fail to report any accident or collision.</li>
                <li>If you have an unauthorized passenger.</li>
                <li>If you are observed and/or ticketed driving 75 MPH or more.</li>
              </ul>
            </div>
            <p style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1rem', textTransform: 'uppercase' }}>
              Violations and Penalties
            </p>
            <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.84rem' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a6e)', color: '#fff' }}>
                    <th style={{ padding: '.75rem 1rem', textAlign: 'left' }}>Violation</th>
                    <th style={{ padding: '.75rem 1rem', textAlign: 'center' }}>1st Offense</th>
                    <th style={{ padding: '.75rem 1rem', textAlign: 'center' }}>2nd Offense</th>
                    <th style={{ padding: '.75rem 1rem', textAlign: 'center' }}>3rd Offense</th>
                  </tr>
                </thead>
                <tbody>
                  {DISCIPLINARY_VIOLATIONS.map((v, idx) => (
                    <tr key={v} style={{ background: idx % 2 === 0 ? '#fff' : '#f8fbff' }}>
                      <td style={{ padding: '.65rem 1rem', borderBottom: '1px solid #e8f0ff' }}>
                        {idx + 1}. {v}
                      </td>
                      <td style={{ padding: '.65rem 1rem', borderBottom: '1px solid #e8f0ff', textAlign: 'center', color: '#8a6000', fontWeight: 600 }}>
                        Warning Letter
                      </td>
                      <td style={{ padding: '.65rem 1rem', borderBottom: '1px solid #e8f0ff', textAlign: 'center', color: '#8a6000', fontWeight: 600 }}>
                        Warning Letter
                      </td>
                      <td style={{ padding: '.65rem 1rem', borderBottom: '1px solid #e8f0ff', textAlign: 'center', color: 'var(--danger)', fontWeight: 700 }}>
                        Termination
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', alignItems: 'end' }}>
              <SignatureField name="disciplinary_signature" value={f.disciplinary_signature} onChange={setSig} label="Employee Signature" readOnly={readOnly} />
              <Field label="Employee Name">
                <input className="field-input" value={f.driver_name} readOnly />
              </Field>
              <Field label="Date">
                <input type="date" className="field-input" value={f.application_date} readOnly />
              </Field>
            </div>
          </SectionCard>
        </div>
      )}

      {/* STEP 7 — Documents */}
      {show(7) && (
        <div className="step-content" data-step-content="7">
          <SectionCard title="Upload Documents">
            <DocumentUpload
              applicationId={state.applicationId}
              files={state.files}
              storageBase={state.storageBase}
              readOnly={readOnly}
              onUploaded={(file) =>
                setState((prev) => ({
                  ...prev,
                  files: [
                    ...prev.files,
                    {
                      id: file.id,
                      file_name: file.name,
                      file_path: file.path,
                      file_type: file.type,
                      url: file.url,
                    },
                  ],
                }))
              }
              onDeleted={(id) => setState((prev) => ({ ...prev, files: prev.files.filter((x) => x.id !== id) }))}
            />
          </SectionCard>
        </div>
      )}

      {/* STEP 8 — Quizzes */}
      {show(8) && (
        <div className="step-content quizesmainsec" data-step-content="8">
          <SectionCard
            title={mode === 'edit' || mode === 'view' ? 'All Quizzes Results' : 'Attempt All Quizzes'}
            iconBg="#4a1d8a"
            className="quizes-section"
          >
            <QuizSection mode={mode} state={state} setState={setState} readOnly={readOnly} />
          </SectionCard>
        </div>
      )}
    </>
  );
}

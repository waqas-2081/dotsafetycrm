/** Shared CSS from form.blade.php / edit-form.blade.php — do not redesign */
export const FORM_PAGE_STYLES = `
*, *::before, *::after { box-sizing: border-box; }
.driver-app-form {
  --navy:#0a1628; --navy-mid:#112240; --accent:#1e5fd4; --accent-light:#3b7bff; --gold:#c9a84c; --gold-light:#e8c96a;
  --surface:#f5f8ff; --card:#ffffff; --border:#dce8ff; --text:#1a2744; --muted:#6b80a3; --success:#0d7a5e; --danger:#c0392b;
  font-family:'DM Sans',sans-serif; color:var(--text);
  padding-bottom: 6rem;
}

.form-meta-card { background:linear-gradient(135deg,var(--navy) 0%,rgb(25,46,80) 45%,rgb(64,123,226) 100%); border-radius:16px; padding:2rem; display:flex; gap:2rem; align-items:flex-start; margin-bottom:1.5rem; position:relative; overflow:hidden; box-shadow:0 8px 32px rgba(10,22,40,.22); }
.form-meta-card::before { content:''; position:absolute; top:-60px; right:-60px; width:260px; height:260px; background:radial-gradient(circle,rgba(30,95,212,.22) 0%,rgba(30,95,212,.06) 50%,transparent 70%); pointer-events:none; }
.form-meta-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--gold),var(--accent-light),var(--gold)); }
.form-meta-card .meta-photo { width:120px; height:120px; border-radius:10px; object-fit:cover; border:3px solid rgba(201,168,76,.45); flex-shrink:0; }
.form-meta-card .meta-photo-placeholder { width:80px; height:100px; border-radius:10px; border:3px solid rgba(201,168,76,.45); flex-shrink:0; background:#1e3254; display:flex; align-items:center; justify-content:center; }
.form-meta-card .meta-info { flex:1; }
.form-meta-card .meta-tag { display:inline-block; background:rgba(201,168,76,.15); border:1px solid rgba(201,168,76,.35); color:var(--gold-light); font-size:.7rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; padding:.25rem .7rem; border-radius:20px; margin-bottom:.6rem; }
.form-meta-card h1 { font-size:1.5rem; color:#fff; margin:0 0 .2rem; font-weight:700; }
.form-meta-card h3 { font-size:1.15rem; color:#90bfff; margin:0 0 .2rem; font-weight:600; }
.form-meta-card p { color:#7a9ad0; font-size:.85rem; margin:0 0 .6rem; }
.form-meta-card h2 { display:inline-flex; align-items:center; gap:.4rem; background:rgba(30,95,212,.2); border:1px solid rgba(59,123,255,.3); color:#90bfff; font-size:.85rem; font-weight:600; padding:.35rem .85rem; border-radius:6px; margin:0; }

.step-nav { display:flex; gap:.5rem; flex-wrap:wrap; margin-bottom:1.5rem; background:var(--card); border:1px solid var(--border); border-radius:14px; padding:.75rem 1rem; box-shadow:0 2px 8px rgba(30,70,160,.06); }
.step-nav-item { display:flex; align-items:center; gap:.4rem; padding:.45rem .9rem; border-radius:8px; font-size:.78rem; font-weight:700; cursor:pointer; border:1.5px solid transparent; color:var(--muted); transition:all .2s; background:transparent; }
.step-nav-item:hover { background:#f0f5ff; color:var(--accent); border-color:var(--accent); }
.step-nav-item.active { background:var(--accent); color:#fff; border-color:var(--accent); }
.step-nav-item .step-num { width:20px; height:20px; border-radius:50%; background:rgba(255,255,255,.2); display:flex; align-items:center; justify-content:center; font-size:.7rem; }

.driver-app-form .section-card { background:var(--card); border-radius:14px; border:1px solid var(--border); margin-bottom:1.25rem; overflow:hidden; box-shadow:0 2px 12px rgba(30,70,160,.06); }
.driver-app-form .section-header { background:#f0f5ff; border-bottom:1px solid var(--border); padding:.9rem 1.5rem; display:flex; align-items:center; gap:.65rem; }
.section-icon { width:30px; height:30px; background:var(--accent); border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.section-icon svg { width:15px; height:15px; stroke:#fff; }
.section-title { font-size:.9rem; font-weight:700; color:var(--navy); }
.section-body { padding:1.5rem; }

.form-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.1rem; }
.form-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:1.1rem; }
.form-grid-4 { display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:1.1rem; }
.form-full { grid-column:1/-1; }
.field { display:flex; flex-direction:column; gap:.35rem; }
.field-label { font-size:.78rem; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; }
.field-input { height:42px; padding:0 .85rem; border:1.5px solid #d8e5f7; border-radius:8px; background:#f8fbff; font-size:.9rem; font-family:'DM Sans',sans-serif; color:var(--text); transition:all .2s; outline:none; width:100%; }
.field-input:focus { border-color:var(--accent-light); background:#fff; box-shadow:0 0 0 3px rgba(59,123,255,.1); }
.field-input[readonly], .field-input:disabled { background:#eef2fa; color:var(--muted); }
.field-select { height:42px; padding:0 .85rem; border:1.5px solid #d8e5f7; border-radius:8px; background:#f8fbff; font-size:.9rem; font-family:'DM Sans',sans-serif; color:var(--text); outline:none; width:100%; transition:all .2s; }
.field-select:focus { border-color:var(--accent-light); background-color:#fff; box-shadow:0 0 0 3px rgba(59,123,255,.1); }
.field-textarea { padding:.75rem .85rem; border:1.5px solid #d8e5f7; border-radius:8px; background:#f8fbff; font-size:.88rem; font-family:'DM Sans',sans-serif; color:var(--text); outline:none; resize:vertical; min-height:90px; line-height:1.6; width:100%; transition:all .2s; }
.field-textarea:focus { border-color:var(--accent-light); background:#fff; box-shadow:0 0 0 3px rgba(59,123,255,.1); }

.auth-box { background:#f7faff; border:1px solid #dce8ff; border-left:4px solid var(--accent); border-radius:10px; padding:1.2rem 1.3rem; font-size:.85rem; line-height:1.75; color:#3a4f72; margin-bottom:1.1rem; }
.auth-box p { margin:0 0 .5rem; }
.auth-box p:last-child { margin:0; }
.auth-box ul { margin:.5rem 0 0 1.2rem; display:flex; flex-direction:column; gap:.3rem; }
.auth-box li { color:#4a5e82; }

.signature-row { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-top:1.2rem; align-items:end; }
.sig-box { display:flex; flex-direction:column; gap:.4rem; }
.sig-canvas-wrap { border-bottom:1.5px solid #d0dcf0; background:#fff; min-height:90px; position:relative; overflow:hidden; }
.sig-canvas-wrap canvas { display:block; width:100%; height:90px; min-height:90px; touch-action:none; cursor:crosshair; }
.sig-canvas-wrap img { max-width:100%; height:auto; display:block; }
.sig-clear { font-size:.72rem; color:var(--accent); background:none; border:none; cursor:pointer; align-self:flex-start; padding:0; }

.radio-group { background:#f4f8ff; border:1.5px solid #dce8ff; border-radius:10px; padding:1.1rem 1.2rem; }
.radio-group p { font-size:.85rem; font-weight:600; color:var(--text); margin:0 0 .75rem; line-height:1.55; }
.radio-group .radio-options { display:flex; gap:1.5rem; flex-wrap:wrap; }
.radio-group label { display:flex; align-items:center; gap:.4rem; font-size:.85rem; cursor:pointer; }
.radio-group input[type="radio"] { accent-color:var(--accent); }

.repeat-row { background:#f8fbff; border:1.5px solid #dce8ff; border-radius:10px; padding:1.1rem 1.2rem; margin-bottom:1rem; }
.btn-add-row { display:inline-flex; align-items:center; gap:.45rem; padding:.5rem 1rem; border-radius:8px; font-size:.82rem; font-weight:600; cursor:pointer; border:1.5px solid var(--accent); background:rgba(30,95,212,.08); color:var(--accent); font-family:'DM Sans',sans-serif; transition:all .2s; margin-top:.5rem; }
.btn-add-row:hover { background:var(--accent); color:#fff; }
.btn-remove-row { display:inline-flex; align-items:center; gap:.35rem; padding:.3rem .75rem; border-radius:6px; font-size:.76rem; font-weight:600; cursor:pointer; border:1px solid rgba(192,57,43,.4); background:rgba(192,57,43,.08); color:var(--danger); font-family:'DM Sans',sans-serif; transition:all .2s; margin-top:.5rem; }
.btn-remove-row:hover { background:var(--danger); color:#fff; }

.employment-item { background:#fff; border:1.5px solid #dce8ff; border-radius:14px; margin-bottom:1.25rem; overflow:hidden; box-shadow:0 2px 12px rgba(30,70,160,.07); }
.employment-item-header { background:linear-gradient(135deg,#0a1628 0%,#1a3a6e 60%,#2a5cc8 100%); padding:.9rem 1.25rem; display:flex; align-items:center; justify-content:space-between; }
.employment-item-body { padding:1.35rem 1.5rem; display:flex; flex-direction:column; gap:1.1rem; }
.btn-delete-emp { display:inline-flex; align-items:center; gap:.35rem; padding:.38rem .85rem; border-radius:7px; font-size:.78rem; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; border:1px solid rgba(255,100,100,.45); background:rgba(192,57,43,.18); color:#ffaaaa; transition:all .2s; }
.btn-delete-emp:hover { background:var(--danger); color:#fff; border-color:var(--danger); }

.badge-verified { display:inline-flex; align-items:center; gap:.35rem; padding:.3rem .75rem; border-radius:20px; font-size:.74rem; font-weight:700; letter-spacing:.04em; text-transform:uppercase; background:#dcf5ec; color:#0d7a5e; border:1px solid #a8e6cf; }
.badge-pending { background:#fff4dc; color:#8a6000; border:1px solid #f0d080; display:inline-flex; align-items:center; gap:.35rem; padding:.3rem .75rem; border-radius:20px; font-size:.74rem; font-weight:700; letter-spacing:.04em; text-transform:uppercase; }

.quiz-card { background:#fff; border:1.5px solid #dce8ff; border-radius:12px; padding:1.25rem; display:flex; flex-direction:column; gap:.75rem; box-shadow:0 2px 8px rgba(30,70,160,.06); position:relative; overflow:visible; min-height:140px; }
.quiz-card .duration-badge { position:absolute; top:.6rem; right:.6rem; background:var(--accent); color:#fff; font-size:.68rem; font-weight:700; padding:.2rem .55rem; border-radius:20px; display:inline-block; z-index:1; }
.quiz-card .quiz-title { font-size:.88rem; font-weight:700; color:var(--navy); line-height:1.4; margin:0; padding-right:5.5rem; padding-top:.15rem; }
.quiz-card .quiz-action-area { margin-top:auto; overflow:visible; }
.quiz-cards-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1.1rem; align-items:stretch; }
.quiz-cards-grid-4 { grid-template-columns:repeat(4,minmax(0,1fr)); }
@media (max-width:1100px) { .quiz-cards-grid-4 { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (max-width:640px) and (not print) { .quiz-cards-grid-4 { grid-template-columns:1fr; } }
.quiz-status-muted { font-size:.82rem; color:var(--muted); }
.quizesmainsec .section-body { overflow:visible; }
.driver-app-form .section-card.quizes-section { overflow:visible; }
.btn-save { display:inline-flex; align-items:center; gap:.5rem; padding:.65rem 1.6rem; background:var(--accent); color:#fff; border:none; border-radius:9px; font-size:.88rem; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .2s; box-shadow:0 4px 14px rgba(30,95,212,.3); }
.btn-save:hover { background:#1851c0; }
.btn-view-results { justify-content:center; font-size:.8rem; width:100%; margin-top:.15rem; }
.alert-pending-quiz { background:#fff4dc; border:1px solid #f0d080; border-radius:8px; padding:.6rem .75rem; }
.alert-pending-quiz p { font-size:.78rem; font-weight:700; color:#8a6000; margin:0 0 .2rem; }
.alert-pending-quiz span { font-size:.75rem; color:#8a6000; }
.form-check.correct-answer { background:#d4edda; border-radius:6px; padding:.35rem .5rem; margin-bottom:.35rem; }
.form-check.incorrect-answer { background:#f8d7da; border-radius:6px; padding:.35rem .5rem; margin-bottom:.35rem; }

.quiz-modal-overlay { background:rgba(10,22,40,.5)!important; z-index:2000; }
.timer-display { font-weight:700; font-size:.85rem; padding:.4rem .75rem; }
.timer-warning { background:#ffc107!important; color:#000!important; animation:pulse-warning 2s infinite; }
.timer-danger { background:#dc3545!important; color:#fff!important; animation:pulse-danger 1s infinite; }
@keyframes pulse-warning { 0%,100%{opacity:1} 50%{opacity:.7} }
@keyframes pulse-danger { 0%,100%{opacity:1} 50%{opacity:.5} }
.question-step { display:none; }
.question-step.active { display:block; }
.question-block { border-radius:10px!important; background:#fff; }
.quizimg { max-width:180px; height:auto; margin:.75rem 0; display:block; border-radius:8px; }
.radiolabel { color:var(--navy); }
.quiz-modal-overlay .progress { height:8px; border-radius:6px; background:#e8eef8; }
.quiz-modal-overlay .progress-bar { background:var(--accent); border-radius:6px; }
.btn-start-quiz { display:inline-flex; align-items:center; justify-content:center; gap:.45rem; padding:.55rem 1.1rem; background:var(--accent); color:#fff; border:none; border-radius:8px; font-size:.82rem; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .2s; }
.btn-start-quiz:hover { background:#1851c0; }

.btn-submit-main { display:inline-flex; align-items:center; justify-content:center; gap:.6rem; padding:.9rem 2.5rem; background:linear-gradient(135deg,#1a3366,var(--navy-mid),#112240); color:#fff; border:none; border-radius:10px; font-size:1rem; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .25s; box-shadow:0 4px 16px rgba(26,51,102,.35); }
.btn-submit-main:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(26,51,102,.45); }
.btn-submit-main:disabled { opacity:.65; transform:none; cursor:not-allowed; }

.driver-app-form .dropzone-react { border:2px dashed var(--border)!important; border-radius:12px!important; background:#f8fbff!important; min-height:120px!important; padding:1.5rem; text-align:center; cursor:pointer; transition:all .2s; }
.driver-app-form .dropzone-react:hover, .driver-app-form .dropzone-react.dragover { border-color:var(--accent)!important; background:#eef4ff!important; }

.uploaded-files-grid { display:flex; flex-wrap:wrap; gap:.75rem; margin-top:1rem; }
.uploaded-file-item { width:110px; }
.uploaded-file-item .file-card { border:1.5px solid #dce8ff; border-radius:8px; overflow:hidden; background:#fff; position:relative; }
.uploaded-file-item .file-thumb { width:100%; height:80px; object-fit:cover; display:block; }
.uploaded-file-item .file-icon-wrap { height:80px; display:flex; align-items:center; justify-content:center; background:#f4f8ff; }
.uploaded-file-item .file-name { padding:4px 6px; font-size:10px; color:var(--muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.uploaded-file-item .file-del { position:absolute; top:2px; right:2px; background:rgba(192,57,43,.9); color:#fff; border:none; border-radius:4px; width:20px; height:20px; font-size:11px; cursor:pointer; line-height:1; }

.alert-success-new { background:#dcf5ec; border:1px solid #a8e6cf; border-radius:8px; padding:.75rem 1rem; }
.alert-success-new p { font-size:.78rem; font-weight:700; color:#0d7a5e; margin:0 0 .2rem; }
.alert-success-new span { font-size:.75rem; color:#0d7a5e; }

.divider { height:1px; background:var(--border); margin:1.25rem 0; }

.form-fixed-actions {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 1020;
  display: flex; align-items: center; justify-content: center;
  padding: 1rem 1.5rem;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.98), rgba(248, 251, 255, 0.97));
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--border);
  box-shadow: 0 -4px 24px rgba(10, 22, 40, 0.08);
}

/* Edit form action bar (from edit-form.blade) */
.action-bar { display:flex; flex-wrap:wrap; gap:.6rem; margin-bottom:1.25rem; }
.btn-bar {
  display:inline-flex; align-items:center; gap:.45rem; padding:.55rem 1rem; border-radius:8px;
  font-size:.82rem; font-weight:600; cursor:pointer; border:1.5px solid #dce8ff; background:#fff; color:#1a2744;
}
.btn-bar svg { width:16px; height:16px; stroke:currentColor; }
.btn-bar-green { background:#dcf5ec; border-color:#a8e6cf; color:#0d7a5e; }
.btn-bar-danger { background:#fde8e6; border-color:#f5c2bc; color:#c0392b; }

.applicant-card {
  background:linear-gradient(135deg,#0a1628 0%,rgb(25,46,80) 45%,rgb(64,123,226) 100%);
  border-radius:16px; padding:1.75rem; display:flex; gap:1.5rem; align-items:flex-start;
  margin-bottom:1.5rem; color:#fff; box-shadow:0 8px 32px rgba(10,22,40,.22);
}
.applicant-photo { width:100px; height:100px; border-radius:10px; object-fit:cover; border:3px solid rgba(201,168,76,.45); flex-shrink:0; }
.applicant-photo-placeholder { width:100px; height:100px; border-radius:10px; border:3px solid rgba(201,168,76,.45); background:#1e3254; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.applicant-tag { display:inline-block; background:rgba(201,168,76,.15); border:1px solid rgba(201,168,76,.35); color:#e8c96a; font-size:.7rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; padding:.25rem .7rem; border-radius:20px; margin-bottom:.5rem; }
.applicant-name { font-size:1.35rem; font-weight:700; margin-bottom:.25rem; }
.applicant-address { color:#7a9ad0; font-size:.85rem; margin-bottom:.5rem; }
.applicant-company { display:inline-flex; align-items:center; gap:.4rem; background:rgba(30,95,212,.2); border:1px solid rgba(59,123,255,.3); color:#90bfff; font-size:.85rem; font-weight:600; padding:.35rem .85rem; border-radius:6px; }

.page-header-title h2 {
  display: block;
  position: static;
  float: none;
  clear: both;
  margin-top: 0.35rem;
}
.driver-app-form .page-header .breadcrumb {
  margin-bottom: 0.25rem;
}
.driver-app-form .page-header .row > .col-md-12 {
  width: 100%;
}

@media (max-width: 768px) and (not print) {
  .form-grid,.form-grid-3,.form-grid-4,.signature-row { grid-template-columns:1fr!important; }
  .form-meta-card, .applicant-card { flex-direction:column; }
  .step-nav { display:none; }
}

/* Force 2-col (and 3/4-col) grids in print — Chrome print width triggers mobile CSS otherwise */
@media print {
  .driver-app-form .form-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 1rem 1.25rem !important;
  }
  .driver-app-form .form-grid-3 {
    display: grid !important;
    grid-template-columns: 1fr 1fr 1fr !important;
    gap: 1rem 1.25rem !important;
  }
  .driver-app-form .form-grid-4 {
    display: grid !important;
    grid-template-columns: 1fr 1fr 1fr 1fr !important;
    gap: 0.85rem 1rem !important;
  }
  .driver-app-form .signature-row {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 1.25rem !important;
  }
  .driver-app-form .field {
    width: auto !important;
    max-width: none !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
  .driver-app-form .form-full {
    grid-column: 1 / -1 !important;
  }
}

/* Success / error SweetAlert styling (matches form navy/blue theme) */
.dss-swal-container.swal2-backdrop-show,
.swal2-container.dss-swal-container,
.swal2-container.swal2-backdrop-show {
  background: rgba(10, 22, 40, 0.45) !important;
  backdrop-filter: blur(10px) saturate(1.1) !important;
  -webkit-backdrop-filter: blur(10px) saturate(1.1) !important;
}
.swal2-container.swal2-backdrop-show::before {
  content: '';
  position: fixed;
  inset: 0;
  background: rgba(10, 22, 40, 0.28);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  pointer-events: none;
  z-index: -1;
}
.dss-swal-popup {
  border-radius: 18px !important;
  padding: 1.75rem 1.5rem 1.5rem !important;
  box-shadow: 0 20px 50px rgba(10, 22, 40, 0.22) !important;
  border: 1px solid #dce8ff !important;
  font-family: 'DM Sans', 'Public Sans', sans-serif !important;
  position: relative;
  z-index: 1;
}
.dss-swal-title {
  font-size: 1.35rem !important;
  font-weight: 700 !important;
  color: #0a1628 !important;
  margin-top: 0.35rem !important;
}
.dss-swal-text {
  font-size: 0.95rem !important;
  color: #5b6b88 !important;
  line-height: 1.55 !important;
}
.dss-swal-confirm {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 120px !important;
  padding: 0.7rem 1.6rem !important;
  border: none !important;
  border-radius: 10px !important;
  background: linear-gradient(135deg, #1a3366, #112240) !important;
  color: #fff !important;
  font-weight: 700 !important;
  font-size: 0.92rem !important;
  box-shadow: 0 4px 16px rgba(26, 51, 102, 0.35) !important;
  cursor: pointer !important;
}
.dss-swal-confirm:hover {
  filter: brightness(1.06);
}
.dss-swal-icon.swal2-success {
  border-color: #0d7a5e !important;
  color: #0d7a5e !important;
}
.dss-swal-icon.swal2-success [class^=swal2-success-line] {
  background-color: #0d7a5e !important;
}
.dss-swal-icon.swal2-success .swal2-success-ring {
  border-color: rgba(13, 122, 94, 0.3) !important;
}
.swal2-timer-progress-bar {
  background: #1e5fd4 !important;
}
.dss-swal-in {
  animation: dss-swal-pop 0.28s ease;
}
@keyframes dss-swal-pop {
  from { opacity: 0; transform: scale(0.92) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* Global: blur page behind SweetAlert popups */
body.swal2-shown > :not(.swal2-container) {
  filter: blur(6px);
  transition: filter 0.2s ease;
}
.swal2-container.swal2-backdrop-show {
  background: rgba(10, 22, 40, 0.42) !important;
  backdrop-filter: blur(8px) saturate(1.05) !important;
  -webkit-backdrop-filter: blur(8px) saturate(1.05) !important;
}

/* ========== PRINT VIEW — same colored UI + breaks as production PDF ========== */
@media print {
  @page {
    size: letter;
    margin: 0.45in;
  }

  html, body, * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  html, body {
    background: #fff !important;
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
  }

  /* Hide only admin chrome / controls — keep form UI colors */
  .pc-sidebar,
  .pc-header,
  .pc-mob-drp,
  header.pc-header,
  nav.pc-sidebar,
  .pc-user-card,
  .action-bar,
  .mainrowheader,
  .form-fixed-actions,
  .btn-submit-main,
  .btn-add-row,
  .btn-remove-row,
  .btn-delete-emp,
  .btn-start-quiz,
  .btn-bar,
  .dropzone-react,
  .file-del,
  .sig-clear,
  .step-nav,
  .page-header,
  .breadcrumb,
  .alert,
  .swal2-container,
  .modal,
  .modal-backdrop,
  input[type="file"],
  .applicant-tag,
  .quiz-action-area,
  .followup-section {
    display: none !important;
  }

  #root,
  .container-fluid,
  #layout-wrapper,
  .main-content,
  .page-content,
  .pc-container,
  .pc-content,
  .driver-app-form {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    top: 0 !important;
    left: 0 !important;
    position: static !important;
    min-height: 0 !important;
    height: auto !important;
    overflow: visible !important;
    float: none !important;
    transform: none !important;
    background: #fff !important;
    box-shadow: none !important;
  }

  .pc-container { margin-left: 0 !important; }
  .driver-app-form { padding-bottom: 0 !important; }

  /* Cover: blue header + large photo (screen layout unchanged) */
  .applicant-card,
  .form-meta-card {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 12px !important;
    background: transparent !important;
    border: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
    margin: 0 0 0 !important;
    box-shadow: none !important;
    page-break-after: always !important;
    break-after: page !important;
  }

  .applicant-card::before,
  .applicant-card::after,
  .form-meta-card::before,
  .form-meta-card::after {
    display: none !important;
  }

  .applicant-info {
    display: block !important;
    order: 1 !important;
    width: 100% !important;
    background: linear-gradient(135deg, #0a1628 0%, #192e50 45%, #407be2 100%) !important;
    border-radius: 14px !important;
    padding: 1.1rem 1.35rem !important;
  }

  .applicant-photo,
  .form-meta-card .meta-photo {
    display: block !important;
    order: 2 !important;
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    max-height: 8in !important;
    object-fit: contain !important;
    object-position: center top !important;
    border: none !important;
    border-radius: 12px !important;
    margin: 0 auto !important;
    background: #fff !important;
  }

  .applicant-photo-placeholder,
  .form-meta-card .meta-photo-placeholder {
    display: flex !important;
    order: 2 !important;
    width: 100% !important;
    height: 260px !important;
    border: none !important;
    border-radius: 12px !important;
    background: #e8eef8 !important;
  }

  .applicant-name { color: #fff !important; font-size: 1.35rem !important; }
  .applicant-address { color: #7a9ad0 !important; }
  .applicant-company {
    display: inline-flex !important;
    background: rgba(30, 95, 212, 0.2) !important;
    border: 1px solid rgba(59, 123, 255, 0.3) !important;
    color: #90bfff !important;
  }

  /* Keep live section UI (cards, headers, fields, colors) — do not flatten */
  .driver-app-form .section-card {
    page-break-inside: auto !important;
    break-inside: auto !important;
    overflow: visible !important;
    box-shadow: none !important;
  }

  .driver-app-form .section-icon {
    display: flex !important;
  }

  /* Don't orphan section headers at bottom of page */
  .driver-app-form .section-header {
    page-break-after: avoid !important;
    break-after: avoid-page !important;
  }

  /* Whole block moves to next page instead of cutting mid-section */
  .driver-app-form .print-keep-together,
  .driver-app-form .section-card.print-keep-together,
  .driver-app-form .auth-box,
  .driver-app-form .radio-group,
  .driver-app-form .signature-row,
  .driver-app-form .repeat-row,
  .driver-app-form .employment-cert-block {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .driver-app-form .employment-cert-block {
    page-break-before: auto !important;
    margin-top: 0.75rem !important;
  }

  /* PDF-like breaks: Authorization alone, then major steps start new pages */
  .driver-app-form .step-content[data-step-content="0"] {
    page-break-after: always !important;
    break-after: page !important;
  }

  .driver-app-form .step-content[data-step-content="2"],
  .driver-app-form .step-content[data-step-content="3"],
  .driver-app-form .step-content[data-step-content="4"],
  .driver-app-form .step-content[data-step-content="5"],
  .driver-app-form .step-content[data-step-content="6"],
  .driver-app-form .step-content[data-step-content="7"],
  .driver-app-form .step-content[data-step-content="8"] {
    page-break-before: always !important;
    break-before: page !important;
  }

  .employment-item {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    box-shadow: none !important;
  }

  .employment-item-header {
    page-break-after: avoid !important;
    break-after: avoid-page !important;
  }

  .quiz-card {
    page-break-before: always !important;
    break-before: page !important;
    page-break-inside: avoid !important;
    box-shadow: none !important;
  }

  .duration-badge { display: inline-block !important; }

  /* Attached files — full page each (PDF pages 39–48 style) */
  .uploaded-files-grid {
    display: block !important;
    margin: 0 !important;
  }

  .uploaded-file-item {
    width: 100% !important;
    max-width: 100% !important;
    page-break-before: always !important;
    break-before: page !important;
    margin: 0 0 12px !important;
  }

  .uploaded-file-item .file-card {
    border: none !important;
    box-shadow: none !important;
  }

  .uploaded-file-item .file-name {
    display: block !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    color: #0a1628 !important;
    padding: 0 0 10px !important;
    white-space: normal !important;
  }

  .uploaded-file-item .file-name::before {
    content: "Attached File:  ";
    font-weight: 700;
  }

  .uploaded-file-item .file-thumb {
    width: 100% !important;
    height: auto !important;
    max-height: 9in !important;
    object-fit: contain !important;
  }

  .uploaded-file-item .file-icon-wrap {
    height: auto !important;
    min-height: 120px !important;
    padding: 24px !important;
  }

  .uploaded-file-item .file-icon-wrap img {
    width: 64px !important;
    height: 64px !important;
  }

  a { text-decoration: none !important; color: inherit !important; }
}
`;

export const DRIVER_TYPES = [
  'Pick Up',
  'Cargo Van',
  'Bus',
  'Straight Truck',
  '18 Wheeler-Truck Tractor',
  '18 Wheeler - Truck Tractor B1',
  '18 Wheeler - Truck Tractor CDL',
];

export const DISCIPLINARY_VIOLATIONS = [
  'Conduct & Appearance',
  'Out of Route miles',
  'Attendance Meetings Leave out on time',
  'ELogs',
  'Paperwork',
  'Clean Truck (inside)',
  'Not Calling In',
  'Sweep trailer out',
  'Handling OS&D Call Dispatch',
  'Dishonest',
  'Speeding Ticket - 15mph over speed limit',
  'Late Delivery',
  'Passengers Policy',
  'Not Accident (Scraping trailers, curbing tires, etc.)',
];

export const STEPS = [
  { id: 0, label: 'Authorization' },
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Employment' },
  { id: 3, label: 'Credit Report' },
  { id: 4, label: 'Violations' },
  { id: 5, label: 'Drug & Alcohol' },
  { id: 6, label: 'Disciplinary' },
  { id: 7, label: 'Documents' },
  { id: 8, label: 'Quizzes' },
];

export const ENGLISH_QUESTIONS = [
  ['quest_hauling', 'What are you hauling?'],
  ['quest_license', "Let me see your driver's license"],
  ['quest_insurance', 'Let me see your insurance'],
  ['quest_where', 'Where are you from?'],
  ['quest_live', 'Where do you live?'],
  ['quest_coming', 'Where are you coming from?'],
  ['quest_going', 'Where are you going?'],
  ['quest_truck_number', 'What is your truck number?'],
  ['quest_trailer_number', 'What is your trailer number?'],
  ['quest_cargo', "What's your cargo?"],
  ['quest_driver_experience', 'For how long have you been a driver?'],
  ['quest_last_company', 'Which was the last company you worked for?'],
  ['quest_trip_start', 'Where did you start your trip today?'],
  ['quest_carrying', 'What are you carrying?'],
  ['quest_driving_duration', 'For how long have you been driving today?'],
  ['quest_border_frequency', 'How many times a week do you cross the border?'],
  ['quest_border_every_trip', 'Do you cross the border every trip?'],
  ['quest_break_time', 'What time did you take your break?'],
  ['quest_license_number', "What's your driver's license number?"],
  ['quest_dob', "What's your date of birth?"],
  ['quest_age', 'How old are you?'],
  ['quest_stop_time', 'What time are you planning to stop driving today?'],
];

export function fmtDate(val) {
  if (!val) return '';
  const s = String(val);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  try {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  } catch {
    return '';
  }
}

export { fileUrl, profileUrl } from '../../utils/storageUrl';

export function emptyExperience() {
  return { type_of_equipment: '', years_of_experience: '', miles_driven: '' };
}

export function emptyAccident() {
  return { accident_date: '', type_of_accident: '', fatalities: '', injuries: '' };
}

export function emptyConviction() {
  return { conviction_location: '', conviction_date: '', conviction_charge: '' };
}

export function emptyEmployment(driverType = '') {
  return {
    id: 'new',
    prev_company_name: '',
    prev_contact_person: '',
    prev_emp_phone: '',
    prev_emp_email: '',
    prev_emp_address: '',
    prev_emp_city: '',
    prev_emp_statezip: '',
    prev_position_held: driverType || '',
    prev_from_date: '',
    prev_to_date: '',
    prev_leaving_reason: '',
    prev_trailer_type: '',
    prev_fmcsa: '',
    prev_dot_regulated: '',
    is_verification_sent: false,
    is_employment_verified: false,
    request_id: null,
  };
}

/** Build multipart FormData matching Laravel field names from storeFormData / updateFormData */
export const APPLICANT_SIGNATURE_FIELDS = [
  'auth_signature',
  'prevemp_signature',
  'credreport_signature',
  'violation_signature',
  'alcohol_signature',
  'commitment_signature',
  'dot_consent_signature',
  'drug_policy_signature',
  'account_auth_signature',
  'fmcsa_signature',
  'disciplinary_signature',
  'hos_signature',
  'final_signature',
];

/** Copy one applicant signature to every other applicant signature field. */
export function syncApplicantSignature(fields, name, value) {
  const next = { ...fields, [name]: value };

  if (!value || !APPLICANT_SIGNATURE_FIELDS.includes(name)) {
    return next;
  }

  APPLICANT_SIGNATURE_FIELDS.forEach((key) => {
    next[key] = value;
  });

  return next;
}

export function buildFormPayload(state, { includeCompanyId = false } = {}) {
  const fd = new FormData();
  const a = state.fields;

  const set = (k, v) => {
    if (v === undefined || v === null) return;
    fd.append(k, v);
  };

  set('application_date', a.application_date);
  set('driver_name', a.driver_name);
  set('email_address', a.email_address);
  set('appcompany_name', a.appcompany_name);
  set('driver_type', a.driver_type);
  set('address', a.address);
  set('city', a.city);
  set('state', a.state);
  set('zip', a.zip);
  set('phone', a.phone);
  set('alternatephone', a.alternatephone);
  set('ssn', a.ssn);
  set('dob', a.dob);
  set('license-number', a.license_number);
  set('license-state', a.license_state);
  set('license-class', a.license_class);
  set('license-expiration', a.license_expiry);
  set('medico', a.medicalcard_number);
  set('expiration-date', a.medicalcard_expiry);
  set('visa', a.visa_number);
  set('expiration-date-visa', a.visa_expiry);
  set('constancia_lfd', a.constancia_lfd);
  if (state.constanciaLfdPendingFile) {
    fd.append('constancia_lfd_file', state.constanciaLfdPendingFile);
  }
  set('denied_license', a.denied_license);
  set('license_suspended', a.license_suspended);
  set('suspended_explain', a.suspended_explain);
  set('arrested_convicted', a.arrested_convicted);
  set('conviction_explanation', a.conviction_explanation);
  set('emergency_name', a.emergency_name);
  set('emergency_phone', a.emergency_phone);
  set('emergency_relation', a.emergency_relation);
  set('violation_cert_date', a.violation_cert_date);
  set('violation_cert_reviewer', a.violation_cert_reviewer);
  set('safety_prog_date', a.safety_prog_date);
  set('safety_prog_carrier', a.safety_prog_carrier);
  set('safety_prog_reviewer', a.safety_prog_reviewer);
  set('alcohol_test', a.alcohol_test);
  set('return_duty_require', a.return_duty_require);
  set('alcohol_state_date', a.alcohol_state_date);
  set('alcohol_witness_date', a.alcohol_witness_date);
  set('consent_rep_name', a.consent_rep_name);
  set('consent_rep_date', a.consent_rep_date);
  set('final_signature', a.final_signature);

  if (includeCompanyId && a.company_id) set('company_id', a.company_id);

  const sigKeys = [
    'auth_signature', 'prevemp_signature', 'credreport_signature', 'violation_signature',
    'violation_review_signature', 'safety_review_signature', 'alcohol_signature',
    'alcohol_witness_signature', 'commitment_signature', 'dot_consent_signature',
    'drug_policy_signature', 'account_auth_signature', 'fmcsa_signature', 'disciplinary_signature',
    'hos_signature',
  ];
  sigKeys.forEach((k) => {
    if (a[k]) set(k, a[k]);
  });

  const experiences = state.experiences?.length ? state.experiences : [emptyExperience()];
  experiences.forEach((row) => {
    fd.append('equipment_type[]', row.type_of_equipment || '');
    fd.append('years_of_experience[]', row.years_of_experience || '');
    fd.append('miles_driven[]', row.miles_driven || '');
  });

  const accidents = state.accidents?.length ? state.accidents : [emptyAccident()];
  accidents.forEach((row) => {
    fd.append('accident_date[]', row.accident_date || '');
    fd.append('type_of_accident[]', row.type_of_accident || '');
    fd.append('fatalities[]', row.fatalities || '');
    fd.append('injuries[]', row.injuries || '');
  });

  const convictions = state.convictions?.length ? state.convictions : [emptyConviction()];
  convictions.forEach((row) => {
    fd.append('violation_location[]', row.conviction_location || '');
    fd.append('violation_date[]', row.conviction_date || '');
    fd.append('violation_charge[]', row.conviction_charge || '');
  });

  const employments = state.employments?.length ? state.employments : [emptyEmployment()];
  employments.forEach((row) => {
    fd.append('employment_ids[]', row.id ?? 'new');
    fd.append('prev_company_name[]', row.prev_company_name || '');
    fd.append('prev_contact_person[]', row.prev_contact_person || '');
    fd.append('prev_emp_phone[]', row.prev_emp_phone || '');
    fd.append('prev_emp_email[]', row.prev_emp_email || '');
    fd.append('prev_emp_address[]', row.prev_emp_address || '');
    fd.append('prev_emp_city[]', row.prev_emp_city || '');
    fd.append('prev_emp_statezip[]', row.prev_emp_statezip || '');
    fd.append('prev_position_held[]', row.prev_position_held || '');
    fd.append('prev_from_date[]', row.prev_from_date || '');
    fd.append('prev_to_date[]', row.prev_to_date || '');
    fd.append('prev_leaving_reason[]', row.prev_leaving_reason || '');
    fd.append('prev_trailer_type[]', row.prev_trailer_type || '');
    fd.append('prev_fmcsa[]', row.prev_fmcsa || '');
    fd.append('prev_dot_regulated[]', row.prev_dot_regulated || '');
  });

  return fd;
}

export function initStateFromPayload(data) {
  const app = data.application || {};
  const user = data.user || {};
  const experiences = (data.experiences || []).map((e) => ({
    type_of_equipment: e.type_of_equipment || '',
    years_of_experience: e.years_of_experience || '',
    miles_driven: e.miles_driven || '',
  }));
  const accidents = (data.accidents || []).map((a) => ({
    accident_date: fmtDate(a.accident_date),
    type_of_accident: a.type_of_accident || '',
    fatalities: a.fatalities ?? '',
    injuries: a.injuries ?? '',
  }));
  const convictions = (data.convictions || []).map((c) => ({
    conviction_location: c.conviction_location || '',
    conviction_date: fmtDate(c.conviction_date),
    conviction_charge: c.conviction_charge || '',
  }));
  const employments = (data.previousEmployments || []).map((e) => ({
    id: e.id,
    prev_company_name: e.prev_company_name || '',
    prev_contact_person: e.prev_contact_person || '',
    prev_emp_phone: e.prev_emp_phone || '',
    prev_emp_email: e.prev_emp_email || '',
    prev_emp_address: e.prev_emp_address || '',
    prev_emp_city: e.prev_emp_city || '',
    prev_emp_statezip: e.prev_emp_statezip || '',
    prev_position_held: e.prev_position_held || app.driver_type || '',
    prev_from_date: fmtDate(e.prev_from_date),
    prev_to_date: fmtDate(e.prev_to_date),
    prev_leaving_reason: e.prev_leaving_reason || '',
    prev_trailer_type: e.prev_trailer_type || '',
    prev_fmcsa: e.prev_fmcsa || '',
    prev_dot_regulated: e.prev_dot_regulated || '',
    is_verification_sent: !!e.is_verification_sent,
    is_employment_verified: !!e.is_employment_verified,
    request_id: e.request_id,
    email_send_count: e.email_send_count,
  }));

  return {
    applicationId: app.id,
    userId: app.user_id,
    companies: data.companies || [],
    files: data.applicationFiles || app.files || [],
    profileImgBase:
      import.meta.env.VITE_PROFILE_IMG_URL ||
      data.profile_img_base ||
      'https://adminapi.dotsafetyservice.com/',
    storageBase:
      import.meta.env.VITE_PROFILE_IMG_URL ||
      data.storage_base ||
      'https://adminapi.dotsafetyservice.com/',
    constanciaLfdPendingFile: null,
    followUpEntries: data.followUpEntries || [],
    correctAnswers: data.correctAnswers || null,
    quizzes: {
      english: data.englishQuestionnaire || null,
      hos: data.hoursOfServiceTest || null,
      preTrip: data.preTripInspection || null,
      traffic: data.trafficSignsTest || null,
    },
    experiences: experiences.length ? experiences : [emptyExperience()],
    accidents: accidents.length ? accidents : [emptyAccident()],
    convictions: convictions.length ? convictions : [emptyConviction()],
    employments: employments.length ? employments : [emptyEmployment(app.driver_type)],
    fields: {
      application_date: fmtDate(app.application_date),
      driver_name: app.driver_name || '',
      email_address: user.email || '',
      appcompany_name: app.company_name || '',
      company_id: app.company_id || '',
      company_display: app.company?.company_name || app.company_name || '',
      driver_type: app.driver_type || '',
      address: app.driver_address || '',
      city: app.driver_city || '',
      state: app.driver_state || '',
      zip: app.driver_zipcode || '',
      phone: app.driver_phone || '',
      alternatephone: app.alternate_phone || '',
      ssn: app.driver_ssn || '',
      dob: fmtDate(app.date_of_birth),
      license_number: app.license_number || '',
      license_state: app.license_state || '',
      license_class: app.license_class || '',
      license_expiry: fmtDate(app.license_expiry),
      medicalcard_number: app.medicalcard_number || '',
      medicalcard_expiry: fmtDate(app.medicalcard_expiry),
      visa_number: app.visa_number || '',
      visa_expiry: fmtDate(app.visa_expiry),
      constancia_lfd: fmtDate(app.constancia_lfd),
      constancia_lfd_file: app.constancia_lfd_file || '',
      denied_license: app.denied_license || '',
      license_suspended: app.license_suspended || '',
      suspended_explain: app.suspended_explain || '',
      arrested_convicted: app.arrested_convicted || '',
      conviction_explanation: app.conviction_explanation || '',
      emergency_name: app.emergency_name || '',
      emergency_phone: app.emergency_phone || '',
      emergency_relation: app.emergency_relation || '',
      violation_cert_date: fmtDate(app.violation_cert_date),
      violation_cert_reviewer: app.violation_cert_reviewer || '',
      safety_prog_date: fmtDate(app.safety_prog_date),
      safety_prog_carrier: app.safety_prog_carrier || app.company_name || '',
      safety_prog_reviewer: app.safety_prog_reviewer || '',
      alcohol_test: app.alcohol_test || '',
      return_duty_require: app.return_duty_require || '',
      alcohol_state_date: fmtDate(app.alcohol_state_date),
      alcohol_witness_date: fmtDate(app.alcohol_witness_date),
      consent_rep_name: app.consent_rep_name || '',
      consent_rep_date: fmtDate(app.consent_rep_date),
      final_signature: app.final_signature || '',
      for_members: app.for_members || '',
      future_member_list: app.future_member_list || '',
      is_active: app.is_active,
      profile: user.profile || '',
      auth_signature: app.auth_signature || '',
      prevemp_signature: app.prevemp_signature || '',
      credreport_signature: app.credreport_signature || '',
      violation_signature: app.violation_signature || '',
      violation_review_signature: app.violation_review_signature || '',
      safety_review_signature: app.safety_review_signature || '',
      alcohol_signature: app.alcohol_signature || '',
      alcohol_witness_signature: app.alcohol_witness_signature || '',
      commitment_signature: app.commitment_signature || '',
      dot_consent_signature: app.dot_consent_signature || '',
      drug_policy_signature: app.drug_policy_signature || '',
      account_auth_signature: app.account_auth_signature || '',
      fmcsa_signature: app.fmcsa_signature || '',
      disciplinary_signature: app.disciplinary_signature || '',
      hos_signature: app.hos_signature || '',
    },
  };
}

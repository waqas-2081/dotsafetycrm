export default function SectionCard({ title, iconBg, icon, children, className = '' }) {
  return (
    <div className={`section-card${className ? ` ${className}` : ''}`}>
      <div className="section-header">
        <div className="section-icon" style={iconBg ? { background: iconBg } : undefined}>
          {icon || (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          )}
        </div>
        <span className="section-title">{title}</span>
      </div>
      <div className="section-body">{children}</div>
    </div>
  );
}

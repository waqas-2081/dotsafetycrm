import './PageSkeleton.css';

/** Single shimmer block */
export function Skel({ className = '', style, width, height, circle = false }) {
  const merged = {
    width: width ?? undefined,
    height: height ?? undefined,
    borderRadius: circle ? '50%' : undefined,
    ...style,
  };
  return <span className={`skel ${circle ? 'skel-circle' : ''} ${className}`.trim()} style={merged} />;
}

/** Table-style skeleton (for use inside existing card/table) */
export function TableSkeleton({ rows = 8, cols = 5 }) {
  return (
    <div className="skel-table-wrap">
      <div className="skel-table-head">
        {Array.from({ length: cols }).map((_, i) => (
          <Skel key={`h-${i}`} height={14} className="skel-table-cell" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div className="skel-table-row" key={`r-${r}`}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skel
              key={`c-${r}-${c}`}
              height={c === 0 ? 16 : 12}
              className="skel-table-cell"
              style={{ width: c === 0 ? '70%' : `${55 + ((r + c) % 4) * 8}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Full page skeleton variants — same look on every screen */
export default function PageSkeleton({ variant = 'dashboard', title = true }) {
  if (variant === 'table') {
    return (
      <div className="pc-container">
        <div className="pc-content skel-page">
          {title && (
            <div className="skel-page-header">
              <Skel width={120} height={12} />
              <Skel width={220} height={28} className="mt-2" />
            </div>
          )}
          <div className="skel-toolbar">
            <Skel width={220} height={38} />
            <Skel width={120} height={38} />
          </div>
          <div className="card skel-card">
            <div className="card-body p-0">
              <TableSkeleton rows={9} cols={6} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div className="pc-container">
        <div className="pc-content skel-page">
          {title && (
            <div className="skel-page-header">
              <Skel width={140} height={12} />
              <Skel width={260} height={28} className="mt-2" />
            </div>
          )}
          <div className="skel-form-nav">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skel key={i} width={110} height={34} />
            ))}
          </div>
          <div className="card skel-card">
            <div className="card-body">
              <Skel width={180} height={18} className="mb-4" />
              <div className="row g-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div className="col-md-6" key={i}>
                    <Skel width={90} height={12} className="mb-2" />
                    <Skel height={40} className="w-100" />
                  </div>
                ))}
              </div>
              <div className="d-flex gap-2 mt-4">
                <Skel width={110} height={40} />
                <Skel width={110} height={40} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div className="pc-container">
        <div className="pc-content skel-page">
          <div className="skel-toolbar mb-3">
            <Skel width={100} height={38} />
            <Skel width={140} height={38} />
          </div>
          <div className="card skel-card mb-3">
            <div className="card-body">
              <Skel width={240} height={22} className="mb-3" />
              <div className="row g-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div className="col-md-3" key={i}>
                    <Skel width={80} height={10} className="mb-2" />
                    <Skel width="70%" height={16} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card skel-card">
            <div className="card-body p-0">
              <TableSkeleton rows={6} cols={5} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'auth') {
    return (
      <div className="skel-auth">
        <div className="skel-auth-card">
          <Skel width={120} height={48} className="mx-auto mb-3" />
          <Skel width={160} height={22} className="mx-auto mb-2" />
          <Skel width={200} height={12} className="mx-auto mb-4" />
          <Skel height={48} className="w-100 mb-3" />
          <Skel height={48} className="w-100 mb-3" />
          <Skel height={44} className="w-100" />
        </div>
      </div>
    );
  }

  // dashboard (default)
  return (
    <div className="pc-container">
      <div className="pc-content skel-page">
        {title && (
          <div className="skel-page-header">
            <Skel width={100} height={12} />
            <Skel width={180} height={28} className="mt-2" />
          </div>
        )}
        <div className="row g-3 mb-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="col-md-3 col-sm-6" key={i}>
              <div className="card skel-card skel-stat-card">
                <div className="card-body">
                  <Skel width={110} height={14} className="mb-3" />
                  <Skel width={64} height={28} className="mb-3" />
                  <Skel width={80} height={10} className="mb-2" />
                  <Skel height={7} className="w-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="card skel-card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <Skel width={260} height={18} className="mb-2" />
                <Skel width={320} height={12} />
              </div>
              <Skel width={110} height={24} />
            </div>
            <div className="d-flex gap-2 mb-3 flex-wrap">
              <Skel width={220} height={36} />
              <Skel width={240} height={36} />
              <Skel width={180} height={36} />
            </div>
            <div className="row g-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="col-md-6" key={i}>
                  <div className="skel-panel">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <Skel width={36} height={36} circle />
                      <Skel width={160} height={14} />
                    </div>
                    <Skel width={48} height={26} className="mb-3" />
                    <Skel height={54} className="w-100 mb-2" />
                    <Skel height={54} className="w-100 mb-2" />
                    <Skel height={54} className="w-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

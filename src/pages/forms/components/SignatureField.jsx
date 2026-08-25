import { useEffect, useRef } from 'react';

/**
 * Canvas signature field matching .sig-canvas-wrap / SignaturePad behavior.
 * Shows existing image when value is set and readOnly; otherwise draws.
 */
export default function SignatureField({
  name,
  value,
  onChange,
  label,
  readOnly = false,
}) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || readOnly || value) return;
    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = 90 * ratio;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, rect.width, 90);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [readOnly, value]);

  const pos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const start = (e) => {
    if (readOnly || value) return;
    drawing.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    e.preventDefault();
  };

  const move = (e) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    e.preventDefault();
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    const data = canvasRef.current.toDataURL('image/png');
    onChange?.(name, data);
  };

  const clear = () => {
    onChange?.(name, '');
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, rect.width, 90);
  };

  return (
    <div className="sig-box">
      {label ? <span className="field-label">{label}</span> : null}
      <div className="sig-canvas-wrap customersignature">
        {value ? (
          <img src={value} alt="Signature" />
        ) : (
          <canvas
            ref={canvasRef}
            onMouseDown={start}
            onMouseMove={move}
            onMouseUp={end}
            onMouseLeave={end}
            onTouchStart={start}
            onTouchMove={move}
            onTouchEnd={end}
          />
        )}
      </div>
      {!readOnly && (
        <button type="button" className="sig-clear" onClick={clear}>
          {value ? 'Clear / Re-sign' : 'Clear'}
        </button>
      )}
    </div>
  );
}

export function Ring({ size = 120, stroke = 11, pct = 0, mini = false }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - pct / 100);
  const col = pct >= 70 ? "var(--ready)" : pct >= 40 ? "var(--warn)" : "var(--accent)";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--lineSoft)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .6s cubic-bezier(.4,0,.2,1), stroke .3s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <span className="serif tnum" style={{ fontWeight: 500, lineHeight: 1, fontSize: mini ? size * 0.42 : size * 0.3 }}>
          {pct}{!mini && <span style={{ fontSize: size * 0.13, color: "var(--muted)" }}>%</span>}
        </span>
      </div>
    </div>
  );
}

export function Bar({ value }) {
  const v = Math.max(0, Math.min(1, value));
  const col = v > 0.92 ? "var(--warn)" : "var(--ready)";
  return <div className="bar"><i style={{ width: `${v * 100}%`, background: col }} /></div>;
}

// Minimal module header: just the action(s), aligned right. No kicker, no blurb.
export function Intro({ right }) {
  if (!right) return null;
  return <div className="intro" style={{ justifyContent: "flex-end", marginBottom: 18 }}>{right}</div>;
}

import { X } from "lucide-react";
import { useEffect } from "react";

// The Pando mark. Uses /logo.png if you drop one in public/, else the bundled SVG.
export function Logo({ size = 28, radius = 8 }) {
  return (
    <img src="/logo.png" alt="Pando" width={size} height={size}
      onError={(e) => { if (!e.currentTarget.dataset.f) { e.currentTarget.dataset.f = "1"; e.currentTarget.src = "/logo.svg"; } }}
      style={{ width: size, height: size, borderRadius: radius, flexShrink: 0, display: "block", boxShadow: "0 1px 3px rgba(20,18,30,.18)" }} />
  );
}

// A centered modal. Escape and backdrop-click close it.
export function Modal({ title, onClose, children, footer }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="serif" style={{ fontSize: 21, fontWeight: 500 }}>{title}</h3>
          <button className="iconbtn" onClick={onClose} aria-label="Close"><X size={17} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div style={{ padding: "0 24px 22px", display: "flex", gap: 10, justifyContent: "flex-end" }}>{footer}</div>}
      </div>
    </div>
  );
}

// Labelled form field. Pass `as="textarea"` or `as="select"`; children for <option>s.
export function Field({ label, as = "input", children, hint, ...props }) {
  const Tag = as;
  return (
    <label style={{ display: "block" }}>
      {label && <span className="lbl">{label}</span>}
      <Tag className="fld" {...props}>{children}</Tag>
      {hint && <span style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 4, display: "block" }}>{hint}</span>}
    </label>
  );
}

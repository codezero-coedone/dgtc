import React, { useEffect } from "react";

export function AdminToast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onClose, 2600);
    return () => window.clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`dk-toast ${toast.type || "success"}`} role="status">
      <strong>{toast.title}</strong>
      {toast.message ? <span>{toast.message}</span> : null}
      <button type="button" onClick={onClose} aria-label="알림 닫기">
        ×
      </button>
    </div>
  );
}

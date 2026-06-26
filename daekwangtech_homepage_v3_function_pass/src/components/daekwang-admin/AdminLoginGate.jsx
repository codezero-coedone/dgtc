import React, { useEffect, useMemo, useState } from "react";
import { DaekwangLogoLockup } from "../brand/DaekwangLogoLockup.jsx";

export const ADMIN_AUTH_STORAGE_KEY = "daekwang.admin.auth.v1";
const DEMO_ADMIN_ID = "dgtc66";
const DEMO_ADMIN_PASSWORD = "1234";

export function readAdminAuthSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.authenticated === true ? parsed : null;
  } catch {
    window.sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    return null;
  }
}

export function clearAdminAuthSession() {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
  }
}

function writeAdminAuthSession(userId) {
  const session = {
    authenticated: true,
    userId,
    loginAt: new Date().toISOString(),
    mode: "demo-local",
  };
  window.sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function AdminLoginGate({ onAuthenticated }) {
  const [modalOpen, setModalOpen] = useState(true);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const lockSummary = useMemo(
    () => [
      ["접근 상태", "잠김"],
      ["보호 범위", "콘텐츠 관리 콘솔"],
      ["인증 방식", "임시 로컬 게이트"],
    ],
    [],
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const submit = (event) => {
    event.preventDefault();
    if (!userId.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 입력하세요.");
      return;
    }
    // Demo-only gate: credentials are client-visible and must be replaced by server session auth before production operation.
    if (userId.trim() !== DEMO_ADMIN_ID || password !== DEMO_ADMIN_PASSWORD) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      return;
    }
    setError("");
    setSuccess(true);
    const session = writeAdminAuthSession(userId.trim());
    window.setTimeout(() => onAuthenticated(session), 260);
  };

  return (
    <section className="admin-login-gate" aria-label="대광테크 관리자 로그인">
      <div className="admin-login-grid" />
      <div className="admin-login-glow" />

      {modalOpen ? (
        <div className="admin-login-backdrop" role="presentation">
          <form className={error ? "admin-login-card has-error" : "admin-login-card"} onSubmit={submit}>
            <button className="admin-login-close" type="button" aria-label="로그인 창 닫기" onClick={() => setModalOpen(false)}>
              ×
            </button>
            <DaekwangLogoLockup tone="light" size="md" />
            <div className="admin-login-heading">
              <span>SECURE ADMIN CONSOLE</span>
              <h1>관리자 로그인</h1>
              <p>대광테크 웹사이트 콘텐츠 관리 콘솔에 접속합니다.</p>
            </div>
            <label>
              <span>관리자 아이디</span>
              <input autoComplete="username" autoFocus placeholder="관리자 아이디" value={userId} onChange={(event) => setUserId(event.target.value)} />
            </label>
            <label>
              <span>비밀번호</span>
              <input autoComplete="current-password" placeholder="비밀번호" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            {error ? <p className="admin-login-error">{error}</p> : null}
            {success ? <p className="admin-login-success">관리자 인증이 완료되었습니다.</p> : null}
            <button className="admin-login-submit" type="submit">로그인</button>
            <p className="admin-login-note">임시 관리자 게이트입니다. 실제 운영 인증은 서버 세션으로 전환 예정입니다.</p>
          </form>
        </div>
      ) : (
        <div className="admin-lock-screen">
          <DaekwangLogoLockup tone="dark" size="lg" />
          <span>ADMIN ACCESS LOCKED</span>
          <h1>관리자 콘솔이 잠겨 있습니다.</h1>
          <p>로그인 창을 다시 열어 인증을 완료해야 관리자 기능을 사용할 수 있습니다.</p>
          <div className="admin-lock-meta">
            {lockSummary.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <button className="admin-login-open" type="button" onClick={() => setModalOpen(true)}>관리자 로그인 열기</button>
        </div>
      )}
    </section>
  );
}

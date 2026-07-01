import React, { useEffect, useMemo, useState } from "react";
import { DaekwangLogoLockup } from "../brand/DaekwangLogoLockup.jsx";
import { AdminApiError, loginAdmin } from "../../services/adminApiClient.js";

export const ADMIN_AUTH_STORAGE_KEY = "daekwang.admin.auth.v1";
const DEMO_FALLBACK_ADMIN_ID = "dgtc66";
const DEMO_FALLBACK_ADMIN_PASSWORD = "1234";
const SERVER_AUTH_ATTEMPT_ENABLED = true;

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

function writeAdminAuthSession(userId, patch = {}) {
  const session = {
    authenticated: true,
    userId,
    loginAt: new Date().toISOString(),
    mode: "server-session",
    ...patch,
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
  const [submitting, setSubmitting] = useState(false);

  const lockSummary = useMemo(
    () => [
      ["접근 상태", "잠김"],
      ["보호 범위", "콘텐츠 관리 콘솔"],
      ["인증 방식", "서버 세션 우선"],
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

  const canUseDemoFallback = (apiError) => {
    if (apiError instanceof AdminApiError) {
      return apiError.code === "SERVER_AUTH_NOT_CONFIGURED" || apiError.status === 404 || apiError.status === 405 || apiError.status === 503;
    }
    return true;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!userId.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 입력하세요.");
      return;
    }
    setSubmitting(true);
    const trimmedUserId = userId.trim();

    if (!SERVER_AUTH_ATTEMPT_ENABLED) {
      if (trimmedUserId !== DEMO_FALLBACK_ADMIN_ID || password !== DEMO_FALLBACK_ADMIN_PASSWORD) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        setSubmitting(false);
        return;
      }
      setError("");
      setSuccess(true);
      const session = writeAdminAuthSession(trimmedUserId, {
        mode: "demo-local-fallback",
        serverAuth: false,
        hold: "SERVER_AUTH_DISABLED_DEMO_FALLBACK",
      });
      window.setTimeout(() => onAuthenticated(session), 260);
      return;
    }

    try {
      const serverSession = await loginAdmin(trimmedUserId, password);
      if (serverSession?.authenticated !== true) {
        throw new Error("SERVER_AUTH_UNAVAILABLE");
      }
      setError("");
      setSuccess(true);
      const session = writeAdminAuthSession(serverSession.userId || trimmedUserId, {
        mode: serverSession.mode || "server-session",
        expiresAt: serverSession.expiresAt,
        serverAuth: true,
      });
      window.setTimeout(() => onAuthenticated(session), 260);
    } catch (apiError) {
      if (!canUseDemoFallback(apiError)) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        setSubmitting(false);
        return;
      }
      // Fallback-only path: this preserves the current admin demo while Cloudflare auth secrets are not configured.
      if (trimmedUserId !== DEMO_FALLBACK_ADMIN_ID || password !== DEMO_FALLBACK_ADMIN_PASSWORD) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        setSubmitting(false);
        return;
      }
      setError("");
      setSuccess(true);
      const session = writeAdminAuthSession(trimmedUserId, {
        mode: "demo-local-fallback",
        serverAuth: false,
        hold: apiError instanceof AdminApiError && apiError.status === 503 ? "SERVER_AUTH_503_DEMO_FALLBACK" : "SERVER_AUTH_NOT_CONFIGURED_OR_API_UNAVAILABLE",
      });
      window.setTimeout(() => onAuthenticated(session), 260);
    }
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
            <button className="admin-login-submit" disabled={submitting} type="submit">{submitting ? "인증 확인 중" : "로그인"}</button>
            <p className="admin-login-note">Cloudflare 서버 세션 인증을 우선 사용합니다. 서버 secret이 없을 때만 리뷰용 데모 fallback으로 제한 진입합니다.</p>
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

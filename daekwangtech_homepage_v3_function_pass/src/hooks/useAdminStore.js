import { useCallback, useEffect, useMemo, useState } from "react";
import { createDefaultAdminState, loadAdminState, nowStamp, resetAdminStorage, saveAdminState } from "../utils/adminStorage.js";

function createActivity(type, title, description, target = title) {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    type,
    title,
    description,
    target,
    time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }),
    user: "관리자",
  };
}

function createAuditLog(type, action, target, status = "success", detail = "") {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    timestamp: nowStamp(),
    user: "관리자",
    action,
    target,
    status,
    type,
    detail,
  };
}

export function useAdminStore() {
  const [state, setState] = useState(() => loadAdminState());

  useEffect(() => {
    saveAdminState(state);
  }, [state]);

  const mutate = useCallback((recipe) => {
    setState((current) => {
      const draft = typeof recipe === "function" ? recipe(current) : recipe;
      return draft;
    });
  }, []);

  const addActivity = useCallback((type, title, description, target = title, status = "success", detail = description) => {
    setState((current) => ({
      ...current,
      activityLogs: [createActivity(type, title, description, target), ...current.activityLogs].slice(0, 30),
      auditLogs: [createAuditLog(type, title, target, status, detail), ...current.auditLogs],
    }));
  }, []);

  const updateSlice = useCallback(
    (key, updater, log) => {
      setState((current) => {
        const nextValue = typeof updater === "function" ? updater(current[key], current) : updater;
        const next = { ...current, [key]: nextValue };
        if (!log) return next;
        return {
          ...next,
          activityLogs: [createActivity(log.type, log.title, log.description, log.target), ...current.activityLogs].slice(0, 30),
          auditLogs: [createAuditLog(log.type, log.title, log.target, log.status || "success", log.detail || log.description), ...current.auditLogs],
        };
      });
    },
    [],
  );

  const actions = useMemo(
    () => ({
      addActivity,
      setState: mutate,
      resetAdminData() {
        const next = resetAdminStorage();
        setState(next);
        return next;
      },
      restoreState(nextState) {
        setState(nextState);
      },
      updateImages(updater, log) {
        updateSlice("imageAssets", updater, log);
      },
      updateNotices(updater, log) {
        updateSlice("notices", updater, log);
      },
      updatePages(updater, log) {
        updateSlice("pages", updater, log);
      },
      updatePopups(updater, log) {
        updateSlice("popups", updater, log);
      },
      updateMenus(updater, log) {
        updateSlice("menus", updater, log);
      },
      updateFooter(updater, log) {
        updateSlice("footerInfo", updater, log);
      },
      updateSiteSettings(updater, log) {
        updateSlice("siteSettings", updater, log);
      },
      updateSeoSettings(updater, log) {
        updateSlice("seoSettings", updater, log);
      },
      updateNoticeCta(updater, log) {
        updateSlice("noticeCtaSettings", updater, log);
      },
      updateUsers(updater, log) {
        updateSlice("adminUsers", updater, log);
      },
      updateBackups(updater, log) {
        updateSlice("backupItems", updater, log);
      },
      updateUiPreferences(updater) {
        updateSlice("uiPreferences", updater);
      },
      clearAuditLogs() {
        setState((current) => ({
          ...current,
          auditLogs: [createAuditLog("logClear", "로그 비우기", "auditLogs", "success", "관리자 감사 로그를 비웠습니다.")],
          activityLogs: [createActivity("logClear", "로그 비우기", "관리자 감사 로그를 비웠습니다.", "auditLogs"), ...current.activityLogs].slice(0, 30),
        }));
      },
      createFreshState() {
        return createDefaultAdminState();
      },
    }),
    [addActivity, mutate, updateSlice],
  );

  return { state, actions };
}

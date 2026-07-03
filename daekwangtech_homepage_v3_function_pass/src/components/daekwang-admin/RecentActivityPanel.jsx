import React from "react";
import { AdminIcon } from "./AdminIcons.jsx";

const activityIcons = {
  imageUpload: "Upload",
  noticeCreate: "Megaphone",
  noticeEdit: "Edit",
  imageReplace: "Refresh",
  login: "Shield",
  draftSave: "File",
};

export function RecentActivityPanel({ logs, onDeleteActivity, onClearActivities }) {
  return (
    <aside className="dk-panel dk-activity-panel">
      <div className="dk-activity-head">
        <h2 className="dk-section-title">최근 활동</h2>
        <button type="button" disabled={!logs.length} onClick={onClearActivities}>
          활동 기록 비우기
        </button>
      </div>
      <div className="dk-activity-list">
        {logs.map((log) => (
          <article key={log.id}>
            <div className="dk-activity-icon">
              <AdminIcon name={activityIcons[log.type] ?? "Clock"} size={17} />
            </div>
            <div>
              <strong>{log.title}</strong>
              <p>{log.description}</p>
              <span>{log.user}</span>
            </div>
            <time>{log.time}</time>
            <button
              className="dk-activity-delete"
              type="button"
              aria-label={`${log.title} 활동 삭제`}
              title={`${log.title} 활동 삭제`}
              onClick={() => onDeleteActivity?.(log)}
            >
              <AdminIcon name="Trash" size={15} />
            </button>
          </article>
        ))}
        {!logs.length ? <div className="dk-empty-state dk-activity-empty">최근 활동 기록이 없습니다.</div> : null}
      </div>
    </aside>
  );
}

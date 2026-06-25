import React, { useMemo, useRef, useState } from "react";
import {
  adminUsers as initialAdminUsers,
  backupItems as initialBackupItems,
  footerInfo as initialFooterInfo,
  logItems,
  menuItems as initialMenuItems,
  pageItems as initialPageItems,
  popupItems as initialPopupItems,
  seoSettings as initialSeoSettings,
  siteSettings as initialSiteSettings,
} from "../../data/daekwangAdminData.js";
import { AdminIcon } from "./AdminIcons.jsx";
import { ImageManagerPanel } from "./ImageManagerPanel.jsx";
import { NoticeCreatePanel } from "./NoticeCreatePanel.jsx";
import { NoticeListTable } from "./NoticeListTable.jsx";
import { RecentActivityPanel } from "./RecentActivityPanel.jsx";
import { SummaryCards } from "./SummaryCards.jsx";

const sectionMeta = {
  dashboard: ["대시보드", "웹사이트 이미지, 공지사항, 최근 활동을 한 화면에서 확인합니다."],
  images: ["이미지 관리", "메인 배너와 페이지별 이미지를 업로드, 교체, 삭제, 정렬합니다."],
  notices: ["공지사항 관리", "공지사항 작성, 임시저장, 등록, 수정, 검색을 관리합니다."],
  pages: ["페이지 관리", "홈페이지 주요 페이지의 노출 상태와 기본 정보를 관리합니다."],
  popups: ["팝업 관리", "사이트 팝업과 배너 공지의 기간, 링크, 노출 상태를 관리합니다."],
  menus: ["메뉴 관리", "홈페이지 상단 네비게이션 메뉴명, 경로, 순서를 관리합니다."],
  footer: ["푸터 관리", "회사 기본 정보와 저작권 문구를 관리합니다."],
  settings: ["기본 설정", "사이트 운영 상태, 관리자 이메일, 언어와 공개 상태를 관리합니다."],
  seo: ["SEO 설정", "검색 결과와 공유 미리보기에 노출되는 기본 정보를 관리합니다."],
  users: ["사용자 관리", "관리자 계정의 권한과 활성 상태를 관리합니다."],
  logs: ["로그 관리", "관리자 콘솔에서 발생한 작업 이력을 검색하고 필터링합니다."],
  backups: ["백업 관리", "사이트 데이터 백업 파일 생성, 다운로드, 복원 작업을 관리합니다."],
};

function currentStamp() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${date} ${time}`;
}

function backupStamp() {
  return new Date().toISOString().slice(0, 16).replace("T", "_").replace(/[-:]/g, "_");
}

function SectionHeader({ title, description, actions }) {
  return (
    <div className="dk-section-toolbar">
      <div>
        <h2 className="dk-section-title">{title}</h2>
        <p>{description}</p>
      </div>
      {actions ? <div className="dk-section-actions">{actions}</div> : null}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    visible: ["노출", "active"],
    hidden: ["비노출", ""],
    active: ["활성", "active"],
    inactive: ["비활성", ""],
    success: ["성공", "active"],
    owner: ["최고관리자", "active"],
    editor: ["콘텐츠 관리자", "active"],
    viewer: ["읽기 전용", ""],
  };
  const [label, tone] = map[status] ?? [status, ""];
  return <span className={tone ? `dk-status-badge ${tone}` : "dk-status-badge"}>{label}</span>;
}

function ToggleButton({ active, onClick, labelOn = "활성", labelOff = "비활성" }) {
  return (
    <button className={active ? "dk-toggle is-on" : "dk-toggle"} type="button" onClick={onClick}>
      <span />
      {active ? labelOn : labelOff}
    </button>
  );
}

function FormField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="dk-field">
      <span>{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder }) {
  return (
    <label className="dk-field">
      <span>{label}</span>
      <textarea value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function DashboardSection({ summaryCards, imageManagerProps, noticeCreateProps, notices, onEditNotice, activityLogs }) {
  return (
    <>
      <SummaryCards cards={summaryCards} />
      <div className="dk-middle-grid">
        <ImageManagerPanel {...imageManagerProps} />
        <NoticeCreatePanel {...noticeCreateProps} />
      </div>
      <div className="dk-bottom-grid">
        <NoticeListTable notices={notices} onEditNotice={onEditNotice} />
        <RecentActivityPanel logs={activityLogs} />
      </div>
    </>
  );
}

function PageManagerPanel({ recordActivity }) {
  const [pages, setPages] = useState(initialPageItems);
  const [editor, setEditor] = useState(initialPageItems[0]);

  const toggleStatus = (id) => {
    setPages((current) =>
      current.map((page) =>
        page.id === id
          ? { ...page, status: page.status === "visible" ? "hidden" : "visible", lastModified: currentStamp() }
          : page,
      ),
    );
  };

  const savePage = () => {
    setPages((current) =>
      current.map((page) => (page.id === editor.id ? { ...editor, lastModified: currentStamp() } : page)),
    );
    recordActivity("pageSave", "페이지 저장", `${editor.name} 페이지 정보가 저장되었습니다.`);
  };

  return (
    <div className="dk-manager-grid">
      <section className="dk-panel dk-admin-panel">
        <div className="dk-table-scroll">
          <table>
            <thead>
              <tr>
                <th>페이지명</th>
                <th>경로</th>
                <th>노출 상태</th>
                <th>최종 수정일</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id}>
                  <td>{page.name}</td>
                  <td>{page.path}</td>
                  <td>
                    <ToggleButton
                      active={page.status === "visible"}
                      labelOn="노출"
                      labelOff="비노출"
                      onClick={() => toggleStatus(page.id)}
                    />
                  </td>
                  <td>{page.lastModified}</td>
                  <td>
                    <button className="dk-icon-btn" type="button" onClick={() => setEditor(page)}>
                      <AdminIcon name="Edit" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="dk-panel dk-admin-panel">
        <h3>페이지 정보 수정</h3>
        <div className="dk-form-stack">
          <FormField label="페이지명" value={editor.name} onChange={(value) => setEditor({ ...editor, name: value })} />
          <FormField label="경로" value={editor.path} onChange={(value) => setEditor({ ...editor, path: value })} />
          <TextAreaField
            label="설명"
            value={editor.description}
            placeholder="페이지 설명을 입력하세요."
            onChange={(value) => setEditor({ ...editor, description: value })}
          />
          <button className="dk-primary-btn" type="button" onClick={savePage}>
            저장
          </button>
        </div>
      </section>
    </div>
  );
}

function PopupManagerPanel({ recordActivity }) {
  const [popups, setPopups] = useState(initialPopupItems);
  const [form, setForm] = useState({
    title: "",
    placement: "메인",
    startDate: "2026-06-26",
    endDate: "2026-07-05",
    status: "active",
    linkUrl: "",
  });

  const addPopup = () => {
    if (!form.title.trim()) {
      window.alert("팝업 제목을 입력하세요.");
      return;
    }
    const item = { ...form, id: `popup-${Date.now()}` };
    setPopups((current) => [item, ...current]);
    setForm({ ...form, title: "", linkUrl: "" });
    recordActivity("popupCreate", "팝업 추가", `${item.title} 팝업이 추가되었습니다.`);
  };

  const removePopup = (id) => {
    const target = popups.find((popup) => popup.id === id);
    if (!target || !window.confirm(`${target.title} 팝업을 삭제할까요?`)) return;
    setPopups((current) => current.filter((popup) => popup.id !== id));
    recordActivity("popupDelete", "팝업 삭제", `${target.title} 팝업이 삭제되었습니다.`);
  };

  const togglePopup = (id) => {
    setPopups((current) =>
      current.map((popup) => (popup.id === id ? { ...popup, status: popup.status === "active" ? "inactive" : "active" } : popup)),
    );
  };

  return (
    <div className="dk-manager-grid">
      <section className="dk-panel dk-admin-panel">
        <h3>새 팝업 추가</h3>
        <div className="dk-form-stack">
          <FormField label="팝업 제목" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
          <FormField label="노출 위치" value={form.placement} onChange={(value) => setForm({ ...form, placement: value })} />
          <div className="dk-two-col">
            <FormField label="시작일" type="date" value={form.startDate} onChange={(value) => setForm({ ...form, startDate: value })} />
            <FormField label="종료일" type="date" value={form.endDate} onChange={(value) => setForm({ ...form, endDate: value })} />
          </div>
          <FormField label="링크 URL" value={form.linkUrl} onChange={(value) => setForm({ ...form, linkUrl: value })} />
          <ToggleButton
            active={form.status === "active"}
            labelOn="노출"
            labelOff="비노출"
            onClick={() => setForm({ ...form, status: form.status === "active" ? "inactive" : "active" })}
          />
          <button className="dk-primary-btn" type="button" onClick={addPopup}>
            새 팝업 추가
          </button>
        </div>
      </section>
      <section className="dk-panel dk-admin-panel">
        <h3>팝업 목록</h3>
        <div className="dk-control-list">
          {popups.map((popup) => (
            <article key={popup.id}>
              <div>
                <strong>{popup.title}</strong>
                <span>
                  {popup.placement} · {popup.startDate} ~ {popup.endDate}
                </span>
              </div>
              <StatusBadge status={popup.status} />
              <div className="dk-row-actions">
                <button type="button" onClick={() => togglePopup(popup.id)}>
                  <AdminIcon name="Refresh" size={15} />
                </button>
                <button className="danger" type="button" onClick={() => removePopup(popup.id)}>
                  <AdminIcon name="Trash" size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function MenuManagerPanel({ recordActivity }) {
  const [menus, setMenus] = useState(initialMenuItems);

  const updateMenu = (id, field, value) => {
    setMenus((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const moveMenu = (id, direction) => {
    const sorted = [...menus].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((item) => item.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= sorted.length) return;
    [sorted[index], sorted[nextIndex]] = [sorted[nextIndex], sorted[index]];
    const normalized = sorted.map((item, orderIndex) => ({ ...item, order: orderIndex + 1 }));
    setMenus(normalized);
    recordActivity("menuSort", "메뉴 순서 변경", "상단 메뉴 순서가 변경되었습니다.");
  };

  return (
    <section className="dk-panel dk-admin-panel">
      <div className="dk-table-scroll">
        <table>
          <thead>
            <tr>
              <th>메뉴명</th>
              <th>경로</th>
              <th>순서</th>
              <th>노출 여부</th>
              <th>정렬</th>
            </tr>
          </thead>
          <tbody>
            {[...menus]
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <tr key={item.id}>
                  <td>
                    <input className="dk-inline-input" value={item.name} onChange={(event) => updateMenu(item.id, "name", event.target.value)} />
                  </td>
                  <td>
                    <input className="dk-inline-input" value={item.path} onChange={(event) => updateMenu(item.id, "path", event.target.value)} />
                  </td>
                  <td>{item.order}</td>
                  <td>
                    <ToggleButton
                      active={item.status === "visible"}
                      labelOn="노출"
                      labelOff="비노출"
                      onClick={() => updateMenu(item.id, "status", item.status === "visible" ? "hidden" : "visible")}
                    />
                  </td>
                  <td>
                    <div className="dk-row-actions">
                      <button type="button" onClick={() => moveMenu(item.id, -1)}>
                        ↑
                      </button>
                      <button type="button" onClick={() => moveMenu(item.id, 1)}>
                        ↓
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FooterManagerPanel({ recordActivity }) {
  const [form, setForm] = useState(initialFooterInfo);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const save = () => {
    recordActivity("footerSave", "푸터 저장", "푸터 회사 정보가 저장되었습니다.");
  };

  return (
    <section className="dk-panel dk-admin-panel">
      <div className="dk-settings-grid">
        <FormField label="회사명" value={form.companyName} onChange={(value) => update("companyName", value)} />
        <FormField label="대표자" value={form.representative} onChange={(value) => update("representative", value)} />
        <FormField label="사업자등록번호" value={form.businessNumber} onChange={(value) => update("businessNumber", value)} />
        <FormField label="주소" value={form.address} onChange={(value) => update("address", value)} />
        <FormField label="대표전화" value={form.tel} onChange={(value) => update("tel", value)} />
        <FormField label="이메일" value={form.email} onChange={(value) => update("email", value)} />
        <FormField label="저작권 문구" value={form.copyright} onChange={(value) => update("copyright", value)} />
      </div>
      <div className="dk-footer-preview">
        <strong>{form.companyName}</strong>
        <span>{form.address}</span>
        <span>
          {form.tel} · {form.email}
        </span>
        <small>{form.copyright}</small>
      </div>
      <button className="dk-primary-btn" type="button" onClick={save}>
        저장
      </button>
    </section>
  );
}

function SiteSettingsPanel({ recordActivity }) {
  const [form, setForm] = useState(initialSiteSettings);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const save = () => {
    recordActivity("settingsSave", "기본 설정 저장", "사이트 기본 설정이 저장되었습니다.");
  };

  return (
    <section className="dk-panel dk-admin-panel">
      <div className="dk-settings-grid">
        <FormField label="사이트명" value={form.siteName} onChange={(value) => update("siteName", value)} />
        <FormField label="관리자 이메일" value={form.adminEmail} onChange={(value) => update("adminEmail", value)} />
        <FormField label="대표 연락처" value={form.contactNumber} onChange={(value) => update("contactNumber", value)} />
        <label className="dk-field">
          <span>기본 언어</span>
          <select value={form.language} onChange={(event) => update("language", event.target.value)}>
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
        </label>
      </div>
      <div className="dk-switch-row">
        <ToggleButton active={form.maintenanceMode} labelOn="유지보수 ON" labelOff="유지보수 OFF" onClick={() => update("maintenanceMode", !form.maintenanceMode)} />
        <ToggleButton active={form.publicStatus} labelOn="공개" labelOff="비공개" onClick={() => update("publicStatus", !form.publicStatus)} />
      </div>
      <button className="dk-primary-btn" type="button" onClick={save}>
        저장
      </button>
    </section>
  );
}

function SeoSettingsPanel({ recordActivity }) {
  const [form, setForm] = useState(initialSeoSettings);
  const fileRef = useRef(null);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const save = () => {
    recordActivity("seoSave", "SEO 설정 저장", "SEO 기본 정보가 저장되었습니다.");
  };

  const uploadOg = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    update("ogImage", file.name);
    recordActivity("seoImage", "OG 이미지 변경", `${file.name} 파일이 OG 이미지로 선택되었습니다.`);
    event.target.value = "";
  };

  return (
    <div className="dk-manager-grid">
      <section className="dk-panel dk-admin-panel">
        <div className="dk-form-stack">
          <FormField label="메타 타이틀" value={form.metaTitle} onChange={(value) => update("metaTitle", value)} />
          <TextAreaField label="메타 설명" value={form.metaDescription} onChange={(value) => update("metaDescription", value)} />
          <FormField label="대표 키워드" value={form.keywords} onChange={(value) => update("keywords", value)} />
          <FormField label="robots 설정" value={form.robots} onChange={(value) => update("robots", value)} />
          <input ref={fileRef} className="dk-hidden-input" type="file" accept="image/*" onChange={uploadOg} />
          <button className="dk-secondary-btn" type="button" onClick={() => fileRef.current?.click()}>
            OG 이미지 업로드
          </button>
          <button className="dk-primary-btn" type="button" onClick={save}>
            저장
          </button>
        </div>
      </section>
      <section className="dk-panel dk-admin-panel">
        <h3>검색 미리보기</h3>
        <div className="dk-seo-preview">
          <span>https://dgtc.ejdzm90.workers.dev</span>
          <strong>{form.metaTitle}</strong>
          <p>{form.metaDescription}</p>
          <small>OG 이미지: {form.ogImage}</small>
        </div>
      </section>
    </div>
  );
}

function UserManagerPanel() {
  const [users, setUsers] = useState(initialAdminUsers);
  const updateUser = (id, field, value) => {
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, [field]: value } : user)));
  };

  return (
    <section className="dk-panel dk-admin-panel">
      <div className="dk-table-scroll">
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th>권한</th>
              <th>상태</th>
              <th>최근 로그인</th>
              <th>수정</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select className="dk-inline-input" value={user.role} onChange={(event) => updateUser(user.id, "role", event.target.value)}>
                    <option value="owner">최고관리자</option>
                    <option value="editor">콘텐츠 관리자</option>
                    <option value="viewer">읽기 전용</option>
                  </select>
                </td>
                <td>
                  <StatusBadge status={user.status} />
                </td>
                <td>{user.lastLogin}</td>
                <td>
                  <ToggleButton
                    active={user.status === "active"}
                    onClick={() => updateUser(user.id, "status", user.status === "active" ? "inactive" : "active")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function LogManagerPanel({ activityLogs }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const activityRows = activityLogs.map((log, index) => ({
    id: `activity-row-${log.id}-${index}`,
    time: log.time,
    user: log.user,
    action: log.title,
    target: log.description,
    status: "success",
    type: log.type,
  }));
  const rows = [...activityRows, ...logItems];
  const filtered = rows.filter((row) => {
    const queryMatch = `${row.user} ${row.action} ${row.target}`.toLowerCase().includes(query.toLowerCase());
    const typeMatch = type === "all" || row.type === type;
    return queryMatch && typeMatch;
  });

  return (
    <section className="dk-panel dk-admin-panel">
      <div className="dk-log-filter">
        <label>
          <AdminIcon name="Search" size={16} />
          <input value={query} placeholder="사용자, 작업, 대상 검색" onChange={(event) => setQuery(event.target.value)} />
        </label>
        <select value={type} onChange={(event) => setType(event.target.value)} aria-label="작업 유형 필터">
          <option value="all">전체 작업</option>
          <option value="imageUpload">이미지 업로드</option>
          <option value="noticeCreate">공지 등록</option>
          <option value="noticeEdit">공지 수정</option>
          <option value="login">로그인</option>
          <option value="backup">백업</option>
        </select>
      </div>
      <div className="dk-table-scroll">
        <table>
          <thead>
            <tr>
              <th>시간</th>
              <th>사용자</th>
              <th>작업</th>
              <th>대상</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>{row.time}</td>
                <td>{row.user}</td>
                <td>{row.action}</td>
                <td>{row.target}</td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BackupManagerPanel({ recordActivity }) {
  const [backups, setBackups] = useState(initialBackupItems);
  const [autoBackup, setAutoBackup] = useState(true);

  const createBackup = () => {
    const item = {
      id: `backup-${Date.now()}`,
      fileName: `backup_${backupStamp()}.zip`,
      createdAt: currentStamp(),
      fileSize: "25.0MB",
      status: "success",
    };
    setBackups((current) => [item, ...current]);
    recordActivity("backup", "백업 생성", `${item.fileName} 백업 파일이 생성되었습니다.`);
  };

  return (
    <div className="dk-backup-grid">
      <section className="dk-panel dk-admin-panel">
        <div className="dk-backup-stats">
          <article>
            <span>마지막 백업일</span>
            <strong>{backups[0]?.createdAt ?? "없음"}</strong>
          </article>
          <article>
            <span>백업 파일 수</span>
            <strong>{backups.length}개</strong>
          </article>
          <article>
            <span>자동 백업</span>
            <ToggleButton active={autoBackup} labelOn="자동" labelOff="수동" onClick={() => setAutoBackup((value) => !value)} />
          </article>
        </div>
        <button className="dk-primary-btn" type="button" onClick={createBackup}>
          백업 생성
        </button>
      </section>
      <section className="dk-panel dk-admin-panel">
        <h3>백업 파일 목록</h3>
        <div className="dk-control-list">
          {backups.map((backup) => (
            <article key={backup.id}>
              <div>
                <strong>{backup.fileName}</strong>
                <span>
                  {backup.createdAt} · {backup.fileSize}
                </span>
              </div>
              <StatusBadge status={backup.status} />
              <div className="dk-row-actions">
                <button type="button" onClick={() => window.alert(`${backup.fileName} 다운로드 mock`)}>
                  <AdminIcon name="Download" size={15} />
                </button>
                <button type="button" onClick={() => window.confirm(`${backup.fileName} 파일로 복원할까요?`) && window.alert("복원 mock 처리되었습니다.")}>
                  <AdminIcon name="Refresh" size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AdminSectionRenderer({
  activeSection,
  summaryCards,
  imageManagerProps,
  noticeCreateProps,
  notices,
  onEditNotice,
  activityLogs,
  onAddActivity,
}) {
  const [title, description] = sectionMeta[activeSection] ?? sectionMeta.dashboard;
  const recordActivity = (type, activityTitle, activityDescription) => {
    onAddActivity(type, activityTitle, activityDescription);
  };

  const body = useMemo(() => {
    if (activeSection === "dashboard") {
      return (
        <DashboardSection
          activityLogs={activityLogs}
          imageManagerProps={imageManagerProps}
          noticeCreateProps={noticeCreateProps}
          notices={notices}
          onEditNotice={onEditNotice}
          summaryCards={summaryCards}
        />
      );
    }

    if (activeSection === "images") {
      return (
        <div className="dk-manager-grid dk-manager-grid-wide">
          <ImageManagerPanel {...imageManagerProps} />
          <RecentActivityPanel logs={activityLogs} />
        </div>
      );
    }

    if (activeSection === "notices") {
      return (
        <div className="dk-manager-grid">
          <NoticeCreatePanel {...noticeCreateProps} />
          <NoticeListTable notices={notices} onEditNotice={onEditNotice} />
          <RecentActivityPanel logs={activityLogs} />
        </div>
      );
    }

    if (activeSection === "pages") return <PageManagerPanel recordActivity={recordActivity} />;
    if (activeSection === "popups") return <PopupManagerPanel recordActivity={recordActivity} />;
    if (activeSection === "menus") return <MenuManagerPanel recordActivity={recordActivity} />;
    if (activeSection === "footer") return <FooterManagerPanel recordActivity={recordActivity} />;
    if (activeSection === "settings") return <SiteSettingsPanel recordActivity={recordActivity} />;
    if (activeSection === "seo") return <SeoSettingsPanel recordActivity={recordActivity} />;
    if (activeSection === "users") return <UserManagerPanel />;
    if (activeSection === "logs") return <LogManagerPanel activityLogs={activityLogs} />;
    if (activeSection === "backups") return <BackupManagerPanel recordActivity={recordActivity} />;
    return null;
  }, [activeSection, activityLogs, imageManagerProps, noticeCreateProps, notices, onEditNotice, recordActivity, summaryCards]);

  return (
    <div className="dk-section-shell">
      <SectionHeader title={title} description={description} />
      {body}
    </div>
  );
}

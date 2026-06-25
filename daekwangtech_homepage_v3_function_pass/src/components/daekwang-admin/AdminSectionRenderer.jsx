import React, { useMemo, useRef, useState } from "react";
import { AdminIcon } from "./AdminIcons.jsx";
import { ImageManagerPanel } from "./ImageManagerPanel.jsx";
import { NoticeCreatePanel } from "./NoticeCreatePanel.jsx";
import { NoticeListTable } from "./NoticeListTable.jsx";
import { RecentActivityPanel } from "./RecentActivityPanel.jsx";
import { SummaryCards } from "./SummaryCards.jsx";
import { clone, nowStamp } from "../../utils/adminStorage.js";
import { downloadCsv, downloadJson, isEmail, isValidPath, validateDateRange } from "../../utils/adminValidation.js";

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

const sectionNames = ["Hero", "회사소개", "설비", "제품", "포트폴리오", "위치"];

function dateOnly() {
  return new Date().toISOString().slice(0, 10);
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
    fail: ["실패", "danger"],
    owner: ["최고관리자", "active"],
    editor: ["콘텐츠 관리자", "active"],
    viewer: ["읽기 전용", ""],
  };
  const [label, tone] = map[status] ?? [status, ""];
  return <span className={tone ? `dk-status-badge ${tone}` : "dk-status-badge"}>{label}</span>;
}

function ToggleButton({ active, onClick, labelOn = "활성", labelOff = "비활성", disabled = false }) {
  return (
    <button className={active ? "dk-toggle is-on" : "dk-toggle"} type="button" disabled={disabled} onClick={onClick}>
      <span />
      {active ? labelOn : labelOff}
    </button>
  );
}

function FormField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="dk-field">
      <span>{label}</span>
      <input type={type} value={value ?? ""} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="dk-field">
      <span>{label}</span>
      <textarea rows={rows} value={value ?? ""} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SelectField({ label, value, onChange, children }) {
  return (
    <label className="dk-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  );
}

function EmptyState({ children }) {
  return <div className="dk-empty-state">{children}</div>;
}

function DashboardSection({
  summaryCards,
  imageManagerProps,
  noticeCreateProps,
  notices,
  onDeleteNotice,
  onEditNotice,
  onOpenPublicNotice,
  onPreviewNotice,
  onToggleNotice,
  activityLogs,
  onNavigate,
  onCreateBackup,
}) {
  return (
    <>
      <SummaryCards cards={summaryCards} onNavigate={onNavigate} />
      <div className="dk-quick-actions dk-panel">
        <button type="button" onClick={() => onNavigate("images")}>이미지 업로드</button>
        <button type="button" onClick={() => onNavigate("notices")}>공지 등록</button>
        <button type="button" onClick={onCreateBackup}>백업 생성</button>
        <button type="button" onClick={() => onNavigate("seo")}>SEO 설정</button>
      </div>
      <div className="dk-middle-grid">
        <ImageManagerPanel {...imageManagerProps} />
        <NoticeCreatePanel {...noticeCreateProps} />
      </div>
      <div className="dk-bottom-grid">
        <NoticeListTable
          notices={notices}
          onDeleteNotice={onDeleteNotice}
          onEditNotice={onEditNotice}
          onOpenPublicNotice={onOpenPublicNotice}
          onPreviewNotice={onPreviewNotice}
          onToggleNotice={onToggleNotice}
        />
        <RecentActivityPanel logs={activityLogs} />
      </div>
    </>
  );
}

function PageManagerPanel({ state, actions, onToast, onPreview }) {
  const [editor, setEditor] = useState(() => clone(state.pages[0]));
  const updateEditor = (patch) => setEditor((current) => ({ ...current, ...patch }));

  const savePage = () => {
    if (!editor.name.trim() || !isValidPath(editor.path)) {
      onToast("페이지 저장 실패", "페이지명과 /로 시작하는 경로를 확인하세요.", "error");
      return;
    }
    actions.updatePages(
      (pages) => pages.map((page) => (page.id === editor.id ? { ...editor, lastModified: nowStamp() } : page)),
      { type: "pageSave", title: "페이지 저장", description: `${editor.name} 페이지가 저장되었습니다.`, target: editor.name },
    );
    onToast("페이지 저장 완료", editor.name);
  };

  const togglePage = (page) => {
    actions.updatePages(
      (pages) => pages.map((item) => (item.id === page.id ? { ...item, status: item.status === "visible" ? "hidden" : "visible", lastModified: nowStamp() } : item)),
      { type: "pageStatus", title: "페이지 노출 변경", description: `${page.name} 페이지 노출 상태가 변경되었습니다.`, target: page.name },
    );
  };

  return (
    <div className="dk-manager-grid">
      <section className="dk-panel dk-admin-panel">
        <div className="dk-table-scroll">
          <table>
            <thead><tr><th>페이지명</th><th>경로</th><th>노출 상태</th><th>최종 수정일</th><th>수정</th></tr></thead>
            <tbody>
              {state.pages.map((page) => (
                <tr key={page.id}>
                  <td>{page.name}</td><td>{page.path}</td>
                  <td><ToggleButton active={page.status === "visible"} labelOn="노출" labelOff="비노출" onClick={() => togglePage(page)} /></td>
                  <td>{page.lastModified}</td>
                  <td><button className="dk-icon-btn" type="button" onClick={() => setEditor(clone(page))}><AdminIcon name="Edit" size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="dk-panel dk-admin-panel">
        <h3>페이지 정보 수정 <span className="dk-dirty-badge">변경사항 있음</span></h3>
        <div className="dk-form-stack">
          <FormField label="페이지명" value={editor.name} onChange={(value) => updateEditor({ name: value })} />
          <FormField label="경로" value={editor.path} onChange={(value) => updateEditor({ path: value })} />
          <FormField label="SEO 제목" value={editor.seoTitle} onChange={(value) => updateEditor({ seoTitle: value })} />
          <TextAreaField label="설명" value={editor.description} onChange={(value) => updateEditor({ description: value })} />
          <div className="dk-check-grid">
            {sectionNames.map((name) => (
              <label key={name}>
                <input
                  type="checkbox"
                  checked={(editor.sections || []).includes(name)}
                  onChange={(event) => {
                    const next = event.target.checked
                      ? [...(editor.sections || []), name]
                      : (editor.sections || []).filter((item) => item !== name);
                    updateEditor({ sections: next });
                  }}
                />
                {name}
              </label>
            ))}
          </div>
          <div className="dk-form-actions">
            <button className="dk-secondary-btn" type="button" onClick={() => onPreview({ kind: "PAGE PREVIEW", title: editor.name, description: editor.description, rows: [["경로", editor.path], ["SEO 제목", editor.seoTitle], ["노출", editor.status]] })}>미리보기</button>
            <button className="dk-primary-btn" type="button" onClick={savePage}>저장</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function PopupManagerPanel({ state, actions, onToast, onConfirm, onPreview }) {
  const empty = { id: "", title: "", placement: "메인", startDate: dateOnly(), endDate: dateOnly(), status: "active", linkUrl: "", content: "" };
  const [form, setForm] = useState(empty);
  const editing = Boolean(form.id);
  const update = (patch) => setForm((current) => ({ ...current, ...patch }));

  const savePopup = () => {
    if (!form.title.trim() || !validateDateRange(form.startDate, form.endDate)) {
      onToast("팝업 저장 실패", "제목과 노출 기간을 확인하세요.", "error");
      return;
    }
    if (editing) {
      actions.updatePopups((popups) => popups.map((popup) => (popup.id === form.id ? form : popup)), {
        type: "popupEdit", title: "팝업 수정", description: `${form.title} 팝업이 수정되었습니다.`, target: form.title,
      });
    } else {
      const item = { ...form, id: `popup-${Date.now()}` };
      actions.updatePopups((popups) => [item, ...popups], {
        type: "popupCreate", title: "팝업 추가", description: `${item.title} 팝업이 추가되었습니다.`, target: item.title,
      });
    }
    setForm(empty);
    onToast("팝업 저장 완료", form.title);
  };

  const deletePopup = (popup) => onConfirm({
    title: "팝업 삭제",
    message: `${popup.title} 팝업을 삭제할까요?`,
    onConfirm: () => {
      actions.updatePopups((popups) => popups.filter((item) => item.id !== popup.id), {
        type: "popupDelete", title: "팝업 삭제", description: `${popup.title} 팝업이 삭제되었습니다.`, target: popup.title,
      });
      onToast("팝업 삭제 완료", popup.title);
    },
  });

  return (
    <div className="dk-manager-grid">
      <section className="dk-panel dk-admin-panel">
        <h3>{editing ? "팝업 수정" : "새 팝업 추가"}</h3>
        <div className="dk-form-stack">
          <FormField label="팝업 제목" value={form.title} onChange={(value) => update({ title: value })} />
          <FormField label="노출 위치" value={form.placement} onChange={(value) => update({ placement: value })} />
          <div className="dk-two-col"><FormField label="시작일" type="date" value={form.startDate} onChange={(value) => update({ startDate: value })} /><FormField label="종료일" type="date" value={form.endDate} onChange={(value) => update({ endDate: value })} /></div>
          <FormField label="링크 URL" value={form.linkUrl} onChange={(value) => update({ linkUrl: value })} />
          <TextAreaField label="내용" value={form.content} onChange={(value) => update({ content: value })} />
          <ToggleButton active={form.status === "active"} labelOn="노출" labelOff="비노출" onClick={() => update({ status: form.status === "active" ? "inactive" : "active" })} />
          <div className="dk-form-actions"><button className="dk-secondary-btn" type="button" onClick={() => onPreview({ kind: "POPUP PREVIEW", title: form.title || "팝업 미리보기", description: form.content, rows: [["위치", form.placement], ["기간", `${form.startDate} ~ ${form.endDate}`], ["링크", form.linkUrl || "-"]] })}>미리보기</button><button className="dk-primary-btn" type="button" onClick={savePopup}>{editing ? "수정 완료" : "새 팝업 추가"}</button></div>
        </div>
      </section>
      <section className="dk-panel dk-admin-panel"><h3>팝업 목록</h3>
        <div className="dk-control-list">
          {state.popups.map((popup) => (
            <article key={popup.id}><div><strong>{popup.title}</strong><span>{popup.placement} · {popup.startDate} ~ {popup.endDate}</span></div><StatusBadge status={popup.status} /><div className="dk-row-actions"><button type="button" onClick={() => setForm(clone(popup))}><AdminIcon name="Edit" size={15} /></button><button type="button" onClick={() => actions.updatePopups((items) => items.map((item) => item.id === popup.id ? { ...item, status: item.status === "active" ? "inactive" : "active" } : item), { type: "popupStatus", title: "팝업 노출 변경", description: `${popup.title} 팝업 상태가 변경되었습니다.`, target: popup.title })}><AdminIcon name="Refresh" size={15} /></button><button className="danger" type="button" onClick={() => deletePopup(popup)}><AdminIcon name="Trash" size={15} /></button></div></article>
          ))}
          {!state.popups.length ? <EmptyState>등록된 팝업이 없습니다.</EmptyState> : null}
        </div>
      </section>
    </div>
  );
}

function MenuManagerPanel({ state, actions, onToast, onConfirm }) {
  const [newMenu, setNewMenu] = useState({ name: "", path: "/notice" });
  const sorted = [...state.menus].sort((a, b) => a.order - b.order);
  const updateMenu = (id, patch) => actions.updateMenus((menus) => menus.map((item) => item.id === id ? { ...item, ...patch } : item), { type: "menuEdit", title: "메뉴 수정", description: "메뉴 정보가 수정되었습니다.", target: id });
  const moveMenu = (id, direction) => {
    const next = [...sorted];
    const index = next.findIndex((item) => item.id === id);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= next.length) return;
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    actions.updateMenus(next.map((item, orderIndex) => ({ ...item, order: orderIndex + 1 })), { type: "menuSort", title: "메뉴 순서 변경", description: "상단 메뉴 순서가 변경되었습니다.", target: "menus" });
  };
  const addMenu = () => {
    if (!newMenu.name.trim() || !isValidPath(newMenu.path)) {
      onToast("메뉴 추가 실패", "메뉴명과 /로 시작하는 경로를 확인하세요.", "error");
      return;
    }
    const item = { id: `menu-${Date.now()}`, name: newMenu.name.trim(), path: newMenu.path.trim(), order: sorted.length + 1, status: "visible" };
    actions.updateMenus((menus) => [...menus, item], { type: "menuCreate", title: "메뉴 추가", description: `${item.name} 메뉴가 추가되었습니다.`, target: item.name });
    setNewMenu({ name: "", path: "/notice" });
    onToast("메뉴 추가 완료", item.name);
  };
  const deleteMenu = (item) => onConfirm({ title: "메뉴 삭제", message: `${item.name} 메뉴를 삭제할까요?`, onConfirm: () => actions.updateMenus((menus) => menus.filter((menu) => menu.id !== item.id).map((menu, index) => ({ ...menu, order: index + 1 })), { type: "menuDelete", title: "메뉴 삭제", description: `${item.name} 메뉴가 삭제되었습니다.`, target: item.name }) });

  return (
    <section className="dk-panel dk-admin-panel">
      <div className="dk-inline-create"><input value={newMenu.name} placeholder="새 메뉴명" onChange={(event) => setNewMenu({ ...newMenu, name: event.target.value })} /><input value={newMenu.path} placeholder="/notice" onChange={(event) => setNewMenu({ ...newMenu, path: event.target.value })} /><button className="dk-primary-btn" type="button" onClick={addMenu}>새 메뉴 추가</button></div>
      <div className="dk-table-scroll"><table><thead><tr><th>메뉴명</th><th>경로</th><th>순서</th><th>노출 여부</th><th>정렬</th><th>삭제</th></tr></thead><tbody>{sorted.map((item, index) => <tr key={item.id}><td><input className="dk-inline-input" value={item.name} onChange={(event) => updateMenu(item.id, { name: event.target.value })} /></td><td><input className="dk-inline-input" value={item.path} onChange={(event) => updateMenu(item.id, { path: event.target.value })} /></td><td>{item.order}</td><td><ToggleButton active={item.status === "visible"} labelOn="노출" labelOff="비노출" onClick={() => updateMenu(item.id, { status: item.status === "visible" ? "hidden" : "visible" })} /></td><td><div className="dk-row-actions"><button disabled={index === 0} type="button" onClick={() => moveMenu(item.id, -1)}>↑</button><button disabled={index === sorted.length - 1} type="button" onClick={() => moveMenu(item.id, 1)}>↓</button></div></td><td><button className="dk-icon-btn danger" type="button" onClick={() => deleteMenu(item)}><AdminIcon name="Trash" size={16} /></button></td></tr>)}</tbody></table></div>
    </section>
  );
}

function FooterManagerPanel({ state, actions, onToast }) {
  const [form, setForm] = useState(state.footerInfo);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const save = () => {
    if (!form.companyName.trim() || !isEmail(form.email)) {
      onToast("푸터 저장 실패", "회사명과 이메일 형식을 확인하세요.", "error");
      return;
    }
    actions.updateFooter(form, { type: "footerSave", title: "푸터 저장", description: "푸터 회사 정보가 저장되었습니다.", target: "footer" });
    onToast("푸터 저장 완료", form.companyName);
  };
  return (
    <section className="dk-panel dk-admin-panel"><div className="dk-settings-grid"><FormField label="회사명" value={form.companyName} onChange={(value) => update("companyName", value)} /><FormField label="대표자" value={form.representative} onChange={(value) => update("representative", value)} /><FormField label="사업자등록번호" value={form.businessNumber} onChange={(value) => update("businessNumber", value)} /><FormField label="주소" value={form.address} onChange={(value) => update("address", value)} /><FormField label="대표전화" value={form.tel} onChange={(value) => update("tel", value)} /><FormField label="이메일" value={form.email} onChange={(value) => update("email", value)} /><FormField label="저작권 문구" value={form.copyright} onChange={(value) => update("copyright", value)} /></div><div className="dk-footer-preview"><strong>{form.companyName}</strong><span>{form.address}</span><span>{form.tel} · {form.email}</span><small>{form.copyright}</small></div><div className="dk-form-actions"><button className="dk-secondary-btn" type="button" onClick={() => setForm(state.footerInfo)}>저장값 복원</button><button className="dk-primary-btn" type="button" onClick={save}>저장</button></div></section>
  );
}

function SiteSettingsPanel({ state, actions, onToast }) {
  const [form, setForm] = useState(state.siteSettings);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const save = () => {
    if (!form.siteName.trim() || !isEmail(form.adminEmail)) {
      onToast("기본 설정 저장 실패", "사이트명과 이메일 형식을 확인하세요.", "error");
      return;
    }
    actions.updateSiteSettings(form, { type: "settingsSave", title: "기본 설정 저장", description: "사이트 기본 설정이 저장되었습니다.", target: "settings" });
    onToast("기본 설정 저장 완료", form.siteName);
  };
  return (
    <section className="dk-panel dk-admin-panel"><div className="dk-state-cards"><article><span>공개 상태</span><strong>{form.publicStatus ? "공개중" : "비공개"}</strong></article><article><span>유지보수</span><strong>{form.maintenanceMode ? "ON" : "OFF"}</strong></article><article><span>기본 언어</span><strong>{form.language}</strong></article><article><span>관리자</span><strong>{form.adminEmail}</strong></article></div><div className="dk-settings-grid"><FormField label="사이트명" value={form.siteName} onChange={(value) => update("siteName", value)} /><FormField label="관리자 이메일" value={form.adminEmail} onChange={(value) => update("adminEmail", value)} /><FormField label="대표 연락처" value={form.contactNumber} onChange={(value) => update("contactNumber", value)} /><SelectField label="기본 언어" value={form.language} onChange={(value) => update("language", value)}><option value="ko">한국어</option><option value="en">English</option></SelectField></div><div className="dk-switch-row"><ToggleButton active={form.maintenanceMode} labelOn="유지보수 ON" labelOff="유지보수 OFF" onClick={() => update("maintenanceMode", !form.maintenanceMode)} /><ToggleButton active={form.publicStatus} labelOn="공개" labelOff="비공개" onClick={() => update("publicStatus", !form.publicStatus)} /></div><div className="dk-form-actions"><button className="dk-secondary-btn" type="button" onClick={() => setForm(state.siteSettings)}>초기화</button><button className="dk-primary-btn" type="button" onClick={save}>저장</button></div></section>
  );
}

function SeoSettingsPanel({ state, actions, onToast, onPreview }) {
  const [form, setForm] = useState(state.seoSettings);
  const fileRef = useRef(null);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const uploadOg = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    update("ogImage", file.name);
    onToast("OG 이미지 선택", file.name);
    event.target.value = "";
  };
  const save = () => {
    actions.updateSeoSettings(form, { type: "seoSave", title: "SEO 설정 저장", description: "SEO 기본 정보가 저장되었습니다.", target: "seo" });
    onToast("SEO 저장 완료", form.metaTitle);
  };
  return (
    <div className="dk-manager-grid"><section className="dk-panel dk-admin-panel"><div className="dk-form-stack"><FormField label={`메타 타이틀 (${form.metaTitle.length}/60)`} value={form.metaTitle} onChange={(value) => update("metaTitle", value)} /><TextAreaField label={`메타 설명 (${form.metaDescription.length}/160)`} value={form.metaDescription} onChange={(value) => update("metaDescription", value)} /><FormField label="대표 키워드" value={form.keywords} onChange={(value) => update("keywords", value)} /><SelectField label="robots 설정" value={form.robots} onChange={(value) => update("robots", value)}><option value="index,follow">index,follow</option><option value="noindex,nofollow">noindex,nofollow</option></SelectField><input ref={fileRef} className="dk-hidden-input" type="file" accept="image/*" onChange={uploadOg} /><button className="dk-secondary-btn" type="button" onClick={() => fileRef.current?.click()}>OG 이미지 업로드</button><div className="dk-form-actions"><button className="dk-secondary-btn" type="button" onClick={() => onPreview({ kind: "SEO PREVIEW", title: form.metaTitle, description: form.metaDescription, rows: [["키워드", form.keywords], ["OG 이미지", form.ogImage], ["robots", form.robots]] })}>미리보기</button><button className="dk-primary-btn" type="button" onClick={save}>저장</button></div></div></section><section className="dk-panel dk-admin-panel"><h3>검색 미리보기</h3><div className="dk-seo-preview"><span>https://dgtc.ejdzm90.workers.dev</span><strong>{form.metaTitle}</strong><p>{form.metaDescription}</p><small>OG 이미지: {form.ogImage}</small></div></section></div>
  );
}

function UserManagerPanel({ state, actions, onToast, onConfirm }) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [form, setForm] = useState({ name: "", email: "", role: "editor", status: "active" });
  const users = state.adminUsers.filter((user) => (`${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase())) && (roleFilter === "all" || user.role === roleFilter));
  const addUser = () => {
    if (!form.name.trim() || !isEmail(form.email) || state.adminUsers.some((user) => user.email === form.email)) {
      onToast("사용자 추가 실패", "이름, 이메일 형식, 중복 이메일을 확인하세요.", "error");
      return;
    }
    const item = { ...form, id: `user-${Date.now()}`, lastLogin: "-" };
    actions.updateUsers((current) => [item, ...current], { type: "userCreate", title: "사용자 추가", description: `${item.name} 계정이 추가되었습니다.`, target: item.email });
    setForm({ name: "", email: "", role: "editor", status: "active" });
  };
  const updateUser = (id, patch) => {
    const nextUsers = state.adminUsers.map((user) => user.id === id ? { ...user, ...patch } : user);
    if (!nextUsers.some((user) => user.role === "owner" && user.status === "active")) {
      onToast("사용자 변경 실패", "활성 최고관리자는 최소 1명 필요합니다.", "error");
      return;
    }
    actions.updateUsers(nextUsers, { type: "userEdit", title: "사용자 수정", description: "사용자 권한 또는 상태가 변경되었습니다.", target: id });
  };
  const deleteUser = (user) => onConfirm({ title: "사용자 삭제", message: `${user.name} 계정을 삭제할까요?`, onConfirm: () => updateUser(user.id, { status: "inactive" }) });
  return (
    <section className="dk-panel dk-admin-panel"><div className="dk-inline-create"><input value={form.name} placeholder="이름" onChange={(event) => setForm({ ...form, name: event.target.value })} /><input value={form.email} placeholder="email@example.com" onChange={(event) => setForm({ ...form, email: event.target.value })} /><select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="owner">최고관리자</option><option value="editor">콘텐츠 관리자</option><option value="viewer">읽기 전용</option></select><button className="dk-primary-btn" type="button" onClick={addUser}>사용자 추가</button></div><div className="dk-log-filter"><label><AdminIcon name="Search" size={16} /><input value={query} placeholder="사용자 검색" onChange={(event) => setQuery(event.target.value)} /></label><select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}><option value="all">전체 권한</option><option value="owner">최고관리자</option><option value="editor">콘텐츠 관리자</option><option value="viewer">읽기 전용</option></select></div><div className="dk-table-scroll"><table><thead><tr><th>이름</th><th>이메일</th><th>권한</th><th>상태</th><th>최근 로그인</th><th>수정</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td><select className="dk-inline-input" value={user.role} onChange={(event) => updateUser(user.id, { role: event.target.value })}><option value="owner">최고관리자</option><option value="editor">콘텐츠 관리자</option><option value="viewer">읽기 전용</option></select></td><td><StatusBadge status={user.status} /></td><td>{user.lastLogin}</td><td><div className="dk-row-actions"><button type="button" onClick={() => updateUser(user.id, { status: user.status === "active" ? "inactive" : "active" })}><AdminIcon name="Refresh" size={15} /></button><button className="danger" type="button" onClick={() => deleteUser(user)}><AdminIcon name="Trash" size={15} /></button></div></td></tr>)}</tbody></table></div></section>
  );
}

function LogManagerPanel({ state, actions, onToast, onConfirm, onPreview }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("desc");
  const rows = [...state.auditLogs].filter((row) => (`${row.user} ${row.action} ${row.target} ${row.detail}`.toLowerCase().includes(query.toLowerCase())) && (type === "all" || row.type === type) && (status === "all" || row.status === status)).sort((a, b) => sort === "desc" ? String(b.timestamp).localeCompare(String(a.timestamp)) : String(a.timestamp).localeCompare(String(b.timestamp)));
  const clearLogs = () => onConfirm({ title: "로그 비우기", message: "감사 로그를 모두 비울까요?", onConfirm: () => { actions.clearAuditLogs(); onToast("로그 비우기 완료", "감사 로그가 정리되었습니다."); } });
  return (
    <section className="dk-panel dk-admin-panel"><div className="dk-log-filter"><label><AdminIcon name="Search" size={16} /><input value={query} placeholder="로그 검색" onChange={(event) => setQuery(event.target.value)} /></label><select value={type} onChange={(event) => setType(event.target.value)}><option value="all">전체 작업</option><option value="noticeCreate">공지 등록</option><option value="imageUpload">이미지 업로드</option><option value="backup">백업</option><option value="storageRecovery">저장소 복구</option></select><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">전체 상태</option><option value="success">성공</option><option value="fail">실패</option></select><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="desc">최신순</option><option value="asc">오래된순</option></select></div><div className="dk-form-actions dk-log-actions"><button className="dk-secondary-btn" type="button" onClick={() => downloadCsv("daekwang-admin-logs.csv", rows)}>CSV 다운로드</button><button className="dk-danger-btn" type="button" onClick={clearLogs}>로그 비우기</button></div><div className="dk-table-scroll"><table><thead><tr><th>시간</th><th>사용자</th><th>작업</th><th>대상</th><th>상태</th><th>상세</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{row.timestamp}</td><td>{row.user}</td><td>{row.action}</td><td>{row.target}</td><td><StatusBadge status={row.status} /></td><td><button className="dk-icon-btn" type="button" onClick={() => onPreview({ kind: "LOG DETAIL", title: row.action, description: row.detail, rows: [["시간", row.timestamp], ["사용자", row.user], ["대상", row.target], ["상태", row.status]] })}><AdminIcon name="Eye" size={16} /></button></td></tr>)}</tbody></table></div>{!rows.length ? <EmptyState>조건에 맞는 로그가 없습니다.</EmptyState> : null}</section>
  );
}

function BackupManagerPanel({ state, actions, onToast, onConfirm }) {
  const autoBackup = state.uiPreferences.autoBackup;
  const createBackup = () => {
    const snapshot = clone(state);
    const item = { id: `backup-${Date.now()}`, fileName: `backup_${new Date().toISOString().slice(0, 10).replace(/-/g, "_")}_${Date.now()}.json`, createdAt: nowStamp(), fileSize: `${Math.max(1, Math.round(JSON.stringify(snapshot).length / 1024))}KB`, status: "success", snapshot };
    actions.updateBackups((items) => [item, ...items], { type: "backup", title: "백업 생성", description: `${item.fileName} 백업 파일이 생성되었습니다.`, target: item.fileName });
    downloadJson(item.fileName, snapshot);
    onToast("백업 생성 완료", item.fileName);
  };
  const restoreBackup = (backup) => onConfirm({ title: "백업 복원", message: `${backup.fileName} 백업으로 복원할까요?`, onConfirm: () => { if (backup.snapshot) { actions.restoreState(backup.snapshot); } actions.addActivity("backupRestore", "백업 복원", `${backup.fileName} 백업이 복원되었습니다.`, backup.fileName); onToast("백업 복원 완료", backup.fileName); } });
  const deleteBackup = (backup) => onConfirm({ title: "백업 삭제", message: `${backup.fileName} 백업을 삭제할까요?`, onConfirm: () => actions.updateBackups((items) => items.filter((item) => item.id !== backup.id), { type: "backupDelete", title: "백업 삭제", description: `${backup.fileName} 백업이 삭제되었습니다.`, target: backup.fileName }) });
  return (
    <div className="dk-backup-grid"><section className="dk-panel dk-admin-panel"><div className="dk-backup-stats"><article><span>마지막 백업일</span><strong>{state.backupItems[0]?.createdAt ?? "없음"}</strong></article><article><span>백업 파일 수</span><strong>{state.backupItems.length}개</strong></article><article><span>자동 백업</span><ToggleButton active={autoBackup} labelOn="자동" labelOff="수동" onClick={() => actions.updateUiPreferences((prefs) => ({ ...prefs, autoBackup: !prefs.autoBackup }))} /></article></div><button className="dk-primary-btn" type="button" onClick={createBackup}>백업 생성</button></section><section className="dk-panel dk-admin-panel"><h3>백업 파일 목록</h3><div className="dk-control-list">{state.backupItems.map((backup) => <article key={backup.id}><div><strong>{backup.fileName}</strong><span>{backup.createdAt} · {backup.fileSize}</span></div><StatusBadge status={backup.status} /><div className="dk-row-actions"><button type="button" onClick={() => { downloadJson(backup.fileName, backup.snapshot || state); onToast("백업 다운로드", backup.fileName); }}><AdminIcon name="Download" size={15} /></button><button type="button" onClick={() => restoreBackup(backup)}><AdminIcon name="Refresh" size={15} /></button><button className="danger" type="button" onClick={() => deleteBackup(backup)}><AdminIcon name="Trash" size={15} /></button></div></article>)}</div></section></div>
  );
}

function NoticeCtaSettingsPanel({ state, actions, onToast, onPreview }) {
  const [form, setForm] = useState(state.noticeCtaSettings);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const save = () => {
    actions.updateNoticeCta(form, { type: "noticeCtaSave", title: "공지 CTA 저장", description: "공지사항 CTA 설정이 저장되었습니다.", target: "noticeCta" });
    onToast("공지 CTA 저장 완료", form.title);
  };
  return (
    <section className="dk-panel dk-admin-panel"><h3>공지사항 CTA 설정</h3><div className="dk-form-stack"><ToggleButton active={form.enabled} labelOn="사용" labelOff="숨김" onClick={() => update("enabled", !form.enabled)} /><div className="dk-two-col"><SelectField label="위치" value={form.position} onChange={(value) => update("position", value)}><option value="top">목록 상단</option><option value="bottom">목록 하단</option></SelectField><SelectField label="스타일" value={form.style} onChange={(value) => update("style", value)}><option value="primary">Primary</option><option value="navyOutline">Navy Outline</option><option value="minimalText">Minimal Text</option></SelectField></div><FormField label="제목" value={form.title} onChange={(value) => update("title", value)} /><TextAreaField label="설명" value={form.description} onChange={(value) => update("description", value)} /><div className="dk-two-col"><FormField label="버튼 라벨" value={form.buttonLabel} onChange={(value) => update("buttonLabel", value)} /><FormField label="버튼 URL" value={form.buttonUrl} onChange={(value) => update("buttonUrl", value)} /></div><div className="dk-form-actions"><button className="dk-secondary-btn" type="button" onClick={() => onPreview({ kind: "NOTICE CTA", title: form.title, description: form.description, rows: [["버튼", form.buttonLabel], ["URL", form.buttonUrl], ["스타일", form.style]] })}>미리보기</button><button className="dk-primary-btn" type="button" onClick={save}>CTA 저장</button></div></div></section>
  );
}

function NoticeManagementIntro({ state, onNavigate, onPreview }) {
  const visible = state.notices.filter((notice) => notice.status === "visible").length;
  const pinned = state.notices.filter((notice) => notice.isPinned).length;
  return (
    <section className="dk-panel dk-admin-panel dk-notice-command">
      <div>
        <span>PUBLIC NOTICE CONTROL</span>
        <h3>공개 공지사항 운영</h3>
        <p>홈페이지 공지사항 목록과 상세 페이지에 노출될 안내 글을 등록하고 관리합니다.</p>
      </div>
      <dl>
        <div><dt>전체</dt><dd>{state.notices.length}</dd></div>
        <div><dt>공개</dt><dd>{visible}</dd></div>
        <div><dt>중요</dt><dd>{pinned}</dd></div>
      </dl>
      <div className="dk-notice-command-actions">
        <a className="dk-secondary-btn" href="#/notice">공개 페이지 보기</a>
        <button className="dk-primary-btn" type="button" onClick={() => onPreview({ kind: "NOTICE CTA", title: state.noticeCtaSettings.title, description: state.noticeCtaSettings.description, rows: [["위치", state.noticeCtaSettings.position], ["스타일", state.noticeCtaSettings.style], ["버튼", state.noticeCtaSettings.buttonLabel]] })}>CTA 설정 보기</button>
        <button className="dk-secondary-btn" type="button" onClick={() => onNavigate("notices")}>새 공지 작성</button>
      </div>
    </section>
  );
}

export function AdminSectionRenderer({
  activeSection,
  actions,
  activityLogs,
  auditLogs,
  imageManagerProps,
  noticeCreateProps,
  notices,
  state,
  summaryCards,
  onDeleteNotice,
  onEditNotice,
  onNavigate,
  onOpenPublicNotice,
  onOpenPublicNoticeList,
  onPreview,
  onReset,
  onToast,
  onToggleNotice,
  onConfirm,
}) {
  const [title, description] = sectionMeta[activeSection] ?? sectionMeta.dashboard;

  const createBackupQuick = () => {
    const snapshot = clone(state);
    const item = { id: `backup-${Date.now()}`, fileName: `backup_quick_${Date.now()}.json`, createdAt: nowStamp(), fileSize: `${Math.max(1, Math.round(JSON.stringify(snapshot).length / 1024))}KB`, status: "success", snapshot };
    actions.updateBackups((items) => [item, ...items], { type: "backup", title: "백업 생성", description: `${item.fileName} 백업 파일이 생성되었습니다.`, target: item.fileName });
    onToast("백업 생성 완료", item.fileName);
  };

  let body = null;
  if (activeSection === "dashboard") {
    body = (
      <DashboardSection
        activityLogs={activityLogs}
        imageManagerProps={imageManagerProps}
        noticeCreateProps={noticeCreateProps}
        notices={notices}
        onCreateBackup={createBackupQuick}
        onDeleteNotice={onDeleteNotice}
        onEditNotice={onEditNotice}
        onOpenPublicNotice={onOpenPublicNotice}
        onPreviewNotice={(notice) => onPreview({ kind: "NOTICE PREVIEW", title: notice.title, description: `${notice.category} · ${notice.publishDate}`, content: notice.content })}
        onToggleNotice={onToggleNotice}
        onNavigate={onNavigate}
        summaryCards={summaryCards}
      />
    );
  } else if (activeSection === "images") {
    body = <div className="dk-manager-grid dk-manager-grid-wide"><ImageManagerPanel {...imageManagerProps} /><RecentActivityPanel logs={activityLogs} /></div>;
  } else if (activeSection === "notices") {
    body = <div className="dk-manager-grid"><NoticeManagementIntro state={state} onNavigate={onNavigate} onPreview={onPreview} /><NoticeCreatePanel {...noticeCreateProps} /><NoticeListTable notices={notices} onDeleteNotice={onDeleteNotice} onEditNotice={onEditNotice} onOpenPublicNotice={onOpenPublicNotice} onPreviewNotice={(notice) => onPreview({ kind: "NOTICE PREVIEW", title: notice.title, description: `${notice.category} · ${notice.publishDate}`, content: notice.content })} onToggleNotice={onToggleNotice} /><NoticeCtaSettingsPanel state={state} actions={actions} onToast={onToast} onPreview={onPreview} /><RecentActivityPanel logs={activityLogs} /></div>;
  } else if (activeSection === "pages") {
    body = <PageManagerPanel state={state} actions={actions} onToast={onToast} onPreview={onPreview} />;
  } else if (activeSection === "popups") {
    body = <PopupManagerPanel state={state} actions={actions} onToast={onToast} onConfirm={onConfirm} onPreview={onPreview} />;
  } else if (activeSection === "menus") {
    body = <MenuManagerPanel state={state} actions={actions} onToast={onToast} onConfirm={onConfirm} />;
  } else if (activeSection === "footer") {
    body = <FooterManagerPanel state={state} actions={actions} onToast={onToast} />;
  } else if (activeSection === "settings") {
    body = <SiteSettingsPanel state={state} actions={actions} onToast={onToast} />;
  } else if (activeSection === "seo") {
    body = <SeoSettingsPanel state={state} actions={actions} onToast={onToast} onPreview={onPreview} />;
  } else if (activeSection === "users") {
    body = <UserManagerPanel state={state} actions={actions} onToast={onToast} onConfirm={onConfirm} />;
  } else if (activeSection === "logs") {
    body = <LogManagerPanel state={{ ...state, auditLogs }} actions={actions} onToast={onToast} onConfirm={onConfirm} onPreview={onPreview} />;
  } else if (activeSection === "backups") {
    body = <BackupManagerPanel state={state} actions={actions} onToast={onToast} onConfirm={onConfirm} />;
  }

  return (
    <div className="dk-section-shell">
      <SectionHeader
        title={title}
        description={description}
        actions={<><button className="dk-secondary-btn" type="button" onClick={onOpenPublicNoticeList}>공지 공개페이지</button><button className="dk-danger-btn" type="button" onClick={onReset}>기본값으로 초기화</button></>}
      />
      {body}
    </div>
  );
}

export const panelStates = {
  booting: "booting",
  ready: "ready",
  editing: "editing",
  dirty: "dirty",
  previewing: "previewing",
  imported: "imported",
  exported: "exported",
  saved: "saved",
  error: "error",
};

export const initialPanelState = {
  status: panelStates.booting,
  activePanel: "dashboard",
  selectedPageId: "index",
  selectedPostId: null,
  dirty: false,
  notice: "관리자 콘솔을 준비하고 있습니다.",
  error: "",
  lastEvent: "BOOT",
};

export function panelReducer(state, event) {
  switch (event.type) {
    case "READY":
      return {
        ...state,
        status: panelStates.ready,
        notice: "브라우저 초안 편집 준비 완료",
        error: "",
        lastEvent: event.type,
      };
    case "SELECT_PANEL":
      return {
        ...state,
        activePanel: event.panel,
        status: state.dirty ? panelStates.dirty : panelStates.ready,
        notice: `${event.label ?? event.panel} 패널로 이동`,
        error: "",
        lastEvent: event.type,
      };
    case "SELECT_PAGE":
      return {
        ...state,
        selectedPageId: event.pageId,
        activePanel: "pages",
        status: state.dirty ? panelStates.dirty : panelStates.editing,
        notice: "페이지 편집 대상을 변경했습니다.",
        error: "",
        lastEvent: event.type,
      };
    case "SELECT_POST":
      return {
        ...state,
        selectedPostId: event.postId,
        activePanel: "posts",
        status: state.dirty ? panelStates.dirty : panelStates.editing,
        notice: "게시글 편집 대상을 변경했습니다.",
        error: "",
        lastEvent: event.type,
      };
    case "EDIT":
      return {
        ...state,
        dirty: true,
        status: panelStates.dirty,
        notice: event.notice ?? "수정 사항이 있습니다.",
        error: "",
        lastEvent: event.type,
      };
    case "SAVE":
      return {
        ...state,
        dirty: false,
        status: panelStates.saved,
        notice: "브라우저 초안 저장 완료",
        error: "",
        lastEvent: event.type,
      };
    case "PREVIEW":
      return {
        ...state,
        dirty: false,
        status: panelStates.previewing,
        notice: "초안 저장 후 미리보기를 열었습니다.",
        error: "",
        lastEvent: event.type,
      };
    case "IMPORT":
      return {
        ...state,
        dirty: true,
        status: panelStates.imported,
        notice: "JSON 데이터를 가져왔습니다. 저장하면 브라우저 초안에 반영됩니다.",
        error: "",
        lastEvent: event.type,
      };
    case "EXPORT":
      return {
        ...state,
        status: panelStates.exported,
        notice: "현재 초안 JSON을 갱신했습니다.",
        error: "",
        lastEvent: event.type,
      };
    case "RESET":
      return {
        ...initialPanelState,
        status: panelStates.ready,
        notice: "기본 콘텐츠로 되돌렸습니다.",
        lastEvent: event.type,
      };
    case "ERROR":
      return {
        ...state,
        status: panelStates.error,
        error: event.error ?? "알 수 없는 오류",
        notice: "상태머신이 오류 상태로 전환되었습니다.",
        lastEvent: event.type,
      };
    default:
      return state;
  }
}

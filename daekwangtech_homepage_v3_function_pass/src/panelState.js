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
  selectedNoticeId: null,
  selectedMediaId: null,
  dirty: false,
  notice: "관리 화면을 준비하고 있습니다.",
  error: "",
  lastEvent: "BOOT",
};

export function panelReducer(state, event) {
  switch (event.type) {
    case "READY":
      return {
        ...state,
        status: panelStates.ready,
        notice: "수정할 준비가 되었습니다.",
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
    case "SELECT_NOTICE":
      return {
        ...state,
        selectedNoticeId: event.postId,
        selectedPostId: event.postId,
        activePanel: "notices",
        status: state.dirty ? panelStates.dirty : panelStates.editing,
        notice: "공지사항 편집 대상을 변경했습니다.",
        error: "",
        lastEvent: event.type,
      };
    case "SELECT_MEDIA":
      return {
        ...state,
        selectedMediaId: event.mediaId,
        activePanel: "media",
        status: state.dirty ? panelStates.dirty : panelStates.editing,
        notice: "이미지 편집 대상을 변경했습니다.",
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
        notice: "임시 저장했습니다.",
        error: "",
        lastEvent: event.type,
      };
    case "SYNC_REMOTE":
      return {
        ...state,
        dirty: false,
        status: panelStates.ready,
        notice: "사이트에 저장된 내용을 불러왔습니다.",
        error: "",
        lastEvent: event.type,
      };
    case "SAVE_REMOTE":
      return {
        ...state,
        dirty: false,
        status: panelStates.saved,
        notice: "사이트에 저장했습니다.",
        error: "",
        lastEvent: event.type,
      };
    case "PUBLISH_REMOTE":
      return {
        ...state,
        dirty: false,
        status: panelStates.saved,
        notice: "방문자 화면에 발행했습니다.",
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
        notice: "데이터를 불러왔습니다. 저장하면 반영됩니다.",
        error: "",
        lastEvent: event.type,
      };
    case "EXPORT":
      return {
        ...state,
        status: panelStates.exported,
        notice: "현재 내용을 갱신했습니다.",
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
        notice: "확인이 필요한 문제가 있습니다.",
        lastEvent: event.type,
      };
    default:
      return state;
  }
}

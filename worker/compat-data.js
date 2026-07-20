export const defaultAdminContent = {};
export const defaultNotices = [];
export const defaultNoticeCtaSettings = {};

export function normalizeContent(content) {
  return content && typeof content === 'object' ? content : {};
}

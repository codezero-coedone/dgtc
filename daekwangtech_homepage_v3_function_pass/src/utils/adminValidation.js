export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export function isImageFile(file) {
  return ["image/jpeg", "image/png", "image/webp"].includes(file?.type);
}

export function isUnderImageLimit(file) {
  return Number(file?.size || 0) <= 10 * 1024 * 1024;
}

export function isValidPath(value) {
  return String(value || "").startsWith("/");
}

export function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) return false;
  return new Date(endDate).getTime() >= new Date(startDate).getTime();
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("파일을 읽을 수 없습니다."));
    reader.readAsDataURL(file);
  });
}

export function downloadJson(fileName, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadCsv(fileName, rows) {
  const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const headers = ["timestamp", "user", "action", "target", "status", "detail"];
  const csv = [headers.join(","), ...rows.map((row) => headers.map((key) => escape(row[key])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function fileSizeLabel(bytes) {
  if (!bytes) return "0KB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)}${units[index]}`;
}

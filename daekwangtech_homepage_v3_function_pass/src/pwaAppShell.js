const SW_PATH = "/daekwang-sw.js";

export function registerDaekwangAppShell() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const canRegister =
    window.location.protocol === "https:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (!canRegister) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register(SW_PATH).catch(() => {
      // PWA shell is progressive enhancement. A failed SW must not break the site.
    });
  });
}

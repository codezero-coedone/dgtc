const CACHE_NAME_MATCHERS = ["daekwang", "app-shell", "runtime"];

function shouldDeleteCache(cacheName) {
  return CACHE_NAME_MATCHERS.some((matcher) => cacheName.includes(matcher));
}

async function clearDaekwangCaches() {
  if (!("caches" in window)) return;
  const keys = await window.caches.keys();
  await Promise.all(keys.filter(shouldDeleteCache).map((key) => window.caches.delete(key)));
}

export function registerDaekwangAppShell() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const canRegister =
    window.location.protocol === "https:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (!canRegister) return;

  window.addEventListener("load", () => {
    Promise.all([
      navigator.serviceWorker.getRegistrations().then((registrations) =>
        Promise.all(
          registrations
            .filter((registration) => registration.scope === window.location.origin + "/")
            .map((registration) => registration.unregister()),
        ),
      ),
      clearDaekwangCaches(),
    ]).catch(() => {
      // PWA shell is progressive enhancement. A failed SW must not break the site.
    });
  });
}

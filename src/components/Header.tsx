import { useState } from "react";
import { site } from "../data/site";

export function Header() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="corporate-header">
      <div className="dk-container header-inner">
        <a href="#/" className="brand" onClick={closeMenu} aria-label="DAEKWANG TECH home">
          <span className="brand-mark">DT</span>
          <span>
            <strong>DAEKWANG TECH</strong>
            <em>대광테크</em>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="주요 메뉴">
          {site.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-utility">
          <a href="#/">HOME</a>
          <a href="#/support">CONTACT</a>
          <span>KOR</span>
        </div>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label="모바일 메뉴 열기"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="relative h-4 w-5">
            <span className={`absolute left-0 top-0 h-px w-5 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`absolute left-0 top-2 h-px w-5 bg-white transition ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-4 h-px w-5 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {open ? (
        <div className="mobile-menu-panel">
          <nav className="dk-container mobile-menu-grid" aria-label="모바일 메뉴">
            {site.nav.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
            <div className="flex gap-4 py-4 text-xs font-bold text-[var(--dk-metal-500)]">
              <a href="#/" onClick={closeMenu}>
                HOME
              </a>
              <a href="#/support" onClick={closeMenu}>
                CONTACT
              </a>
              <span>KOR</span>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

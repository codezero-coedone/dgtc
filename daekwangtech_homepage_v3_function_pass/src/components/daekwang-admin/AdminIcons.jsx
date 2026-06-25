import React from "react";

const paths = {
  LogoD: "M8 6h8c6 0 10 3.8 10 9s-4 9-10 9H8V6Zm5 5v8h3c3 0 5-1.4 5-4s-2-4-5-4h-3Z",
  Home: "M4 12 16 3l12 9v14a2 2 0 0 1-2 2h-7v-8h-6v8H6a2 2 0 0 1-2-2V12Z",
  Image: "M6 7h20v18H6V7Zm3 13 5-5 4 4 3-3 4 4M10 12h.1",
  Megaphone: "M5 17h4l11 5V10L9 15H5v2Zm4 0 2 7",
  File: "M9 4h11l5 5v19H9V4Zm10 0v6h6",
  Popup: "M6 8h20v14H6V8Zm5 19h10M16 22v5",
  Menu: "M6 9h20M6 16h20M6 23h20",
  Footer: "M6 7h20v18H6V7Zm0 12h20",
  Settings: "M16 11a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0-8 2 4 4 1 4-2 2 4-3 3v5l3 3-2 4-4-2-4 1-2 4-4-2 2-4-1-4-4-2v-5l4-2 1-4-2-4 4-2Z",
  Seo: "M6 24l6-6 5 4 9-12M19 10h7v7",
  Users: "M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-8 13c1-5 4-8 8-8s7 3 8 8M23 14a4 4 0 1 0 0-8M21 28c.8-3 2.7-5 5.5-5",
  Log: "M8 5h16v22H8V5Zm5 7h8M13 17h8M13 22h5",
  Backup: "M8 24h16a6 6 0 0 0 0-12h-1A8 8 0 0 0 8 15a5 5 0 0 0 0 9Zm8-8v7M13 20l3 3 3-3",
  Search: "M14 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm6 14 6 6",
  Bell: "M16 27a3 3 0 0 0 3-3h-6a3 3 0 0 0 3 3Zm-8-5h16l-2-3v-6a6 6 0 0 0-12 0v6l-2 3Z",
  Upload: "M16 23V8m0 0-6 6m6-6 6 6M7 23v4h18v-4",
  Eye: "M4 16s4-8 12-8 12 8 12 8-4 8-12 8S4 16 4 16Zm12-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  Refresh: "M25 11a9 9 0 0 0-16-3L6 11m0-6v6h6M7 21a9 9 0 0 0 16 3l3-3m0 6v-6h-6",
  Trash: "M9 10h14M13 10V7h6v3m-8 0 1 17h8l1-17",
  Edit: "M8 23l1-5L22 5l5 5-13 13-6 1Zm11-15 5 5",
  More: "M8 16h.1M16 16h.1M24 16h.1",
  Calendar: "M8 7h16v19H8V7Zm0 7h16M12 4v6M20 4v6",
  Download: "M16 6v14m0 0 6-6m-6 6-6-6M7 26h18",
  Clock: "M16 5a11 11 0 1 0 0 22 11 11 0 0 0 0-22Zm0 6v6l4 3",
  Monitor: "M5 7h22v15H5V7Zm7 20h8M16 22v5",
  Shield: "M16 4 6 8v7c0 7 4 11 10 13 6-2 10-6 10-13V8L16 4Z",
  Chevron: "m12 8 8 8-8 8",
  Banner: "M5 7h22v16H5V7Zm4 4h8M9 16h14",
};

export function AdminIcon({ name, size = 20, className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 32 32"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={paths[name] ?? paths.File} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

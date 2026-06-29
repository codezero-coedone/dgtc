import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { registerDaekwangAppShell } from "./pwaAppShell.js";
import "./styles/brand-tokens.css";
import "../styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

registerDaekwangAppShell();

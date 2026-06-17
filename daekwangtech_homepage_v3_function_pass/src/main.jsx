import React from "react";
import { createRoot } from "react-dom/client";
import "../script.js";

function RuntimeMarker() {
  return <span data-react-vite-runtime="ready" />;
}

const mount = document.createElement("div");
mount.id = "react-vite-runtime";
mount.hidden = true;
document.body.appendChild(mount);

createRoot(mount).render(<RuntimeMarker />);

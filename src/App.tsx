import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";

/** Compatibility export; the app entry mounts TanStack Router directly in main.tsx. */
export default function App() {
  return <RouterProvider router={router} />;
}

import { AuthProvider } from "../features/auth/context/AuthContext.tsx";
import { createRoot } from "react-dom/client";
import "@mantine/carousel/styles.css";
import { StrictMode } from "react";
import App from "./App.tsx";
import "./index.css";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);

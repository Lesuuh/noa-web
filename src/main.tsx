// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { StrictMode } from "react";
import { ExamContextProvider } from "./contexts/ExamStateContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ExamContextProvider>
          <App />
        </ExamContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

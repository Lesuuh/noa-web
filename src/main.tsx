// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import { ExamContextProvider } from "./contexts/ExamStateContext.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { UserContextProvider } from "./contexts/UserContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <ExamContextProvider>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "black",
                color: "white",
              },
            }}
          />
        </ExamContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>
);

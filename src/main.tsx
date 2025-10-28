// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext.tsx";
import { StrictMode } from "react";
import { ExamContextProvider } from "./contexts/ExamStateContext.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {/* <AuthProvider> */}
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
      {/* </AuthProvider> */}
    </BrowserRouter>
  </StrictMode>
);

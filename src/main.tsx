// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import { Toaster } from "./components/ui/sonner.tsx";
import { UserContextProvider } from "./contexts/UserContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserContextProvider>
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
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>
);

import { Routes, Route } from "react-router-dom";
import ResultPage from "./pages/ResultPage";
import LoginPage from "./pages/LoginPage";
import CreateAccount from "./pages/CreateAccount";
import Dashboard from "./pages/Dashboard";
import AuthGuard from "./components/AuthGuard";
import ExamPage from "./pages/ExamPage";

const App = () => {
  return (
    <div className="">
      <Routes>
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="result" element={<ResultPage />} />
      </Routes>
    </div>
  );
};

export default App;

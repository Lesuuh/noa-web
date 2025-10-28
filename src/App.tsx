import { Routes, Route } from "react-router-dom";
import ResultPage from "./pages/ResultPage";
import LoginPage from "./pages/LoginPage";
import CreateAccount from "./pages/CreateAccount";
import Dashboard from "./pages/Dashboard";
import ExamPage from "./pages/ExamPage";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/AuthGuard";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <Routes>
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="" element={<AuthGuard />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/exam" element={<ExamPage />} />

          <Route path="/result" element={<ResultPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;

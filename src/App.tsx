import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import CreateAccount from "./pages/CreateAccount";
import Dashboard from "./pages/Dashboard";
import ExamPage from "./pages/ExamPage";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/AuthGuard";
import ExamReview from "./pages/ExamReview";

const App = () => {
  return (
    <div className="min-h-screen ">
      <Routes>
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AuthGuard />}>
          <Route index path="/" element={<Dashboard />} />
          <Route path="/review/:id" element={<ExamReview />} />
          <Route path="/exam" element={<ExamPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;

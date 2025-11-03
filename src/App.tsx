import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";
import AuthGuard from "./components/AuthGuard";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ExamReview = lazy(() => import("./pages/ExamReview"));
const ExamPage = lazy(() => import("./pages/ExamPage"));
const Freemium = lazy(() => import("./pages/Freemuim"));

const App = () => {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AuthGuard />}>
            <Route index path="/" element={<Dashboard />} />
            <Route path="/review/:id" element={<ExamReview />} />
            <Route path="/exam" element={<ExamPage />} />
            <Route path="/freemium" element={<Freemium />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;

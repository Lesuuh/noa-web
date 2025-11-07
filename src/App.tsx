import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";
import AuthGuard from "./components/AuthGuard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ExamReview = lazy(() => import("./pages/ExamReview"));
const ExamPage = lazy(() => import("./pages/ExamPage"));
const Freemium = lazy(() => import("./pages/Freemuim"));
const History = lazy(() => import("./pages/History"));
const Settings = lazy(() => import("./pages/Settings"));

const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes (require auth) */}
            <Route element={<AuthGuard />}>
              <Route
                element={
                  <Suspense fallback={<Loader />}>
                    <DashboardLayout />
                  </Suspense>
                }
              >
                <Route index path="/" element={<Dashboard />} />
                <Route path="/review/:id" element={<ExamReview />} />
                <Route path="/freemium" element={<Freemium />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="/exam" element={<ExamPage />} />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </QueryClientProvider>
  );
};

export default App;

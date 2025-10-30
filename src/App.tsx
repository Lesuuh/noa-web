import { Routes, Route } from "react-router-dom";
import ResultPage from "./pages/ResultPage";
import LoginPage from "./pages/LoginPage";
import CreateAccount from "./pages/CreateAccount";
import Dashboard from "./pages/Dashboard";
import ExamPage from "./pages/ExamPage";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/AuthGuard";
import StartExamPage from "./pages/StartExamPage";


const attempts = [
  {
    id: "1",
    date: "2025-10-29",
    timeSpent: "12m 30s",
    score: 80,
    questions: [
      {
        id: "q1",
        questionText: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
        userAnswer: "4",
      },
      {
        id: "q2",
        questionText: "What is the capital of Nigeria?",
        options: ["Lagos", "Abuja", "Kano", "Port Harcourt"],
        correctAnswer: "Abuja",
        userAnswer: "Lagos",
      },
    ],
  },
];

const App = () => {
  return (
    <div className="min-h-screen ">
      <Routes>
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="" element={<AuthGuard />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/start" element={<StartExamPage attempts={attempts}/>} />
          <Route path="/exam" element={<ExamPage />} />

          <Route path="/result" element={<ResultPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;

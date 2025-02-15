import ExamPage from "./pages/ExamPage";
import StartPage from "./pages/StartPage";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div className="w-full max-w-[1400px] px-4 md:px-10 lg:px-20 my-5">
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/exam" element={<ExamPage />} />
      </Routes>
    </div>
  );
};

export default App;

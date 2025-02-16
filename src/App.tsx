// import { useState } from "react";
import { useState } from "react";
import ExamPage from "./pages/ExamPage";
import StartPage from "./pages/StartPage";
import { Routes, Route } from "react-router-dom";
import ResultPage from "./pages/ResultPage";

const App = () => {
  const [name, setName] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  return (
    <div className="w-full max-w-[1400px] px-4 md:px-10 lg:px-20 my-5">
      <Routes>
        <Route
          path="/"
          element={<StartPage name={name} handleChange={handleChange} />}
        />
        <Route path="/exam" element={<ExamPage name={name} />} />
        <Route path="result" element={<ResultPage />} />
      </Routes>
    </div>
  );
};

export default App;

// import { useState } from "react";
import { useState } from "react";

import { Routes, Route } from "react-router-dom";
import ResultPage from "./pages/ResultPage";
import LoginPage from "./pages/LoginPage";
import CreateAccount from "./pages/CreateAccount";

const App = () => {
  const [createAccountDetails, setCreateAccountDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  return (
    <div className="">
      <Routes>
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/exam"
          // element={<ExamPage name={name} examNumber={examNumber} />}
        />
        <Route path="result" element={<ResultPage />} />
      </Routes>
    </div>
  );
};

export default App;

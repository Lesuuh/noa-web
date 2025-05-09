// import { useState } from "react";
import { useState } from "react";
import ExamPage from "./pages/ExamPage";
import StartPage from "./pages/StartPage";
import { Routes, Route } from "react-router-dom";
import ResultPage from "./pages/ResultPage";
import LoginPage from "./pages/LoginPage";
import CreateAccount from "./pages/CreateAccount";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";

const App = () => {
  // const [name, setName] = useState("");
  // const [examNumber, setExamNumber] = useState("");
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [createAccountDetails, setCreateAccountDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { email: loginEmail, password: loginPassword } = loginDetails;
  const {
    name,
    email: createAccountEmail,
    password: createAccountPassword,
  } = createAccountDetails;

  const createAccount = async (
    createAccountEmail: string,
    createAccountPassword: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        createAccountEmail,
        createAccountPassword
      );
      const user = userCredential.user;
      console.log(user);
    } catch (error) {
      console.error("Error signing Up:", error);
    }
  };

  const login = async (loginEmail: string, loginPassword: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
    } catch (error) {
      console.error("Error login", error);
    }
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { id, value } = e.target;
  //   if (id === "name") {
  //     setName(value);
  //   } else if (id === "examNumber") {
  //     setExamNumber(value);
  //   }
  // };
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-10 lg:px-20 my-5">
      <Routes>
        <Route path="/login" element={<LoginPage login={login} />} />
        <Route
          path="/create-account"
          element={<CreateAccount create={createAccount} />}
        />
        <Route
          path="/"
          element={
            <StartPage
            // name={name}
            // examNumber={examNumber}
            // handleChange={handleChange}
            />
          }
        />
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

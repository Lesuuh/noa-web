import { useLocation } from "react-router-dom";
import { questions } from "../data/sampleQuestions";

const ResultPage = () => {
  const location = useLocation();
  const { score } = location.state || { score: 0 };
  return (
    <div className="flex flex-col h-screen justify-center items-center bg-slate-200">
      <h2 className="text-4xl">Congratulations</h2>
      <p>You have completed the examinations</p>
      <p>
        You scored: <span className="font-bold text-2xl">{score}</span> out of{" "}
        <span className="font-bold text-2xl">{questions.length}</span>
      </p>
    </div>
  );
};

export default ResultPage;

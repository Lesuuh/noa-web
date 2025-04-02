import { useLocation } from "react-router-dom";
import { questions } from "../data/sampleQuestions";

const ResultPage = () => {
  const location = useLocation();
  const { score } = location.state || { score: 0 };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gradient-to-br from-green-400 to-blue-500 text-white">
      <div className="bg-white text-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-4xl font-bold mb-4 text-green-600">
          Congratulations!
        </h2>
        <p className="text-lg font-medium mb-6">
          You have successfully completed the examination.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
          <p className="text-xl font-semibold">
            Your Score:{" "}
            <span className="text-green-600 font-bold text-3xl">{score}</span> /{" "}
            <span className="text-gray-700 font-bold text-3xl">
              {questions.length}
            </span>
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ResultPage;

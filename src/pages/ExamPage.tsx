import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { questions } from "../data/sampleQuestions";
import { QuestionNav } from "../components/QuestionNav";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ExamState {
  currentQuestion: number;
  answers: Record<number, number>;
  timeRemaining: number;
  isSubmitted: boolean;
}

interface ExamPageProps {
  name: string;
  examNumber: string;
}

const ExamPage = ({ name, examNumber }: ExamPageProps) => {
  const EXAM_TIME = 30 * 60;
  const [examState, setExamState] = useState<ExamState>({
    currentQuestion: 0,
    answers: {},
    timeRemaining: EXAM_TIME,
    isSubmitted: false,
  });

  const navigate = useNavigate();

  const currentQuestion = questions[examState.currentQuestion];
  const currentQuestionOptions = currentQuestion.options;

  const handleNext = () => {
    if (examState.currentQuestion < questions.length - 1) {
      setExamState((prevState) => ({
        ...prevState,
        currentQuestion: examState.currentQuestion + 1,
      }));
    }
  };

  const handlePrevious = () => {
    if (examState.currentQuestion > 0) {
      setExamState((prevState) => ({
        ...prevState,
        currentQuestion: examState.currentQuestion - 1,
      }));
    }
  };

  const handleOptionChange = (optionIndex: number) => {
    setExamState((prevState) => ({
      ...prevState,
      answers: {
        ...prevState.answers,
        [prevState.currentQuestion]: optionIndex,
      },
    }));
  };

  const handleSubmit = () => {
    const score = Object.entries(examState.answers).reduce(
      (acc, [questionIndex, answer]) => {
        return (
          acc +
          (questions[Number(questionIndex)].correctAnswer === answer ? 1 : 0)
        );
      },
      0
    );
    navigate("/result", { state: { score } });
  };

  const navigateQuestion = (index: number) => {
    setExamState((prev) => ({
      ...prev,
      currentQuestion: index,
    }));
  };

  const initialTime = 75;
  const [timeRemaining, setTimeRemaining] = useState(initialTime * 60);

  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmit();
    }
    const countDown = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(countDown);
  }, [timeRemaining]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="min-h-screen max-w-md md:max-w-[1400px] w-full mx-auto bg-gray-100 text-gray-800">
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div>
          <img
            src="https://noa.gov.ng/assets/logo-nW5qDcRC.svg"
            alt="NOA Logo"
            className="w-40"
          />
          <h2 className="text-xl font-bold mt-2">
            2025 NOA Promotional Examination
          </h2>
        </div>
        <div className="text-right">
          <p className="font-semibold">
            <span className="font-light">Name: </span>
            {name}
          </p>
          <p className="font-semibold">
            <span className="font-light">Exam Number: </span>
            {examNumber}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <p className="font-bold text-lg bg-red-500 text-white px-4 py-2 rounded-lg">
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </p>
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
            >
              Submit
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-8 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Question {currentQuestion.id}:
          </h3>
          <p className="text-gray-700">{currentQuestion.question}</p>
        </div>
        <div className="mb-6">
          <ul className="space-y-4">
            {currentQuestionOptions.map((option, index) => (
              <li key={index} className="flex items-center">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={index}
                  checked={
                    examState.answers[examState.currentQuestion] === index
                  }
                  onChange={() => handleOptionChange(index)}
                  className="mr-3"
                />
                <label className="text-gray-700">{option}</label>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={examState.currentQuestion === 0}
            className={`px-6 py-2 rounded-lg shadow-md ${
              examState.currentQuestion === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <FaArrowLeft className="mr-2" /> Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={examState.currentQuestion === questions.length - 1}
            className={`px-6 py-2 rounded-lg shadow-md ${
              examState.currentQuestion === questions.length - 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Next <FaArrowRight className="ml-2" />
          </Button>
        </div>
      </main>
      <footer className="mt-8 text-center text-gray-600">
        <QuestionNav
          totalQuestions={questions.length}
          currentQuestion={examState.currentQuestion}
          answers={examState.answers}
          onQuestionSelect={navigateQuestion}
        />
      </footer>
    </div>
  );
};

export default ExamPage;

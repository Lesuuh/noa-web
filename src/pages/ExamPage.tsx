import { useEffect, useState } from "react";
// import { ExamState } from "../types";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { questions } from "../data/sampleQuestions";
import { QuestionNav } from "../components/QuestionNav";
import { Link, useNavigate } from "react-router-dom";

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
    console.log(score);
    navigate("/result", { state: { score } });
  };

  const navigateQuestion = (index: number) => {
    setExamState((prev) => ({
      ...prev,
      currentQuestion: index,
    }));
  };

  const initialTime = 50;
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
    <div>
      <header className="flex">
        <div className="mr-auto">
          <img
            src="https://noa.gov.ng/assets/logo-nW5qDcRC.svg"
            alt=""
            className="text-white w-60"
          />
          <h2 className="text-lg font-bold py-2">
            2025 NOA Promotional Examination
          </h2>
        </div>
        <div>
          <p className="font-semibold">
            <span className="font-thin">Name: </span>
            {name}
          </p>
          <p className="font-semibold">
            <span className="font-thin">Exam Number: </span>
            {examNumber}
          </p>
          <div className="flex gap-4 py-3 items-center">
            <p className="font-bold text-xl bg-red-400 px-3 py-2">
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </p>
            <button
              onClick={() => handleSubmit()}
              className="bg-slate-500 px-6 py-2 rounded-sm text-white font-semibold cursor-pointer"
            >
              <Link to="result">Submit</Link>
            </button>
          </div>
        </div>
      </header>
      <main className="bg-slate-300 px-4 py-4 rounded-sm my-10">
        <div className="bg-slate-100 h-auto  px-4 py-7 my-5 rounded-sm">
          <p>Question {currentQuestion.id}:</p>
          <p>{currentQuestion.question}</p>
        </div>
        <div className="h-auto">
          <ul className="ml-3 my-10">
            {currentQuestionOptions.map((option, index) => (
              <li key={index}>
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={index}
                  checked={
                    examState.answers[examState.currentQuestion] === index
                  }
                  onChange={() => handleOptionChange(index)}
                  className="mr-2 py-2"
                />
                {option}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between ">
          <button
            onClick={() => handlePrevious()}
            disabled={examState.currentQuestion === 0}
            className="px-6 py-2 bg-slate-700 text-white rounded-sm flex items-center justify-between"
          >
            <FaArrowLeft /> <p className="ml-2">Previous</p>
          </button>
          <button
            onClick={() => handleNext()}
            className="px-6 py-2 bg-slate-700 text-white rounded-sm flex items-center justify-between"
          >
            <p className="mr-2">Next</p>
            <FaArrowRight />
          </button>
        </div>
      </main>
      <div className="flex items-center space-x-4">
        {/* totalQuestions, answers, currentQuestion, onQuestionSelect  */}

        <QuestionNav
          totalQuestions={questions.length}
          currentQuestion={examState.currentQuestion}
          answers={examState.answers}
          onQuestionSelect={navigateQuestion}
        />
      </div>
    </div>
  );
};

export default ExamPage;

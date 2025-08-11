import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { questions } from "@/data/sampleQuestions";
import { QuestionNav } from "@/components/QuestionNav";
import { useExamState } from "@/contexts/ExamStateContext";
import { saveTestHistory } from "@/services/saveTestHistory";
import { useAuth } from "@/contexts/AuthContext";
import { UserDetails } from "@/types";
import { fetchUserById } from "@/data/fetchUser";
import Loader from "@/components/Loader";

const ExamPage = () => {
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const refNumber = useRef(
    `NOA/25A/${Math.floor(1000 + Math.random() * 9000)}`
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);
    fetchUserById(user.uid).then((data) => {
      setUserDetails(data);
      setLoading(false);
    });
  }, [user]);

  const shuffleQuestions = () => {
    return questions.sort(() => Math.random() - 0.5);
  };
  const { examState, setExamState } = useExamState();
  const navigate = useNavigate();
  const [shuffledQuestions] = useState(() => shuffleQuestions());
  const currentQuestion = shuffledQuestions[examState.currentQuestion];
  const currentQuestionOptions = currentQuestion.options;

  // Move to next question
  const handleNext = () => {
    if (examState.currentQuestion < questions.length - 1) {
      setExamState((prevState) => ({
        ...prevState,
        currentQuestion: prevState.currentQuestion + 1,
      }));
    }
  };

  // Go to previous question
  const handlePrevious = () => {
    if (examState.currentQuestion > 0) {
      setExamState((prevState) => ({
        ...prevState,
        currentQuestion: prevState.currentQuestion - 1,
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

  const timeUsed = 60 * 60 - examState.timeRemaining;
  const timeUsedInMinutes = timeUsed / 60;

  const handleSubmit = () => {
    let score = 0;
    Object.entries(examState.answers).forEach(
      ([questionIndex, selectedAnswer]) => {
        const correctAnswer = questions[Number(questionIndex)].correctAnswer;
        if (selectedAnswer === correctAnswer) {
          score += 1;
        }
      }
    );
    setExamState((prevState) => ({ ...prevState, score, isSubmitted: true }));
    saveTestHistory(score, timeUsedInMinutes.toFixed(0));
    navigate(`/result`);
  };

  const navigateQuestion = (index: number) => {
    setExamState((prev) => ({
      ...prev,
      currentQuestion: index,
    }));
  };

  useEffect(() => {
    if (examState.timeRemaining <= 0 && !examState.isSubmitted) {
      handleSubmit();
      return;
    }

    const countDown = setInterval(() => {
      setExamState((prevState) => ({
        ...prevState,
        timeRemaining: prevState.timeRemaining - 1,
      }));
    }, 1000);

    return () => clearInterval(countDown);
  }, [examState.timeRemaining, examState.isSubmitted]);

  const minutes = Math.floor(examState.timeRemaining / 60);
  const seconds = examState.timeRemaining % 60;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentQuestion]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 flex flex-col">
      <header className="bg-gray-800 shadow-md h-[70px] px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center sticky top-0 z-10 border-b border-gray-700">
        {/* Left side */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center md:justify-start">
          <img
            src="/public/noa.jpg"
            alt="NOA Logo"
            className="h-8 w-auto sm:h-10"
          />
          <h2 className="text-lg sm:text-xl font-bold text-gray-100 leading-tight">
            2025 NOA Promotional Examination
          </h2>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <p className="font-medium text-xs text-gray-300">
              <span className="font-light">Name: </span>
              {userDetails?.name}
            </p>
            <p className="font-medium text-xs text-gray-300">
              <span className="font-light">Exam Number: </span>
              {refNumber.current}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-semibold shadow-sm">
              <Clock className="w-4 h-4" />
              <span>
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </span>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={examState.isSubmitted}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 text-sm rounded-md shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {examState.isSubmitted ? "Submitted" : "Submit"}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <Card className="bg-gray-800 border border-gray-700 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-100">
              {/* Question {currentQuestion.id}: */}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              {currentQuestion.question}
            </p>
            <RadioGroup
              value={
                examState.answers[examState.currentQuestion]?.toString() || ""
              }
              onValueChange={(value) => handleOptionChange(Number(value))}
              className="space-y-4"
            >
              {currentQuestionOptions.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center p-4 border border-gray-600 rounded-lg hover:bg-gray-700 cursor-pointer transition-all duration-200 ${
                    examState.answers[examState.currentQuestion] === index
                      ? "bg-blue-900/50 border-blue-500"
                      : ""
                  }`}
                  onClick={() => handleOptionChange(index)}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${currentQuestion.id}-${index}`}
                    className="mr-3 text-blue-400"
                  />
                  <Label
                    htmlFor={`option-${currentQuestion.id}-${index}`}
                    className="text-gray-200 text-base cursor-pointer flex-1"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-10">
          <Button
            onClick={handlePrevious}
            disabled={examState.currentQuestion === 0}
            className="px-6 py-2 rounded-lg shadow-md bg-gray-700 text-gray-100 hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={examState.currentQuestion === questions.length - 1}
            className="px-6 py-2 rounded-lg shadow-md bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>

      <footer className="mt-8 py-6 bg-gray-800 border-t border-gray-700 shadow-md">
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

import { useEffect } from "react";
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

interface ExamPageProps {
  name?: string;
  examNumber?: string;
}

const ExamPage = ({
  name = "John Doe",
  examNumber = "NOA/2025/001",
}: ExamPageProps) => {
  const { examState, setExamState } = useExamState();

  const navigate = useNavigate();
  const test = useExamState();
  console.log(test);
  const currentQuestion = questions[examState.currentQuestion];
  const currentQuestionOptions = currentQuestion.options;

  // move to next question
  const handleNext = () => {
    if (examState.currentQuestion < questions.length - 1) {
      setExamState((prevState) => ({
        ...prevState,
        currentQuestion: prevState.currentQuestion + 1,
      }));
    }
  };

  // go to previous question
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
  }, [examState.timeRemaining, examState.isSubmitted]); // Depend on timeRemaining and isSubmitted

  console.log(examState);

  const minutes = Math.floor(examState.timeRemaining / 60);
  const seconds = examState.timeRemaining % 60;
  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto bg-gray-50 text-gray-800 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-6 flex flex-col md:flex-row justify-between items-center sticky top-0 z-10 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <img src="/public/noa.jpg" alt="NOA Logo" className="h-10 w-auto" />
          <h2 className="text-xl font-bold text-gray-900">
            2025 NOA Promotional Examination
          </h2>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="font-medium text-sm text-gray-700">
            <span className="font-light">Name: </span>
            {name}
          </p>
          <p className="font-medium text-sm text-gray-700">
            <span className="font-light">Exam Number: </span>
            {examNumber}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md text-lg font-bold">
              <Clock className="w-5 h-5" />
              <span>
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </span>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={examState.isSubmitted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md transition-colors duration-200"
            >
              {examState.isSubmitted ? "Submitted" : "Submit Exam"}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Question {currentQuestion.id}:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6 text-lg">
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
                  className="flex items-center p-4 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  data-state={
                    examState.answers[examState.currentQuestion] === index
                      ? "checked"
                      : "unchecked"
                  }
                  onClick={() => handleOptionChange(index)}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${currentQuestion.id}-${index}`}
                    className="mr-3"
                  />
                  <Label
                    htmlFor={`option-${currentQuestion.id}-${index}`}
                    className="text-gray-800 text-base cursor-pointer flex-1"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button
            onClick={handlePrevious}
            disabled={examState.currentQuestion === 0}
            className="px-6 py-2 rounded-md shadow-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={examState.currentQuestion === questions.length - 1}
            className="px-6 py-2 rounded-md shadow-md bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>

      <footer className="mt-8 py-6 bg-white border-t border-gray-200 shadow-sm">
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

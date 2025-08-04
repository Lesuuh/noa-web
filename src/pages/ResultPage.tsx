import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useExamState } from "@/contexts/ExamStateContext";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  LayoutDashboard,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ResultPage() {
  const { examState } = useExamState();

  console.log(examState);
  const score = examState.score;
  const totalQuestions = 140;
  const rawScore = Number(score);

  const answeredQuestions = Object.keys(examState.answers).length;
  const incorrectAnswers = answeredQuestions - rawScore;
  const unansweredQuestions = totalQuestions - answeredQuestions;
  const percentageScore = (rawScore / totalQuestions) * 100;

  // Placeholder for testId to link to review page. In a real app, this would be dynamic.
  const dummyTestId = "test-session-1";

  const toDashboard = () => {
    localStorage.removeItem("examState");
    console.log("clear");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4 md:p-6 lg:p-8 items-center justify-center">
      <Card className="w-full max-w-3xl bg-gray-800 border border-gray-700 shadow-lg rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-blue-400">
            Test Results
          </CardTitle>
          <CardDescription className="text-lg mt-2 text-gray-400">
            Here's how you performed on your recent exam.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8">
          {/* Overall Score */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <Progress
                value={percentageScore}
                className="w-full h-full absolute top-0 left-0 bg-gray-700"
                indicatorClassName="bg-blue-500"
              />
              <span className="text-5xl font-extrabold text-blue-400 z-10">
                {Math.round(percentageScore)}%
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-200">
              You scored {rawScore} out of {totalQuestions} questions.
            </p>
          </div>

          {/* Performance Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="text-center p-4 bg-green-900/50 border-green-700">
              <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-green-300">{rawScore}</p>
              <p className="text-sm text-gray-400">Correct</p>
            </Card>
            <Card className="text-center p-4 bg-red-900/50 border-red-700">
              <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-red-300">
                {incorrectAnswers}
              </p>
              <p className="text-sm text-gray-400">Incorrect</p>
            </Card>
            <Card className="text-center p-4 bg-yellow-900/50 border-yellow-700">
              <HelpCircle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-yellow-300">
                {unansweredQuestions}
              </p>
              <p className="text-sm text-gray-400">Unanswered</p>
            </Card>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button
              onClick={() => toDashboard()}
              asChild
              className="py-6 text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transition-all duration-300"
            >
              <Link to={`/dashboard/review/${dummyTestId}`}>
                <BookOpen className="mr-2 h-5 w-5" /> Review Answers
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="py-6 text-lg bg-transparent text-blue-400 border-blue-600 hover:bg-gray-700 hover:text-blue-300 rounded-lg shadow-md transition-all duration-300"
            >
              <Link to="/dashboard" onClick={() => toDashboard()}>
                <LayoutDashboard className="mr-2 h-5 w-5" /> Back to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

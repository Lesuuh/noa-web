"use client";

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
    console.log("claer")
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 items-center justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-blue-600">
            Test Results
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Here's how you performed on your recent exam.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8">
          {/* Overall Score */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <Progress
                value={percentageScore}
                className="w-full h-full absolute top-0 left-0"
                // indicatorClassName="bg-blue-500"
              />
              <span className="text-5xl font-extrabold text-blue-700 z-10">
                {Math.round(percentageScore)}%
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-800">
              You scored {rawScore} out of {totalQuestions} questions.
            </p>
          </div>

          {/* Performance Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="text-center p-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-green-700">{rawScore}</p>
              <p className="text-sm text-gray-600">Correct</p>
            </Card>
            <Card className="text-center p-4 bg-red-50 border-red-200">
              <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-red-700">
                {incorrectAnswers}
              </p>
              <p className="text-sm text-gray-600">Incorrect</p>
            </Card>
            <Card className="text-center p-4 bg-yellow-50 border-yellow-200">
              <HelpCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-yellow-700">
                {unansweredQuestions}
              </p>
              <p className="text-sm text-gray-600">Unanswered</p>
            </Card>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Button
              onClick={() => toDashboard()}
              asChild
              className="py-6 text-lg"
            >
              <Link to={`/dashboard/review/${dummyTestId}`}>
                <BookOpen className="mr-2 h-5 w-5" /> Review Answers
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="py-6 text-lg bg-transparent"
            >
              <Link to="/dashboard">
                <LayoutDashboard className="mr-2 h-5 w-5" /> Back to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

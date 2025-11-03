import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Question } from "@/types";
import { useNavigate } from "react-router-dom";

interface ExamResultProps {
  allQuestions: Question[];
  score: number;
  totalQuestions: number;
}

export default function ExamResult({
  allQuestions,
  score,
  totalQuestions,
}: ExamResultProps) {
  const navigate = useNavigate();
  const scorePercentage = Math.round((score / totalQuestions) * 100);
  const incorrect = allQuestions.length - score;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-white border border-gray-200 shadow-lg">
        <CardContent className="py-10 px-8 text-center space-y-8">
          {/* Header */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Exam Complete!
          </h2>
          <p className="text-gray-500 text-base mb-4">
            You scored{" "}
            <span className="text-cyan-500 font-semibold">{score}</span> out of{" "}
            <span className="text-cyan-500 font-semibold">
              {allQuestions.length}
            </span>{" "}
            questions
          </p>

          {/* Progress Bar */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-500">
              {scorePercentage}%
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
              <p className="text-xs text-gray-500 mb-1">Correct</p>
              <p className="text-2xl font-bold text-cyan-500">{score}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-xs text-gray-500 mb-1">Incorrect</p>
              <p className="text-2xl font-bold text-red-500">{incorrect}</p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/")}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition-colors text-base"
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

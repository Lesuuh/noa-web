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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/80 border-slate-800 backdrop-blur-sm">
        <CardContent className="pt-12 pb-12 text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(34,211,238,0.1)"
                  strokeWidth="2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgb(34,211,238)"
                  strokeWidth="2"
                  strokeDasharray={`${(scorePercentage / 100) * 282.7} 282.7`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-cyan-400">
                  {scorePercentage}%
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Exam Complete!
            </h2>
            <p className="text-slate-400">
              You scored{" "}
              <span className="text-cyan-400 font-semibold">{score}</span> out
              of{" "}
              <span className="text-cyan-400 font-semibold">
                {allQuestions.length}
              </span>{" "}
              questions
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Correct</p>
              <p className="text-2xl font-bold text-emerald-400">{score}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Incorrect</p>
              <p className="text-2xl font-bold text-red-400">
                {allQuestions.length - score}
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Go home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

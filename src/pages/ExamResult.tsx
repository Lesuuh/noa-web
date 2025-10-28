import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ExamResultProps {
  score: number;
  totalQuestions: number;
  onRetake: () => void;
}

export default function ExamResult({
  score,
  totalQuestions,
  onRetake,
}: ExamResultProps) {
  const scorePercentage = Math.round((score / totalQuestions) * 100);
  const incorrect = totalQuestions - score;

  const getBadgeColor = () => {
    if (scorePercentage >= 90) return "text-emerald-500";
    if (scorePercentage >= 75) return "text-blue-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <Card className="w-full max-w-lg bg-slate-900/80 border-slate-800 backdrop-blur-sm shadow-lg">
        <CardContent className="text-center space-y-6 py-12 px-6 sm:px-12">
          {/* Trophy / Header */}
          <div className="flex flex-col items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 21h6M12 17v4m-4-8a4 4 0 104 4H8a4 4 0 10-4-4h4z"
              />
            </svg>
            <h2 className="text-3xl font-bold text-white">Exam Complete!</h2>
            <p className="text-slate-400">
              You scored{" "}
              <span className="font-semibold text-cyan-400">{score}</span> out
              of{" "}
              <span className="font-semibold text-cyan-400">
                {totalQuestions}
              </span>{" "}
              questions
            </p>
          </div>

          {/* Score Circles */}
          <div className="flex justify-center gap-6 mt-6">
            {/* Correct */}
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="mt-2 text-white font-bold">{score}</span>
              <span className="text-xs text-slate-400">Correct</span>
            </div>

            {/* Incorrect */}
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="mt-2 text-white font-bold">{incorrect}</span>
              <span className="text-xs text-slate-400">Incorrect</span>
            </div>

            {/* Score % */}
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-12 h-12 ${getBadgeColor()}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="mt-2 text-white font-bold">
                {scorePercentage}%
              </span>
              <span className="text-xs text-slate-400">Score %</span>
            </div>
          </div>

          {/* Retake Button */}
          <Button
            onClick={onRetake}
            className="mt-8 w-full bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v6h6M20 20v-6h-6"
              />
            </svg>
            Retake Exam
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

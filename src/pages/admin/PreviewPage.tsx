import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  Home,
  Eye,
  EyeOff,
} from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "Who was Nigeria's first Prime Minister?",
    options: [
      "Nnamdi Azikiwe",
      "Tafawa Balewa",
      "Obafemi Awolowo",
      "Ahmadu Bello",
    ],
    correctAnswer: "Tafawa Balewa",
  },
  {
    id: 2,
    question: "What is the capital of Rivers State?",
    options: ["Aba", "Uyo", "Port Harcourt", "Yenagoa"],
    correctAnswer: "Port Harcourt",
  },
  {
    id: 3,
    question: "In what year did Nigeria gain independence?",
    options: ["1958", "1960", "1963", "1970"],
    correctAnswer: "1960",
  },
  {
    id: 4,
    question: "What does the green color in the Nigerian flag represent?",
    options: ["Peace", "Agriculture", "Unity", "Progress"],
    correctAnswer: "Agriculture",
  },
];

export default function AdminPreviewPage() {
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(true);
  const question = sampleQuestions[current];

  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Question Preview
              </h1>
              <p className="text-gray-600">
                Review and verify quiz questions before publishing
              </p>
            </div>
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
            >
              {showAnswer ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Hide Answer
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Show Answer
                </>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-500 ease-out"
                style={{
                  width: `${((current + 1) / sampleQuestions.length) * 100}%`,
                }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 min-w-[80px] text-right">
              {current + 1} / {sampleQuestions.length}
            </span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          {/* Question Header */}
          <div className="bg-gradient-to-r px-8 text-gray-90">
            <div className="flex items-start gap-4">
              <div className=" bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-gray-700 font-bold text-lg bg-gray-200 rounded-full w-8 flex items-center justify-center h-8">
                  {current + 1}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-meduim leading-relaxed">
                  {question.question}
                </h2>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="p-6">
            <div className="space-y-4">
              {question.options.map((opt, index) => {
                const isCorrect = opt === question.correctAnswer;
                return (
                  <div
                    key={index}
                    className={`group relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${
                      showAnswer && isCorrect
                        ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg shadow-green-500/20"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    {/* Option Label */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${
                        showAnswer && isCorrect
                          ? "bg-green-500 text-white"
                          : "bg-white border-2 border-gray-300 text-gray-700 group-hover:border-gray-400"
                      }`}
                    >
                      {getOptionLabel(index)}
                    </div>

                    {/* Option Text */}
                    <span
                      className={`flex-1 font-medium ${
                        showAnswer && isCorrect
                          ? "text-green-900"
                          : "text-gray-800"
                      }`}
                    >
                      {opt}
                    </span>

                    {/* Correct Badge */}
                    {showAnswer && isCorrect && (
                      <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-md">
                        <CheckCircle2 className="w-4 h-4" />
                        Correct
                      </div>
                    )}

                    {/* Subtle Icon for Non-Correct */}
                    {showAnswer && !isCorrect && (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
            disabled={current === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              current === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {/* Question Dots */}
          <div className="flex items-center gap-2">
            {sampleQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`transition-all rounded-full ${
                  index === current
                    ? "w-10 h-3 bg-gradient-to-r from-blue-600 to-indigo-600"
                    : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() =>
              setCurrent((prev) =>
                Math.min(prev + 1, sampleQuestions.length - 1)
              )
            }
            disabled={current === sampleQuestions.length - 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              current === sampleQuestions.length - 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30"
            }`}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl font-medium">
            <Home className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

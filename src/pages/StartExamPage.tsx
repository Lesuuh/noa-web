import { useState } from "react";
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  Menu,
  X,
  Award,
  BarChart3,
} from "lucide-react";

// Mock data - replace with actual data from your backend
const mockAttemptData = {
  id: "attempt_123",
  score: 85,
  totalQuestions: 50,
  correctAnswers: 42,
  duration: 1800, // in seconds
  startedAt: "2025-10-29T10:30:00",
  completedAt: "2025-10-29T11:00:00",
  userName: "John Doe",
};

const mockQuestions = Array.from({ length: 50 }, (_, i) => ({
  id: `q_${i + 1}`,
  questionNumber: i + 1,
  question: `This is question ${
    i + 1
  }. What is the correct answer to this NOA professional excellence assessment question?`,
  options: [
    "Option A - First possible answer",
    "Option B - Second possible answer",
    "Option C - Third possible answer",
    "Option D - Fourth possible answer",
  ],
  correctAnswer: Math.floor(Math.random() * 4),
  userAnswer: Math.random() > 0.15 ? Math.floor(Math.random() * 4) : null,
  category: ["General Knowledge", "Policy", "Procedures", "Ethics"][
    Math.floor(Math.random() * 4)
  ],
}));

export default function ExamReview() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // all, correct, incorrect, unanswered
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  const attempt = mockAttemptData;
  const questions = mockQuestions;

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    if (filterStatus === "correct") return q.userAnswer === q.correctAnswer;
    if (filterStatus === "incorrect")
      return q.userAnswer !== q.correctAnswer && q.userAnswer !== null;
    if (filterStatus === "unanswered") return q.userAnswer === null;
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const paginatedQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  // Statistics
  const incorrectAnswers = questions.filter(
    (q) => q.userAnswer !== q.correctAnswer && q.userAnswer !== null
  ).length;
  const unansweredQuestions = questions.filter(
    (q) => q.userAnswer === null
  ).length;
  const accuracy = (
    (attempt.correctAnswers / attempt.totalQuestions) *
    100
  ).toFixed(1);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-white border-r border-slate-200 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded flex items-center justify-center text-white font-bold text-sm drop-shadow-md">
              NOA
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900">NOA CBT</h1>
              <p className="text-[10px] text-slate-500">Review Results</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors md:hidden"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* Summary Stats in Sidebar */}
        <div className="p-4 space-y-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-slate-600">
                Correct
              </span>
            </div>
            <p className="text-2xl font-bold text-emerald-700">
              {attempt.correctAnswers}
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-slate-600">
                Incorrect
              </span>
            </div>
            <p className="text-2xl font-bold text-red-700">
              {incorrectAnswers}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-medium text-slate-600">
                Unanswered
              </span>
            </div>
            <p className="text-2xl font-bold text-amber-700">
              {unansweredQuestions}
            </p>
          </div>

          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-cyan-600" />
              <span className="text-xs font-medium text-slate-600">
                Accuracy
              </span>
            </div>
            <p className="text-2xl font-bold text-cyan-700">{accuracy}%</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="p-4 border-t border-slate-200">
          <p className="text-xs font-medium text-slate-500 mb-2 uppercase">
            Filter Questions
          </p>
          <div className="space-y-1">
            {[
              { value: "all", label: "All Questions", count: questions.length },
              {
                value: "correct",
                label: "Correct",
                count: attempt.correctAnswers,
              },
              {
                value: "incorrect",
                label: "Incorrect",
                count: incorrectAnswers,
              },
              {
                value: "unanswered",
                label: "Unanswered",
                count: unansweredQuestions,
              },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setFilterStatus(filter.value);
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === filter.value
                    ? "bg-emerald-100 text-emerald-700"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <span>{filter.label}</span>
                <span className="float-right text-xs text-slate-500">
                  ({filter.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 right-4 md:hidden z-50 p-2 rounded-lg bg-slate-800/80 backdrop-blur-sm border border-emerald-900/30 hover:bg-slate-700 transition-colors"
      >
        <Menu className="w-5 h-5 text-emerald-400" />
      </button>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 space-y-6 overflow-auto ml-0 md:ml-64">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </a>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Exam Review</h2>
              <p className="text-slate-500 text-sm mt-1">
                Completed on{" "}
                {new Date(attempt.completedAt).toLocaleDateString()} at{" "}
                {new Date(attempt.completedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span className="text-2xl font-bold text-slate-900">
              {attempt.score}%
            </span>
          </div>
        </div>

        {/* Score Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">
                  Total Score
                </p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">
                  {attempt.score}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">
                  Questions
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {attempt.correctAnswers}/{attempt.totalQuestions}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-slate-600" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">
                  Duration
                </p>
                <p className="text-3xl font-bold text-cyan-700 mt-1">
                  {Math.floor(attempt.duration / 60)}m
                </p>
              </div>
              <Clock className="w-8 h-8 text-cyan-700" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">
                  Accuracy
                </p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">
                  {accuracy}%
                </p>
              </div>
              <Target className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-slate-800">
              {filterStatus === "all"
                ? "All Questions"
                : filterStatus === "correct"
                ? "Correct Answers"
                : filterStatus === "incorrect"
                ? "Incorrect Answers"
                : "Unanswered Questions"}
            </h3>
            <span className="text-sm text-slate-500">
              Showing {startIndex + 1}-
              {Math.min(
                startIndex + questionsPerPage,
                filteredQuestions.length
              )}{" "}
              of {filteredQuestions.length}
            </span>
          </div>

          <div className="space-y-4">
            {paginatedQuestions.map((q) => {
              const isCorrect = q.userAnswer === q.correctAnswer;
              const isUnanswered = q.userAnswer === null;

              return (
                <div
                  key={q.id}
                  className={`border-2 rounded-lg p-4 transition-all cursor-pointer hover:shadow-md ${
                    isUnanswered
                      ? "border-amber-200 bg-amber-50"
                      : isCorrect
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-red-200 bg-red-50"
                  }`}
                  onClick={() =>
                    setSelectedQuestion(selectedQuestion === q.id ? null : q.id)
                  }
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        isUnanswered
                          ? "bg-amber-200 text-amber-700"
                          : isCorrect
                          ? "bg-emerald-200 text-emerald-700"
                          : "bg-red-200 text-red-700"
                      }`}
                    >
                      {q.questionNumber}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-medium text-slate-800">
                          {q.question}
                        </p>
                        <div className="flex-shrink-0">
                          {isUnanswered ? (
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                          ) : isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      </div>

                      <span className="inline-block px-2 py-1 text-xs font-medium bg-white rounded-full text-slate-600 border border-slate-200">
                        {q.category}
                      </span>

                      {selectedQuestion === q.id && (
                        <div className="mt-4 space-y-2">
                          {q.options.map((option, idx) => {
                            const isUserAnswer = idx === q.userAnswer;
                            const isCorrectAnswer = idx === q.correctAnswer;

                            return (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg border-2 ${
                                  isCorrectAnswer
                                    ? "border-emerald-500 bg-emerald-100"
                                    : isUserAnswer
                                    ? "border-red-500 bg-red-100"
                                    : "border-slate-200 bg-white"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {isCorrectAnswer && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                  )}
                                  <span
                                    className={`text-sm ${
                                      isCorrectAnswer
                                        ? "font-semibold text-emerald-800"
                                        : isUserAnswer
                                        ? "font-semibold text-red-800"
                                        : "text-slate-700"
                                    }`}
                                  >
                                    {option}
                                  </span>
                                </div>
                              </div>
                            );
                          })}

                          {isUnanswered && (
                            <p className="text-sm text-amber-700 font-medium mt-2">
                              ⚠️ You did not answer this question
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/dashboard"
            className="flex-1 py-3 px-6 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-lg text-center"
          >
            Back to Dashboard
          </a>
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 px-6 rounded-xl bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 transition-colors shadow-inner"
          >
            Print Results
          </button>
        </div>
      </main>
    </div>
  );
}

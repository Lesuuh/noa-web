import { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchQuestions } from "@/data/fetchQuestions";
import { ExamAttempt, Question } from "@/types";
import ExamResult from "./ExamResult";
import { TimerDisplay } from "@/components/TimerDisplay";
import { supabase } from "@/supabase";
import { useUser } from "@/contexts/UserContext";
import ErrorModal from "@/components/modals/ErrorModal";
import Loader from "@/components/Loader";
import { checkAttemptAllowance, fetchTestDuration } from "@/data/fetchUserData";

export default function ExamPage() {
  const { user, loading } = useUser();

  // -----------------------------
  // State
  // -----------------------------
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(10800);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [jumpInput, setJumpInput] = useState("");
  const [showNavigator, setShowNavigator] = useState(false);
  const [error, setError] = useState<string>("");
  const [examAttempt, setExamAttempt] = useState<ExamAttempt | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const startedAt = useRef(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const answeredCount = Object.keys(answers).length;
  const question = allQuestions[currentQuestion];
  const isTimeWarning = timeRemaining < 60;

  // -----------------------------
  // Restore saved progress from localStorage
  // -----------------------------
  useEffect(() => {
    const savedAnswers = localStorage.getItem("exam_answers");
    const savedTimeRemaining = localStorage.getItem("time_remaining");
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedTimeRemaining) setTimeRemaining(Number(savedTimeRemaining));
  }, []);

  // -----------------------------
  // Autosave progress to localStorage every 30s
  // -----------------------------
  useEffect(() => {
    const autosave = setInterval(() => {
      localStorage.setItem("exam_answers", JSON.stringify(answers));
      localStorage.setItem("time_remaining", String(timeRemaining));
    }, 30000);

    return () => clearInterval(autosave);
  }, [answers, timeRemaining]);

  // -----------------------------
  // Sync answers to Supabase every 60s
  // -----------------------------
  useEffect(() => {
    if (!examAttempt?.id) return;

    const syncInterval = setInterval(async () => {
      try {
        await supabase.from("exam_attempts").update({
          answers,
          duration_seconds: 10800 - timeRemaining,
        });
      } catch (err) {
        console.error("Failed to sync", err);
      }
    }, 60000);

    return () => clearInterval(syncInterval);
  }, [answers, timeRemaining, examAttempt?.id]);

  // -----------------------------
  // Warn user before accidental refresh/close
  // -----------------------------
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSubmitted) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isSubmitted]);

  // -----------------------------
  // Load exam questions and duration
  // -----------------------------
  useEffect(() => {
    if (!user?.id) return;

    const initExam = async () => {
      try {
        // Check if user is allowed
        const { allowed, message } = await checkAttemptAllowance(user.id);
        if (!allowed) {
          setError(message || "You’ve exceeded your free attempts.");
          return;
        }

        // Fetch test duration
        const { testDuration } = await fetchTestDuration();
        const durationSeconds = testDuration[0]?.duration_seconds ?? 10800;
        setTimeRemaining(durationSeconds);

        // Fetch questions
        const questions = await fetchQuestions();
        if (!questions.length) {
          setError("No questions available for this exam.");
          return;
        }
        setAllQuestions(questions);
      } catch (err) {
        console.error("Exam init failed", err);
        setError("Could not start exam. Please retry.");
      }
    };

    initExam();
  }, [user?.id]);

  // -----------------------------
  // Create exam attempt in Supabase
  // -----------------------------
  useEffect(() => {
    if (!user?.id || allQuestions.length === 0) return;

    const createAttempt = async () => {
      try {
        const { data, error } = await supabase
          .from("exam_attempts")
          .insert({
            user_id: user.id,
            exam_id: allQuestions[0].exam_id,
            started_at: startedAt.current,
            status: "in_progress",
            question_order: allQuestions.map((q) => q.id),
          })
          .select()
          .single();

        if (error) throw error;
        setExamAttempt(data);
      } catch (err) {
        console.error("Failed to create attempt", err);
      }
    };

    createAttempt();
  }, [user?.id, allQuestions]);

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleOptionChange = (optionIndex: number) => {
    const currentQuestionId = allQuestions[currentQuestion].id;
    setAnswers((prev) => ({ ...prev, [currentQuestionId]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < allQuestions.length - 1)
      setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleJumpToQuestion = () => {
    const questionNum = Number.parseInt(jumpInput);
    if (questionNum > 0 && questionNum <= allQuestions.length) {
      setCurrentQuestion(questionNum - 1);
      setJumpInput("");
      setShowNavigator(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    if (!user?.id) {
      setError("You must be logged in to submit this exam.");
      return;
    }

    let totalScore = 0;
    allQuestions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) totalScore++;
    });
    setScore(totalScore);

    const submitted_at = new Date();
    try {
      setSubmitting(true);
      const { data, error } = await supabase
        .from("exam_attempts")
        .update({
          score: totalScore,
          answers,
          submitted_at,
          duration_seconds: Math.floor(
            (submitted_at.getTime() - startedAt.current.getTime()) / 1000
          ),
          status: "completed",
        })
        .eq("id", examAttempt?.id)
        .select()
        .single();

      if (error) setError(error.message);

      setExamAttempt(data ?? undefined);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unexpected error occurred";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }, [submitting, user?.id, allQuestions, answers, examAttempt?.id]);

  // -----------------------------
  // Timer countdown
  // -----------------------------

  useEffect(() => {
    if (isSubmitted || !examAttempt) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [handleSubmit, isSubmitted, examAttempt]);

  // -----------------------------
  // Render loading / submitted / main UI
  // -----------------------------
  if (allQuestions.length === 0)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (loading) return <Loader />;
  if (isSubmitted)
    return (
      <ExamResult
        allQuestions={allQuestions}
        score={score}
        totalQuestions={allQuestions.length}
      />
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Left: Exam Info */}
            <div className="w-full sm:w-auto flex-1 text-center sm:text-left">
              <h1 className="text-base sm:text-xl font-bold text-white truncate">
                2025 Promotional Exam
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Question {currentQuestion + 1} of {allQuestions.length}
              </p>
            </div>

            {/* Center: Progress Bar (hidden on very small screens) */}
            <div className="hidden xs:flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 rounded-lg">
              <div className="w-24 sm:w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestion + 1) / allQuestions.length) * 100
                    }%`,
                  }}
                />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-slate-300 whitespace-nowrap">
                {answeredCount}/{allQuestions.length}
              </span>
            </div>

            {/* Right: Timer + Submit */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-sm sm:text-base transition-colors ${
                  isTimeWarning
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-slate-800/50 text-slate-200 border border-slate-700/50"
                }`}
              >
                <Clock className="w-4 h-4 flex-shrink-0" />
                <TimerDisplay time={timeRemaining} />
              </div>

              <Button
                onClick={handleSubmit}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-200"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className=" xs:inline">Submit</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Question Card */}
        <Card className="bg-slate-900/60 border-slate-700/50 backdrop-blur-sm mb-8 overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {/* Question Text */}
            <div className="mb-8">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {currentQuestion + 1}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed flex-1">
                  {question.question}
                </h2>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const isSelected = answers[question.id] === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionChange(idx)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                        : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected
                            ? "bg-cyan-500 border-cyan-500"
                            : "border-slate-600 group-hover:border-slate-500"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span
                        className={`font-medium ${
                          isSelected ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="w-full sm:w-auto px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
            <span>
              {answeredCount} of {allQuestions.length} answered
            </span>
          </div>

          {currentQuestion === allQuestions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-8 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Exam</span>
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">
              Question Navigator
            </h3>
            <button
              onClick={() => setShowNavigator(!showNavigator)}
              className="text-xs px-3 py-1 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded transition-colors"
            >
              {showNavigator ? "Hide" : "Show"}
            </button>
          </div>

          {/* Jump to Question Input */}
          <div className="mb-4 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="number"
                min="1"
                max={allQuestions.length}
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleJumpToQuestion()}
                placeholder={`Jump to question (1-${allQuestions.length})`}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800 transition-colors text-sm"
              />
            </div>
            <Button
              onClick={handleJumpToQuestion}
              className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 rounded-lg font-medium transition-colors text-sm"
            >
              Go
            </Button>
          </div>

          {/* Question Grid - Scrollable for large sets */}
          {showNavigator && (
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 overflow-x-auto">
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
                  minWidth: "min-content",
                }}
              >
                {allQuestions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentQuestion(idx);
                      setShowNavigator(false);
                    }}
                    title={`Question ${idx + 1}`}
                    className={`w-10 h-10 rounded-lg font-semibold text-xs transition-all duration-200 flex items-center justify-center ${
                      idx === currentQuestion
                        ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20"
                        : answers[allQuestions[idx].id] !== undefined
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                        : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-1">Answered</p>
              <p className="text-lg font-bold text-cyan-400">{answeredCount}</p>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-1">Remaining</p>
              <p className="text-lg font-bold text-amber-400">
                {allQuestions.length - answeredCount}
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-1">Progress</p>
              <p className="text-lg font-bold text-emerald-400">
                {Math.round((answeredCount / allQuestions.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* error modal */}
      {error && <ErrorModal message={error} onClose={() => setError("")} />}
    </div>
  );
}

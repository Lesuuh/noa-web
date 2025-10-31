import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Clock, CheckCircle2 } from "lucide-react";
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
  // const [jumpInput, setJumpInput] = useState("");
  const [showNavigator, setShowNavigator] = useState(false);
  const [error, setError] = useState<string>("");
  const [examAttempt, setExamAttempt] = useState<ExamAttempt | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [loadingExam, setLoadingExam] = useState(true); // Add this

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

  // Clear localStorage after successful submission
  useEffect(() => {
    if (isSubmitted) {
      localStorage.removeItem("exam_answers");
      localStorage.removeItem("time_remaining");
    }
  }, [isSubmitted]);

  // -----------------------------
  // Load exam questions and duration
  // -----------------------------

  // Update the initExam function:
  useEffect(() => {
    if (!user?.id) return;

    const initExam = async () => {
      setLoadingExam(true); // Start loading
      try {
        // Check if user is allowed
        const { allowed, message, attempts } = await checkAttemptAllowance(
          user.id
        );

        if (!allowed) {
          setError(message || "You've exceeded your free attempts.");
          setLoadingExam(false); // Stop loading even if blocked
          return;
        }

        setAttemptCount(attempts || 0);

        // Fetch test duration
        const { testDuration } = await fetchTestDuration();
        const durationSeconds = testDuration[0]?.duration_seconds ?? 10800;
        setTimeRemaining(durationSeconds);

        // Fetch questions
        const questions = await fetchQuestions();
        if (!questions.length) {
          setError("No questions available for this exam.");
          setLoadingExam(false);
          return;
        }
        setAllQuestions(questions);
        setLoadingExam(false); // Stop loading after success
      } catch (err) {
        console.error("Exam init failed", err);
        setError("Could not start exam. Please retry.");
        setLoadingExam(false); // Stop loading on error
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

  // const handleJumpToQuestion = () => {
  //   const questionNum = Number.parseInt(jumpInput);
  //   if (questionNum > 0 && questionNum <= allQuestions.length) {
  //     setCurrentQuestion(questionNum - 1);
  //     setJumpInput("");
  //     setShowNavigator(false);
  //   }
  // };

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

  if (loading || loadingExam) return <Loader />;

  // Show error modal if blocked (before checking allQuestions)
  if (error && allQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex items-center justify-center p-4">
        <ErrorModal
          message={error}
          onClose={() => (window.location.href = "/")}
        />
      </div>
    );
  }
  // -----------------------------
  if (allQuestions.length === 0)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (isSubmitted)
    return (
      <ExamResult
        allQuestions={allQuestions}
        score={score}
        totalQuestions={allQuestions.length}
      />
    );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Exam Info */}
          <div className="w-full sm:w-auto flex-1 text-center sm:text-left">
            <h1 className="text-base sm:text-xl font-bold truncate">
              2025 Promotional Exam
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Question {currentQuestion + 1} of {allQuestions.length}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Attempt {attemptCount} of 10
            </p>
          </div>

          {/* Progress Bar */}
          <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 rounded-lg">
            <div className="w-24 sm:w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestion + 1) / allQuestions.length) * 100
                  }%`,
                }}
              />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-500">
              {answeredCount}/{allQuestions.length}
            </span>
          </div>

          {/* Timer & Submit */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-sm sm:text-base transition-colors ${
                isTimeWarning
                  ? "bg-red-100 text-red-500 border border-red-200"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              <Clock className="w-4 h-4 flex-shrink-0" />
              <TimerDisplay time={timeRemaining} />
            </div>

            <Button
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-200"
              onClick={handleSubmit}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Question Card */}
        <Card className="bg-white border border-gray-200 shadow-sm mb-8 overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {/* Question Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                <span className="text-cyan-600 font-bold text-sm">
                  {currentQuestion + 1}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-relaxed flex-1">
                {question.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const isSelected = answers[question.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionChange(idx)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? "bg-cyan-50 border-cyan-400 shadow-sm"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected
                            ? "bg-cyan-400 border-cyan-400"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span
                        className={`font-medium ${
                          isSelected ? "text-gray-900" : "text-gray-700"
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="w-full sm:w-auto px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>

          {currentQuestion === allQuestions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-8 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Submit Exam
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-2 bg-cyan-400 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Navigator & Stats */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500">
              Question Navigator
            </h3>
            <button
              onClick={() => setShowNavigator(!showNavigator)}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors"
            >
              {showNavigator ? "Hide" : "Show"}
            </button>
          </div>

          {showNavigator && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-x-auto">
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
                        ? "bg-cyan-400 text-white shadow-sm"
                        : answers[allQuestions[idx].id] !== undefined
                        ? "bg-emerald-100 text-emerald-600 border border-emerald-200 hover:bg-emerald-200"
                        : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
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
            <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Answered</p>
              <p className="text-lg font-bold text-cyan-500">{answeredCount}</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Remaining</p>
              <p className="text-lg font-bold text-amber-500">
                {allQuestions.length - answeredCount}
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Progress</p>
              <p className="text-lg font-bold text-emerald-500">
                {Math.round((answeredCount / allQuestions.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </main>

      {error && <ErrorModal message={error} onClose={() => setError("")} />}
    </div>
  );
}

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { ExamAttempt } from "@/types";
import ExamResult from "./ExamResult";
import { TimerDisplay } from "@/components/TimerDisplay";
import { supabase } from "@/supabase";
import { useUser } from "@/contexts/UserContext";
import Loader from "@/components/Loader";
import {
  checkAttemptAllowance,
  fetchQuestions,
  fetchTestDuration,
  syncExam,
} from "@/api/api";
import UpgradeModal from "@/components/modals/UpgradeModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function ExamPage() {
  const { user, loading } = useUser();
  const queryClient = useQueryClient();

  // State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(10800);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showNavigator, setShowNavigator] = useState(false);
  const [error, setError] = useState<string>("");
  const [examAttempt, setExamAttempt] = useState<ExamAttempt | undefined>();

  const startedAt = useRef(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Use refs for latest values in timer
  const latestAnswers = useRef(answers);
  const latestQuestions = useRef<typeof allQuestions>([]);
  const latestExamAttempt = useRef(examAttempt);

  // Queries
  const { data: attemptCount, isLoading: loadingAttemptCount } = useQuery({
    queryKey: ["attemptCount", user?.id],
    queryFn: () => checkAttemptAllowance(user?.id as string),
    enabled: !!user?.id,
  });

  const { data: duration, isLoading: loadingDuration } = useQuery({
    queryKey: ["duration"],
    queryFn: fetchTestDuration,
    enabled: !!attemptCount?.allowed,
  });

  const { data: allQuestions = [], isLoading: loadingQuestions } = useQuery({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
    enabled: !!attemptCount?.allowed,
  });

  // ✅ Update duration when fetched
  useEffect(() => {
    if (duration?.testDuration?.[0]?.duration_seconds) {
      const durationSeconds = duration.testDuration[0].duration_seconds;
      setTimeRemaining(durationSeconds);
    }
  }, [duration]);

  // ✅ Keep refs updated
  useEffect(() => {
    latestAnswers.current = answers;
  }, [answers]);

  useEffect(() => {
    latestQuestions.current = allQuestions;
  }, [allQuestions]);

  useEffect(() => {
    latestExamAttempt.current = examAttempt;
  }, [examAttempt]);

  const answeredCount = Object.keys(answers).length;
  const question = allQuestions[currentQuestion];
  const isTimeWarning = timeRemaining < 60;

  // Restore saved progress
  useEffect(() => {
    const savedAnswers = localStorage.getItem("exam_answers");
    const savedTimeRemaining = localStorage.getItem("time_remaining");
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedTimeRemaining) setTimeRemaining(Number(savedTimeRemaining));
  }, []);

  // Autosave to localStorage
  useEffect(() => {
    const autosave = setInterval(() => {
      localStorage.setItem("exam_answers", JSON.stringify(answers));
      localStorage.setItem("time_remaining", String(timeRemaining));
    }, 30000);
    return () => clearInterval(autosave);
  }, [answers, timeRemaining]);

  // Sync mutation
  const mutation = useMutation({
    mutationFn: ({
      attemptId,
      answers,
      timeRemaining,
    }: {
      attemptId: string;
      answers: Record<string, number>;
      timeRemaining: number;
    }) => syncExam(attemptId, answers, timeRemaining),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examAttempts", user?.id] });
    },
    onError: (error) => {
      console.error("Sync failed:", error.message);
    },
  });

  // ✅ Sync to Supabase (Fixed - removed mutation from deps)
  useEffect(() => {
    if (!examAttempt?.id) return;

    const sync = () => {
      mutation.mutate({
        attemptId: examAttempt.id,
        answers: latestAnswers.current,
        timeRemaining,
      });
    };

    sync(); // Initial sync
    const interval = setInterval(sync, 60000);
    return () => clearInterval(interval);
  }, [examAttempt?.id, timeRemaining]); // ✅ Removed mutation

  // Warn before unload
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

  // Clear localStorage after submission
  useEffect(() => {
    if (isSubmitted) {
      localStorage.removeItem("exam_answers");
      localStorage.removeItem("time_remaining");
    }
  }, [isSubmitted]);

  // Create exam attempt
  useEffect(() => {
    if (!user?.id || allQuestions.length === 0 || examAttempt) return;

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
  }, [user?.id, allQuestions, examAttempt]);

  // Handlers
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

  // ✅ Submit function using refs (doesn't need to be in deps)
  const submitExam = useCallback(async () => {
    if (!user?.id || !latestExamAttempt.current?.id) {
      setError("You must be logged in to submit this exam.");
      return;
    }

    let totalScore = 0;
    const questionsToCheck = latestQuestions.current;
    const answersToCheck = latestAnswers.current;

    questionsToCheck.forEach((q) => {
      if (answersToCheck[q.id] === q.correct_answer) totalScore++;
    });

    setScore(totalScore);

    const submitted_at = new Date();
    try {
      const { data, error } = await supabase
        .from("exam_attempts")
        .update({
          score: totalScore,
          answers: answersToCheck,
          submitted_at,
          duration_seconds: Math.floor(
            (submitted_at.getTime() - startedAt.current.getTime()) / 1000
          ),
          status: "completed",
        })
        .eq("id", latestExamAttempt.current.id)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return;
      }

      setExamAttempt(data ?? undefined);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unexpected error occurred";
      setError(message);
    }
  }, [user?.id]); // ✅ Minimal dependencies

  // ✅ Timer countdown (Fixed - stable submitExam)
  useEffect(() => {
    if (isSubmitted || !examAttempt) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          submitExam(); // ✅ Now stable, won't be stale
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSubmitted, examAttempt, submitExam]); // ✅ submitExam is now stable

  // Render
  const isLoadingExam =
    loading || loadingAttemptCount || loadingDuration || loadingQuestions;

  if (isLoadingExam) return <Loader />;

  // ✅ THEN check if not allowed (after loading is done)
  if (attemptCount?.allowed === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <UpgradeModal
          message={attemptCount.message || "You've reached your exam limit"}
          // ✅ Use message from attemptCount, not error state
          onClose={() => (window.location.href = "/")}
        />
      </div>
    );
  }

  // ✅ Check if questions are available
  if (!allQuestions?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-600">No questions available.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

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
              Attempt {attemptCount?.attempts} of 10
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
              onClick={submitExam}
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
              onClick={submitExam}
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
    </div>
  );
}

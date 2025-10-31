import { useEffect, useState } from "react";
import { ChevronLeft, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/supabase";
import { useUser } from "@/contexts/UserContext";
import { ExamAttempt, Question } from "@/types";
import { useParams } from "react-router-dom";
import { formatAttemptTime } from "@/components/formattedDateTime";
import Loader from "@/components/Loader";

export default function ExamReview() {
  const [filterStatus, setFilterStatus] = useState<
    "correct" | "incorrect" | "unanswered"
  >("correct");
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  const { user } = useUser();
  const { id } = useParams();

  const [attempts, setAttempts] = useState<ExamAttempt | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const answeredQuestions = Object.keys(attempts?.answers || {}).length;

  const examReviewQuestions = allQuestions.map((question, idx) => {
    const userAnswer = attempts?.answers?.[question.id];

    let status: "correct" | "incorrect" | "unanswered";

    if (userAnswer === undefined) {
      status = "unanswered";
    } else if (userAnswer === question.correct_answer) {
      status = "correct";
    } else {
      status = "incorrect";
    }

    return {
      id: question.id,

      questionNumber: idx + 1,
      questionText: question.question,
      options: question.options,
      correctAnswer: question.correct_answer,
      userAnswer,
      status,
    };
  });

  const questions = examReviewQuestions;

  // const unansweredQuestions =

  console.log(questions);

  console.log(attempts);
  useEffect(() => {
    const getAllQuestions = async () => {
      if (user && id) {
        try {
          setLoading(true);
          const { data, error } = await supabase.from("questions").select("*");

          if (error) {
            console.error("Error fetching questions:", error.message);
            return [];
          }

          const orderedQuestions = attempts?.question_order
            ? attempts.question_order.map((id) => data.find((q) => q.id === id))
            : [];

          setAllQuestions(orderedQuestions);
        } catch (error) {
          console.error("Error fetching attempt data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    getAllQuestions();
  }, [user, id, attempts?.question_order]);

  console.log(allQuestions);

  useEffect(() => {
    const getAllAttempts = async () => {
      if (user && id) {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from("exam_attempts")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "completed")
            .eq("id", id)
            .single();

          if (error) throw error;
          setAttempts(data);
        } catch (error) {
          console.error("Error fetching attempt data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    getAllAttempts();
  }, [user, id]);

  const correctQuestions = examReviewQuestions.filter(
    (q) => q.status === "correct"
  );
  const incorrectQuestions = examReviewQuestions.filter(
    (q) => q.status === "incorrect"
  );
  const unansweredQuestions = examReviewQuestions.filter(
    (q) => q.status === "unanswered"
  );

  const totalQuestions = allQuestions;

  console.log(unansweredQuestions);
  // --- FILTERING LOGIC ---
  const filteredQuestions = questions.filter((q) => {
    const isCorrect = q.userAnswer === q.correctAnswer;
    const isIncorrect =
      q.userAnswer !== q.correctAnswer && q.userAnswer !== null;
    const isUnanswered = q.userAnswer === undefined;

    if (filterStatus === "correct") return isCorrect;
    if (filterStatus === "incorrect") return isIncorrect;
    if (filterStatus === "unanswered") return isUnanswered;

    return true;
  });
  // --- END FILTERING LOGIC ---

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const paginatedQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  // Score calculation based on all questions
  const displayedScore =
    attempts && allQuestions.length > 0
      ? Math.round((attempts.score / allQuestions.length) * 100)
      : 0;

  // Overall test completion status based on all 100 questions
  const overallCompletion =
    totalQuestions &&
    Math.round((answeredQuestions / totalQuestions.length) * 100);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <a
          href="/dashboard"
          className="p-2 rounded-md hover:bg-slate-200 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </a>
        <div>
          <h1 className="text-2xl font-bold">Exam Review</h1>
          <p className="text-sm text-slate-500">
            {formatAttemptTime(attempts?.submitted_at ?? "").dateLabel} ·{" "}
            {attempts && Math.floor(attempts?.duration_seconds / 60)} min total
          </p>
        </div>
      </div>

      {/* Summary - REDESIGNED */}
      <div className="bg-white border border-slate-200 rounded-lg p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-sm text-slate-500 mb-2">
              Attempt Performance (
              <span className="font-semibold text-slate-700">
                {answeredQuestions || 0}
              </span>{" "}
              out of{" "}
              <span className="font-semibold text-slate-700">
                {totalQuestions.length}
              </span>{" "}
              questions attempted )
            </p>
            <h2 className="text-5xl font-bold text-slate-900">
              {displayedScore}%
            </h2>

            <p className="text-sm text-slate-600 mt-3">
              <span className="text-emerald-600 font-semibold">
                {correctQuestions.length} Correct
              </span>{" "}
              ·{" "}
              <span className="text-red-600 font-semibold">
                {incorrectQuestions.length} Incorrect
              </span>{" "}
              ·{" "}
              <span className="text-amber-600 font-semibold">
                {unansweredQuestions.length || 0} unanswered
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">Overall Progress</p>
            <div className="font-bold text-xl text-slate-700">
              {overallCompletion || 0}% Completed
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
              <div
                className="bg-sky-500 h-2 rounded-full"
                style={{ width: `${overallCompletion || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters - REDESIGNED */}
      <div className="flex gap-6 mb-6 border-b border-slate-200">
        {[
          {
            value: "correct",
            label: `Correct (${correctQuestions.length})`,
            count: 29,
          },
          {
            value: "incorrect",
            label: `Incorrect (${incorrectQuestions.length})`,
            count: 94,
          },
          {
            value: "unanswered",
            label: `Unanswered (${unansweredQuestions.length})`,
            count: unansweredQuestions,
          },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setFilterStatus(
                f.value as "correct" | "incorrect" | "unanswered"
              );
              setCurrentPage(1);
            }}
            // Added check to disable filters with a count of 0 for a better UX
            disabled={f.count === 0}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              filterStatus === f.value
                ? "text-slate-900"
                : "text-slate-500 hover:text-slate-700 disabled:opacity-50"
            }`}
          >
            {f.label}
            {filterStatus === f.value && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
            )}
          </button>
        ))}
      </div>

      {/* Question List (Pagination and rendering logic remains the same) */}
      <div className="space-y-2">
        {paginatedQuestions.map((q) => {
          const isCorrect = q.userAnswer === q.correctAnswer;
          const isUnanswered = q.userAnswer === null;
          const isExpanded = selectedQuestion === q.id;
          const isIncorrect =
            q.userAnswer !== q.correctAnswer && q.userAnswer !== null;

          return (
            <div
              key={q.id}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-colors"
            >
              <div
                className="p-4 cursor-pointer flex items-start gap-3"
                onClick={() => setSelectedQuestion(isExpanded ? null : q.id)}
              >
                <span className="text-sm text-slate-400 font-medium mt-0.5 flex-shrink-0 w-8">
                  {q.questionNumber}
                </span>
                <p className="text-slate-700 flex-1">{q.questionText}</p>
                {isUnanswered ? (
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                ) : isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100">
                  <div className="space-y-2 ml-11">
                    {q.options.map((opt, idx) => {
                      const isUser = idx === q.userAnswer;
                      const isRight = idx === q.correctAnswer;
                      const letterLabel = String.fromCharCode(65 + idx);

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-md text-sm flex items-start gap-2 ${
                            isRight
                              ? "bg-emerald-50"
                              : isUser && isIncorrect
                              ? "bg-red-50"
                              : "bg-slate-50"
                          }`}
                        >
                          <span
                            className={`font-medium flex-shrink-0 ${
                              isRight
                                ? "text-emerald-700"
                                : isUser && isIncorrect
                                ? "text-red-700"
                                : "text-slate-500"
                            }`}
                          >
                            {letterLabel}.
                          </span>
                          <span
                            className={
                              isRight
                                ? "text-emerald-900"
                                : isUser && isIncorrect
                                ? "text-red-900"
                                : "text-slate-700"
                            }
                          >
                            {opt}
                          </span>
                          {isRight && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto mt-0.5" />
                          )}
                          {isUser && isIncorrect && (
                            <XCircle className="w-4 h-4 text-red-600 ml-auto mt-0.5" />
                          )}
                        </div>
                      );
                    })}
                    {isUnanswered && (
                      <p className="text-sm text-amber-700 italic mt-3">
                        No answer submitted. The correct answer is highlighted
                        in green.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredQuestions.length === 0 && (
          <div className="text-center p-12 bg-white rounded-lg border border-slate-200 text-slate-500">
            No questions match the current filter: "{filterStatus.toUpperCase()}
            "
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
          >
            Previous
          </button>

          <span className="text-sm text-slate-500">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

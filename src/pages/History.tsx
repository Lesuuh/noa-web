import { ArrowRight, Clock, Trophy, TrendingUp } from "@/lib/icons";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { fetchUserExamAttempts } from "@/api/api";
import Loader from "@/components/Loader";
import { formatAttemptTime } from "@/components/formattedDateTime";
import { useState } from "react";

const History = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("All Attempts");

  const { data: attempts = [], isLoading } = useQuery({
    queryKey: ["attempts", user?.id],
    queryFn: () => fetchUserExamAttempts(user!.id),
    enabled: !!user?.id,
  });

  if (isLoading) return <Loader />;

  const getScoreBadgeStyle = (score: number) =>
    score >= 90
      ? "bg-emerald-600 text-white shadow-sm"
      : score >= 75
      ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
      : "bg-orange-50 text-orange-700 border border-orange-200";

  const getScoreIcon = (score: number) =>
    score >= 90 ? (
      <Trophy className="w-3.5 h-3.5" />
    ) : score >= 75 ? (
      <TrendingUp className="w-3.5 h-3.5" />
    ) : null;

  const tabs = ["All Attempts", "Top Scores", "Below 75%"];

  const filteredAttempts = attempts.filter((attempt) => {
    if (activeTab === "Top Scores") return attempt.score >= 90;
    if (activeTab === "Below 75%") return attempt.score < 75;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Test History
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your past attempts, analyze performance, and review results.
          </p>
        </div>
        {/* <button className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold transition-colors">
          New Practice Test
        </button> */}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Attempts */}
      {filteredAttempts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="inline-flex p-6 bg-gray-50 rounded-full mb-4">
            <Clock className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium text-lg mb-1">
            No attempts yet
          </p>
          <p className="text-gray-400 text-sm">
            Take your first test to start tracking your progress.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAttempts.map((attempt) => {
            const { dateLabel } = formatAttemptTime(attempt.started_at);
            return (
              <div
                key={attempt.id}
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
              >
                {/* Attempt Info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 flex-1">
                  <div>
                    <span className="text-xs text-gray-500 font-medium">
                      {dateLabel}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 mt-1 px-2.5 py-1 rounded-full text-sm font-semibold ${getScoreBadgeStyle(
                        attempt.score
                      )}`}
                    >
                      {getScoreIcon(attempt.score)}
                      {attempt.score}%
                    </span>
                  </div>

                  <div className="flex items-center text-gray-400 text-xs sm:text-sm">
                    <Clock className="w-3 h-3 mr-1.5" />
                    {(attempt.duration_seconds / 60).toFixed(0)} min
                  </div>
                </div>

                {/* Review Button */}
                <div className="w-full sm:w-auto flex justify-end">
                  <Link
                    to={`/review/${attempt.id}`}
                    className="flex items-center justify-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-transform duration-200 group w-full sm:w-auto"
                  >
                    <span>Review</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {/* {attempts.length > 5 && (
        <div className="mt-4 flex justify-center">
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">
            View all {attempts.length} attempts →
          </button>
        </div>
      )} */}
    </div>
  );
};

export default History;

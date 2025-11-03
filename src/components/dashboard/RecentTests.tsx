import { ArrowRight, Clock, Trophy, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { formatAttemptTime } from "../formattedDateTime";
import { ExamAttempt } from "@/types";

const RecentTests = ({ attempts }: { attempts: ExamAttempt[] }) => {
  const getScoreBadgeStyle = (score: number) => {
    if (score >= 90) {
      return "bg-emerald-600  text-white shadow-sm";
    } else if (score >= 75) {
      return "bg-cyan-50 text-cyan-700 border border-cyan-200";
    } else {
      return "bg-orange-50 text-orange-700 border border-orange-200";
    }
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) {
      return <Trophy className="w-3.5 h-3.5" />;
    } else if (score >= 75) {
      return <TrendingUp className="w-3.5 h-3.5" />;
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-base md:text-lg text-slate-800">
            Recent Tests
          </h3>
        </div>
        {attempts.length > 0 && (
          <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
            {attempts.length} total
          </span>
        )}
      </div>

      <div className="space-y-2">
        {attempts.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex p-4 bg-slate-50 rounded-full mb-3">
              <Clock className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 text-sm">No tests taken yet.</p>
            <p className="text-slate-400 text-xs mt-1">
              Start your first test to see your progress here
            </p>
          </div>
        ) : (
          attempts.slice(0, 5).map((t, idx) => {
            const { dateLabel } = formatAttemptTime(t.started_at);
            return (
              <div
                key={idx}
                className="group relative flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-slate-50 to-white hover:from-emerald-50 hover:to-cyan-50 transition-all duration-200 border border-slate-200 hover:border-emerald-200 hover:shadow-sm"
              >
                {/* Left section - Date and Score */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium mb-1">
                      {dateLabel}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full ${getScoreBadgeStyle(
                          t.score
                        )}`}
                      >
                        {getScoreIcon(t.score)}
                        {t.score}%
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {(t.duration_seconds / 60).toFixed(0)}m
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right section - Review link */}
                <Link
                  to={`/review/${t.id}`}
                  className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-medium text-sm  group-hover:translate-x-1 transition-transform duration-200"
                >
                  <span>Review</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })
        )}
      </div>

      {/* {attempts.length > 5 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <button className="w-full text-center text-sm text-slate-600 hover:text-emerald-600 font-medium transition-colors">
            View all {attempts.length} tests →
          </button>
        </div>
      )} */}
    </div>
  );
};

export default RecentTests;

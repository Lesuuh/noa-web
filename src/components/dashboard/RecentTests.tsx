import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { formatAttemptTime } from "../formattedDateTime";
import { ExamAttempt } from "@/types";

const RecentTests = ({ attempts }: { attempts: ExamAttempt[] }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-emerald-600" />
        <h3 className="font-bold text-sm md:text-lg text-slate-800">
          Recent Tests
        </h3>
      </div>
      <div className="space-y-3">
        {attempts.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No tests taken yet.</p>
        ) : (
          attempts.slice(0, 5).map((t, idx) => {
            const { dateLabel } = formatAttemptTime(t.started_at);
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
              >
                <div className="flex items-center gap-2 mb-1 sm:mb-0">
                  <span className="text-sm text-slate-600">{dateLabel}</span>
                  <span
                    className={`font-bold text-sm px-2 py-1 rounded-full ${
                      t.score >= 90
                        ? "bg-gradient-to-r from-emerald-600 to-cyan-700 text-transparent bg-clip-text"
                        : t.score >= 75
                        ? "bg-cyan-100 text-cyan-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {t.score}%
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {(t.duration_seconds / 60).toFixed(0)} min
                </p>
                <Link
                  to={`/review/${t.id}`}
                  className="mt-1 sm:mt-0 text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                >
                  <span className="text-sm font-medium">Review</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentTests;

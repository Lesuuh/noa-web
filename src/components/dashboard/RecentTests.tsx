import { ArrowRight, Clock, Trophy, TrendingUp} from "@/lib/icons";
import { Link } from "react-router-dom";
import { formatAttemptTime } from "../formattedDateTime";
import { ExamAttempt } from "@/types";
import { FileText } from "lucide-react";

const RecentTests = ({ attempts }: { attempts: ExamAttempt[] }) => {
  // Professional status mapping
  const getStatusMetrics = (score: number) => {
    if (score >= 90) {
      return {
        label: "Distinction",
        styles: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: <Trophy className="w-3 h-3" />,
      };
    } else if (score >= 75) {
      return {
        label: "Qualified",
        styles: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <TrendingUp className="w-3 h-3" />,
      };
    } else {
      return {
        label: "Review Required",
        styles: "bg-slate-100 text-slate-600 border-slate-200",
        icon: <Clock className="w-3 h-3" />,
      };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm transition-all hover:shadow-md">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <FileText className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 tracking-tight">
              Examination History
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Official Records
            </p>
          </div>
        </div>
        {attempts.length > 0 && (
          <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            {attempts.length} ATTEMPTS
          </span>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {attempts.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="inline-flex p-5 bg-slate-50 rounded-full mb-4 border border-slate-100">
              <Clock className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-900 font-bold">
              No examination history found.
            </p>
            <p className="text-slate-500 text-sm mt-1 max-w-[200px] mx-auto">
              Complete your first CBT assessment to populate your service
              record.
            </p>
          </div>
        ) : (
          attempts.slice(0, 5).map((t, idx) => {
            const { dateLabel } = formatAttemptTime(t.started_at);
            const status = getStatusMetrics(t.score);

            return (
              <div
                key={idx}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-slate-50 transition-colors"
              >
                {/* Identification Column */}
                <div className="flex items-center gap-5 mb-4 sm:mb-0">
                  <div className="hidden sm:flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-emerald-600 border border-transparent group-hover:border-emerald-100 transition-all font-black text-xs">
                    #{attempts.length - idx}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900">
                      {dateLabel}
                    </span>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                      {/* Started at {timeLabel} •{" "} */}
                      {(t.duration_seconds / 60).toFixed(0)}m duration
                    </span>
                  </div>
                </div>

                {/* Performance Column */}
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-tight ${status.styles}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                      <span className="text-xl font-black text-slate-900">
                        {t.score}%
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/review/${t.id}`}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white hover:bg-emerald-700 transition-all active:scale-90"
                    title="Review Examination"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {attempts.length > 5 && (
        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
          <button className="w-full py-3 text-xs font-black text-slate-500 hover:text-emerald-700 uppercase tracking-widest transition-colors">
            Access Full Examination Ledger →
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentTests;

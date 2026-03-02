import {
  ArrowRight,
  Clock,
  Trophy,
  TrendingUp,
  
} from "@/lib/icons";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { fetchUserExamAttempts } from "@/api/api";
import Loader from "@/components/Loader";
import { formatAttemptTime } from "@/components/formattedDateTime";
import { useState, useMemo } from "react";
import { FileText, Filter, Search } from "lucide-react";

const History = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("All Attempts");

  const { data: attempts = [], isLoading } = useQuery({
    queryKey: ["attempts", user?.id],
    queryFn: () => fetchUserExamAttempts(user!.id),
    enabled: !!user?.id,
  });

  const filteredAttempts = useMemo(() => {
    if (activeTab === "Top Scores")
      return attempts.filter((a) => a.score >= 90);
    if (activeTab === "Below 75%") return attempts.filter((a) => a.score < 75);
    return attempts;
  }, [attempts, activeTab]);

  if (isLoading) return <Loader />;

  const getStatusMetrics = (score: number) => {
    if (score >= 90)
      return {
        label: "Distinction",
        color: "text-emerald-700 bg-emerald-50 border-emerald-100",
        icon: <Trophy className="w-3.5 h-3.5" />,
      };
    if (score >= 75)
      return {
        label: "Qualified",
        color: "text-blue-700 bg-blue-50 border-blue-100",
        icon: <TrendingUp className="w-3.5 h-3.5" />,
      };
    return {
      label: "Review Required",
      color: "text-slate-600 bg-slate-100 border-slate-200",
      icon: <Clock className="w-3.5 h-3.5" />,
    };
  };

  const tabs = ["All Attempts", "Top Scores", "Below 75%"];

  return (
    <div className="max-w-[1400px] mx-auto p-6 lg:p-10 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-emerald-700 rounded-lg text-white">
              <FileText size={18} />
            </div>
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">
              Official Archive
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Examination History
          </h1>
          <p className="text-slate-500 font-medium">
            Permanent record of all CBT promotional assessment attempts and
            performance analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by date..."
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none w-full sm:w-64"
            />
          </div>
          <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Analytics Summary - Optional but adds that "Officer" feel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Total Records
          </p>
          <p className="text-2xl font-black text-slate-900">
            {attempts.length}
          </p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Average Readiness
          </p>
          <p className="text-2xl font-black text-emerald-600">
            {(
              attempts.reduce((acc, curr) => acc + curr.score, 0) /
              (attempts.length || 1)
            ).toFixed(1)}
            %
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1 bg-slate-100/50 border border-slate-200 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-all ${
              activeTab === tab
                ? "bg-white text-emerald-700 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Records Table/List */}
      {filteredAttempts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-[2rem]">
          <div className="inline-flex p-6 bg-slate-50 rounded-full mb-4 border border-slate-100">
            <FileText className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-slate-900 font-black text-xl tracking-tight">
            No records found
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Adjust your filters or take a new examination.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAttempts.map((attempt, idx) => {
            const { dateLabel} = formatAttemptTime(
              attempt.started_at,
            );
            const status = getStatusMetrics(attempt.score);
            return (
              <div
                key={attempt.id}
                className="group bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-xl hover:shadow-emerald-900/5 transition-all hover:border-emerald-100"
              >
                {/* ID & Date */}
                <div className="flex items-center gap-6 flex-1">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xs border border-slate-100 group-hover:bg-emerald-700 group-hover:text-white group-hover:border-emerald-600 transition-all">
                    #{attempts.length - idx}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-none mb-1">
                      {dateLabel}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                        {/* Time: {timeLabel} */}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                        Duration: {(attempt.duration_seconds / 60).toFixed(0)}m
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Status */}
                <div className="flex items-center justify-between lg:justify-end gap-8">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-tight border ${status.color}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">
                      {attempt.score}%
                    </span>
                  </div>

                  <Link
                    to={`/review/${attempt.id}`}
                    className="flex items-center justify-center w-12 h-12 bg-slate-900 text-white rounded-full hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;

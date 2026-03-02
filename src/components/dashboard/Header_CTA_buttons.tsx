import { UserContextType } from "@/types";
import { Play, Clock } from "@/lib/icons";

type buttonStats = {
  lastScore: number;
  testsCompleted: number;
  inProgress: boolean;
};

const Header_CTA_buttons = ({
  user,
  handleStartNew,
  stats,
  handleResume,
}: {
  user: UserContextType;
  handleStartNew: () => void;
  stats: buttonStats;
  handleResume: () => void;
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div className="space-y-1">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Welcome back,{" "}
          <span className="text-emerald-600">
            {user?.full_name?.split(" ")[0]}
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider">
            National Orientation Agency • Official Candidate
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {stats.inProgress && (
          <button
            onClick={handleResume}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
          >
            <Clock className="w-5 h-5 text-emerald-600" />
            Resume Last Session
          </button>
        )}
        <button
          onClick={handleStartNew}
          className="flex items-center justify-center gap-2 py-4 px-8 bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-800 transition-all active:scale-95"
        >
          <Play className="w-5 h-5 fill-current" />
          Access New Examination
        </button>
      </div>
    </div>
  );
};

export default Header_CTA_buttons;

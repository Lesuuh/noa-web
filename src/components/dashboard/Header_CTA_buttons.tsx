import { UserContextType } from "@/types";
import { Clock, Play } from "@/lib/icons";

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
    <>
      {/* Header with integrated buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-2xl md:text-4xl font-bold drop-shadow-sm">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-cyan-700 bg-clip-text text-transparent">
              {user?.full_name}
            </span>
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            National Orientation Agency • Professional Excellence Through
            Assessment
          </p>
        </div>

        {/* Buttons integrated into header */}
        <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap sm:ml-4">
          {stats.inProgress && (
            <button
              onClick={handleResume}
              className="flex items-center justify-center gap-2 py-2.5 px-4 sm:px-5 bg-cyan-600 text-white text-sm sm:text-base font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-cyan-700 transition-all duration-200 animate-pulse hover:animate-none w-full sm:w-auto"
            >
              <Clock className="w-4 h-4" />
              Resume Test
            </button>
          )}
          <button
            onClick={handleStartNew}
            className="flex items-center justify-center gap-2 py-2.5 px-4 sm:px-5 bg-emerald-600 text-white text-sm sm:text-base font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-emerald-700 transition-all duration-200 w-full sm:w-auto"
          >
            <Play className="w-4 h-4" />
            Start New Test
          </button>
        </div>
      </div>
    </>
  );
};

export default Header_CTA_buttons;

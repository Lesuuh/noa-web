import { UserContextType } from "@/types";

type buttonStats = {
  lastScore: number;
  testsCompleted: number;
  inProgress: boolean;
};

const Header_CTA_buttons = ({
  user,
  hoveredCard,
  setHoveredCard,
  handleStartNew,
  stats,
  handleResume,
}: {
  user: UserContextType;
  hoveredCard: string | null;
  setHoveredCard: (value: string | null) => void;
  handleStartNew: () => void;
  stats: buttonStats;
  handleResume: () => void;
}) => {
  return (
    <>
      {/* Header - Increased size and added subtle drop shadow */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
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
      </div>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-700"></h3>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Start New Test Card */}
          <div
            onMouseEnter={() => setHoveredCard("new")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={handleStartNew}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-radial from-white/30 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col h-full min-h-[200px] justify-between">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">30 min</span>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="text-2xl font-bold text-white">
                  Start New Test
                </h3>
                <p className="text-white/80 text-sm">
                  Challenge yourself with a fresh assessment
                </p>

                <div className="flex items-center gap-4 pt-3 text-white/90">
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      {stats.testsCompleted} completed
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      Last: {stats.lastScore}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <span className="text-white/90 text-sm font-medium">
                  Ready to begin?
                </span>
                <div
                  className={`p-2 bg-white rounded-full transition-transform ${
                    hoveredCard === "new" ? "translate-x-1" : ""
                  }`}
                >
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              className={`absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-opacity duration-300 ${
                hoveredCard === "new" ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          {/* Resume Test Card */}
          <div
            onMouseEnter={() => setHoveredCard("resume")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={handleResume}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-700 p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-radial from-white/30 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col h-full min-h-[200px] justify-between">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                {stats.inProgress && (
                  <div className="px-3 py-1 bg-amber-400 rounded-full">
                    <span className="text-xs font-bold text-amber-900">
                      In Progress
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="text-2xl font-bold text-white">
                  Resume Previous Test
                </h3>
                <p className="text-white/80 text-sm">
                  Continue where you left off
                </p>

                <div className="pt-3 space-y-2">
                  <div className="flex items-center justify-between text-white/90 text-sm">
                    <span>Progress</span>
                    <span className="font-bold">12/40 questions</span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full w-[30%] transition-all duration-500" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <span className="text-white/90 text-sm font-medium">
                  Pick up where you left off
                </span>
                <div
                  className={`p-2 bg-white rounded-full transition-transform ${
                    hoveredCard === "resume" ? "translate-x-1" : ""
                  }`}
                >
                  <svg
                    className="w-5 h-5 text-cyan-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              className={`absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-opacity duration-300 ${
                hoveredCard === "resume" ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Header_CTA_buttons;

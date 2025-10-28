import { useState, useEffect } from "react";
// import Confetti from "react-confetti";
// import { useWindowSize } from "@react-hook/window-size";
import {
  ArrowRight,
  Trophy,
  User2Icon,
  Settings,
  HelpCircle,
  Target,
  TrendingUp,
  TimerIcon,
  Zap,
  Menu,
  X,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const mockUserDetails = {
  name: "Lesuuh",
  photoURL: null,
};

const mockHistory = [
  { date: "2024-10-20", score: 92, time: 45 },
  { date: "2024-10-18", score: 48, time: 52 },
  { date: "2024-10-15", score: 95, time: 40 },
  { date: "2024-10-12", score: 90, time: 58 },
  { date: "2024-10-10", score: 85, time: 48 },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const history = mockHistory;
  const userDetails = mockUserDetails;

  // Statistics
  const totalTestTaken = history.length;
  const totalScore = history.reduce((acc, test) => acc + test.score, 0);
  const averageScore = totalTestTaken ? totalScore / totalTestTaken : 0;
  const highestScore = history.length
    ? Math.max(...history.map((t) => t.score))
    : 0;
  const totalTime = history.reduce((acc, t) => acc + Number(t.time), 0);
  const averageTime = totalTestTaken
    ? (totalTime / totalTestTaken).toFixed(1)
    : "0";

  const highScores = history.filter((t) => t.score > 90);
  const scoreAbove90 = () => {
    if (highScores.length >= 3) return 100;
    if (highScores.length === 2) return 66;
    if (highScores.length === 1) return 33;
    return 0;
  };

  const toComplete5Challenges = () => {
    if (totalTestTaken > 4) return 100;
    if (totalTestTaken === 4) return 80;
    if (totalTestTaken === 3) return 60;
    if (totalTestTaken === 2) return 40;
    if (totalTestTaken === 1) return 20;
    return 0;
  };

  useEffect(() => {
    if (totalTestTaken === 5 && !showConfetti) setShowConfetti(true);
  }, [totalTestTaken, showConfetti]);

  useEffect(() => {
    if (showConfetti) {
      const timeout = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [showConfetti]);

  const scoreTrendData = history
    .slice() // createsa acopy of the data
    .reverse() // flip the arrangement order
    .map((test) => ({ test: test.date, score: test.score }));

  const navItems = [
    { label: "Dashboard", icon: Target, href: "dashboard" },
    { label: "Take Exam", icon: Zap, href: "exam" },
    { label: "Achievements", icon: Trophy, href: "#" },
    { label: "Settings", icon: Settings, href: "#" },
    { label: "Support", icon: HelpCircle, href: "#" },
  ];

  const kpiData = [
    {
      label: "Tests Completed",
      value: totalTestTaken,
      icon: Target,
      bgColor: "bg-cyan-500/10",
      textColor: "text-cyan-400",
      borderColor: "border-cyan-500/30",
    },
    {
      label: "Average Score",
      value: `${averageScore.toFixed(1)}%`,
      icon: TrendingUp,
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
      borderColor: "border-blue-500/30",
    },
    {
      label: "Highest Score",
      value: `${highestScore}%`,
      icon: Trophy,
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/30",
    },
    {
      label: "Avg. Time",
      value: `${averageTime} min`,
      icon: TimerIcon,
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
      borderColor: "border-purple-500/30",
    },
  ];

  const acheivements = [
    {
      label: "5 Tests",
      value: toComplete5Challenges(),
      color: "bg-cyan-500",
    },
    {
      label: "90%+ Score",
      value: scoreAbove90(),
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed z-50 h-full top-0 left-0 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 transition-transform duration-300 w-64 md:w-64 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h1 className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Mono
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Make sidebar a flex column with space-between */}
        <div className="flex flex-col justify-between h-[calc(100%-64px)] px-2 py-4">
          {/* Nav Items */}
          <nav className="space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/50 transition-colors group"
              >
                <item.icon className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
                <span className="text-sm font-medium group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </a>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="pt-4 border-t border-slate-800">
            <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-100 transition-colors group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5"
                />
              </svg>
              <span className="text-sm font-medium text-red-400 group-hover:text-red-600 transition-colors">
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Hamburger button for mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 right-4 md:hidden z-50 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 space-y-8 overflow-auto ml-0 md:ml-64">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {userDetails.name}
              </span>
            </h2>
            <p className="text-slate-400 mt-1">
              Track your progress and master skills
            </p>
          </div>
          <div className="hidden md:flex-shrink-0">
            {userDetails.photoURL ? (
              <img
                src={userDetails.photoURL || "/placeholder.svg"}
                alt="avatar"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full ring-2 ring-cyan-500/50 object-cover"
              />
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center ring-2 ring-cyan-500/50">
                <User2Icon className="text-white w-6 h-6 sm:w-7 sm:h-7" />
              </div>
            )}
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {kpiData.map((kpi) => (
            <div
              key={kpi.label}
              className={`${kpi.bgColor} border ${kpi.borderColor} rounded-xl p-4 sm:p-6 backdrop-blur-sm transition-all hover:scale-105 hover:border-opacity-100`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">
                    {kpi.label}
                  </p>
                  <p
                    className={`${kpi.textColor} text-2xl sm:text-3xl font-bold mt-2`}
                  >
                    {kpi.value}
                  </p>
                </div>
                <div className={`${kpi.bgColor} p-2 sm:p-3 rounded-lg`}>
                  <kpi.icon
                    className={`${kpi.textColor} w-5 h-5 sm:w-6 sm:h-6`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievements & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Achievements */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-lg">Achievements</h3>
            </div>
            {/* {showConfetti && <Confetti width={width} height={height} />} */}
            <div className="space-y-4">
              {acheivements.map((ach) => (
                <div key={ach.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-300">
                      {ach.label}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {ach.value}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`${ach.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${ach.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score Chart */}
          <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-lg">Score Progression</h3>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={scoreTrendData}>
                <CartesianGrid
                  stroke="rgba(148,163,184,0.1)"
                  vertical={false}
                  strokeDasharray="5 5"
                />
                <XAxis
                  dataKey="test"
                  tick={{ fill: "rgb(148,163,184)", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(148,163,184,0.1)" }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "rgb(148,163,184)", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(148,163,184,0.1)" }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="rgb(34,211,238)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Tests */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-lg">Recent Tests</h3>
          </div>
          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                No tests taken yet.
              </p>
            ) : (
              history.slice(0, 5).map((t, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors border border-slate-800/50"
                >
                  <div className="flex items-center gap-2 mb-1 sm:mb-0">
                    <span className="text-sm text-slate-400">{t.date}</span>
                    <span
                      className={`font-bold text-sm px-2 py-1 rounded-full ${
                        t.score >= 90
                          ? "bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text"
                          : t.score >= 75
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-orange-500/20 text-orange-400"
                      }`}
                    >
                      {t.score}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{t.time} min</p>
                  <a
                    href="#"
                    className="mt-1 sm:mt-0 text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    <span className="text-sm font-medium">Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

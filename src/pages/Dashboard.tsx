import { useState, useEffect } from "react";
import {
  Trophy,
  Settings,
  HelpCircle,
  Target,
  TrendingUp,
  TimerIcon,
  Zap,
  Menu,
  X,
  ArrowRight,
  Star,
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

import { useUser } from "@/contexts/UserContext";
import Loader from "@/components/Loader";
import { ExamAttempt } from "@/types";
import { fetchUserExamAttempts } from "@/data/fetchUserData";
import { supabase } from "@/supabase";
import { formatAttemptTime } from "@/components/formattedDateTime";
import { AnimatePresence, motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, loading } = useUser();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [testLoading, setTestLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [openStart, setOpenStart] = useState(false);
  const [openResume, setOpenResume] = useState(false);
  const navigate = useNavigate();

  // Load user exam attempts
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setTestLoading(true);
      const data = await fetchUserExamAttempts(user.id);
      setAttempts(data);
      setTestLoading(false);
    };
    load();
  }, [user]);

  const history = attempts;

  // Statistics
  const totalTestTaken = history.length;
  const totalScore = history.reduce((acc, test) => acc + test.score, 0);
  const averageScore = totalTestTaken ? totalScore / totalTestTaken : 0;
  const highestScore = history.length
    ? Math.max(...history.map((t) => t.score))
    : 0;
  const totalTimeInMinutes =
    history.reduce((acc, test) => acc + test.duration_seconds, 0) / 60;
  const averageTime = (totalTimeInMinutes / totalTestTaken).toFixed(2);

  const highScores = history.filter((t) => t.score > 90);
  const scoreAbove90 = () => {
    if (highScores.length >= 3) return 100;
    if (highScores.length === 2) return 66;
    if (highScores.length === 1) return 33;
    return 0;
  };

  const toComplete5Challenges = () => {
    if (totalTestTaken >= 5) return 100;
    return totalTestTaken * 20;
  };

  useEffect(() => {
    if (totalTestTaken >= 5 && !showConfetti) setShowConfetti(true);
  }, [totalTestTaken, showConfetti]);

  useEffect(() => {
    if (showConfetti) {
      const timeout = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [showConfetti]);

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel("exam_attempts_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "exam_attempts",
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          const data = await fetchUserExamAttempts(user.id);
          setAttempts(data);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const scoreTrendData = history
    .slice(0, 5)
    .reverse()
    .map(({ started_at, score }) => {
      const { dateLabel } = formatAttemptTime(started_at);
      return { date: dateLabel, score };
    });

  const handleStartNew = () => setOpenStart(true);
  const handleResume = () => setOpenResume(true);

  // const lastAttempt = true;

  const navItems = [
    { label: "Dashboard", icon: Target, href: "dashboard" },
    { label: "Take Exam", icon: Zap, href: "exam" },
    { label: "Settings", icon: Settings, href: "#" },
    { label: "Support", icon: HelpCircle, href: "#" },
    { label: "Freemium", icon: Star, href: "upgrade" },
  ];

  const kpiData = [
    {
      label: "Tests Completed",
      value: totalTestTaken,
      icon: Target,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-300",
    },
    {
      label: "Average Score",
      value: `${averageScore.toFixed(1)}%`,
      icon: TrendingUp,
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      borderColor: "border-amber-300",
    },
    {
      label: "Highest Score",
      value: `${highestScore}%`,
      icon: Trophy,
      // Refined Gold for premium look
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-400",
    },
    {
      label: "Avg. Completion Time",
      value: `${averageTime || 5} min`,
      icon: TimerIcon,
      bgColor: "bg-cyan-50", // Changed from blue-50
      textColor: "text-cyan-700", // Changed from blue-700
      borderColor: "border-cyan-300", // Changed from blue-300
    },
  ];

  const achievements = [
    {
      label: "Consistency Champion - Completed 5 Tests",
      value: toComplete5Challenges(),
      color: "bg-emerald-600",
    },
    {
      label: "Higher Achiever - Scored 90+% in recent tests",
      value: scoreAbove90(),
      color: "bg-cyan-700",
    },
  ];

  if (loading || testLoading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-white border-r border-slate-200 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header  */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded flex items-center justify-center text-white font-bold text-sm drop-shadow-md">
              NOA
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900">NOA CBT</h1>
              <p className="text-[10px] text-slate-500">
                Professional Excellence
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors md:hidden"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>
        <div className="flex flex-col justify-between h-[calc(100%-64px)] px-2 py-4">
          <nav className="space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                // Subtle hover effect change
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 transition-colors group"
              >
                <item.icon className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                  {item.label}
                </span>
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-slate-200">
            <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 cursor-pointer transition-colors group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-red-600 group-hover:text-red-700 transition-colors"
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
              <span className="text-sm font-medium text-red-600 group-hover:text-red-700 transition-colors">
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 right-4 md:hidden z-50 p-2 rounded-lg bg-slate-800/80 backdrop-blur-sm border border-emerald-900/30 hover:bg-slate-700 transition-colors"
      >
        <Menu className="w-5 h-5 text-emerald-400" />
      </button>

      <main className="flex-1 p-4 md:p-8 space-y-8 overflow-auto ml-0 md:ml-64">
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

        {/* Main Buttons - Modernized Shadow */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <button
            onClick={handleStartNew}
            // Softened shadow for a modern 'lift' effect
            className="flex-1 py-4 px-6 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" /> Start New Test
          </button>
          <button
            onClick={handleResume}
            // Softened shadow for a modern 'lift' effect
            className="flex-1 py-4 px-6 rounded-xl bg-cyan-700 text-white font-semibold hover:bg-cyan-800 transition-colors shadow-xl shadow-cyan-700/30 flex items-center justify-center gap-2"
          >
            <Target className="w-5 h-5" /> Resume Previous Test
          </button>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {kpiData.map((kpi) => (
            <div
              key={kpi.label}
              // Added subtle hover shadow
              className={`${kpi.bgColor} border ${kpi.borderColor} rounded-xl p-4 sm:px-6 py-5 transition-all hover:scale-[1.02] hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className={`${kpi.textColor} text-2xl sm:text-3xl font-bold mt-2`}
                  >
                    {kpi.value}
                  </p>
                  <p className="text-slate-500 text-xs font-medium uppercase">
                    {kpi.label}
                  </p>
                </div>
                <div
                  className={`bg-white p-2 sm:p-3 rounded-lg border ${kpi.borderColor}`}
                >
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
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-sm md:text-lg text-slate-800">
                Achievements
              </h3>
            </div>
            <div className="space-y-4">
              {achievements.map((ach) => (
                <div key={ach.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-700">
                      {ach.label}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {ach.value}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`${ach.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${ach.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-sm md:text-lg text-slate-800">
                Performance Trend
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart
                data={scoreTrendData}
                margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
              >
                <CartesianGrid
                  stroke="rgba(203, 213, 225, 0.5)"
                  vertical={false}
                  strokeDasharray="5 5"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: "rgb(203, 213, 225)" }}
                  tick={{ fill: "rgb(100, 116, 139)", fontSize: 12, dy: 10 }}
                  interval="preserveEnd"
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={{ stroke: "rgb(203, 213, 225)" }}
                  tick={{ fill: "rgb(100, 116, 139)", fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="rgb(5, 150, 105)"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid rgb(203, 213, 225)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#334155" }}
                  cursor={{ strokeDasharray: "3 3" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Tests */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm md:text-lg text-slate-800">
              Recent Tests
            </h3>
          </div>
          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                No tests taken yet.
              </p>
            ) : (
              history.slice(0, 5).map((t, idx) => {
                const { dateLabel } = formatAttemptTime(t.started_at);
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
                  >
                    <div className="flex items-center gap-2 mb-1 sm:mb-0">
                      <span className="text-sm text-slate-600">
                        {dateLabel}
                      </span>
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
      </main>

      {/* modals */}
      <AnimatePresence>
        {openStart && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-11/12 sm:w-[400px] rounded-xl p-6 relative shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Close button */}
              <button
                onClick={() => setOpenStart(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-700" />
              </button>

              {/* Modal content */}
              <div className="text-center space-y-4">
                <Zap className="w-12 h-12 mx-auto text-emerald-500" />
                <h2 className="text-xl font-bold text-slate-900">
                  Ready to Start Your Test?
                </h2>
                <p className="text-slate-600 text-sm">
                  Make sure you are ready. You won’t be able to pause once the
                  test starts.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={() => navigate("/exam")}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" /> Start Test
                  </button>
                  <button
                    onClick={() => setOpenStart(false)}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-100 text-slate-800 font-medium hover:bg-slate-200 transition-colors shadow-inner"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {openResume && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-11/12 sm:w-[400px] rounded-xl p-6 relative shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Close button */}
              <button
                onClick={() => setOpenResume(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-700" />
              </button>

              {/* Modal content */}
              <div className="text-center space-y-4">
                <Target className="w-12 h-12 mx-auto text-cyan-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  Resume Your Test
                </h2>
                {/* {lastAttempt ? (
                  <p className="text-slate-600 text-sm">
                    Last attempt: <strong>{lastAttempt.score || 50}%</strong> |{" "}
                    {lastAttempt.duration_minutes || 2} min |{" "}
                    {lastAttempt.date || "Wed 29 Oct"}
                  </p>
                ) : ( */}
                <p className="text-slate-600 text-sm">
                  You have a test in progress. Resume from where you left off.
                </p>
                {/* )} */}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    // onClick={onResume}
                    className="flex-1 py-3 px-4 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <Target className="w-5 h-5" /> Resume Test
                  </button>
                  <button
                    onClick={() => setOpenResume(false)}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-100 text-slate-800 font-medium hover:bg-slate-200 transition-colors shadow-inner"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

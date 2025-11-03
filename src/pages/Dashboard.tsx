import { useState, useEffect } from "react";
import { Trophy, Target, TrendingUp, TimerIcon, Menu } from "lucide-react";

import { useUser } from "@/contexts/UserContext";
import Loader from "@/components/Loader";
import { ExamAttempt } from "@/types";
import { fetchUserExamAttempts } from "@/data/fetchUserData";
import { supabase } from "@/supabase";
import { formatAttemptTime } from "@/components/formattedDateTime";
import { useExamStats } from "@/hooks/useExamStats";

import Sidebar from "@/components/dashboard/Sidebar";
import KpiCard from "@/components/dashboard/KpiCard";
import Achievement_Chart from "@/components/dashboard/Achievement_Chart";
import RecentTests from "@/components/dashboard/RecentTests";
import StartModal from "@/components/dashboard/StartModal";
import ResumeModal from "@/components/dashboard/ResumeModal";
import Header_CTA_buttons from "@/components/dashboard/Header_CTA_buttons";
import SEO from "@/components/SeoMeta";

export default function Dashboard() {
  const { user, loading } = useUser();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [testLoading, setTestLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [openStart, setOpenStart] = useState(false);
  const [openResume, setOpenResume] = useState(false);

  // Load user exam attempts
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const mounted = true;
      const data = await fetchUserExamAttempts(user.id);
      if (mounted) setAttempts(data);
      setTestLoading(false);
    };
    load();
  }, [user]);

  const {
    totalTestTaken,
    averageScore,
    highestScore,
    averageTime,
    scoreAbove90,
    toComplete5Challenges,
  } = useExamStats(attempts);

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
          event: "INSERT",
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

  const scoreTrendData = attempts
    .slice(0, 5)
    .reverse()
    .map(({ started_at, score }) => {
      const { dateLabel } = formatAttemptTime(started_at);
      return { date: dateLabel, score };
    });

  const handleStartNew = () => setOpenStart(true);
  const handleResume = () => setOpenResume(true);

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
      value: `${averageTime} min`,
      icon: TimerIcon,
      bgColor: "bg-cyan-50", // Changed from blue-50
      textColor: "text-cyan-700", // Changed from blue-700
      borderColor: "border-cyan-300", // Changed from blue-300
    },
  ];

  const achievements = [
    {
      label: "Consistency Champion - Completed 5 Tests",
      value:
        typeof toComplete5Challenges === "function"
          ? toComplete5Challenges()
          : toComplete5Challenges ?? 0,
      color: "bg-emerald-600",
    },
    {
      label: "Higher Achiever - Scored 90+% in recent tests",
      value:
        typeof scoreAbove90 === "function" ? scoreAbove90() : scoreAbove90 ?? 0,
      color: "bg-cyan-700",
    },
  ];
  // Mock data
  const stats = {
    lastScore: 85,
    testsCompleted: 12,
    inProgress: true,
  };

  if (loading || testLoading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <SEO
        title="NOA Practice Dashboard"
        description="Track your NOA exam progress, resume tests, and challenge yourself with new CBT practice exams."
        url="http://localhost:5173"
      />
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 right-4 md:hidden z-50 p-2 rounded-lg bg-slate-800/80 backdrop-blur-sm border border-emerald-900/30 hover:bg-slate-700 transition-colors"
      >
        <Menu className="w-5 h-5 text-emerald-400" />
      </button>

      <main className="flex-1 p-4 md:p-8 space-y-8 overflow-auto ml-0 md:ml-64">
        <Header_CTA_buttons
          user={user}
          stats={stats}
          handleResume={handleResume}
          handleStartNew={handleStartNew}
        />

        {/* KPIs Grid */}
        <KpiCard kpiData={kpiData} />

        {/* Achievements & Chart */}
        <Achievement_Chart
          achievements={achievements}
          scoreTrendData={scoreTrendData}
        />

        {/* Recent Tests */}
        <RecentTests attempts={attempts} />
      </main>

      {/* modals */}
      <StartModal openStart={openStart} setOpenStart={setOpenStart} />
      <ResumeModal openResume={openResume} setOpenResume={setOpenResume} />
    </div>
  );
}

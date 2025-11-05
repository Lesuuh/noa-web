import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { Trophy, Target, TrendingUp, TimerIcon } from "lucide-react";

import { useUser } from "@/contexts/UserContext";
import Loader from "@/components/Loader";
import { fetchUserExamAttempts } from "@/api/api";
import { supabase } from "@/supabase";
import { formatAttemptTime } from "@/components/formattedDateTime";
import { useExamStats } from "@/hooks/useExamStats";
const Achievement_Chart = lazy(
  () => import("@/components/dashboard/Achievement_Chart")
);
const RecentTests = lazy(() => import("@/components/dashboard/RecentTests"));
import KpiCard from "@/components/dashboard/KpiCard";
import StartModal from "@/components/dashboard/StartModal";
import ResumeModal from "@/components/dashboard/ResumeModal";
import Header_CTA_buttons from "@/components/dashboard/Header_CTA_buttons";
import SEO from "@/components/SeoMeta";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const { user, loading } = useUser();
  const [showConfetti, setShowConfetti] = useState(false);
  const [openStart, setOpenStart] = useState(false);
  const [openResume, setOpenResume] = useState(false);
  const queryClient = useQueryClient();

  const { data: attempts, isLoading: testLoading } = useQuery({
    queryKey: ["attempts", user?.id],
    queryFn: () => fetchUserExamAttempts(user!.id),
    enabled: !!user?.id,
  });

  const {
    totalTestTaken,
    averageScore,
    highestScore,
    averageTime,
    scoreAbove90,
    toComplete5Challenges,
  } = useExamStats(attempts ?? []);

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

          queryClient.setQueryData(["attempts"], data);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, user?.id]);

  const scoreTrendData = useMemo(() => {
    return attempts
      ?.slice(0, 5)
      .reverse()
      .map(({ started_at, score }) => {
        const { dateLabel } = formatAttemptTime(started_at);
        return { date: dateLabel, score };
      });
  }, [attempts]);

  const handleStartNew = () => setOpenStart(true);
  const handleResume = () => setOpenResume(true);

  const kpiData = useMemo(
    () => [
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
    ],
    [averageScore, averageTime, highestScore, totalTestTaken]
  );

  const achievements = useMemo(
    () => [
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
          typeof scoreAbove90 === "function"
            ? scoreAbove90()
            : scoreAbove90 ?? 0,
        color: "bg-cyan-700",
      },
    ],
    [scoreAbove90, toComplete5Challenges]
  );

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

      <main className="flex-1  md:p-8 space-y-8 overflow-auto ml-0">
        <Suspense fallback={<Loader />}>
          <Header_CTA_buttons
            user={user}
            stats={stats}
            handleResume={handleResume}
            handleStartNew={handleStartNew}
          />
        </Suspense>

        {/* KPIs Grid */}
        <Suspense fallback={<Loader />}>
          <KpiCard kpiData={kpiData} />
        </Suspense>

        {/* Achievements & Chart */}
        <Suspense fallback={<Loader />}>
          <Achievement_Chart
            achievements={achievements}
            scoreTrendData={scoreTrendData ?? []}
          />
        </Suspense>

        {/* Recent Tests */}
        <Suspense fallback={<Loader />}>
          <RecentTests attempts={attempts ?? []} />
        </Suspense>
      </main>

      {/* modals */}
      <StartModal openStart={openStart} setOpenStart={setOpenStart} />
      <ResumeModal openResume={openResume} setOpenResume={setOpenResume} />
    </div>
  );
}

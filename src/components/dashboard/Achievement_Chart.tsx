import { Award, Target, TrendingUp, Trophy, Zap } from "@/lib/icons";
import { useMemo } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  TooltipProps,
} from "recharts";

type ScoreTrend = {
  date: string;
  score: number;
};

type Achievements = {
  label: string;
  value: number;
  color: string;
};

const Achievement_Chart = ({
  achievements,
  scoreTrendData,
}: {
  achievements: Achievements[];
  scoreTrendData: ScoreTrend[];
}) => {
  // Official Tooltip - Minimalist & High Contrast
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 px-4 py-3 rounded-xl shadow-2xl border border-slate-800">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            Attempt Date: {data.date}
          </p>
          <p className="text-xl font-black text-white">
            {data.score}
            <span className="text-emerald-400 text-sm ml-0.5">%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const Chart = useMemo(() => {
    if (!scoreTrendData.length) return null;
    return (
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={scoreTrendData}
          margin={{ top: 20, right: 10, left: -25, bottom: 0 }}
        >
          <defs>
            <linearGradient id="officialGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
            dy={15}
          />
          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
            ticks={[0, 50, 100]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#e2e8f0", strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#059669"
            strokeWidth={3}
            fill="url(#officialGradient)"
            animationDuration={1500}
            dot={{
              r: 0, // Hidden by default for clean look
            }}
            activeDot={{
              r: 6,
              fill: "#059669",
              strokeWidth: 3,
              stroke: "white",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }, [scoreTrendData]);

  const getIcon = (value: number) => {
    if (value >= 90) return Award;
    if (value >= 70) return Target;
    return Zap;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Performance Analytics Card */}
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg tracking-tight">
                Performance Analytics
              </h3>
              <p className="text-xs text-slate-500 font-medium italic">
                Score trend across last 10 attempts
              </p>
            </div>
          </div>
        </div>

        {scoreTrendData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
            <TrendingUp className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-sm font-semibold tracking-tight">
              Awaiting first examination data...
            </p>
          </div>
        ) : (
          Chart
        )}
      </div>

      {/* Service Achievements Card */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-amber-50 rounded-xl">
            <Trophy className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-lg tracking-tight">
              Service Record
            </h3>
            <p className="text-xs text-slate-500 font-medium italic">
              Milestones achieved
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {achievements.map((ach) => {
            const Icon = getIcon(ach.value);
            return (
              <div key={ach.label} className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-600" />
                    <span className="text-[13px] font-bold text-slate-700 tracking-tight">
                      {ach.label}
                    </span>
                  </div>
                  <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {ach.value}%
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-[2px]">
                  <div
                    className={`${ach.color} h-full rounded-full transition-all duration-1000 ease-out relative`}
                    style={{ width: `${ach.value}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 p-4 bg-emerald-900 rounded-2xl">
          <p className="text-xs text-emerald-100/70 font-bold uppercase tracking-widest mb-1">
            Current Readiness
          </p>
          <p className="text-white text-sm font-medium">
            Keep maintaining 90%+ scores to secure your promotion eligibility.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Achievement_Chart;

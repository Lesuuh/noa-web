import { TrendingUp, Trophy, Target, Zap } from "lucide-react";
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
  value: number | string;
  color: string;
};

const Achievement_Chart = ({
  achievements,
  scoreTrendData,
}: {
  achievements: Achievements[];
  scoreTrendData: ScoreTrend[];
}) => {
  // Get icon based on achievement value
  const getAchievementIcon = (value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (numValue >= 90) return Trophy;
    if (numValue >= 70) return Target;
    return Zap;
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="bg-white px-4 py-2.5 rounded-lg shadow-lg border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">{data.date}</p>
          <p className="text-lg font-bold text-emerald-600">{data.score}%</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      {/* Achievements Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Trophy className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-base md:text-lg text-slate-800">
              Achievements
            </h3>
          </div>
        </div>

        <div className="space-y-5">
          {achievements.map((ach) => {
            const Icon = getAchievementIcon(ach.value);
            const numValue =
              typeof ach.value === "string" ? parseFloat(ach.value) : ach.value;

            return (
              <div key={ach.label} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    <span className="text-sm font-medium text-slate-700">
                      {ach.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                    {ach.value}%
                  </span>
                </div>
                <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`${ach.color} h-full rounded-full transition-all duration-700 ease-out relative`}
                    style={{ width: `${numValue}%` }}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Trend Chart */}
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-base md:text-lg text-slate-800">
              Performance Trend
            </h3>
          </div>
          {scoreTrendData.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                <span className="text-slate-600">Score</span>
              </div>
            </div>
          )}
        </div>

        {scoreTrendData.length === 0 ? (
          <div className="flex items-center justify-center h-60 text-slate-400">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No performance data yet</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={scoreTrendData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="rgb(16, 185, 129)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="rgb(16, 185, 129)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="rgb(226, 232, 240)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: "rgb(203, 213, 225)", strokeWidth: 1 }}
                tick={{ fill: "rgb(100, 116, 139)", fontSize: 11 }}
                interval="preserveStartEnd"
                dy={10}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={{ stroke: "rgb(203, 213, 225)", strokeWidth: 1 }}
                tick={{ fill: "rgb(100, 116, 139)", fontSize: 11 }}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="rgb(16, 185, 129)"
                strokeWidth={3}
                fill="url(#scoreGradient)"
                dot={{
                  r: 4,
                  fill: "rgb(16, 185, 129)",
                  strokeWidth: 2,
                  stroke: "white",
                }}
                activeDot={{
                  r: 6,
                  fill: "rgb(16, 185, 129)",
                  strokeWidth: 2,
                  stroke: "white",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Achievement_Chart;

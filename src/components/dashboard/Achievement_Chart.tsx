import { TrendingUp, Trophy } from "lucide-react";
import {
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
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
  return (
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
  );
};

export default Achievement_Chart;

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowRight,
  BookKey,
  HelpCircle,
  Settings,
  TimerIcon,
  Trophy,
  User2Icon,
} from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const scoreTrendData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 70 },
  { month: "Mar", score: 72 },
  { month: "Apr", score: 78 },
  { month: "May", score: 85 },
  { month: "Jun", score: 82 },
  { month: "Jul", score: 88 },
];

const pastTests = [
  { date: "26 July", score: 84, time: "90 mins" },
  { date: "25 July", score: 73, time: "100 mins" },
  { date: "24 July", score: 91, time: "75 mins" },
  { date: "23 July", score: 68, time: "110 mins" },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <main className="flex flex-col w-full min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <section className="shadow-md rounded-md p-5 md:p-10 w-full border max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold">
              Hello, Lesuuh
            </h2>
            <p className="text-gray-600 mt-1 text-sm ">
              Welcome back, Ready for your next challenge?
            </p>
          </div>
          <div>{user?.photoURL || <User2Icon />}</div>
        </div>
        <div className="mt-4 w-full flex items-center justify-between gap-4">
          <Button className="flex-1 py-6">
            <BookKey /> Start New Test
          </Button>
          <Button variant="outline" className="flex-1 py-6">
            <TimerIcon /> Resume previous test
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>📊 Your Stats</CardTitle>
            <CardDescription>Overview of your performance.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Tests Taken:</span>
              <span className="text-lg font-semibold">15</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Score:</span>
              <span className="text-lg font-semibold">78%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Highest Score:</span>
              <span className="text-lg font-semibold">95%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Average Time Per Test:
              </span>
              <span className="text-lg font-semibold">85 mins</span>
            </div>
          </CardContent>
        </Card>

        {/* charts */}

        <Card>
          <CardHeader>
            <CardTitle>📈 Score Trend</CardTitle>
            <CardDescription>
              Your scores over the last few months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                score: {
                  label: "Score",
                  color: "hsl(var(--primary))",
                },
              }}
              className="min-h-[200px] w-full"
            >
              <LineChart
                accessibilityLayer
                data={scoreTrendData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                  domain={[0, 100]}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="score"
                  type="natural"
                  stroke="blue"
                  strokeWidth={2}
                  dot={{
                    fill: "blue",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "blue",
                  }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section className="max-w-7xl w-full mx-auto mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Test History</CardTitle>
            <CardDescription>Review your test history</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 divide-y">
            {pastTests.map((test, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b-1 last:border-b-0 pb-2 last:pb-0"
              >
                <div>
                  <h3 className="font-medium">
                    {test.date} - {test.score}%{" "}
                  </h3>
                  <p className="text-gray-600 text-sm">{test.time}</p>
                </div>
                <Button variant="secondary">
                  Review <ArrowRight />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl w-full mx-auto mt-7">
        {/* User Info / Settings */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Settings</CardTitle>
            <CardDescription>
              Manage your profile and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="ghost" className="justify-start">
              <Settings className="mr-2 h-4 w-4" /> View/Update Profile
            </Button>
            <Button variant="ghost" className="justify-start">
              <Settings className="mr-2 h-4 w-4" /> Change Password
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-red-500 hover:text-red-600"
            >
              Log Out
            </Button>
          </CardContent>
        </Card>

        {/* Badges or Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>🏆 Achievements</CardTitle>
            <CardDescription>Milestones you've reached.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="font-medium">Completed 5 Tests</p>
                <Progress value={100} className="h-2" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-blue-500" />
              <div>
                <p className="font-medium">Scored above 90% three times</p>
                <Progress value={66} className="h-2" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-medium">First Perfect Score</p>
                <Progress value={0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support / Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>❓ Help</CardTitle>
            <CardDescription>Need assistance or have feedback?</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="ghost" className="justify-start">
              <HelpCircle className="mr-2 h-4 w-4" /> Contact Support
            </Button>
            <Button variant="ghost" className="justify-start">
              <HelpCircle className="mr-2 h-4 w-4" /> Report a Question
            </Button>
            <Button variant="ghost" className="justify-start">
              <HelpCircle className="mr-2 h-4 w-4" /> Leave Feedback
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Dashboard;

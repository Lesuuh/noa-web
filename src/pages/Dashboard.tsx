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
import { fetchTestHistory } from "@/services/fetchAllTestHistory";
import {
  ArrowRight,
  BookKey,
  HelpCircle,
  Settings,
  TimerIcon,
  Trophy,
  User2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { logout } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [width, height] = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  const totalTestTaken = history.length;
  const totalScore = history.reduce((acc, test) => acc + test.score, 0);
  const averageScore = totalTestTaken ? totalScore / totalTestTaken : 0;
  const highestScore = history.length
    ? Math.max(...history.map((test) => test.score))
    : 0;
  const totalTime = history.reduce((acc, test) => acc + test.time, 0);
  const averageTime = totalTestTaken
    ? (totalTime / totalTestTaken).toFixed(1)
    : "0";

  const scores = history.map((test) => test.score);
  const scoreTrendData = scores.map((score, index) => ({
    test: `Test ${index + 1}`,
    score: score,
  }));

  const highScores = history.filter((test) => test.score > 90);
  const scoreAbove90 = () => {
    let progress = 0;
    if (highScores.length > 3) {
      return (progress = 100);
    } else if (highScores.length === 2) {
      return (progress = 66);
    } else if (highScores.length === 1) {
      return (progress = 33);
    } else {
      return 0;
    }
    return progress;
  };
  const toComplete5Challenges = () => {
    if (totalTestTaken > 4) {
      return 100;
    } else if (totalTestTaken === 4) {
      return 80;
    } else if (totalTestTaken === 3) {
      return 60;
    } else if (totalTestTaken === 2) {
      return 40;
    } else if (totalTestTaken === 1) {
      return 20;
    } else {
      return 0;
    }
  };

  if (totalTestTaken === 5) {
    setShowConfetti(true);
  }

  useEffect(() => {
    if (showConfetti) {
      const timeOut = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timeOut);
    }
  }, [showConfetti]);
  useEffect(() => {
    const fetchingTestHistory = async () => {
      try {
        const testHistory = await fetchTestHistory();
        setHistory(testHistory);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };

    fetchingTestHistory();
  }, []);

  const navigate = useNavigate();
  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <main className="flex flex-col w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-6 lg:p-8">
      <section className="shadow-md rounded-md p-5 md:p-10 w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold">
              Hello, Lesuuh
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
              Welcome back, Ready for your next challenge?
            </p>
          </div>
          <div>{user?.photoURL || <User2Icon />}</div>
        </div>
        <div className="mt-4 w-full flex items-center justify-between gap-4">
          <Link to={"/exam"} className="flex-1">
            <Button className="py-6 w-full">
              <BookKey /> Start New Test
            </Button>
          </Link>
          <Link to={"/resume"} className="flex-1">
            <Button variant="outline" className="w-full py-6">
              <TimerIcon /> Resume previous test
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full max-w-7xl mx-auto">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>📊 Your Stats</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Overview of your performance.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Tests Taken:</span>
              <span className="text-lg font-semibold">{totalTestTaken}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Score:</span>
              <span className="text-lg font-semibold">
                {averageScore.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Highest Score:</span>
              <span className="text-lg font-semibold">{highestScore}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Average Completion Time:
              </span>
              <span className="text-lg font-semibold">{averageTime} mins</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>📈 Score Trend</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
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
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="test"
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
                  dot={{ fill: "blue" }}
                  activeDot={{ r: 6, fill: "blue" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section className="max-w-7xl w-full mx-auto mt-10">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Test History</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Review your test history
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 divide-y divide-gray-200 dark:divide-gray-700">
            {history?.map((test, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b-1 last:border-b-0 pb-2 last:pb-0"
              >
                <div>
                  <h3 className="font-medium">
                    {test.date} - {test.score}%
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {test.time} mins used
                  </p>
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
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>⚙️ Settings</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
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
              onClick={handleLogout}
              variant="ghost"
              className="justify-start text-red-500 hover:text-red-600"
            >
              Log Out
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>🏆 Achievements</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Milestones you've reached.
            </CardDescription>
          </CardHeader>
          {showConfetti && <Confetti width={width} height={height} />}
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <div className="w-full">
                <p className="font-medium">Completed 5 Tests</p>
                <Progress value={toComplete5Challenges()} className="h-2" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-blue-500" />
              <div className="w-full">
                <p className="font-medium">Scored above 90% three times</p>
                <Progress value={scoreAbove90()} className="h-2" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-green-500" />
              <div className="w-full">
                <p className="font-medium">First Perfect Score</p>
                <Progress value={0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>❓ Help</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Need assistance or have feedback?
            </CardDescription>
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

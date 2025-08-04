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
import { Link } from "react-router-dom";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { LogoutDialog } from "@/components/modals/LogoutModal";
import Loader from "@/components/Loader";
import { fetchUserById } from "@/data/fetchUser";
import { UserDetails } from "@/types";

const Dashboard = () => {
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);
    fetchUserById(user.uid).then((data) => {
      setUserDetails(data);
      setLoading(false);
    });
  }, [user]);

  console.log(userDetails);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [width, height] = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

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
  console.log(scores);
  const scoreTrendData = scores.reverse().map((score, index) => ({
    test: `Test ${index + 1}`,
    score: score,
  }));

  const highScores = history.filter((test) => test.score > 90);
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
    if (totalTestTaken === 5 && !showConfetti) {
      setShowConfetti(true);
    }
  }, [totalTestTaken, showConfetti]);

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
        setLoading(true);
        const testHistory = await fetchTestHistory();
        setHistory(testHistory);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchingTestHistory();
  }, []);

  if (loading) return <Loader />;

  return (
    <main className="flex flex-col w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4 md:p-6 lg:p-8">
      <section className="shadow-md rounded-md p-5 md:p-10 w-full border border-gray-700 bg-gray-800 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-100">
              Hello, {userDetails.name}
            </h2>
            <p className="text-gray-400 mt-1 text-sm">
              Welcome back, Ready for your next challenge?
            </p>
          </div>
          <div>{user?.photoURL || <User2Icon className="text-blue-400" />}</div>
        </div>
        <div className="mt-4 w-full flex items-center justify-between gap-4">
          <Link to={"/exam"} className="flex-1">
            <Button className="py-6 w-full bg-blue-600 hover:bg-blue-500 text-white">
              <BookKey /> Start New Test
            </Button>
          </Link>
          <Link to={"/resume"} className="flex-1">
            <Button
              variant="outline"
              className="w-full py-6 text-blue-400 border-blue-600 hover:bg-gray-700"
            >
              <TimerIcon /> Resume previous test
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full max-w-7xl mx-auto">
        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle>📊 Your Stats</CardTitle>
            <CardDescription className="text-gray-400">
              Overview of your performance.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-gray-100">
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

        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle>📈 Score Trend</CardTitle>
            <CardDescription className="text-gray-400">
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
              <LineChart data={scoreTrendData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} stroke="#4b5563" />
                <XAxis
                  dataKey="test"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs text-gray-400"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={[0, 100]}
                  className="text-xs text-gray-400"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="score"
                  type="natural"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                  activeDot={{ r: 6, fill: "#3b82f6" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section className="max-w-7xl w-full mx-auto mt-10">
        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle>Test History</CardTitle>
            <CardDescription className="text-gray-400">
              Review your test history
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 divide-y divide-gray-700">
            {history?.map((test, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between pb-2 last:pb-0"
              >
                <div>
                  <h3 className="font-medium text-gray-100">
                    {test.date} - {test.score}%
                  </h3>
                  <p className="text-blue-400 text-sm">{test.time} mins used</p>
                </div>
                <Button
                  variant="secondary"
                  className="bg-gray-700 text-gray-100 hover:bg-gray-600"
                >
                  Review <ArrowRight />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl w-full mx-auto mt-7">
        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle>⚙️ Settings</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your profile and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button
              variant="ghost"
              className="justify-start text-blue-400 hover:text-blue-300"
            >
              <Settings className="mr-2 h-4 w-4" /> View/Update Profile
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-blue-400 hover:text-blue-300"
            >
              <Settings className="mr-2 h-4 w-4" /> Change Password
            </Button>
            <Button
              onClick={() => setLogoutModal(true)}
              variant="ghost"
              className="justify-start text-red-400 hover:text-red-500"
            >
              Log Out
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle>🏆 Achievements</CardTitle>
            <CardDescription className="text-gray-400">
              Milestones you've reached.
            </CardDescription>
          </CardHeader>
          {showConfetti && <Confetti width={width} height={height} />}
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-yellow-400" />
              <div className="w-full">
                <p className="font-medium text-gray-100">Completed 5 Tests</p>
                <Progress
                  value={toComplete5Challenges()}
                  className="h-2 bg-gray-700"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-blue-400" />
              <div className="w-full">
                <p className="font-medium text-gray-100">
                  Scored above 90% three times
                </p>
                <Progress value={scoreAbove90()} className="h-2 bg-gray-700" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-green-400" />
              <div className="w-full">
                <p className="font-medium text-gray-100">First Perfect Score</p>
                <Progress value={0} className="h-2 bg-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle>❓ Help</CardTitle>
            <CardDescription className="text-gray-400">
              Need assistance or have feedback?
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button
              variant="ghost"
              className="justify-start text-blue-400 hover:text-blue-300"
            >
              <HelpCircle className="mr-2 h-4 w-4" /> Contact Support
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-blue-400 hover:text-blue-300"
            >
              <HelpCircle className="mr-2 h-4 w-4" /> Report a Question
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-blue-400 hover:text-blue-300"
            >
              <HelpCircle className="mr-2 h-4 w-4" /> Leave Feedback
            </Button>
          </CardContent>
        </Card>
      </section>

      {logoutModal && (
        <LogoutDialog open={logoutModal} onOpenChange={setLogoutModal} />
      )}
    </main>
  );
};

export default Dashboard;

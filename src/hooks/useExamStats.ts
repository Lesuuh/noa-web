import { ExamAttempt } from "@/types";
import { useMemo } from "react";

export function useExamStats(attempts: ExamAttempt[]) {
  return useMemo(() => {
    if (attempts.length === 0) {
      return {
        totalTestTaken: 0,
        averageScore: 0,
        highestScore: 0,
        averageTime: 0,
      };
    }
    const totalTestTaken = attempts.length;
    const totalScore = attempts.reduce((acc, test) => acc + test.score, 0);
    const averageScore = totalTestTaken ? totalScore / totalTestTaken : 0;
    const highestScore = attempts.length
      ? Math.max(...attempts.map((t) => t.score))
      : 0;
    const totalTimeInMinutes =
      attempts.reduce((acc, test) => acc + test.duration_seconds, 0) / 60;
    const averageTime =
      (totalTimeInMinutes &&
        totalTestTaken &&
        (totalTimeInMinutes / totalTestTaken).toFixed(2)) ||
      0;

    const highScores = attempts.filter((t) => t.score > 90);
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

    return {
      totalTestTaken,
      averageScore,
      highestScore,
      averageTime,
      scoreAbove90,
      toComplete5Challenges,
    };
  }, [attempts]);
}

import { supabase } from "@/supabase";

export const fetchUserExamAttempts = async (user_id: string) => {
  const { data, error } = await supabase
    .from("exam_attempts")
    .select("*")
    .eq("user_id", user_id)
    .eq("status", "completed")
    .order("started_at", { ascending: false });

  if (error) {
    console.error(error.message);
    return [];
  }

  return data || [];
};

export const fetchQuestions = async () => {
  const { data, error } = await supabase.from("questions").select("*");

  if (error) {
    console.error("Error occurred while fetching questions:", error.message);
    throw error;
  }

  const shuffledQuestions = data.sort(() => Math.random() - 0.5);

  console.log(shuffledQuestions);

  return shuffledQuestions || [];
};

export const checkAttemptAllowance = async (userId: string) => {
  try {
    const { data: completedAttempts, error } = await supabase
      .from("exam_attempts")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "completed");

    if (error) throw error;

    const attemptCount = completedAttempts?.length || 0;
    const maxFreeAttempts = 10;

    return {
      allowed: attemptCount < maxFreeAttempts,
      attempts: attemptCount,
      remaining: maxFreeAttempts - attemptCount,
      message:
        attemptCount >= maxFreeAttempts
          ? "You've used all 10 free attempts. Upgrade to continue."
          : null,
    };
  } catch (error) {
    console.error("Error checking attempts:", error);
    return {
      allowed: false,
      attempts: 0,
      remaining: 0,
      message: "Error checking attempts",
    };
  }
};

export const fetchTestDuration = async () => {
  const { data: testDuration, error } = await supabase
    .from("exams")
    .select("duration_seconds");

  if (error) throw error;

  return { testDuration };
};

// sync exam to supabase
export const syncExam = async (
  attemptId: string,
  answers: Record<string, number>,
  timeRemaining: number
) => {
  try {
    const durationSeconds = 10800 - timeRemaining;

    const { error } = await supabase
      .from("exam_attempts")
      .update({
        answers,
        duration_seconds: durationSeconds,
        updated_at: new Date().toISOString(),
      })
      .eq("id", attemptId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("Failed to sync exam:", err);
    return { success: false, error: err };
  }
};

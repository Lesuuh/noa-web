import { supabase } from "@/supabase";

export const fetchTestHistory = async (user_id: string) => {
  const { data, error } = await supabase
    .from("exam_attempts")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error.message);
    return [];
  }

  return data || [];
};

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

// export const checkAttemptAllowance = async (userId: string) => {
//   try {
//     const { count, error } = await supabase
//       .from("exam_attempts")
//       .select("id", { count: "exact" })
//       .eq("user_id", userId)
//       .eq("status", "completed");

//     if (error) throw error;

//     if ((count ?? 0) >= 10) {
//       return { allowed: false, message: "Free limit reached. Please upgrade." };
//     }

//     return { allowed: true, attempts: count };
//   } catch (err: unknown) {
//     const message = err instanceof Error ? err.message : "Unknown error";
//     console.error("Attempt check failed:", message);
//     return {
//       allowed: false,
//       message: "Could not verify attempts. Try again later.",
//     };
//   }
// };

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

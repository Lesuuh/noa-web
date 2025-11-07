import { supabase } from "@/supabase";
import { ExamAttempt, Question, User } from "@/types";

// Email + password login
export const loginWithEmail = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
};

// Google OAuth login
export const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });

  if (error) throw new Error(error.message);
  return true;
};

export const logoutUser = async (): Promise<boolean> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error.message);
    return false;
  }
  return true;
};

export const fetchUserExamAttempts = async (
  user_id: string
): Promise<ExamAttempt[]> => {
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

export const fetchQuestions = async (): Promise<Question[]> => {
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
  const durationSeconds = 10800 - timeRemaining;

  const { error } = await supabase
    .from("exam_attempts")
    .update({
      answers,
      duration_seconds: durationSeconds,
      updated_at: new Date().toISOString(),
    })
    .eq("id", attemptId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
};

export const deleteUserAccount = async (user_id: string) => {
  await supabase.from("exam_attempts").delete().eq("id", user_id);
  await supabase.from("users").delete().eq("id", user_id);
};

export const updateUserProfile = async (
  formData: { name: string; email: string },
  user: User
) => {
  if (formData.email !== user.email) {
    const { error: authError } = await supabase.auth.updateUser({
      email: formData.email,
    });

    if (authError) throw Error;
  }

  if (formData.name !== user.full_name) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: formData.name })
      .eq("id", user?.id);

    if (profileError) throw profileError;
  }
  return { success: true, updated: formData };
};

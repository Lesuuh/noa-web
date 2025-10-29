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
    .eq("user_id", user_id);

  if (error) {
    console.error(error.message);
    return [];
  }

  return data || [];
};

export const checkAttemptAllowance = async (userId: string) => {
  const { data, error } = await supabase
    .from("exam_attempts")
    .select("attempt_number")
    .eq("user_id", userId);

  if (error) throw error;

  const attemptCount = data?.length || 0;

  if (attemptCount >= 10) {
    return { allowed: false, message: "Free limit reached. Please upgrade." };
  }

  return { allowed: true, attemptNumber: attemptCount + 1 };
};

export const fetchTestDuration = async () => {
  const { data: testDuration, error } = await supabase
    .from("exams")
    .select("duration_seconds");

  if (error) throw error;

  return { testDuration };
};

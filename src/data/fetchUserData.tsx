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

  return data || []
};

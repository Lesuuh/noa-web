import { supabase } from "@/supabase";

export const fetchQuestions = async () => {
  const { data, error } = await supabase.from("questions").select("*");

  if (error) {
    console.error("Error occurred while fetching questions:", error.message);
    throw error;
  }

  console.log(data);

  return data || [];
};

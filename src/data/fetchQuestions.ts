import { supabase } from "@/supabase";

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

// fisher-yates
// function shuffle(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// }

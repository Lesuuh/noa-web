import { supabase } from "@/supabase";

export const logoutUser = async (): Promise<boolean> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error.message);
    return false;
  }
  return true;
};

 
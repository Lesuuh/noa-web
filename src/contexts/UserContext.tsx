import { supabase } from "@/supabase";
import { UserContextProp, UserContextType } from "@/types";
import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext<UserContextProp | undefined>(undefined);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserContextType>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async (userId: string) => {
      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error(error);
        return null;
      }
      return profile;
    };

    const setUserFromSession = async (session: Session | null) => {
      if (!isMounted) return;
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false); // ✅ Make sure loading is false after any update
    };

    // Initial load
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setUserFromSession(session));

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserFromSession(session); // ✅ reuses same function
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within UserContextProvider");
  }
  return context;
};

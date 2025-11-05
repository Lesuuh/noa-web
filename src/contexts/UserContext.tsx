import { supabase } from "@/supabase";
import { UserContextProp, UserContextType } from "@/types";
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
    // Fetch user profile helper
    const fetchUserProfile = async (userId: string) => {
      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
      return profile;
    };

    // Initial session check
    const initializeUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();

    // Auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
      } else {
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
      }
    });

    return () => subscription.unsubscribe();
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

import { supabase } from "@/supabase";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

type UserContextType = Omit<User, "created_at" | "updated_at"> | null;

type UserContextProp = {
  user: UserContextType;
  loading: boolean;
};

const UserContext = createContext<UserContextProp>({
  user: null,
  loading: true,
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserContextType>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user.id) {
        setLoading(false);
        return;
      }
      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setUser(profile);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUser must be used within UserContextProvider");
  return context;
};

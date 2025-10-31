import { Outlet, useNavigate } from "react-router-dom";

import Loader from "./Loader";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { useUser } from "@/contexts/UserContext";

export default function AuthGuard() {
  const { loading, user } = useUser();
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setAuthenticated(false);
        navigate("/login");
      } else {
        setAuthenticated(true);
      }
    };

    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          navigate("/login");
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return <Loader />;
  }

  // Only render protected content if authenticated and user exists
  if (!authenticated || !user) return null;

  return <Outlet />;
}

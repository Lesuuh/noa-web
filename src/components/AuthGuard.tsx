import { Outlet, useNavigate } from "react-router-dom";

import Loader from "./Loader";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase";

export default function AuthGuard() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/login");
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
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

    listener.subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return <Loader />;
  }

  if (!authenticated) return null;

  return <Outlet />;
}

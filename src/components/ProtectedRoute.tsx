import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setAuthenticated(!!data.session?.user);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return authenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;

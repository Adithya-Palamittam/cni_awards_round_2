import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

interface AuthGuardProps {
  adminOnly?: boolean;
}

const AuthGuard = ({ adminOnly = false }: AuthGuardProps) => {
  const [checking, setChecking] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setRedirectTo("/");
        setChecking(false);
        return;
      }

      const { data: userRecord, error: dbError } = await supabase
        .from("users_table")
        .select("is_completed, is_admin")
        .eq("uid", user.id)
        .single();

      if (dbError || !userRecord) {
        setRedirectTo("/");
      } else {
        if (adminOnly && !userRecord.is_admin) {
          setRedirectTo("/unauthorized");
        } else if (!adminOnly && userRecord.is_completed) {
          console.log("User has completed the process, redirecting to thank you page.");
          setRedirectTo("/thank-you");
        }
      }

      setChecking(false);
    };

    checkAuth();
  }, [adminOnly]);

  if (checking) return <div className="text-center mt-10">Loading...</div>;

  return redirectTo ? <Navigate to={redirectTo} replace state={{ from: location }} /> : <Outlet />;
};

export default AuthGuard;

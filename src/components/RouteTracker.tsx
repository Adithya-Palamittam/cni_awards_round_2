// src/components/RouteTracker.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const RouteTracker = () => {
  const location = useLocation();

useEffect(() => {
  const updateLastVisited = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const ALLOWED_PATHS = [
      "/terms",
      "/process",
      "/regions",
      "/regional-selection",
      "/national-selection",
      "/restaurant-review",
      "/rating",
      "/final-ratings",
      "/thank-you",
    ];

    if (ALLOWED_PATHS.includes(location.pathname)) {
      await supabase
        .from("users_table")
        .update({ last_visited_page: location.pathname })
        .eq("uid", user.id);
    }
  };

  updateLastVisited();
}, [location]);


  return null;
};

export default RouteTracker;

// hooks/useStepGuard.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const useStepGuard = ({
  user,
  requiredStep,
}: {
  user: any;
  requiredStep: "terms" | "regional" | "national" | "rating";
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const enforceStep = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("user_selection_table")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !data) return;

      const { agreed_terms, selected_regional_restaurants, selected_national_restaurants } = data;

      // Logic for each step
      switch (requiredStep) {
        case "regional":
          if (!agreed_terms) navigate("/terms");
          break;
        case "national":
          if (!agreed_terms) navigate("/terms");
          else if (!selected_regional_restaurants || selected_regional_restaurants.length < 10)
            navigate("/regional-selection");
          break;
        case "rating":
          if (!agreed_terms) navigate("/terms");
          else if (!selected_regional_restaurants || selected_regional_restaurants.length < 10)
            navigate("/regional-selection");
          else if (!selected_national_restaurants || selected_national_restaurants.length < 5)
            navigate("/national-selection");
          break;
        case "terms":
        default:
          // Do nothing
          break;
      }
    };

    enforceStep();
  }, [user, requiredStep]);
};

export default useStepGuard;

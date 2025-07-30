import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabaseClient";
import HamburgerMenu from "@/components/HamburgerMenu";

const TermsAndConditions = () => {
  const [agreed, setAgreed] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const checkAgreement = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/");

      const { data, error } = await supabase
        .from("users_table")
        .select("agreed_terms")
        .eq("uid", user.id)
        .single();

      if (data?.agreed_terms) {
        // Already agreed — skip to next step
        navigate("/process");
      } else {
        setChecking(false); // Allow rendering terms
      }
    };

    checkAgreement();
  }, []);


const handleProceed = async () => {
  if (!user?.id) {
    alert("User not logged in.");
    return;
  }

  if (agreed) {
    // 1. Update agreed_terms in users_table
    const { error: updateError } = await supabase
      .from("users_table")
      .update({ agreed_terms: true })
      .eq("uid", user.id);

    if (updateError) {
      console.error("Failed to update terms status:", updateError.message);
      return;
    }

    // 2. Insert empty record into user_selection_table
    const { error: insertError } = await supabase
      .from("user_selection_table")
      .insert([
        {
          user_id: user.id,
          selected_regional_restaurants: [],
          selected_national_restaurants: [],
        },
      ]);

    if (insertError) {
      console.error("Failed to initialize user selection:", insertError.message);
      return;
    }

    // 3. Navigate to next step
    navigate("/process");
  }
};


  return (
    <div className="bg-white min-h-screen flex flex-col md:h-screen">
      {/* Header with Hamburger Menu */}
      <div className="flex justify-end items-center pt-2 pr-2">
        <HamburgerMenu />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-1 overflow-y-auto md:flex md:items-center md:justify-center md:px-0 md:py-0">
        <div className="w-full max-w-2xl md:max-h-[calc(100vh-4rem)] md:overflow-hidden">
          <div className="text-center mb-4">
            <img
              src="/logo.png"
              alt="TP Awards Logo"
              className="mx-auto mb-4 w-[8rem] h-[8rem] md:w-[12rem] md:h-[12rem] object-contain"
            />
          </div>

          <div className="space-y-3 md:space-y-6 text-center text-sm md:text-md">
            {/* Section 1 */}
            <div>
              <h2 className="text-base md:text-lg font-semibold text-blue-600 mb-2">The Process</h2>
              <p className="text-gray-700 leading-snug">
                This voting process is designed to be as impartial and
                comprehensive as possible, involving experts and
                tastemakers such as yourself.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-base md:text-lg font-semibold text-blue-600 mb-2">Keep it clean</h2>
              <p className="text-gray-700 leading-snug">
              The terms & conditions primarily cover confidentiality and conflict of interest. Read them{" "}
                <a href="https://www.cntraveller.in/info/tra-2025-panelist-declaration-form/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                  here
                </a>.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-base md:text-lg font-semibold text-blue-600 mb-2">Declaration</h2>
              <p className="text-gray-700 leading-snug">
                You certify that all parts of the <a href="https://www.cntraveller.in/info/tra-2025-panelist-declaration-form/" className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">declaration</a> and voting
                form are true and correct. By participating in the awards,
                you agree to abide by and be bound by the terms and
                conditions.
              </p>

              <div className="flex items-center justify-center gap-2 md:mt-6 mt-4">
                <Checkbox
                  id="agree"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                />
                <label htmlFor="agree" className="text-gray-700">
                  I agree
                </label>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleProceed}
                  disabled={!agreed}
                  className="bg-black text-white text-md px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-2 text-xs text-sm md:fixed md:bottom-0 md:left-0 md:right-0">
        <p>© 2025 Condé Nast India</p>
      </footer>
    </div>
  );

};

export default TermsAndConditions;

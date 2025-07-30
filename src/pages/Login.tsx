import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import ReactGA from "react-ga4";
import { useEffect } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   ReactGA.send({ hitType: "pageview", page: "/login", title: "Login Page" });
  // }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    const user = authData.user;

    if (!user) {
      setError("Failed to get user information.");
      return;
    }

    // Fetch user record from users_table
    const { data: userMeta, error: metaError } = await supabase
      .from("users_table")
      .select("last_visited_page, is_completed, agreed_terms, is_admin")
      .eq("uid", user.id)
      .single();

    if (metaError || !userMeta) {
      setError("Failed to fetch user metadata.");
      return;
    }

    // Track successful login
    ReactGA.event({
      category: "User",
      action: "Login",
      label: user.email || user.id,
    });

    // ✅ Redirect based on last visited page or fallback
  if (userMeta.is_admin) {
    navigate("/admin"); // Redirect to admin dashboard
  } else if (userMeta.is_completed) {
    navigate("/thank-you");
  } else if (userMeta.last_visited_page) {
    navigate(userMeta.last_visited_page);
  } else if (!userMeta.agreed_terms) {
    navigate("/terms");
  } else {
    navigate("/process");
  }
  };

  return (
  <div className="min-h-screen bg-white flex flex-col">
    <div className="flex-grow flex items-center justify-center px-4">
      <div className="w-full max-w-lg justify-between flex-col pb-10">
     
        <img src="/logo.png" alt="TP Awards Logo" className="mx-auto mb-4 w-[10rem] h-[10rem] md:w-[15rem] md:h-[15rem] object-contain" />
        <div>
          <div className="text-center mb-8 pt-8">
            <p className="text-base md:text-xl mb-2">Your votes will crown India's top 50 restaurants.</p>
            <p className="text-base md:text-xl">Ready to go?</p>
          </div>
  

        <form onSubmit={handleLogin} className="space-y-6 pb-8 px-4 md:px-20">
          <div>
            <Input
              type="text"
              placeholder="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-center border-0 border-b border-gray-400 rounded-none bg-transparent focus:border-black focus-visible:ring-0 placeholder:text-gray-500"
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-center border-0 border-b border-gray-400 rounded-none bg-transparent focus:border-black focus-visible:ring-0 placeholder:text-gray-500"
              required
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-black text-white px-8 py-2 rounded hover:bg-gray-800 text-md"
            >
              Login
            </Button>
          </div>
        </form>
        </div>

        <div className="text-center text-xs md:text-sm text-gray-600 mt-10">
              You have till 11:59 pm on Thursday, 31st July to vote
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer className="bg-black text-white text-center py-3 text-xs md:fixed md:bottom-0 md:left-0 md:right-0">
      <p className="text-xs">© 2025 Condé Nast India</p>
    </footer>
  </div>
);

};

export default Login;

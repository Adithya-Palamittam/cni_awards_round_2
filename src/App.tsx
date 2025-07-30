// import { Toaster } from "@/components/ui/toaster";
import { Toaster } from "sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { UserProvider } from "@/contexts/UserContext";
import AuthGuard from "./components/AuthGuard";
import RouteTracker from "./components/RouteTracker";

// Pages (User flow)
import Login from "./pages/Login";
import TermsAndConditions from "./pages/TermsAndConditions";
import ProcessDescription from "./pages/ProcessDescription";
import VotingRegions from "./pages/VotingRegions";
import RegionalSelection from "./pages/RegionalSelection";
import NationalSelection from "./pages/NationalSelection";
import RestaurantReview from "./pages/RestaurantReview";
import RatingPage from "./pages/RatingPage";
import FinalRatings from "./pages/FinalRatings";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";

// Admin panel
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import UsersPage from "./admin/UsersPage";
import RatingsPage from "./admin/RatingsPage";
import { useEffect } from "react";
// import SettingsPage from "./admin/SettingsPage";
import ReactGA from "react-ga4";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    ReactGA.initialize("G-9KGQHWBWZH");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster position="top-center"/>
        {/* <Sonner position="top-center"/> */}
        <UserProvider>
          <BrowserRouter>
            <RouteTracker />
            <Routes>
              {/* Admin Routes (protected) */}
              <Route element={<AuthGuard adminOnly />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="ratings" element={<RatingsPage />} />
                  {/* <Route path="settings" element={<SettingsPage />} /> */}
                </Route>
              </Route>
              {/* Public login route */}
              <Route path="/" element={<Login />} />
              {/* Protected user flow */}
              <Route element={<AuthGuard />}>
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/process" element={<ProcessDescription />} />
                <Route path="/regions" element={<VotingRegions />} />
                <Route path="/regional-selection" element={<RegionalSelection />} />
                <Route path="/national-selection" element={<NationalSelection />} />
                <Route path="/restaurant-review" element={<RestaurantReview />} />
                <Route path="/rating" element={<RatingPage />} />
                <Route path="/final-ratings" element={<FinalRatings />} />
              </Route>
              {/* Completion & fallback */}
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

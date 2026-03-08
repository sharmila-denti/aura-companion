import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { applyGenderTheme } from "@/lib/theme";
import { requestNotificationPermission, startNotificationScheduler } from "@/lib/notifications";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import BeautyTracker from "./pages/BeautyTracker";
import HealthTracker from "./pages/HealthTracker";
import FitnessPlanner from "./pages/FitnessPlanner";
import DietPlanner from "./pages/DietPlanner";
import CycleTracker from "./pages/CycleTracker";
import ProfilePage from "./pages/ProfilePage";
import NotificationSettings from "./pages/NotificationSettings";
import MoodMusic from "./pages/MoodMusic";

const queryClient = new QueryClient();

function AppContent() {
  useEffect(() => {
    applyGenderTheme();
    requestNotificationPermission().then((granted) => {
      if (granted) startNotificationScheduler();
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/beauty" element={<BeautyTracker />} />
        <Route path="/health" element={<HealthTracker />} />
        <Route path="/fitness" element={<FitnessPlanner />} />
        <Route path="/diet" element={<DietPlanner />} />
        <Route path="/cycle" element={<CycleTracker />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationSettings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

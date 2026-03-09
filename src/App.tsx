import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { applyGenderTheme } from "@/lib/theme";
import { requestNotificationPermission, startNotificationScheduler } from "@/lib/notifications";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import Login from "./pages/Login";
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
import Subscription from "./pages/Subscription";
import AIAssistant from "./pages/AIAssistant";
import Diary from "./pages/Diary";
import DailyTargets from "./pages/DailyTargets";
import StyleAdvisor from "./pages/StyleAdvisor";
import QRScanner from "./pages/QRScanner";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen gradient-soft flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function PaidRoute({ children }: { children: React.ReactNode }) {
  const { subscribed, plan, loading } = useSubscription();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasActiveSubscription = subscribed && plan && plan !== 'free_trial';

  if (!hasActiveSubscription) {
    return <Navigate to="/subscription" replace />;
  }

  return <>{children}</>;
}

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
        <Route path="/" element={<Login />} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/beauty" element={<ProtectedRoute><PaidRoute><BeautyTracker /></PaidRoute></ProtectedRoute>} />
        <Route path="/health" element={<ProtectedRoute><HealthTracker /></ProtectedRoute>} />
        <Route path="/fitness" element={<ProtectedRoute><FitnessPlanner /></ProtectedRoute>} />
        <Route path="/diet" element={<ProtectedRoute><PaidRoute><DietPlanner /></PaidRoute></ProtectedRoute>} />
        <Route path="/cycle" element={<ProtectedRoute><CycleTracker /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
        <Route path="/mood-music" element={<ProtectedRoute><MoodMusic /></ProtectedRoute>} />
        <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
        <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
        <Route path="/diary" element={<ProtectedRoute><Diary /></ProtectedRoute>} />
        <Route path="/targets" element={<ProtectedRoute><DailyTargets /></ProtectedRoute>} />
        <Route path="/style" element={<ProtectedRoute><PaidRoute><StyleAdvisor /></PaidRoute></ProtectedRoute>} />
        <Route path="/qr-scanner" element={<ProtectedRoute><QRScanner /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
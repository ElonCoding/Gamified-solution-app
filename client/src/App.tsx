import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ChallengesPage from "./pages/ChallengesPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AssistantPage from "./pages/AssistantPage";
import api, { setToken } from "./api";
import type { Challenge, DashboardPayload, LeaderboardItem } from "./types";

type AnalyticsPayload = {
  weeklyGrowth: { week: string; xp: number }[];
  metrics: { accuracy: number; speed: number; consistency: number };
  proficiency: { tech: number; aptitude: number; softSkills: number };
  feedback: string;
};

export default function App() {
  const [token, setAuthToken] = useState<string | null>(localStorage.getItem("token"));
  const [dark, setDark] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", !dark);
  }, [dark]);

  useEffect(() => {
    setToken(token);
    if (!token) return;
    const run = async () => {
      const [dash, list, lb, an] = await Promise.all([
        api.get("/api/dashboard"),
        api.get("/api/challenges"),
        api.get("/api/leaderboard"),
        api.get("/api/analytics")
      ]);
      setDashboard(dash.data);
      setChallenges(list.data.items);
      setLeaderboard(lb.data.items);
      setAnalytics(an.data);
    };
    run();
  }, [token]);

  const handleAuth = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setAuthToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setDashboard(null);
    setChallenges([]);
    setLeaderboard([]);
    setAnalytics(null);
  };

  const refreshData = async () => {
    const [dash, list, lb, an] = await Promise.all([
      api.get("/api/dashboard"),
      api.get("/api/challenges"),
      api.get("/api/leaderboard"),
      api.get("/api/analytics")
    ]);
    setDashboard(dash.data);
    setChallenges(list.data.items);
    setLeaderboard(lb.data.items);
    setAnalytics(an.data);
  };

  return (
    <Routes>
      <Route element={<AppLayout dark={dark} onToggleTheme={() => setDark((v) => !v)} isAuthed={Boolean(token)} onLogout={handleLogout} />}>
        <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <LandingPage onAuth={handleAuth} />} />
        <Route path="/dashboard" element={token ? <DashboardPage data={dashboard} /> : <Navigate to="/" replace />} />
        <Route path="/challenges" element={token ? <ChallengesPage challenges={challenges} onRefresh={refreshData} /> : <Navigate to="/" replace />} />
        <Route path="/leaderboard" element={token ? <LeaderboardPage items={leaderboard} /> : <Navigate to="/" replace />} />
        <Route path="/profile" element={token ? <ProfilePage data={dashboard} /> : <Navigate to="/" replace />} />
        <Route path="/analytics" element={token ? <AnalyticsPage data={analytics} /> : <Navigate to="/" replace />} />
        <Route path="/assistant" element={token ? <AssistantPage /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}


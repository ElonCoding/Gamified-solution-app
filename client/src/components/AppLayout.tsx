import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Flame, Home, Rocket, Trophy, User, BarChart3, Bot, MoonStar, Sun, Settings, LogOut } from "lucide-react";

type Props = {
  dark: boolean;
  onToggleTheme: () => void;
  isAuthed: boolean;
  onLogout: () => void;
  userRole?: string;
  streak?: number;
};

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/challenges", label: "Challenges", icon: Rocket },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/assistant", label: "AI Coach", icon: Bot }
];

export default function AppLayout({ dark, onToggleTheme, isAuthed, onLogout, userRole, streak }: Props) {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${dark ? "dark" : "light"}`}>
      <div className="app-gradient min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-900/70 backdrop-blur-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <span className="rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 px-3 py-1.5 text-sm font-bold text-white shadow-glow-sm">
                GamifyU
              </span>
              <span className="hidden text-slate-300 md:block">Learning OS</span>
            </Link>
            <div className="flex items-center gap-2">
              {isAuthed && streak !== undefined && streak > 0 && (
                <div className="hidden items-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-sm text-orange-400 md:flex">
                  <Flame size={14} className="animate-fire" />
                  <span className="font-semibold">{streak}</span>
                </div>
              )}
              <button onClick={onToggleTheme} className="rounded-xl border border-white/15 p-2 transition hover:bg-white/10">
                {dark ? <Sun size={16} /> : <MoonStar size={16} />}
              </button>
              {isAuthed ? (
                <button
                  onClick={() => { onLogout(); navigate("/"); }}
                  className="flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-sm transition hover:bg-white/10"
                >
                  <LogOut size={14} /> Logout
                </button>
              ) : (
                <Link to="/" className="rounded-xl border border-white/15 px-3 py-2 text-sm transition hover:bg-white/10">
                  Login
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Navigation */}
        {isAuthed && (
          <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 md:px-8">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-medium transition ${isActive ? "bg-brand-600 text-white shadow-glow-sm" : "bg-white/5 text-slate-300 hover:bg-white/10"}`
                }
              >
                <link.icon size={16} />
                {link.label}
              </NavLink>
            ))}
            {(userRole === "admin" || userRole === "superadmin") && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-medium transition ${isActive ? "bg-rose-600 text-white" : "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"}`
                }
              >
                <Settings size={16} />
                Admin
              </NavLink>
            )}
          </nav>
        )}

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 pb-10 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

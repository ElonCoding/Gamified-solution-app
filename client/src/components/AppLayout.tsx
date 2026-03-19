import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Flame, Home, Rocket, Trophy, User, BarChart3, Bot, MoonStar, Sun } from "lucide-react";

type Props = {
  dark: boolean;
  onToggleTheme: () => void;
  isAuthed: boolean;
  onLogout: () => void;
};

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/challenges", label: "Challenges", icon: Rocket },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/assistant", label: "AI Coach", icon: Bot }
];

export default function AppLayout({ dark, onToggleTheme, isAuthed, onLogout }: Props) {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${dark ? "dark" : "light"}`}>
      <div className="app-gradient min-h-screen">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-900/70 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <span className="rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 px-3 py-1 text-sm">GamifyU</span>
              <span className="hidden text-slate-300 md:block">Learning OS</span>
            </Link>
            <div className="flex items-center gap-2">
              <button onClick={onToggleTheme} className="rounded-xl border border-white/15 p-2">
                {dark ? <Sun size={16} /> : <MoonStar size={16} />}
              </button>
              {isAuthed ? (
                <button
                  onClick={() => {
                    onLogout();
                    navigate("/");
                  }}
                  className="rounded-xl border border-white/15 px-3 py-2 text-sm"
                >
                  Logout
                </button>
              ) : (
                <Link to="/" className="rounded-xl border border-white/15 px-3 py-2 text-sm">
                  Login
                </Link>
              )}
            </div>
          </div>
        </header>
        {isAuthed && (
          <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 md:px-8">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-2xl px-4 py-2 text-sm ${isActive ? "bg-brand-600 text-white shadow-glow" : "bg-white/5 text-slate-300"}`
                }
              >
                <link.icon size={16} />
                {link.label}
              </NavLink>
            ))}
            <div className="ml-auto flex items-center gap-2 rounded-2xl bg-orange-500/15 px-4 py-2 text-orange-300">
              <Flame size={16} />
              Daily streak
            </div>
          </nav>
        )}
        <main className="mx-auto max-w-7xl px-4 pb-10 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


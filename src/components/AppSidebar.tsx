import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Receipt,
  Landmark,
  FileText,
  Shield,
  Settings,
  LogOut,
  Wallet,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Transactions", icon: Receipt, path: "/transactions" },
  { label: "Budgets", icon: Wallet, path: "/budgets" },
  { label: "Ledgers", icon: Landmark, path: "/ledgers" },
  { label: "Import Statement", icon: FileText, path: "/import" },
];

const adminItems = [
  { label: "Master Admin", icon: Shield, path: "/admin" },
];

const bottomItems = [
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 pb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black overflow-hidden ring-1 ring-zinc-800 shadow-md">
          <img src="/logo-black.png" alt="Logo" className="h-full w-full object-cover" />
        </div>
        <span className="text-lg font-bold text-foreground">MoneyFlow</span>
      </div>
      <div className="px-5 pb-5">
        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 pt-2">
        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Menu</p>
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {user?.role === "admin" && (
          <>
            <p className="mb-2 mt-6 px-2 text-xs font-semibold uppercase tracking-wider text-warning">Admin Controls</p>
            <ul className="space-y-0.5">
              {adminItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4 text-expense" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border px-3 py-3">
        {bottomItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
        <div className="flex items-center gap-3 px-3 pt-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm font-medium text-expense hover:underline"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

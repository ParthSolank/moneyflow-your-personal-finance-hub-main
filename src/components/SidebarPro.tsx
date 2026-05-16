import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  Landmark, 
  FileText, 
  Shield, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSidebarPro } from "@/hooks/useSidebarPro";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

/**
 * SidebarPro Component
 * 
 * A professional, high-performance sidebar for the MoneyFlow dashboard.
 * Features:
 * - Expandable/Collapsible states with Framer Motion animations.
 * - Responsive design (Mobile Sheet vs Desktop Fixed).
 * - Navigation for both standard users and administrators.
 * - Dynamic logo and user profile sections.
 */
export const SidebarPro = () => {
  // Global sidebar state (collapsed, mobile) from custom hook
  const { isCollapsed, toggleSidebar, isMobile } = useSidebarPro();
  
  // Auth state for user details and logout functionality
  const { user, logout } = useAuth();
  
  const location = useLocation();
  const navigate = useNavigate();

  // Helper to determine if a route is currently active
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /**
   * Internal sub-component to render the navigation links and logo.
   * Shared between Desktop and Mobile views.
   */
  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6">
      {/* Top Section: Logo & App Title */}
      <div className={cn(
        "px-6 mb-8 flex items-center transition-all duration-300",
        isCollapsed ? "justify-center px-0" : "justify-start gap-3"
      )}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black shadow-lg overflow-hidden ring-1 ring-zinc-800">
            <img src="/logo-black.png" alt="Logo" className="h-full w-full object-cover" />
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col whitespace-nowrap min-w-0"
            >
              <span className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">
                MoneyFlow
              </span>
              <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                {new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
              </span>
            </motion.div>
          )}
        </div>
        {!isCollapsed && !isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="ml-auto h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Toggle Button for Collapsed State */}
      {isCollapsed && !isMobile && (
        <div className="px-6 mb-6 flex justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Menu Section */}
      <nav className="flex-1 px-4 space-y-8 overflow-y-auto no-scrollbar">
        <div>
          {!isCollapsed && (
            <p className="px-2 mb-4 text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.1em]">
              Menu
            </p>
          )}
          <ul className="space-y-1.5">
            {navItems.map((item) => (
              <li key={item.path}>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          isActive(item.path)
                            ? "bg-white dark:bg-zinc-800 text-purple-600 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
                            : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        )}
                      >
                        <item.icon className={cn("h-5 w-5 shrink-0", isActive(item.path) ? "text-purple-600" : "text-inherit")} />
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
              </li>
            ))}
          </ul>
        </div>

        {/* Admin Section */}
        {user?.role === "admin" && (
          <div>
            {!isCollapsed && (
              <p className="px-2 mb-4 text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.1em]">
                Admin Controls
              </p>
            )}
            <ul className="space-y-1.5">
              {adminItems.map((item) => (
                <li key={item.path}>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={item.path}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                            isActive(item.path)
                              ? "bg-white dark:bg-zinc-800 text-purple-600 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
                              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          )}
                        >
                          <item.icon className={cn("h-5 w-5 shrink-0", isActive(item.path) ? "text-purple-600" : "text-inherit")} />
                          {!isCollapsed && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="whitespace-nowrap"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </Link>
                      </TooltipTrigger>
                      {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                    </Tooltip>
                  </TooltipProvider>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="px-4 mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-1.5">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/settings"
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive("/settings")
                    ? "bg-white dark:bg-zinc-800 text-purple-600 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}
              >
                <Settings className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>Settings</span>}
              </Link>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">Settings</TooltipContent>}
          </Tooltip>
        </TooltipProvider>

        <div className={cn(
          "flex items-center gap-3 px-3 py-4 mt-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl transition-all duration-300",
          isCollapsed ? "justify-center px-2" : "justify-between"
        )}>
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar className="h-8 w-8 shrink-0 ring-2 ring-white dark:ring-zinc-700">
              <AvatarFallback className="bg-purple-100 text-purple-600 text-xs font-bold">
                {user?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col whitespace-nowrap"
              >
                <span className="text-xs font-bold text-zinc-900 dark:text-white leading-tight truncate max-w-[100px]">
                  {user?.fullName || "User Name"}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium">
                  {user?.role === "admin" ? "Pro Admin" : "User"}
                </span>
              </motion.div>
            )}
          </div>
          {!isCollapsed && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-3 left-4 z-50 md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[260px] bg-[#f5f5f5] dark:bg-zinc-900 border-none">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 z-40 h-screen bg-[#f5f5f5] dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 shadow-sm"
    >
      <SidebarContent />
    </motion.aside>
  );
};

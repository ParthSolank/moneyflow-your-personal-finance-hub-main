import { ReactNode } from "react";
import { SidebarPro } from "./SidebarPro";
import { SidebarProvider, useSidebarPro } from "@/hooks/useSidebarPro";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * AppLayout Component
 * 
 * The primary layout wrapper for all authenticated pages.
 * Handles:
 * - Integration of the SidebarPro.
 * - Dynamic content area margins based on sidebar collapse state.
 * - Sticky top header with user avatar.
 * - Responsive breakpoints for mobile support.
 */
const LayoutContent = ({ children }: AppLayoutProps) => {
  const { isCollapsed, isMobile } = useSidebarPro();

  return (
    <div className="flex min-h-screen bg-background dark:bg-zinc-950">
      {/* Permanent sidebar component */}
      <SidebarPro />
      
      {/* Main content area: Margins adjust dynamically as sidebar expands/collapses */}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isMobile ? "ml-0" : isCollapsed ? "ml-[80px]" : "ml-[260px]"
      )}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-end border-b border-border/40 bg-background/80 backdrop-blur-md px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-900 dark:text-zinc-100 ring-1 ring-zinc-200 dark:ring-zinc-700">
            JS
          </div>
        </header>
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}

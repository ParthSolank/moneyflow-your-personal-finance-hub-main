import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-60 flex-1">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-end border-b border-border bg-card px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            JS
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

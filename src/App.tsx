import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Ledgers from "./pages/Ledgers";
import ImportStatement from "./pages/ImportStatement";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Budgets from "./pages/Budgets";
import LedgerDetails from "./pages/LedgerDetails";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * Main App Component
 * 
 * This is the root component of the React application.
 * It sets up:
 * - React Query Client for data fetching and caching.
 * - Global Authentication Context (AuthProvider).
 * - Tooltip Provider for UI accessibility.
 * - Centralized Toaster for notifications.
 * - Client-side Routing using React Router.
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        {/* Global UI feedback components */}
        <Toaster />
        <Sonner />
        
        <BrowserRouter>
          <Routes>
            {/* Public authentication routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected application routes (require login) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/ledgers" element={<Ledgers />} />
              <Route path="/ledgers/:id" element={<LedgerDetails />} />
              <Route path="/import" element={<ImportStatement />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Fallback for unknown routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

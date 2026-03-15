import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import AdminCatalogPage from "./pages/AdminCatalogPage";
import VendorExplorePage from "./pages/VendorExplorePage";
import VendorInventoryPage from "./pages/VendorInventoryPage";
import SalesPage from "./pages/SalesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/admin/catalog" replace />} />
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/catalog" element={<AdminCatalogPage />} />
              <Route path="/vendor/explore" element={<VendorExplorePage />} />
              <Route path="/vendor/inventory" element={<VendorInventoryPage />} />
              <Route path="/sales" element={<SalesPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

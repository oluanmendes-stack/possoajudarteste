import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import LoginPossoAjudar from "./pages/LoginPossoAjudar";
import Dashboard from "./pages/Dashboard";
import LancarVendas from "./pages/LancarVendas";
import Products from "./pages/Products";
import CanaisdCobranca from "./pages/CanaisdCobranca";
import Profile from "./pages/Profile";
import CadastrarProdutos from "./pages/CadastrarProdutos";
import CadastrarColaboradora from "./pages/CadastrarColaboradora";
import Relatorio from "./pages/Relatorio";
import ControleGratificacao from "./pages/ControleGratificacao";
import DashboardAdmin from "./pages/DashboardAdmin";
import AdminSetup from "./pages/AdminSetup";
import PromoteToAdmin from "./pages/PromoteToAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPossoAjudar />} />
            <Route path="/admin-setup" element={<AdminSetup />} />
            <Route path="/promote-to-admin" element={<PromoteToAdmin />} />
            <Route
              path="/cadastrar-colaboradora"
              element={<CadastrarColaboradora />}
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lancar-vendas" element={<LancarVendas />} />
            <Route path="/products" element={<Products />} />
            <Route path="/canais-cobranca" element={<CanaisdCobranca />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cadastrar-produtos" element={<CadastrarProdutos />} />
            <Route path="/relatorio" element={<Relatorio />} />
            <Route path="/controle-gratificacao" element={<ControleGratificacao />} />
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />
            {/* ADICIONE TODAS AS ROTAS CUSTOMIZADAS ACIMA DA ROTA CATCH-ALL "*" */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// Protege contra criação dupla de raiz em modo HMR
const rootElement = document.getElementById("root");
if (rootElement && !rootElement._reactRoot) {
  const root = createRoot(rootElement);
  (rootElement as any)._reactRoot = root;
  root.render(<App />);
}

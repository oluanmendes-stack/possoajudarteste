import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Plus, Home, LogOut, TrendingUp, BarChart3, CreditCard, FileText, Gift, Shield, Settings } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Logo } from "./Logo";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 text-teal-600 hover:bg-teal-50 rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 pt-20 flex-1 flex flex-col overflow-hidden">
          {/* Logo Section */}
          <div className="mb-4 flex items-center gap-3 pb-4 border-b border-teal-100 flex-shrink-0">
            <Logo size={40} />
            <div>
              <h1 className="text-base font-bold text-teal-900">Posso Ajudar</h1>
              <p className="text-xs text-teal-600">Voluntária</p>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="mb-4 pb-4 border-b border-teal-100 flex-shrink-0">
            <p className="text-xs text-teal-600 font-medium">Bem-vindo,</p>
            <h2 className="text-base font-bold text-teal-900">
              {currentUser?.apelido || "Voluntária"}
            </h2>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1 overflow-y-auto pr-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-2 text-sm text-teal-900 hover:bg-teal-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Home size={18} />
              <span>Início</span>
            </Link>

            <Link
              to="/lancar-vendas"
              className="flex items-center gap-3 px-4 py-2 text-sm text-teal-900 hover:bg-teal-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <TrendingUp size={18} />
              <span>Lançar Vendas</span>
            </Link>

            <Link
              to="/products"
              className="flex items-center gap-3 px-4 py-2 text-sm text-teal-900 hover:bg-teal-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <BarChart3 size={18} />
              <span>Produtos</span>
            </Link>

            <Link
              to="/canais-cobranca"
              className="flex items-center gap-3 px-4 py-2 text-sm text-teal-900 hover:bg-teal-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <CreditCard size={18} />
              <span>Canais de Cobrança</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-teal-900 hover:bg-teal-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User size={18} />
              <span>Meu Perfil</span>
            </Link>

            <Link
              to="/cadastrar-produtos"
              className="flex items-center gap-3 px-4 py-2 text-sm text-teal-900 hover:bg-teal-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Plus size={18} />
              <span>Cadastrar Produtos</span>
            </Link>

            <Link
              to="/relatorio"
              className="flex items-center gap-3 px-4 py-2 text-sm text-teal-900 hover:bg-teal-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FileText size={18} />
              <span>Relatório de Vendas</span>
            </Link>

            <Link
              to="/controle-gratificacao"
              className="flex items-center gap-3 px-4 py-2 text-sm text-teal-900 hover:bg-teal-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Gift size={18} />
              <span>Controle de Gratificação</span>
            </Link>

            {currentUser?.is_admin && (
              <>
                <Link
                  to="/dashboard-admin"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-purple-900 hover:bg-purple-50 rounded-lg transition-colors border-l-4 border-purple-600 bg-purple-50"
                  onClick={() => setIsOpen(false)}
                >
                  <Shield size={18} />
                  <span>Dashboard Admin</span>
                </Link>
                <Link
                  to="/cadastrar-periodo"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Plus size={18} />
                  <span>Cadastrar Período</span>
                </Link>
              </>
            )}
          </nav>

          {/* Logout */}
          <div className="mt-4 pt-4 border-t border-teal-100 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm bg-teal-100 text-teal-700 hover:bg-teal-200 rounded-lg transition-colors font-medium"
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

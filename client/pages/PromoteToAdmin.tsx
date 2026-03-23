import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Shield } from "lucide-react";

export default function PromoteToAdmin() {
  const navigate = useNavigate();
  const { currentUser, makeCurrentUserAdmin } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-600 font-semibold">Nenhum usuário logado</p>
          <Button
            onClick={() => navigate("/")}
            className="mt-4 bg-teal-600 hover:bg-teal-700"
          >
            Voltar ao Login
          </Button>
        </div>
      </div>
    );
  }

  const handlePromoteToAdmin = async () => {
    setIsLoading(true);
    try {
      await makeCurrentUserAdmin();
      toast.success("Usuário promovido a admin com sucesso!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao promover para admin"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 px-4 py-8">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-teal-700 hover:text-teal-900 font-medium mb-8"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
              <Shield size={32} className="text-teal-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-teal-900 mb-2">
            Promover para Admin
          </h1>

          <p className="text-teal-700 mb-6">
            Usuário: <span className="font-semibold">{currentUser.nomeCompleto}</span>
          </p>

          <p className="text-sm text-teal-600 mb-8">
            Clique no botão abaixo para dar acesso admin a este usuário. Isso permite:
          </p>

          <ul className="text-left text-sm text-teal-600 mb-8 space-y-2 bg-teal-50 p-4 rounded-lg">
            <li>✓ Editar meta de vendas</li>
            <li>✓ Visualizar dashboard admin</li>
            <li>✓ Ver comparativo de voluntárias</li>
          </ul>

          <Button
            onClick={handlePromoteToAdmin}
            disabled={isLoading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 h-10 flex items-center justify-center gap-2"
          >
            <Shield size={18} />
            {isLoading ? "Promovendo..." : "Promover para Admin"}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { Logo } from "@/components/Logo";

export default function LoginPossoAjudar() {
  const navigate = useNavigate();
  const { loginAsync } = useApp();
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!matricula || !senha) {
      setError("Preencha todos os campos");
      return;
    }

    // Validate password format (11 digits)
    if (!/^\d{11}$/.test(senha)) {
      setError("Senha inválida. Deve conter 11 dígitos");
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginAsync(matricula, senha);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Erro ao fazer login");
      }
    } catch (err) {
      setError("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <Logo size={96} />
          </div>

          <h1 className="text-3xl font-bold text-teal-900 mb-2">
            Posso Ajudar?
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-teal-900 mb-2">
              Matrícula
            </label>
            <Input
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="Digite sua matrícula"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-teal-900 mb-2">
              Senha
            </label>
            <Input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              maxLength={11}
              autoComplete="current-password"
              className="w-full"
            />
            <p className="text-xs text-teal-700 mt-2">
              💡 A senha deve conter 11 dígitos
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 h-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="border-t border-teal-200 pt-6 mt-6">
          <p className="text-center text-teal-700 text-sm mb-4">
            Primeira vez aqui?
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full border-teal-600 text-teal-600 hover:bg-teal-50 font-semibold py-2 h-10"
            onClick={() => navigate("/cadastrar-colaboradora")}
          >
            Cadastrar Nova Colaboradora
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to registration on submit
    if (!isLogin) {
      // Redirect to register page
      window.location.href = "/register";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          {/* Logo */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            className="mx-auto mb-6"
          >
            {/* Left person - smaller head */}
            <circle
              cx="28"
              cy="16"
              r="7"
              stroke="#14B8A6"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Right person - larger head */}
            <circle
              cx="50"
              cy="12"
              r="9"
              stroke="#14B8A6"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Left person body */}
            <path
              d="M 28 23 L 28 38 Q 28 45 22 52 Q 20 56 20 60 L 20 68 Q 20 70 22 70 L 34 70 Q 36 70 36 68 L 36 60 Q 36 56 34 52 Q 28 45 28 38"
              stroke="#14B8A6"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Right person body */}
            <path
              d="M 50 21 L 50 38 Q 50 45 58 52 Q 60 56 60 60 L 60 68 Q 60 70 58 70 L 42 70 Q 40 70 40 68 L 40 60 Q 40 56 42 52 Q 50 45 50 38"
              stroke="#14B8A6"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Left person arm */}
            <path
              d="M 20 30 Q 15 32 14 40 L 14 60"
              stroke="#14B8A6"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Right person arm */}
            <path
              d="M 60 28 Q 65 30 66 40 L 66 60"
              stroke="#14B8A6"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Faça Adesão
          </h1>
          <p className="text-slate-600">Bem-vindo ao sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Senha
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full"
            />
          </div>

          {!isLogin && (
            <Button
              asChild
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 h-10"
            >
              <Link to="/register">Novo Cadastro</Link>
            </Button>
          )}

          {isLogin && (
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 h-10"
            >
              Login
            </Button>
          )}
        </form>

        <div className="flex gap-4">
          <Button
            onClick={() => setIsLogin(true)}
            variant={isLogin ? "default" : "outline"}
            className="flex-1 h-10"
          >
            Login
          </Button>
          <Button
            onClick={() => setIsLogin(false)}
            variant={!isLogin ? "default" : "outline"}
            className="flex-1 h-10"
          >
            Signup
          </Button>
        </div>

        <p className="text-center text-slate-600 text-sm mt-6">
          Esqueceu a senha?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Recuperar
          </a>
        </p>
      </div>
    </div>
  );
}

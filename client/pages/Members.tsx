import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const MEMBERS = [
  { id: 1, name: "João Silva", email: "joao@example.com", status: "Ativo" },
  { id: 2, name: "Maria Santos", email: "maria@example.com", status: "Ativo" },
  { id: 3, name: "Pedro Costa", email: "pedro@example.com", status: "Pendente" },
  { id: 4, name: "Ana Oliveira", email: "ana@example.com", status: "Ativo" },
  { id: 5, name: "Carlos Souza", email: "carlos@example.com", status: "Ativo" },
  { id: 6, name: "Beatriz Lima", email: "beatriz@example.com", status: "Completo" },
];

export default function Members() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/design"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Geral Membros</h1>
          <p className="text-slate-600 mt-2">
            Veja todos os membros do grupo
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {MEMBERS.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-600"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <User size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900">{member.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                    <Mail size={14} />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="mt-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        member.status === "Ativo"
                          ? "bg-green-100 text-green-800"
                          : member.status === "Pendente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-10"
            onClick={() => (window.location.href = "/design")}
          >
            Voltar
          </Button>
          <Button
            onClick={() => (window.location.href = "/login")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white h-10"
          >
            Finalizar
          </Button>
        </div>
      </div>
    </div>
  );
}

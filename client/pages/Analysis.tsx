import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import { Link } from "react-router-dom";

const ANALYSIS_ITEMS = [
  { id: 1, label: "Item 1", value: "Ativo" },
  { id: 2, label: "Item 2", value: "Pendente" },
  { id: 3, label: "Item 3", value: "Completo" },
  { id: 4, label: "Item 4", value: "Ativo" },
  { id: 5, label: "Item 5", value: "Pendente" },
  { id: 6, label: "Item 6", value: "Completo" },
];

export default function Analysis() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/selection"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Análise Adesão</h1>
          <p className="text-slate-600 mt-2">
            Visualize sua análise de adesão
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                João Silva
              </h2>
              <p className="text-slate-600">joão@example.com</p>
              <p className="text-sm text-slate-500 mt-1">
                Membro desde Janeiro de 2024
              </p>
            </div>
          </div>
        </div>

        {/* Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {ANALYSIS_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-600"
            >
              <p className="text-sm font-medium text-slate-600">{item.label}</p>
              <p className="text-lg font-semibold text-slate-900 mt-2">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-10"
            onClick={() => (window.location.href = "/selection")}
          >
            Voltar
          </Button>
          <Button
            onClick={() => (window.location.href = "/design")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-10"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}

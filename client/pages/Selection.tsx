import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";

const SELECTION_ITEMS = [
  { id: 1, title: "Opção 1", description: "Descrição da opção 1" },
  { id: 2, title: "Opção 2", description: "Descrição da opção 2" },
  { id: 3, title: "Opção 3", description: "Descrição da opção 3" },
  { id: 4, title: "Opção 4", description: "Descrição da opção 4" },
];

export default function Selection() {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selected) {
      window.location.href = "/analysis";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Passo Adesão</h1>
          <p className="text-slate-600 mt-2">Selecione uma opção para continuar</p>
        </div>

        {/* Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {SELECTION_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                selected === item.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {item.description}
                  </p>
                </div>
                {selected === item.id && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-10"
            onClick={() => (window.location.href = "/register")}
          >
            Voltar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selected}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white h-10"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}

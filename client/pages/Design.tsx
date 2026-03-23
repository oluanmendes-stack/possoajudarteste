import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const DESIGN_ITEMS = [
  { id: 1, title: "Design 1", members: 5 },
  { id: 2, title: "Design 2", members: 3 },
  { id: 3, title: "Design 3", members: 7 },
  { id: 4, title: "Design 4", members: 2 },
  { id: 5, title: "Design 5", members: 4 },
  { id: 6, title: "Design 6", members: 6 },
];

export default function Design() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/analysis"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">
            Qual Membros Design Cadastro?
          </h1>
          <p className="text-slate-600 mt-2">Selecione um design</p>
        </div>

        {/* Design Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {DESIGN_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`rounded-lg border-2 transition-all overflow-hidden ${
                selected === item.id
                  ? "border-blue-600 shadow-lg"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="bg-slate-100 h-32 flex items-center justify-center border-b border-slate-200">
                <Plus size={32} className="text-slate-400" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 text-sm">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2">
                  {item.members} membros
                </p>
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
            onClick={() => (window.location.href = "/analysis")}
          >
            Voltar
          </Button>
          <Button
            onClick={() => (window.location.href = "/members")}
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

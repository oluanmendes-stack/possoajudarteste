import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { User } from "@/hooks/useAppData";

interface EditMetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (newMeta: number) => void;
}

export function EditMetaModal({ isOpen, onClose, user, onSave }: EditMetaModalProps) {
  const [newMeta, setNewMeta] = useState(user.meta.toString());

  useEffect(() => {
    setNewMeta(user.meta.toString());
  }, [user.meta, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const metaValue = parseFloat(newMeta);
    
    if (isNaN(metaValue) || metaValue <= 0) {
      alert("Digite uma meta válida (maior que 0)");
      return;
    }

    onSave(metaValue);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-teal-900">Editar Meta Mensal</h2>
          <button
            onClick={onClose}
            className="p-1 text-teal-600 hover:bg-teal-50 rounded"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-teal-900 mb-2">
              Meta Mensal (unidades)
            </label>
            <Input
              type="number"
              min="1"
              step="1"
              value={newMeta}
              onChange={(e) => setNewMeta(e.target.value)}
              placeholder="Ex: 100"
              className="w-full text-lg"
              autoFocus
            />
            <p className="text-xs text-teal-600 mt-2">
              Meta atual: {user.meta} unidades
            </p>
          </div>

          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
            <p className="text-sm text-teal-900">
              <span className="font-semibold">Progresso atual:</span> {user.metaAtingida} / {user.meta} unidades
            </p>
            <div className="w-full bg-teal-200 rounded-full h-2 mt-3">
              <div
                className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((user.metaAtingida / user.meta) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold"
            >
              Salvar Meta
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

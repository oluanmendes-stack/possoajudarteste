import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Save, Camera, Edit, X } from "lucide-react";
import { toast } from "sonner";
import { EditMetaModal } from "@/components/EditMetaModal";
import { User } from "@/hooks/useAppData";

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, updateUser, getTotalSalesByProduct, products, getDonationsByUser } =
    useApp();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);
  const [isEditMetaOpen, setIsEditMetaOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    } else {
      setFormData(currentUser);
      setPhotoPreview(currentUser.foto || null);
    }
  }, [currentUser, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        if (formData) {
          setFormData({
            ...formData,
            foto: result,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    if (formData) {
      setFormData({
        ...formData,
        foto: undefined,
      });
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    if (!formData.apelido.trim()) {
      toast.error("Apelido é obrigatório");
      return;
    }

    if (!formData.emailPessoal?.trim()) {
      toast.error("Email pessoal é obrigatório");
      return;
    }

    setIsLoading(true);
    try {
      await updateUser(formData);
      toast.success("Perfil atualizado com sucesso!");
      setEditing(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar perfil"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser || !formData) return null;

  const totalSalesByProduct = getTotalSalesByProduct(currentUser.id);
  const totalSalesMonth = Object.values(totalSalesByProduct).reduce(
    (a, b) => a + b,
    0
  );
  const progressPercentage = Math.min(
    (currentUser.metaAtingida / currentUser.meta) * 100,
    100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <Sidebar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-teal-200">
        <div className="max-w-4xl mx-auto px-4 py-6 pl-20">
          <h1 className="text-3xl font-bold text-teal-900">Meu Perfil</h1>
          <p className="text-teal-600 mt-1">Gerencie suas informações e metas</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 pl-20">
        {/* Profile Photo Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-lg font-semibold text-teal-900 mb-6">
            Foto de Perfil
          </h2>

          <div className="flex flex-col items-center gap-6">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-teal-200 bg-teal-50 flex items-center justify-center shadow-lg">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera size={64} className="text-teal-400" />
              )}
            </div>

            {editing && (
              <div className="flex gap-3">
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors">
                  <Upload size={18} />
                  Enviar Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {photoPreview && (
                  <button
                    onClick={handleRemovePhoto}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                  >
                    <X size={18} />
                    Remover
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-teal-900">
              Informações Pessoais
            </h2>
            <Button
              onClick={() => {
                if (editing) {
                  handleSave();
                } else {
                  setEditing(true);
                }
              }}
              disabled={isLoading}
              className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {editing ? "Salvar" : "Editar"}
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-teal-900 mb-2">
                Matrícula
              </label>
              <Input
                type="text"
                value={formData.matricula}
                disabled
                className="bg-teal-50 text-teal-900 font-mono cursor-not-allowed"
              />
              <p className="text-xs text-teal-600 mt-1">
                Matrícula não pode ser alterada
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-900 mb-2">
                CPF
              </label>
              <Input
                type="text"
                value={formData.cpf}
                disabled
                className="bg-teal-50 text-teal-900 font-mono cursor-not-allowed"
              />
              <p className="text-xs text-teal-600 mt-1">
                CPF não pode ser alterado
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-900 mb-2">
                Nome Completo
              </label>
              <Input
                type="text"
                value={formData.nomeCompleto}
                disabled
                className="bg-teal-50 text-teal-900 cursor-not-allowed"
              />
              <p className="text-xs text-teal-600 mt-1">
                Nome não pode ser alterado
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-900 mb-2">
                Apelido (Como gostaria de ser chamada) *
              </label>
              {editing ? (
                <Input
                  type="text"
                  value={formData.apelido}
                  onChange={(e) =>
                    setFormData({ ...formData, apelido: e.target.value })
                  }
                  placeholder="Digite seu apelido"
                />
              ) : (
                <div className="p-3 bg-teal-50 rounded-lg text-teal-900 font-medium">
                  {formData.apelido}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-900 mb-2">
                Email Institucional
              </label>
              <Input
                type="email"
                value={formData.emailInstitucional}
                disabled
                className="bg-teal-50 text-teal-900 cursor-not-allowed"
              />
              <p className="text-xs text-teal-600 mt-1">
                Email institucional não pode ser alterado
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-900 mb-2">
                Email Pessoal *
              </label>
              {editing ? (
                <Input
                  type="email"
                  value={formData.emailPessoal || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, emailPessoal: e.target.value })
                  }
                  placeholder="seu.email@pessoal.com"
                />
              ) : (
                <div className="p-3 bg-teal-50 rounded-lg text-teal-900">
                  {formData.emailPessoal || "-"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-900 mb-2">
                Número Corporativo
              </label>
              {editing ? (
                <Input
                  type="text"
                  value={formData.numeroCorporativo || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numeroCorporativo: e.target.value,
                    })
                  }
                  placeholder="Ex: (11) 9999-9999"
                />
              ) : (
                <div className="p-3 bg-teal-50 rounded-lg text-teal-900">
                  {formData.numeroCorporativo || "-"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-900 mb-2">
                Ramal
              </label>
              {editing ? (
                <Input
                  type="text"
                  value={formData.ramal || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, ramal: e.target.value })
                  }
                  placeholder="Ex: 1234"
                />
              ) : (
                <div className="p-3 bg-teal-50 rounded-lg text-teal-900">
                  {formData.ramal || "-"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Meta Goals Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-teal-900">
              Meta de Vendas
            </h2>
            {currentUser.is_admin && (
              <Button
                onClick={() => setIsEditMetaOpen(true)}
                variant="outline"
                className="flex items-center gap-2 text-teal-600 hover:bg-teal-50 border-teal-200"
              >
                <Edit size={16} />
                Editar
              </Button>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-teal-900 mb-2">
                Meta Mensal (itens)
              </label>
              {editing ? (
                <Input
                  type="number"
                  value={formData.meta}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta: parseInt(e.target.value) || 0,
                    })
                  }
                  min="1"
                />
              ) : (
                <div className="p-3 bg-teal-50 rounded-lg text-teal-900 font-bold text-lg">
                  {formData.meta} itens
                </div>
              )}
            </div>

            {/* Gamification Bar */}
            <div className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg border-2 border-teal-200">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-semibold text-teal-900">
                  Progresso Mensal
                </p>
                <p className="text-2xl font-bold text-teal-600">
                  {currentUser.metaAtingida}/{currentUser.meta}
                </p>
              </div>

              <div className="w-full bg-white rounded-full h-8 border-2 border-teal-200 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 h-full flex items-center justify-center transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                >
                  {progressPercentage > 15 && (
                    <span className="text-white font-bold text-sm">
                      {Math.round(progressPercentage)}%
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-4 text-sm text-teal-700">
                {progressPercentage >= 100
                  ? "🎉 Parabéns! Você atingiu sua meta!"
                  : `Faltam ${currentUser.meta - currentUser.metaAtingida} itens para atingir sua meta`}
              </p>
            </div>
          </div>
        </div>

        {/* Donations Summary */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-lg font-semibold text-teal-900 mb-6">
            Resumo de Doações por Canal
          </h2>

          {getDonationsByUser(currentUser.id).length > 0 ? (
            <div className="space-y-3">
              {Array.from(
                new Set(getDonationsByUser(currentUser.id).map((d) => d.tipo))
              ).map((tipo) => {
                const donationsOfType = getDonationsByUser(currentUser.id).filter(
                  (d) => d.tipo === tipo
                );
                const total = donationsOfType.reduce((a, b) => a + b.valor, 0);
                const bgColor = tipo === "agua" ? "bg-blue-50" : tipo === "luz" ? "bg-yellow-50" : "bg-purple-50";
                const textColor = tipo === "agua" ? "text-blue-600" : tipo === "luz" ? "text-yellow-600" : "text-purple-600";

                return (
                  <div
                    key={tipo}
                    className={`flex items-center justify-between p-4 rounded-lg ${bgColor}`}
                  >
                    <div>
                      <p className="font-medium text-teal-900">
                        {tipo === "agua" ? "Água" : tipo === "luz" ? "Luz" : "PIX"}
                      </p>
                      <p className="text-xs text-teal-600">
                        {donationsOfType.length} registro(s)
                      </p>
                    </div>
                    <p className={`text-xl font-bold ${textColor}`}>
                      R$ {total.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-teal-600 text-center py-6">
              Nenhuma doação registrada
            </p>
          )}
        </div>

        {/* Sales Summary */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-lg font-semibold text-teal-900 mb-6">
            Resumo de Vendas por Produto
          </h2>

          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-teal-50 rounded-lg"
              >
                <p className="font-medium text-teal-900">{product.nome}</p>
                <p className="text-xl font-bold text-teal-600">
                  {totalSalesByProduct[product.id] || 0} vendido(s)
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t-2 border-teal-200 flex items-center justify-between">
            <p className="font-semibold text-teal-900 text-lg">Total do Mês</p>
            <p className="text-3xl font-bold text-teal-600">{totalSalesMonth}</p>
          </div>
        </div>

        {editing && (
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Save size={18} />
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setFormData(currentUser);
                setPhotoPreview(currentUser.foto || null);
              }}
              disabled={isLoading}
              className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold py-3 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}

        {editing && (
          <p className="text-xs text-teal-600 mt-4 text-center">
            * Campos obrigatórios
          </p>
        )}

        {/* Edit Meta Modal */}
        {currentUser && (
          <EditMetaModal
            isOpen={isEditMetaOpen}
            onClose={() => setIsEditMetaOpen(false)}
            user={currentUser}
            onSave={(newMeta) => {
              updateUser({ ...currentUser, meta: newMeta });
            }}
          />
        )}
      </div>
    </div>
  );
}

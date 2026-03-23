import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Save, Camera, X } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/hooks/useAppData";

export default function EditarPerfil() {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useApp();
  const [formData, setFormData] = useState<User | null>(null);
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
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar perfil"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (currentUser) {
      setFormData(currentUser);
      setPhotoPreview(currentUser.foto || null);
    }
  };

  if (!currentUser || !formData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <Sidebar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-teal-200">
        <div className="max-w-4xl mx-auto px-4 py-6 pl-20">
          <h1 className="text-3xl font-bold text-teal-900">Editar Perfil</h1>
          <p className="text-teal-600 mt-1">Atualize suas informações pessoais</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 pl-20">
        {/* Photo Section */}
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
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-lg font-semibold text-teal-900 mb-6">
            Informações Pessoais
          </h2>

          <div className="space-y-6">
            {/* Matrícula */}
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

            {/* CPF */}
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

            {/* Nome Completo */}
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

            {/* Apelido */}
            <div>
              <label className="block text-sm font-medium text-teal-900 mb-2">
                Apelido (Como gostaria de ser chamada) *
              </label>
              <Input
                type="text"
                value={formData.apelido}
                onChange={(e) =>
                  setFormData({ ...formData, apelido: e.target.value })
                }
                placeholder="Digite seu apelido"
                className="w-full"
              />
            </div>

            {/* Email Institucional */}
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

            {/* Email Pessoal */}
            <div>
              <label className="block text-sm font-medium text-teal-900 mb-2">
                Email Pessoal *
              </label>
              <Input
                type="email"
                value={formData.emailPessoal || ""}
                onChange={(e) =>
                  setFormData({ ...formData, emailPessoal: e.target.value })
                }
                placeholder="seu.email@pessoal.com"
                className="w-full"
              />
            </div>

            {/* Telefone Corporativo */}
            <div>
              <label className="block text-sm font-medium text-teal-900 mb-2">
                Número Corporativo
              </label>
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
                className="w-full"
              />
            </div>

            {/* Ramal */}
            <div>
              <label className="block text-sm font-medium text-teal-900 mb-2">
                Ramal
              </label>
              <Input
                type="text"
                value={formData.ramal || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ramal: e.target.value })
                }
                placeholder="Ex: 1234"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Save size={18} />
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold py-3 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>

        <p className="text-xs text-teal-600 mt-4 text-center">
          * Campos obrigatórios
        </p>
      </div>
    </div>
  );
}

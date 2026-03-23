import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { Logo } from "@/components/Logo";
import { ArrowLeft, Camera } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  matricula: string;
  cpf: string;
  nomeCompleto: string;
  emailInstitucional: string;
  apelido?: string;
  numeroCorporativo?: string;
  ramal?: string;
  emailPessoal?: string;
}

export default function CadastrarColaboradora() {
  const navigate = useNavigate();
  const { registerUser } = useApp();
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [foto, setFoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: "onBlur",
  });

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, selecione uma imagem válida");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFoto(base64);
        setFotoPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatCPF = (cpf: string): string => {
    const cleaned = cpf.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return cpf;
  };

  const validateCPF = (cpf: string): boolean => {
    const cleaned = cpf.replace(/\D/g, "");
    if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) {
      return false;
    }
    return true;
  };

  const onSubmit = async (data: FormData) => {
    if (!validateCPF(data.cpf)) {
      toast.error("CPF inválido");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({
        matricula: data.matricula.trim(),
        cpf: data.cpf.replace(/\D/g, ""),
        nomeCompleto: data.nomeCompleto.trim(),
        emailInstitucional: data.emailInstitucional.trim(),
        apelido: data.apelido?.trim(),
        numeroCorporativo: data.numeroCorporativo?.trim(),
        ramal: data.ramal?.trim(),
        emailPessoal: data.emailPessoal?.trim(),
        foto: foto || undefined,
      });

      toast.success("Colaboradora cadastrada com sucesso!");
      reset();
      setFoto(null);
      setFotoPreview(null);
      navigate("/");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao cadastrar colaboradora",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-teal-700 hover:text-teal-900 font-medium mb-6"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>

          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <Logo size={80} />
            </div>
            <h1 className="text-3xl font-bold text-teal-900 mb-2">
              Cadastrar Colaboradora
            </h1>
            <p className="text-teal-700">
              Preencha os dados abaixo para registrar uma nova colaboradora
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Photo Upload Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden border-4 border-teal-200">
                  {fotoPreview ? (
                    <img
                      src={fotoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="text-teal-400" size={40} />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-teal-600 rounded-full p-2 cursor-pointer hover:bg-teal-700 transition-colors">
                  <Camera size={16} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Required Fields Section */}
            <div>
              <h2 className="text-lg font-semibold text-teal-900 mb-4">
                Informações Obrigatórias
              </h2>
              <div className="space-y-4">
                {/* Matrícula */}
                <div>
                  <label className="block text-sm font-medium text-teal-900 mb-2">
                    Matrícula <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("matricula", {
                      required: "Matrícula é obrigatória",
                      minLength: {
                        value: 3,
                        message: "Matrícula deve ter no mínimo 3 caracteres",
                      },
                    })}
                    type="text"
                    placeholder="Digite a matrícula"
                    className={errors.matricula ? "border-red-500" : ""}
                  />
                  {errors.matricula && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.matricula.message}
                    </p>
                  )}
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-sm font-medium text-teal-900 mb-2">
                    CPF <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("cpf", {
                      required: "CPF é obrigatório",
                    })}
                    type="text"
                    placeholder="000.000.000-00"
                    className={errors.cpf ? "border-red-500" : ""}
                  />
                  {errors.cpf && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cpf.message}
                    </p>
                  )}
                </div>

                {/* Nome Completo */}
                <div>
                  <label className="block text-sm font-medium text-teal-900 mb-2">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("nomeCompleto", {
                      required: "Nome completo é obrigatório",
                      minLength: {
                        value: 5,
                        message: "Nome deve ter no mínimo 5 caracteres",
                      },
                    })}
                    type="text"
                    placeholder="Digite o nome completo"
                    className={errors.nomeCompleto ? "border-red-500" : ""}
                  />
                  {errors.nomeCompleto && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.nomeCompleto.message}
                    </p>
                  )}
                </div>

                {/* Email Institucional */}
                <div>
                  <label className="block text-sm font-medium text-teal-900 mb-2">
                    Email Institucional <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("emailInstitucional", {
                      required: "Email institucional é obrigatório",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email inválido",
                      },
                    })}
                    type="email"
                    placeholder="exemplo@instituicao.com.br"
                    className={
                      errors.emailInstitucional ? "border-red-500" : ""
                    }
                  />
                  {errors.emailInstitucional && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.emailInstitucional.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <hr className="my-6" />

            {/* Optional Fields Section */}
            <div>
              <h2 className="text-lg font-semibold text-teal-900 mb-4">
                Informações Adicionais (Opcionais)
              </h2>
              <div className="space-y-4">
                {/* Apelido */}
                <div>
                  <label className="block text-sm font-medium text-teal-900 mb-2">
                    Apelido (como gostaria de ser chamada)
                  </label>
                  <Input
                    {...register("apelido")}
                    type="text"
                    placeholder="Ex: Maria"
                  />
                </div>

                {/* Número Corporativo */}
                <div>
                  <label className="block text-sm font-medium text-teal-900 mb-2">
                    Número Corporativo
                  </label>
                  <Input
                    {...register("numeroCorporativo")}
                    type="text"
                    placeholder="Digite o número corporativo"
                  />
                </div>

                {/* Ramal */}
                <div>
                  <label className="block text-sm font-medium text-teal-900 mb-2">
                    Ramal
                  </label>
                  <Input
                    {...register("ramal")}
                    type="text"
                    placeholder="Digite o ramal"
                  />
                </div>

                {/* Email Pessoal */}
                <div>
                  <label className="block text-sm font-medium text-teal-900 mb-2">
                    Email Pessoal
                  </label>
                  <Input
                    {...register("emailPessoal", {
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email inválido",
                      },
                    })}
                    type="email"
                    placeholder="exemplo@email.com"
                    className={errors.emailPessoal ? "border-red-500" : ""}
                  />
                  {errors.emailPessoal && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.emailPessoal.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Cadastrando..." : "Cadastrar Colaboradora"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

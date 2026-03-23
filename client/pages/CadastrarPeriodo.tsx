import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CadastrarPeriodo() {
  const navigate = useNavigate();
  const { currentUser, periodos, createPeriodo, deletePeriodo, setPeriodoAtivo, getPeriodoAtivo } = useApp();
  
  const [nome, setNome] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser || !currentUser.is_admin) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleCreatePeriodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim() || !dataInicio || !dataFim) {
      toast.error("Preenchem todos os campos obrigatórios");
      return;
    }

    if (new Date(dataInicio) > new Date(dataFim)) {
      toast.error("A data inicial não pode ser posterior à data final");
      return;
    }

    setLoading(true);
    try {
      await createPeriodo(nome, dataInicio, dataFim, descricao);
      toast.success("Período cadastrado com sucesso!");
      
      // Limpar formulário
      setNome("");
      setDataInicio("");
      setDataFim("");
      setDescricao("");
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar período");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePeriodo = async (idPeriodo: string) => {
    if (!confirm("Tem certeza que deseja deletar este período?")) return;

    try {
      await deletePeriodo(idPeriodo);
      toast.success("Período deletado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao deletar período");
    }
  };

  const handleSetActive = async (idPeriodo: string) => {
    try {
      await setPeriodoAtivo(idPeriodo);
      toast.success("Período ativado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao ativar período");
    }
  };

  if (!currentUser || !currentUser.is_admin) return null;

  const periodoAtivo = getPeriodoAtivo();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <Sidebar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-teal-200">
        <div className="max-w-6xl mx-auto px-4 py-6 pl-20">
          <h1 className="text-3xl font-bold text-teal-900">Cadastrar Período</h1>
          <p className="text-teal-600 mt-1">
            Crie e gerencie períodos para os relatórios e dashboards
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 pl-20">
        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-teal-900 mb-6">
            Novo Período
          </h2>

          <form onSubmit={handleCreatePeriodo} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-teal-900 mb-2">
                  Nome do Período *
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Janeiro 2024"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-900 mb-2">
                  Descrição
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Período de vendas do mês"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-teal-900 mb-2">
                  <Calendar className="inline mr-2" size={16} />
                  Data Inicial *
                </label>
                <Input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-900 mb-2">
                  <Calendar className="inline mr-2" size={16} />
                  Data Final *
                </label>
                <Input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2"
            >
              {loading ? "Cadastrando..." : "Cadastrar Período"}
            </Button>
          </form>
        </div>

        {/* Período Ativo */}
        {periodoAtivo && (
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg shadow-sm p-6 mb-8 border-2 border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">
              ⭐ Período Ativo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-yellow-700">Nome</p>
                <p className="text-xl font-bold text-yellow-900">{periodoAtivo.nome}</p>
              </div>
              <div>
                <p className="text-sm text-yellow-700">Período</p>
                <p className="text-xl font-bold text-yellow-900">
                  {formatDate(periodoAtivo.data_inicio)} a {formatDate(periodoAtivo.data_fim)}
                </p>
              </div>
              {periodoAtivo.descricao && (
                <div>
                  <p className="text-sm text-yellow-700">Descrição</p>
                  <p className="text-lg text-yellow-900">{periodoAtivo.descricao}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Períodos List */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-teal-900 mb-6">
            Períodos Cadastrados
          </h2>

          {periodos.length > 0 ? (
            <div className="space-y-3">
              {periodos.map((periodo) => (
                <div
                  key={periodo.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    periodo.ativo
                      ? "bg-yellow-50 border-2 border-yellow-200"
                      : "bg-teal-50 hover:bg-teal-100 border border-teal-200"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {periodo.ativo && (
                        <span className="text-xl">⭐</span>
                      )}
                      <div>
                        <p className="font-semibold text-teal-900">{periodo.nome}</p>
                        <p className="text-sm text-teal-600">
                          {formatDate(periodo.data_inicio)} a {formatDate(periodo.data_fim)}
                        </p>
                        {periodo.descricao && (
                          <p className="text-xs text-teal-500 mt-1">{periodo.descricao}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    {!periodo.ativo && (
                      <Button
                        onClick={() => handleSetActive(periodo.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        Ativar
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDeletePeriodo(periodo.id)}
                      variant="destructive"
                      size="sm"
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-teal-600 text-lg">
                Nenhum período cadastrado ainda
              </p>
              <p className="text-teal-500 text-sm mt-2">
                Crie seu primeiro período usando o formulário acima
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

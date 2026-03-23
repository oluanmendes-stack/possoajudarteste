import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { triggerConfetti } from "@/utils/confetti";
import { Calendar, TrendingUp } from "lucide-react";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const { currentUser, users, sales } = useApp();
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!currentUser || !currentUser.is_admin) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handlePeriodChange = (days: number) => {
    const today = new Date();
    const start = new Date(today.setDate(today.getDate() - days));
    setStartDate(start);
    setEndDate(new Date());
  };

  const handleCustomDateSubmit = () => {
    if (customStartDate && customEndDate) {
      setStartDate(new Date(customStartDate));
      setEndDate(new Date(customEndDate));
    }
  };

  if (!currentUser || !currentUser.is_admin) return null;

  // Calculate metrics for each volunteer
  const volunteerMetrics = users
    .filter((u) => !u.is_admin)
    .map((user) => {
      const userSales = sales.filter(
        (s) =>
          s.userId === user.id &&
          new Date(s.data) >= startDate &&
          new Date(s.data) <= endDate
      );
      const totalVendas = userSales.reduce((sum, s) => sum + s.quantidade, 0);
      const progressPercentage = (user.metaAtingida / user.meta) * 100;
      const mediaPerCapita = users.length > 0 ? totalVendas / 1 : 0;

      return {
        id: user.id,
        nome: user.apelido,
        nomeCompleto: user.nomeCompleto,
        vendas: totalVendas,
        meta: user.meta,
        metaAtingida: user.metaAtingida,
        progressPercentage: Math.min(progressPercentage, 100),
        mediaPerCapita,
      };
    })
    .sort((a, b) => b.vendas - a.vendas);

  const totalVendasGeral = volunteerMetrics.reduce((sum, v) => sum + v.vendas, 0);
  const mediaGeralPerCapita = volunteerMetrics.length > 0 
    ? totalVendasGeral / volunteerMetrics.length 
    : 0;

  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return `${startDate.toLocaleDateString("pt-BR", options)} - ${endDate.toLocaleDateString("pt-BR", options)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <Sidebar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-teal-200">
        <div className="max-w-6xl mx-auto px-4 py-6 pl-20">
          <h1 className="text-3xl font-bold text-teal-900">Dashboard Administrativo</h1>
          <p className="text-teal-600 mt-1">
            Acompanhamento geral de todas as voluntárias
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 pl-20">
        {/* Period Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-teal-900 mb-6">
            Selecionar Período
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            <Button
              onClick={() => handlePeriodChange(7)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold"
            >
              Últimos 7 dias
            </Button>
            <Button
              onClick={() => handlePeriodChange(30)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold"
            >
              Últimos 30 dias
            </Button>
            <Button
              onClick={() => handlePeriodChange(90)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold"
            >
              Últimos 90 dias
            </Button>
            <Button
              onClick={() => {
                const today = new Date();
                setStartDate(new Date(today.getFullYear(), today.getMonth(), 1));
                setEndDate(new Date());
              }}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold"
            >
              Este Mês
            </Button>
            <Button
              variant="outline"
              className="border-teal-200 text-teal-600"
            >
              Personalizado
            </Button>
          </div>

          {/* Custom Date Range */}
          <div className="bg-teal-50 p-6 rounded-lg border border-teal-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-teal-900 mb-2">
                  <Calendar className="inline mr-2" size={16} />
                  Data Inicial
                </label>
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-900 mb-2">
                  <Calendar className="inline mr-2" size={16} />
                  Data Final
                </label>
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <Button
              onClick={handleCustomDateSubmit}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold"
            >
              Aplicar Filtro
            </Button>
          </div>

          {/* Date Range Display */}
          <div className="p-4 bg-teal-100 rounded-lg border-l-4 border-teal-600">
            <p className="text-sm text-teal-700">
              <span className="font-semibold">Período selecionado:</span> {formatDateRange()}
            </p>
          </div>
        </div>

        {/* General Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-teal-600 mb-2">Total de Vendas</p>
            <p className="text-4xl font-bold text-teal-900">{totalVendasGeral}</p>
            <p className="text-xs text-teal-600 mt-2">unidades no período</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-blue-600 mb-2">Número de Voluntárias</p>
            <p className="text-4xl font-bold text-blue-900">{volunteerMetrics.length}</p>
            <p className="text-xs text-blue-600 mt-2">ativas</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm p-6 border-2 border-green-200">
            <p className="text-sm text-green-700 font-semibold mb-2">Média por Voluntária</p>
            <p className="text-4xl font-bold text-green-900">{mediaGeralPerCapita.toFixed(1)}</p>
            <p className="text-xs text-green-700 mt-2">vendas por pessoa</p>
          </div>
        </div>

        {/* Volunteers Comparison */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-lg font-semibold text-teal-900 mb-6 flex items-center gap-2">
            <TrendingUp size={20} />
            Comparativo de Voluntárias
          </h2>

          {volunteerMetrics.length > 0 ? (
            <div className="space-y-4">
              {volunteerMetrics.map((volunteer, index) => (
                <div
                  key={volunteer.id}
                  className="p-4 bg-teal-50 rounded-lg border-l-4 border-teal-600"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-teal-600">#{index + 1}</span>
                        <div>
                          <p className="font-semibold text-teal-900">{volunteer.nome}</p>
                          <p className="text-xs text-teal-600">{volunteer.nomeCompleto}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-teal-900">
                        {volunteer.vendas}
                      </p>
                      <p className="text-xs text-teal-600">vendas</p>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="bg-white rounded p-2 text-center">
                      <p className="text-xs text-teal-600">Meta</p>
                      <p className="text-lg font-bold text-teal-900">{volunteer.meta}</p>
                    </div>
                    <div className="bg-white rounded p-2 text-center">
                      <p className="text-xs text-teal-600">Atingida</p>
                      <p className="text-lg font-bold text-teal-900">{volunteer.metaAtingida}</p>
                    </div>
                    <div className="bg-white rounded p-2 text-center">
                      <p className="text-xs text-teal-600">Progresso</p>
                      <p className="text-lg font-bold text-teal-900">
                        {Math.round(volunteer.progressPercentage)}%
                      </p>
                    </div>
                    <div className="bg-white rounded p-2 text-center">
                      <p className="text-xs text-teal-600">Média Pessoal</p>
                      <p className="text-lg font-bold text-green-600">
                        {volunteer.mediaPerCapita.toFixed(1)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-teal-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${volunteer.progressPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-teal-600 text-center py-8">
              Nenhuma voluntária registrada
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

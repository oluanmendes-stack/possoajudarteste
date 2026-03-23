import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = [
  "#14B8A6",
  "#0D9488",
  "#0F766E",
  "#134E4A",
  "#06B6D4",
  "#0891B2",
  "#0E7490",
];

type PeriodType = "7days" | "30days" | "90days" | "currentMonth" | "custom";

export default function Relatorio() {
  const navigate = useNavigate();
  const { currentUser, products, getTotalSalesByProductInRange, getDonationsByUser, getPeriodoAtivo } = useApp();
  const [periodType, setPeriodType] = useState<PeriodType>("30days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Usar período ativo automaticamente se disponível
  useEffect(() => {
    const periodAtivo = getPeriodoAtivo();
    if (periodAtivo) {
      setStartDate(new Date(periodAtivo.data_inicio));
      setEndDate(new Date(periodAtivo.data_fim));
    }
  }, []);

  useEffect(() => {
    updateDateRange();
  }, [periodType]);

  const updateDateRange = () => {
    const today = new Date();
    const endDate = new Date(today);

    let startDate: Date;

    switch (periodType) {
      case "7days":
        startDate = new Date(today.setDate(today.getDate() - 7));
        break;
      case "30days":
        startDate = new Date(today.setDate(today.getDate() - 30));
        break;
      case "90days":
        startDate = new Date(today.setDate(today.getDate() - 90));
        break;
      case "currentMonth":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "custom":
        if (customStartDate && customEndDate) {
          setStartDate(new Date(customStartDate));
          setEndDate(new Date(customEndDate));
          return;
        }
        return;
      default:
        startDate = new Date(today.setDate(today.getDate() - 30));
    }

    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleCustomDateSubmit = () => {
    if (customStartDate && customEndDate) {
      updateDateRange();
    }
  };

  if (!currentUser) return null;

  const salesByProduct = getTotalSalesByProductInRange(
    currentUser.id,
    startDate,
    endDate,
  );

  const chartData = products
    .map((p) => ({
      name: p.nome,
      value: salesByProduct[p.id] || 0,
    }))
    .filter((item) => item.value > 0);

  const totalSales = Object.values(salesByProduct).reduce((a, b) => a + b, 0);

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
          <h1 className="text-3xl font-bold text-teal-900">Relatório de Vendas</h1>
          <p className="text-teal-600 mt-1">
            Analise suas vendas por período
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 pl-20">
        {/* Period Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-teal-900 mb-6">
            Filtrar por Período
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            <Button
              onClick={() => setPeriodType("7days")}
              variant={periodType === "7days" ? "default" : "outline"}
              className={periodType === "7days" ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              Últimos 7 dias
            </Button>
            <Button
              onClick={() => setPeriodType("30days")}
              variant={periodType === "30days" ? "default" : "outline"}
              className={periodType === "30days" ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              Últimos 30 dias
            </Button>
            <Button
              onClick={() => setPeriodType("90days")}
              variant={periodType === "90days" ? "default" : "outline"}
              className={periodType === "90days" ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              Últimos 90 dias
            </Button>
            <Button
              onClick={() => setPeriodType("currentMonth")}
              variant={periodType === "currentMonth" ? "default" : "outline"}
              className={periodType === "currentMonth" ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              Este Mês
            </Button>
            <Button
              onClick={() => setPeriodType("custom")}
              variant={periodType === "custom" ? "default" : "outline"}
              className={periodType === "custom" ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              Personalizado
            </Button>
          </div>

          {/* Custom Date Range */}
          {periodType === "custom" && (
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
          )}

          {/* Date Range Display */}
          <div className="p-4 bg-teal-100 rounded-lg border-l-4 border-teal-600">
            <p className="text-sm text-teal-700">
              <span className="font-semibold">Período selecionado:</span> {formatDateRange()}
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-teal-600 mb-2">Total de Vendas</p>
            <p className="text-4xl font-bold text-teal-900">{totalSales}</p>
            <p className="text-xs text-teal-600 mt-2">
              unidades no período
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-teal-600 mb-2">Produtos Vendidos</p>
            <p className="text-4xl font-bold text-teal-900">{chartData.length}</p>
            <p className="text-xs text-teal-600 mt-2">
              tipos diferentes
            </p>
          </div>
        </div>

        {/* Donut Chart */}
        {chartData.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-lg font-semibold text-teal-900 mb-6">
              Distribuição de Vendas por Produto
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value} unidades`}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #14B8A6",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
            <p className="text-teal-600 text-lg">
              Nenhuma venda registrada neste período
            </p>
          </div>
        )}

        {/* Detailed Sales by Product */}
        {chartData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-lg font-semibold text-teal-900 mb-6">
              Detalhamento por Produto
            </h2>
            <div className="space-y-3">
              {chartData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <p className="font-semibold text-teal-900">{item.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-teal-900">
                      {item.value}
                    </p>
                    <p className="text-xs text-teal-600">
                      {((item.value / totalSales) * 100).toFixed(1)}% do total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Donations Section */}
        {currentUser && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-lg font-semibold text-teal-900 mb-6">
              Doações por Canal de Cobrança
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
                  const bgColor = tipo === "agua" ? "bg-blue-50 hover:bg-blue-100" : tipo === "luz" ? "bg-yellow-50 hover:bg-yellow-100" : "bg-purple-50 hover:bg-purple-100";
                  const dotColor = tipo === "agua" ? "#06B6D4" : tipo === "luz" ? "#F59E0B" : "#A855F7";
                  const textColor = tipo === "agua" ? "text-blue-600" : tipo === "luz" ? "text-yellow-600" : "text-purple-600";

                  return (
                    <div
                      key={tipo}
                      className={`flex items-center justify-between p-4 rounded-lg transition-colors ${bgColor}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: dotColor,
                          }}
                        />
                        <div>
                          <p className="font-semibold text-teal-900">
                            {tipo === "agua" ? "Água" : tipo === "luz" ? "Luz" : "PIX"}
                          </p>
                          <p className="text-xs text-teal-600">
                            {donationsOfType.length} doação(ões)
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${textColor}`}>
                          R$ {total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-teal-600 text-center py-6">
                Nenhuma doação registrada neste período
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

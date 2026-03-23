import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = [
  "#14B8A6",
  "#0D9488",
  "#0F766E",
  "#134E4A",
  "#06B6D4",
  "#0891B2",
  "#0E7490",
];

export default function Products() {
  const navigate = useNavigate();
  const { currentUser, products, getTotalSalesByProduct } = useApp();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const totalSalesByProduct = getTotalSalesByProduct(currentUser.id);

  // Prepare data for donut chart
  const chartData = products
    .filter((p) => totalSalesByProduct[p.id] || totalSalesByProduct[p.id] === 0)
    .map((product) => ({
      name: product.nome,
      value: totalSalesByProduct[product.id] || 0,
    }));

  const totalSales = Object.values(totalSalesByProduct).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <Sidebar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-teal-200">
        <div className="max-w-6xl mx-auto px-4 py-6 pl-20">
          <h1 className="text-3xl font-bold text-teal-900">Produtos</h1>
          <p className="text-teal-600 mt-1">
            Visualize as vendas de cada produto
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 pl-20">
        {/* Main Donut Chart */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-lg font-semibold text-teal-900 mb-6">
            Distribuição de Vendas
          </h2>

          {chartData.length === 0 || totalSales === 0 ? (
            <div className="h-96 flex items-center justify-center text-teal-600">
              <p>Nenhuma venda registrada ainda</p>
            </div>
          ) : (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={130}
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
                    formatter={(value) => `${value} vendas`}
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
          )}
        </div>

        {/* Product Details Cards with Mini Charts */}
        <h2 className="text-lg font-semibold text-teal-900 mb-6">
          Detalhes por Produto
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products.map((product, index) => {
            const sales = totalSalesByProduct[product.id] || 0;
            const percentage =
              totalSales > 0 ? ((sales / totalSales) * 100).toFixed(1) : "0";

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-teal-600"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mini Donut Chart */}
                  <div className="flex items-center justify-center h-48">
                    <ResponsiveContainer width={180} height={180}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: product.nome, value: sales },
                            {
                              name: "Restante",
                              value: Math.max(0, totalSales - sales),
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          <Cell fill={COLORS[index % COLORS.length]} />
                          <Cell fill="#E0E7FF" />
                        </Pie>
                        <Tooltip
                          formatter={(value) => `${value} vendas`}
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #14B8A6",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-teal-900 mb-2">
                      {product.nome}
                    </h3>

                    {product.imagem && (
                      <img
                        src={product.imagem}
                        alt={product.nome}
                        className="w-20 h-20 object-cover rounded-lg mb-4"
                      />
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-teal-600">Preço:</p>
                        <p className="font-semibold text-teal-900">
                          R$ {product.preço.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-sm text-teal-600">Vendas:</p>
                        <p className="font-bold text-lg text-teal-900">
                          {sales}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-sm text-teal-600">Percentual:</p>
                        <p className="font-semibold text-teal-900">
                          {percentage}%
                        </p>
                      </div>

                      {sales > 0 && (
                        <div className="pt-2 border-t border-teal-100">
                          <p className="text-sm text-green-600 font-medium">
                            Faturamento:{" "}
                            <span className="text-lg font-bold">
                              R$ {(sales * product.preço).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
          <h3 className="text-lg font-semibold text-teal-900 mb-4">
            Resumo Geral
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-teal-600 mb-1">Total de Vendas</p>
              <p className="text-3xl font-bold text-teal-900">{totalSales}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-teal-600 mb-1">Total de Produtos</p>
              <p className="text-3xl font-bold text-teal-900">
                {products.length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-teal-600 mb-1">Faturamento Total</p>
              <p className="text-3xl font-bold text-green-600">
                R${" "}
                {Object.entries(totalSalesByProduct)
                  .reduce((total, [productId, qty]) => {
                    const product = products.find((p) => p.id === productId);
                    return total + (product ? product.preço * qty : 0);
                  }, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

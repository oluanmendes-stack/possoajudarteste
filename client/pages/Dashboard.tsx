import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { triggerConfetti } from "@/utils/confetti";
import { exportToCSV, exportToJSON, importFromCSV } from "@/utils/export";
import { Download, Upload, Edit } from "lucide-react";
import { EditMetaModal } from "@/components/EditMetaModal";


export default function Dashboard() {
  const navigate = useNavigate();
  const {
    currentUser,
    sales,
    donations,
    recordSale,
    recordDonation,
    updateUser,
  } = useApp();
  const [goalReached, setGoalReached] = useState(false);
  const [isEditMetaOpen, setIsEditMetaOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Trigger confetti when goal is reached
  useEffect(() => {
    if (
      currentUser &&
      currentUser.metaAtingida >= currentUser.meta &&
      !goalReached
    ) {
      setGoalReached(true);
      triggerConfetti();
    }
  }, [currentUser, goalReached]);

  if (!currentUser) return null;

  const totalSalesMonth = sales
    .filter((s) => s.userId === currentUser.id)
    .reduce((a, b) => a + b.quantidade, 0);

  // Count donations as additional items towards goals
  const totalDonations = donations
    .filter((d) => d.userId === currentUser.id)
    .length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <Sidebar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-teal-200">
        <div className="max-w-6xl mx-auto px-4 py-6 pl-20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-teal-900">
                {currentUser.is_admin ? "Dashboard Administrativo" : "Posso Ajudar?"}
              </h1>
              <p className="text-teal-600 mt-1">
                {currentUser.is_admin ? "Acompanhamento geral das voluntárias" : "Registre suas vendas do dia"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {currentUser.is_admin && (
                <Button
                  onClick={() => navigate("/dashboard-admin")}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                >
                  Dashboard Admin
                </Button>
              )}

              {/* Profile Circle - Clickable */}
              <button
                onClick={() => navigate("/profile")}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                {currentUser.foto ? (
                  <img
                    src={currentUser.foto}
                    alt="Perfil"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-lg">
                    {currentUser.apelido.charAt(0).toUpperCase()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 pl-20">
        {/* Monthly Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-teal-900">
              Resumo do Mês
            </h2>
            {currentUser.is_admin && (
              <Button
                onClick={() => setIsEditMetaOpen(true)}
                variant="outline"
                className="flex items-center gap-2 text-teal-600 hover:bg-teal-50 border-teal-200"
              >
                <Edit size={16} />
                Editar Meta
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-teal-50 rounded-lg">
              <p className="text-sm text-teal-600 mb-1">Total de Vendas</p>
              <p className="text-3xl font-bold text-teal-900">
                {totalSalesMonth}
              </p>
              <p className="text-xs text-teal-500 mt-1">{totalDonations} doações</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Meta Atingida (com doações)</p>
              <p className="text-3xl font-bold text-green-900">
                {currentUser.metaAtingida + totalDonations}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Meta Total</p>
              <p className="text-3xl font-bold text-blue-900">
                {currentUser.meta}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-teal-900">
                Progresso para Meta (com doações)
              </p>
              <p className="text-sm font-medium text-teal-600">
                {Math.round(
                  ((currentUser.metaAtingida + totalDonations) / currentUser.meta) * 100,
                )}
                %
              </p>
            </div>
            <div className="w-full bg-teal-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-teal-500 to-teal-600 h-4 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    ((currentUser.metaAtingida + totalDonations) / currentUser.meta) * 100,
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>


        {/* Export/Import Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 border-t-4 border-teal-600">
          <h2 className="text-lg font-semibold text-teal-900 mb-6">
            Exportar / Importar Dados
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => {
                if (currentUser) {
                  const userSales = sales.filter(
                    (s) => s.userId === currentUser.id,
                  );
                  const userDonations = donations.filter(
                    (d) => d.userId === currentUser.id,
                  );
                  exportToCSV(userSales, userDonations, currentUser.apelido);
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2"
            >
              <Download size={18} />
              Exportar CSV
            </Button>
            <Button
              onClick={() => {
                if (currentUser) {
                  const userSales = sales.filter(
                    (s) => s.userId === currentUser.id,
                  );
                  const userDonations = donations.filter(
                    (d) => d.userId === currentUser.id,
                  );
                  exportToJSON(userSales, userDonations, currentUser.apelido);
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2"
            >
              <Download size={18} />
              Exportar JSON
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="font-semibold flex items-center gap-2"
            >
              <Upload size={18} />
              Importar Dados
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && currentUser) {
                  if (file.name.endsWith(".csv")) {
                    importFromCSV(file).then((data) => {
                      data.sales.forEach((sale) => {
                        // Find product by name from the CSV
                        const product = products[0]; // Default to first product
                        if (product) {
                          recordSale(product.id, sale.quantidade || 0, {
                            local: sale.local,
                            pagamento: sale.pagamento,
                            parcelas: sale.parcelas,
                          });
                        }
                      });
                      data.donations.forEach((donation) => {
                        if (donation.tipo && donation.valor) {
                          recordDonation(donation.tipo, donation.valor);
                        }
                      });
                    });
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

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
  );
}

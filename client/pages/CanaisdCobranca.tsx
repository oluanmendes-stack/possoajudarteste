import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Droplet, Zap, Lightbulb, Download, Upload } from "lucide-react";
import { exportToCSV, exportToJSON, importFromCSV } from "@/utils/export";
import { toast } from "sonner";

export default function CanaisdCobranca() {
  const navigate = useNavigate();
  const { currentUser, recordDonation, getDonationsByUser, sales } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [valor, setValor] = useState("");
  const [parcelas, setParcelas] = useState(1);
  const [tipo, setTipo] = useState<"agua" | "luz" | "pix">("agua");
  const [nomeDiador, setNomeDiador] = useState("");
  const [telefoneDiador, setTelefoneDiador] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!valor || parseFloat(valor) <= 0) {
      setError("Valor deve ser maior que 0");
      return;
    }

    setIsLoading(true);
    try {
      const valorFinal = parseFloat(valor) * parcelas;
      await recordDonation(
        tipo,
        valorFinal,
        nomeDiador || undefined,
        telefoneDiador || undefined,
        parcelas > 1 ? parcelas : undefined,
      );
      setSuccess(`Doação de R$ ${valorFinal.toFixed(2)} registrada!`);
      setValor("");
      setNomeDiador("");
      setTelefoneDiador("");
      setParcelas(1);
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao registrar doação"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return null;

  const donations = getDonationsByUser(currentUser.id);
  const totalAgua = donations
    .filter((d) => d.tipo === "agua")
    .reduce((acc, d) => acc + d.valor, 0);
  const totalLuz = donations
    .filter((d) => d.tipo === "luz")
    .reduce((acc, d) => acc + d.valor, 0);
  const totalPix = donations
    .filter((d) => d.tipo === "pix")
    .reduce((acc, d) => acc + d.valor, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <Sidebar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-teal-200">
        <div className="max-w-6xl mx-auto px-4 py-6 pl-20">
          <h1 className="text-3xl font-bold text-teal-900">
            Canais de Cobrança
          </h1>
          <p className="text-teal-600 mt-1">
            Registre doações para contas de água e luz
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 pl-20">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Register Donation Form */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-lg font-semibold text-teal-900 mb-6">
            Registrar Doação
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-teal-900 mb-2">
                  Tipo de Canal de Cobrança
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTipo("agua")}
                    className={`px-4 py-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-colors ${
                      tipo === "agua"
                        ? "border-blue-600 bg-blue-50 text-blue-900 font-semibold"
                        : "border-teal-200 bg-white text-teal-900 hover:bg-teal-50"
                    }`}
                  >
                    <Droplet
                      size={20}
                      className={
                        tipo === "agua" ? "text-blue-600" : "text-blue-400"
                      }
                    />
                    <span>Água</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipo("luz")}
                    className={`px-4 py-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-colors ${
                      tipo === "luz"
                        ? "border-yellow-600 bg-yellow-50 text-yellow-900 font-semibold"
                        : "border-teal-200 bg-white text-teal-900 hover:bg-teal-50"
                    }`}
                  >
                    <Lightbulb
                      size={20}
                      className={
                        tipo === "luz" ? "text-yellow-600" : "text-yellow-400"
                      }
                    />
                    <span>Luz</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipo("pix")}
                    className={`px-4 py-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-colors ${
                      tipo === "pix"
                        ? "border-purple-600 bg-purple-50 text-purple-900 font-semibold"
                        : "border-teal-200 bg-white text-teal-900 hover:bg-teal-50"
                    }`}
                  >
                    <span className="text-xl">💳</span>
                    <span>PIX</span>
                  </button>
                </div>
              </div>

              {/* Donor Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome do Doador */}
                <div>
                  <label className="block text-sm font-medium text-teal-900 mb-2">
                    Nome Completo do Doador
                  </label>
                  <Input
                    type="text"
                    value={nomeDiador}
                    onChange={(e) => setNomeDiador(e.target.value)}
                    placeholder="Digite o nome completo"
                    className="w-full"
                  />
                </div>

                {/* Telefone do Doador */}
                <div>
                  <label className="block text-sm font-medium text-teal-900 mb-2">
                    Número de Telefone
                  </label>
                  <Input
                    type="tel"
                    value={telefoneDiador}
                    onChange={(e) => setTelefoneDiador(e.target.value)}
                    placeholder="(XX) XXXXX-XXXX"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Valor e Parcelas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-teal-900 mb-2">
                    Valor (R$)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="Ex: 50.00"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-900 mb-2">
                    Parcelas
                  </label>
                  <select
                    value={parcelas}
                    onChange={(e) => setParcelas(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:border-teal-600"
                  >
                    {[1, 2, 3, 4, 5, 6, 12].map((p) => (
                      <option key={p} value={p}>
                        {p}x
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cálculo */}
              {valor && (
                <div className="p-4 bg-teal-50 rounded-lg border-2 border-teal-200">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-teal-600">Valor Unitário</p>
                      <p className="text-lg font-bold text-teal-900">
                        R$ {parseFloat(valor).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-teal-600">Parcelas</p>
                      <p className="text-lg font-bold text-teal-900">{parcelas}x</p>
                    </div>
                    <div>
                      <p className="text-sm text-teal-600">Total</p>
                      <p className="text-lg font-bold text-green-700">
                        R$ {(parseFloat(valor) * parcelas).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Registrando..." : "Registrar Doação"}
            </Button>
          </form>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Água */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm p-6 border-l-4 border-blue-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                <Droplet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Água</h3>
                <p className="text-sm text-blue-700">Total arrecadado</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-900">
              R$ {totalAgua.toFixed(2)}
            </p>
          </div>

          {/* Luz */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-sm p-6 border-l-4 border-yellow-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">Luz</h3>
                <p className="text-sm text-yellow-700">Total arrecadado</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-yellow-900">
              R$ {totalLuz.toFixed(2)}
            </p>
          </div>

          {/* PIX */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-sm p-6 border-l-4 border-purple-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
                <span className="text-xl">💳</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-900">PIX</h3>
                <p className="text-sm text-purple-700">Total recebido</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-900">
              R$ {totalPix.toFixed(2)}
            </p>
          </div>
        </div>

        {/* History */}
        {donations.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-lg font-semibold text-teal-900 mb-6">
              Histórico de Doações
            </h2>

            <div className="space-y-3">
              {donations
                .sort(
                  (a, b) =>
                    new Date(b.data).getTime() - new Date(a.data).getTime(),
                )
                .map((donation) => (
                  <div
                    key={donation.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-teal-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4 mb-3 md:mb-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-200">
                        {donation.tipo === "agua" ? (
                          <Droplet className="w-5 h-5 text-blue-600" />
                        ) : donation.tipo === "luz" ? (
                          <Zap className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <span className="text-lg">💳</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-teal-900">
                          {donation.tipo === "agua" ? "Água" : donation.tipo === "luz" ? "Luz" : "PIX"}
                        </p>
                        <p className="text-sm text-teal-600">
                          {new Date(donation.data).toLocaleDateString("pt-BR")}
                        </p>
                        {donation.nomeDiador && (
                          <p className="text-sm text-teal-700 font-medium">
                            {donation.nomeDiador}
                            {donation.telefoneDiador &&
                              ` • ${donation.telefoneDiador}`}
                          </p>
                        )}
                        {donation.parcelas && (
                          <p className="text-xs text-teal-600">
                            {donation.parcelas}x
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-lg font-bold text-teal-900">
                      R$ {donation.valor.toFixed(2)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Export/Import Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 border-t-4 border-teal-600 mt-8">
          <h2 className="text-lg font-semibold text-teal-900 mb-6">
            Exportar / Importar Doações
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => {
                if (currentUser) {
                  const userDonations = getDonationsByUser(currentUser.id);
                  if (userDonations.length === 0) {
                    toast.error("Não há doações para exportar");
                    return;
                  }
                  const emptyArray: any[] = [];
                  exportToCSV(
                    emptyArray,
                    userDonations,
                    currentUser.apelido || "usuario",
                  );
                  toast.success("Doações exportadas como CSV");
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
                  const userDonations = getDonationsByUser(currentUser.id);
                  if (userDonations.length === 0) {
                    toast.error("Não há doações para exportar");
                    return;
                  }
                  const emptyArray: any[] = [];
                  exportToJSON(
                    emptyArray,
                    userDonations,
                    currentUser.apelido || "usuario",
                  );
                  toast.success("Doações exportadas como JSON");
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
                    importFromCSV(file)
                      .then((data) => {
                        data.donations.forEach((donation) => {
                          recordDonation(
                            donation.tipo as "agua" | "luz",
                            donation.valor || 0,
                            donation.nomeDiador,
                            donation.telefoneDiador,
                          );
                        });
                        toast.success(
                          `${data.donations.length} doação(ões) importada(s) com sucesso!`,
                        );
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      })
                      .catch((err) => {
                        toast.error("Erro ao importar CSV");
                        console.error(err);
                      });
                  } else if (file.name.endsWith(".json")) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const jsonData = JSON.parse(
                          event.target?.result as string,
                        );
                        const donations = jsonData.doacoes || [];
                        let count = 0;
                        donations.forEach((donation: any) => {
                          recordDonation(
                            donation.tipo as "agua" | "luz",
                            donation.valor,
                            donation.nomeDiador,
                            donation.telefoneDiador,
                          );
                          count++;
                        });
                        toast.success(
                          `${count} doação(ões) importada(s) com sucesso!`,
                        );
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      } catch (err) {
                        toast.error("Erro ao importar JSON. Formato inválido");
                        console.error(err);
                      }
                    };
                    reader.readAsText(file);
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

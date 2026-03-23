import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Package } from "lucide-react";
import { toast } from "sonner";

export default function LancarVendas() {
  const navigate = useNavigate();
  const { currentUser, products, recordSale } = useApp();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [local, setLocal] = useState("acoes");
  const [pagamento, setPagamento] = useState("dinheiro");
  const [parcelas, setParcelas] = useState(1);
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nomeComprador, setNomeComprador] = useState("");
  const [telefoneComprador, setTelefoneComprador] = useState("");
  const [emailComprador, setEmailComprador] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta),
    }));
  };

  const handleRecordSale = async (productId: string) => {
    const qty = quantities[productId] || 0;
    if (qty <= 0) {
      toast.error("Digite uma quantidade válida");
      return;
    }

    setIsLoading(true);
    try {
      await recordSale(productId, qty, {
        local: local as
          | "acoes"
          | "vendaExterna"
          | "vendaInterna"
          | "quimioterapia"
          | "portaria"
          | "sus"
          | "convenio",
        pagamento: pagamento as "cartao" | "dinheiro" | "pix",
        parcelas: pagamento === "cartao" ? parcelas : undefined,
        nomeComprador: nomeComprador || undefined,
        telefoneComprador: telefoneComprador || undefined,
        emailComprador: emailComprador || undefined,
      });
      setQuantities((prev) => ({
        ...prev,
        [productId]: 0,
      }));
      setSuccess(`${qty} unidades vendidas!`);
      setTimeout(() => setSuccess(""), 2000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao registrar venda"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <Sidebar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-teal-200">
        <div className="max-w-6xl mx-auto px-4 py-6 pl-20">
          <h1 className="text-3xl font-bold text-teal-900">Lançar Vendas</h1>
          <p className="text-teal-600 mt-1">Registre uma nova venda</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 pl-20">
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Sales Options */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-lg font-semibold text-teal-900 mb-6">
            Detalhes da Venda
          </h2>

          {/* Buyer Information */}
          <div className="bg-teal-50 rounded-lg p-6 mb-8 border-2 border-teal-200">
            <h3 className="text-md font-semibold text-teal-900 mb-4">
              Dados do Comprador
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-900 mb-2">
                  Nome Completo
                </label>
                <Input
                  type="text"
                  value={nomeComprador}
                  onChange={(e) => setNomeComprador(e.target.value)}
                  placeholder="Digite o nome completo"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-900 mb-2">
                  Telefone
                </label>
                <Input
                  type="tel"
                  value={telefoneComprador}
                  onChange={(e) => setTelefoneComprador(e.target.value)}
                  placeholder="(XX) XXXXX-XXXX"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-900 mb-2">
                  E-mail
                </label>
                <Input
                  type="email"
                  value={emailComprador}
                  onChange={(e) => setEmailComprador(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Local */}
            <div>
              <label className="block text-sm font-medium text-teal-900 mb-2">
                Local da Venda
              </label>
              <select
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:border-teal-600"
              >
                <option value="acoes">Ações</option>
                <option value="vendaExterna">Venda Externa</option>
                <option value="vendaInterna">Venda Interna</option>
                <option value="quimioterapia">Quimioterapia</option>
                <option value="portaria">Portaria Principal</option>
                <option value="sus">SUS</option>
                <option value="convenio">Convênio</option>
              </select>
            </div>

            {/* Pagamento */}
            <div>
              <label className="block text-sm font-medium text-teal-900 mb-2">
                Forma de Pagamento
              </label>
              <select
                value={pagamento}
                onChange={(e) => setPagamento(e.target.value)}
                className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:border-teal-600"
              >
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao">Cartão</option>
                <option value="pix">PIX</option>
              </select>
            </div>

            {/* Parcelas (apenas se cartão) */}
            {pagamento === "cartao" && (
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
            )}
          </div>

          <div className="border-t-2 border-teal-100 pt-8">
            <h3 className="text-lg font-semibold text-teal-900 mb-6">
              Selecione os Produtos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-teal-50 rounded-lg p-6 border-2 border-teal-100"
                >
                  {/* Product Image */}
                  {product.imagem ? (
                    <img
                      src={product.imagem}
                      alt={product.nome}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center mb-4">
                      <Package size={56} className="text-teal-600" />
                    </div>
                  )}

                  {/* Product Info */}
                  <h3 className="font-bold text-teal-900 text-lg mb-1">
                    {product.nome}
                  </h3>
                  <p className="text-teal-600 font-semibold mb-4">
                    R$ {product.preço.toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between bg-white rounded-lg p-3 mb-4">
                    <button
                      onClick={() => handleQuantityChange(product.id, -1)}
                      className="p-1 text-teal-600 hover:bg-teal-50 rounded"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-2xl font-bold text-teal-900">
                      {quantities[product.id] || 0}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(product.id, 1)}
                      className="p-1 text-teal-600 hover:bg-teal-50 rounded"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  <Button
                    onClick={() => handleRecordSale(product.id)}
                    disabled={!quantities[product.id] || isLoading}
                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Registrando..." : "Registrar"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

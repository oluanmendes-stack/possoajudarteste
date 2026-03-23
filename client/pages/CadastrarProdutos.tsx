import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Upload } from "lucide-react";
import { toast } from "sonner";

export default function CadastrarProdutos() {
  const navigate = useNavigate();
  const { currentUser, products, addProduct, deleteProduct } = useApp();
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagem(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nome.trim()) {
      setError("Nome do produto é obrigatório");
      return;
    }

    if (!preco || parseFloat(preco) <= 0) {
      setError("Preço deve ser um valor maior que 0");
      return;
    }

    setIsLoading(true);
    try {
      await addProduct({
        nome: nome.trim(),
        preço: parseFloat(preco),
        imagem: imagem || undefined,
      });

      setSuccess("Produto cadastrado com sucesso!");
      setNome("");
      setPreco("");
      setImagem(null);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao cadastrar produto"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) {
      return;
    }

    setDeletingId(productId);
    try {
      await deleteProduct(productId);
      toast.success("Produto deletado com sucesso!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao deletar produto"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <Sidebar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-teal-200">
        <div className="max-w-4xl mx-auto px-4 py-6 pl-20">
          <h1 className="text-3xl font-bold text-teal-900">
            Cadastrar Produtos
          </h1>
          <p className="text-teal-600 mt-1">
            Adicione novos produtos para venda
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 pl-20">
        {/* Add Product Form */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-lg font-semibold text-teal-900 mb-6">
            Novo Produto
          </h2>

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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-teal-900 mb-4">
                Imagem do Produto
              </label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 rounded-lg border-2 border-dashed border-teal-300 flex items-center justify-center bg-teal-50">
                  {imagem ? (
                    <img
                      src={imagem}
                      alt="Produto"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                      <p className="text-xs text-teal-600">Clique para enviar</p>
                    </div>
                  )}
                </div>
                <label className="cursor-pointer">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium cursor-pointer">
                    Escolher Imagem
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-900 mb-2">
                Nome do Produto
              </label>
              <Input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Água mineral 500ml"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-900 mb-2">
                Preço (R$) *
              </label>
              <Input
                type="number"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="Ex: 2.50"
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
              {isLoading ? "Cadastrando..." : "Cadastrar Produto"}
            </Button>
          </form>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-lg font-semibold text-teal-900 mb-6">
            Produtos Cadastrados
          </h2>

          {products.length === 0 ? (
            <p className="text-teal-600 text-center py-8">
              Nenhum produto cadastrado ainda
            </p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 bg-teal-50 rounded-lg border-l-4 border-teal-600"
                >
                  {product.imagem && (
                    <img
                      src={product.imagem}
                      alt={product.nome}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-teal-900">
                      {product.nome}
                    </p>
                    <p className="text-sm text-teal-600">
                      R$ {product.preço.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={deletingId === product.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="w-full font-semibold py-3"
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

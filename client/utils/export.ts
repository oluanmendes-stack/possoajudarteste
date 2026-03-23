import { Sale, Donation } from "@/hooks/useAppData";

export function exportToCSV(
  sales: Sale[],
  donations: Donation[],
  userName: string,
) {
  try {
    let csv =
      "Data,Tipo,Descrição,Quantidade,Local,Pagamento,Parcelas,Valor,Nome Doador,Telefone Doador\n";

    // Add sales
    sales.forEach((sale) => {
      const data = new Date(sale.data).toLocaleDateString("pt-BR");
      csv += `${data},Venda,Produto,${sale.quantidade},${sale.local || "N/A"},${sale.pagamento || "N/A"},${sale.parcelas || "N/A"},,,\n`;
    });

    // Add donations
    donations.forEach((donation) => {
      const data = new Date(donation.data).toLocaleDateString("pt-BR");
      csv += `${data},Doação,${donation.tipo === "agua" ? "Água" : "Luz"},,,,,${donation.valor},${donation.nomeDiador || ""},${donation.telefoneDiador || ""}\n`;
    });

    // Trigger download
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csv),
    );
    element.setAttribute("download", `vendas_${userName}_${Date.now()}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();

    // Safely remove element
    setTimeout(() => {
      if (element.parentNode === document.body) {
        document.body.removeChild(element);
      }
    }, 100);
  } catch (error) {
    console.error("CSV export error:", error);
  }
}

export function exportToJSON(
  sales: Sale[],
  donations: Donation[],
  userName: string,
) {
  try {
    const data = {
      usuario: userName,
      data_exportacao: new Date().toISOString(),
      vendas: sales,
      doacoes: donations,
      resumo: {
        total_vendas: sales.reduce((acc, s) => acc + s.quantidade, 0),
        total_doacoes: donations.reduce((acc, d) => acc + d.valor, 0),
      },
    };

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(data, null, 2)),
    );
    element.setAttribute("download", `vendas_${userName}_${Date.now()}.json`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();

    // Safely remove element
    setTimeout(() => {
      if (element.parentNode === document.body) {
        document.body.removeChild(element);
      }
    }, 100);
  } catch (error) {
    console.error("JSON export error:", error);
  }
}

export async function importFromCSV(file: File): Promise<{
  sales: Partial<Sale>[];
  donations: Partial<Donation>[];
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split("\n");
        const sales: Partial<Sale>[] = [];
        const donations: Partial<Donation>[] = [];

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const parts = lines[i].split(",").map((v) => v.trim());
          const data = parts[0];
          const tipo = parts[1];
          const descricao = parts[2];
          const quantidade = parts[3];
          const local = parts[4];
          const pagamento = parts[5];
          const parcelas = parts[6];
          const valor = parts[7];
          const nomeDiador = parts[8];
          const telefoneDiador = parts[9];

          if (tipo === "Venda") {
            sales.push({
              quantidade: parseInt(quantidade) || 0,
              local: local !== "N/A" ? (local as any) : undefined,
              pagamento: pagamento !== "N/A" ? (pagamento as any) : undefined,
              parcelas: parcelas !== "N/A" ? parseInt(parcelas) : undefined,
            });
          } else if (tipo === "Doação") {
            donations.push({
              tipo: descricao === "Água" ? "agua" : "luz",
              valor: parseFloat(valor) || 0,
              nomeDiador: nomeDiador || undefined,
              telefoneDiador: telefoneDiador || undefined,
            });
          }
        }

        resolve({ sales, donations });
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
}

import React, { createContext, useContext } from "react";
import { useAppData } from "@/hooks/useAppData";
import { User, Product, Sale, Donation } from "@/hooks/useAppData";

interface AppContextType {
  loading: boolean;
  currentUser: User | null;
  users: User[];
  products: Product[];
  sales: Sale[];
  donations: Donation[];
  login: (
    matricula: string,
    senha: string,
  ) => { success: boolean; error: string | null };
  loginAsync: (
    matricula: string,
    senha: string,
  ) => Promise<{ success: boolean; error: string | null }>;
  logout: () => void;
  registerUser: (userData: Omit<User, "id" | "meta" | "metaAtingida">) => Promise<User>;
  registerAdminUser: () => Promise<User>;
  makeCurrentUserAdmin: () => Promise<User>;
  updateUser: (updatedUser: User) => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<Product>;
  deleteProduct: (productId: string) => Promise<void>;
  recordSale: (
    productId: string,
    quantidade: number,
    details?: {
      local?:
        | "acoes"
        | "vendaExterna"
        | "vendaInterna"
        | "quimioterapia"
        | "portaria"
        | "sus"
        | "convenio";
      pagamento?: "cartao" | "dinheiro" | "pix";
      parcelas?: number;
    },
  ) => Promise<Sale | undefined>;
  recordDonation: (
    tipo: "agua" | "luz",
    valor: number,
    nomeDiador?: string,
    telefoneDiador?: string,
  ) => Promise<Donation | undefined>;
  getSalesByUser: (userId: string) => Sale[];
  getSalesByMonth: (userId: string, date?: Date) => Sale[];
  getSalesByDateRange: (
    userId: string,
    startDate: Date,
    endDate: Date,
  ) => Sale[];
  getTotalSalesByProduct: (userId: string) => Record<string, number>;
  getTotalSalesByProductInRange: (
    userId: string,
    startDate: Date,
    endDate: Date,
  ) => Record<string, number>;
  getDonationsByUser: (userId: string) => Donation[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const appData = useAppData();

  return <AppContext.Provider value={appData}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

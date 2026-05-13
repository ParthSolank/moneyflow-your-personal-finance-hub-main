import api from "./client";

export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
}

export interface ImportTransaction extends ParsedTransaction {
  category: string;
}

export const importService = {
  async parseStatement(file: File): Promise<ParsedTransaction[]> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/import/parse", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  async confirmImport(accountId: string, transactions: ImportTransaction[]): Promise<number> {
    const response = await api.post("/import/confirm", { accountId, transactions });
    return response.data;
  }
};

export interface allStatement {
  id: string;
  supplierName: string;
  supplierType: string;
  commercialName: string;
  walletBalance: string;
  amount: string;
  title: string;
  buyerName: string;
  propertyName: string;
  createdAt: string;
}

export interface statementResponse {
  items: allStatement[];
  page?: number; // optional
  pageSize?: number;
  fromDate?: string;
  toDate?: string;
  commercialName?: string;
  totalItems: number;
}

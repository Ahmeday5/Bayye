export interface allSuppliers {
  id: number;
  email: string;
  name: string;
  commercialName: string;
  phoneNumber: string;
  supplierType: string;
  warehouseAddress: string;
  warehouseImageUrl: string;
  deliveryMethod: string;
  profitPercentage: string;
  minimumOrderPrice?: string;
  minimumOrderItems: string;
  deliveryDays: string;
  walletBalance: string;
  isActive?: boolean;
  averageRating?: number;
  totalRatings?: number;
  warehouseLocation?: string;
  password?: string;
}

export interface addallSuppliers {
  id: number;
  email: string;
  name: string;
  commercialName: string;
  phoneNumber: string;
  supplierType: string;
  warehouseAddress: string;
  warehouseImageUrl: string;
  deliveryMethod: string;
  minimumOrderItems: string;
  deliveryDays: string;
  warehouseLocation: string;
}

export interface SuppliersResponse {
  items: allSuppliers[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface UpdateSupplierResponse {
  success: boolean;
  message: string;
  data?: allSuppliers;
}

export interface WalletResponse {
  success: boolean;
  message: string;
  newBalance?: number;
}

export interface AddSupplierResponse {
  success: boolean;
  message: string;
  data?: addallSuppliers;
}

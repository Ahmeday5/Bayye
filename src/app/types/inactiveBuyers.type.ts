export interface inactiveBuyers {
  id: number;
  fullName: string;
  phoneNumber: string;
  propertyName: string;
  propertyType: string;
  propertyAddress: string;
  propertyInsideImagePath: string;
  propertyOutsideImagePath: string;
  isActive: boolean;
  walletBalance: string;
}

export interface inactiveBuyersResponse {
  items: inactiveBuyers[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface activateBuyerResponse {
  success: boolean;
  message: string;
  data?: inactiveBuyers;
}

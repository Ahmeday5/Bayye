export interface activeBuyers {
  id: number;
  fullName: string;
  phoneNumber: string;
  propertyName: string;
  propertyType: string;
  propertyLocation: string;
  propertyAddress: string;
  propertyInsideImagePath: string;
  propertyOutsideImagePath: string;
  isActive: boolean;
  walletBalance: number;
  deliveryStation: string;
  deliveryStationId?: number;
}

export interface activeBuyersResponse {
  items: activeBuyers[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface UpdateBuyersResponse {
  success: boolean;
  message: string;
  data?: activeBuyers;
}

export interface AllDeliveryStation {
  id: number;
  name: string;
}

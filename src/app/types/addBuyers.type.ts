export interface addallBuyers {
  id: number;
  FullName: string;
  PhoneNumber: string;
  PropertyName: string;
  PropertyType: string;
  PropertyLocation: string;
  PropertyAddress: string;
  DeliveryStationId: number | null;
  PropertyInsideImage: string;
  PropertyOutsideImage: string;
}

export interface AddBuyersResponse {
  success: boolean;
  message: string;
  data?: addallBuyers;
}

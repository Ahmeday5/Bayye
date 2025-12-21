export interface Advertisement {
  id: number;
  name: string;
  imageUrl: string;
}

export interface AdvertisementsResponse {
  items: Advertisement[];
  totalItems: number;
}

export interface UpdateAdvertisementResponse {
  success: boolean;
  message: string;
  data?: Advertisement;
}

export interface AddResponse {
  success: boolean;
  message: string;
  data?: Advertisement;
}

export interface OrderItem {
  id: number;
  supplierProductId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  totalAmount: number;
  deliveryDate: string;
  paymentMethod: string;
  status: string;
  walletPaymentAmount: number;
  supplierId: number;
  supplierName: string;
  supplierType: string;
  buyerName: string;
  buyerPhone: string;
  propertyName: string;
  propertyAddress: string;
  propertyLocation: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  data: Order[];
}

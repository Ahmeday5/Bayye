export interface returnItem {
  id: number;
  supplierOrderItemId: number;
  supplierOrderId: number;
  returnedQuantity: number;
  returnDate: string;
  productName: string;
  unitPrice: number;
}

export interface Return {
  supplierOrderId: number;
  orderDate: string;
  buyerName: string;
  totalReturnedQuantity: number;
  totalRefundAmount: number;
  items: returnItem[];
}

export interface ReturnsResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  data: Return[];
}

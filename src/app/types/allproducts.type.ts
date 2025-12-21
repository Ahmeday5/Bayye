export interface allProducts {
  id: number;
  name: string;
  category: string;
  company: string;
  imageUrl: string;
}

export interface productData {
  items: allProducts[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface productResponse {
  message: string;
  data: productData;
}

export interface allCategories {
  name: string;
}

export interface categoryData {
  data: allCategories[];
  message: string;
}

export interface AddProductResponse {
  success: boolean;
  message: string;
  data?: allProducts;
}

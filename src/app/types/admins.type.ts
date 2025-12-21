export interface allAdmins {
  id: string;
  email: string;
  roles: string[];
}

export interface adminsResponse {
  items: allAdmins[];
  page?: number; // optional
  pageSize?: number;
  totalItems: number;
}

export interface AddAdminResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    email: string;
    role: string;
  };
}

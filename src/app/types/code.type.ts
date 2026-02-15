export interface usedBy {
  buyerFullName: string;
  buyerPropertyName: string;
  usedAt: string;
}

export interface ReferralCode {
  id: number;
  code: string;
  createdAt: string;
  usageCount: number;
  usedBy: usedBy[];
}

export interface CodeDataResponse {
  data: ReferralCode[];
}

export interface AddCodeRequest {
  code: string;
}

export interface AddCodeResponse {
  id?: number;
  code: string;
  message: string;
}

export interface DeleteCodeResponse {
  message: string;
  deletedId: number;
}

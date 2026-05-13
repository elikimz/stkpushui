export interface STKPushRequest {
  phone: string;
  amount: number;
  reference?: string;
}

export interface STKPushResponse {
  status: string;
  message: string;
  reference: string;
  data?: any;
}

export interface PaymentStatusResponse {
  status: 'pending' | 'completed' | 'failed' | 'timeout';
  message: string;
  reference: string;
}

export interface ApiError {
  detail: string | Array<{ msg: string; loc: any[] }>;
}

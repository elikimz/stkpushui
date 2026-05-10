export interface PaymentRequest {
  phone: string
  amount: number
}

export interface PaymentResponse {
  status: string
  message: string
  reference: string
  data?: Record<string, unknown>
}

export interface TransactionStatus {
  id: number
  phone: string
  amount: number
  reference: string
  status: string
  created_at: string
  updated_at: string
}

export interface ApiError {
  status: string
  message: string
  error_code?: string
}

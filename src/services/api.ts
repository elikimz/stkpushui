import axios, { AxiosInstance } from 'axios'
import { PaymentRequest, PaymentResponse, TransactionStatus } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  async initiatePayment(data: PaymentRequest): Promise<PaymentResponse> {
    const response = await this.client.post<PaymentResponse>('/api/pay', data)
    return response.data
  }

  async getTransaction(reference: string): Promise<TransactionStatus> {
    const response = await this.client.get<TransactionStatus>(
      `/api/transactions/${reference}`
    )
    return response.data
  }

  async listTransactions(skip: number = 0, limit: number = 100) {
    const response = await this.client.get<TransactionStatus[]>(
      '/api/transactions',
      {
        params: { skip, limit },
      }
    )
    return response.data
  }
}

export default new ApiClient()

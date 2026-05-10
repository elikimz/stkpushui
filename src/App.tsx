import React, { useState } from 'react'
import { PaymentForm } from './components/PaymentForm'
import { TransactionStatus } from './components/TransactionStatus'
import { PaymentRequest, PaymentResponse } from './types'
import apiClient from './services/api'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<PaymentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async (data: PaymentRequest) => {
    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      const result = await apiClient.initiatePayment(data)
      setResponse(result)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>💳 PesaFlux Payment</h1>
        <p>Send money via M-Pesa STK Push</p>

        <PaymentForm onSubmit={handlePayment} isLoading={isLoading} />
        <TransactionStatus response={response} error={error} />
      </div>
    </div>
  )
}

export default App

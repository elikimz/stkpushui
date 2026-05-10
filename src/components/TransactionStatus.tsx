import React from 'react'
import { PaymentResponse } from '../types'

interface TransactionStatusProps {
  response: PaymentResponse | null
  error: string | null
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  response,
  error,
}) => {
  if (!response && !error) {
    return null
  }

  if (error) {
    return (
      <div className="status-box error">
        <h3>❌ Payment Failed</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (response) {
    const isSuccess = response.status === 'success'

    return (
      <div className={`status-box ${isSuccess ? 'success' : 'pending'}`}>
        <h3>{isSuccess ? '✅ STK Sent!' : '⏳ Processing...'}</h3>
        <p>{response.message}</p>
        {response.reference && (
          <div className="transaction-reference">
            <label>Transaction Reference</label>
            <code>{response.reference}</code>
          </div>
        )}
      </div>
    )
  }

  return null
}

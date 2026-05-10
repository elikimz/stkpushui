import React, { useState } from 'react'
import { PaymentRequest } from '../types'

interface PaymentFormProps {
  onSubmit: (data: PaymentRequest) => Promise<void>
  isLoading: boolean
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, isLoading }) => {
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate phone
    if (!phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^254\d{9}$/.test(phone)) {
      newErrors.phone = 'Phone must be in format 254XXXXXXXXX'
    }

    // Validate amount
    if (!amount) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit({
        phone,
        amount: parseFloat(amount),
      })
    } catch (error) {
      console.error('Payment error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          type="tel"
          placeholder="254712345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isLoading}
          className={errors.phone ? 'error' : ''}
        />
        {errors.phone && <div className="error-message">{errors.phone}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount (KES)</label>
        <input
          id="amount"
          type="number"
          placeholder="100"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
          className={errors.amount ? 'error' : ''}
          min="0"
          step="0.01"
        />
        {errors.amount && <div className="error-message">{errors.amount}</div>}
      </div>

      <button type="submit" className="submit-btn" disabled={isLoading}>
        {isLoading ? (
          <>
            <span className="loading-spinner"></span>
            Processing...
          </>
        ) : (
          'Send Payment'
        )}
      </button>
    </form>
  )
}

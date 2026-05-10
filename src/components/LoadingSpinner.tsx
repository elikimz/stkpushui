import React from 'react'

interface LoadingSpinnerProps {
  text?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Loading...' }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loading-spinner"></div>
      <span>{text}</span>
    </div>
  )
}

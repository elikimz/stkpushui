import React, { useState } from 'react';
import { Phone, CreditCard, Hash, Send } from 'lucide-react';
import { STKPushRequest } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PaymentFormProps {
  onSubmit: (data: STKPushRequest) => Promise<void>;
  isLoading: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    phone: '',
    amount: '',
    reference: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^254\d{9}$/.test(formData.phone)) newErrors.phone = 'Format: 254XXXXXXXXX';
    
    if (!formData.amount) newErrors.amount = 'Amount is required';
    else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) newErrors.amount = 'Must be > 0';

    if (!formData.reference) newErrors.reference = 'Reference is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    await onSubmit({
      phone: formData.phone,
      amount: Number(formData.amount),
      reference: formData.reference,
    });
  };

  const inputClasses = (field: string) => cn(
    "block w-full pl-10 pr-3 py-3 border rounded-xl text-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none",
    errors[field] ? "border-red-300 bg-red-50" : "border-slate-200 bg-white"
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="tel"
            placeholder="254712345678"
            className={inputClasses('phone')}
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            disabled={isLoading}
          />
        </div>
        {errors.phone && <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.phone}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Amount (KES)</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CreditCard className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="number"
            placeholder="100.00"
            className={inputClasses('amount')}
            value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: e.target.value })}
            disabled={isLoading}
          />
        </div>
        {errors.amount && <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.amount}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Reference</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Hash className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Order #123"
            className={inputClasses('reference')}
            value={formData.reference}
            onChange={e => setFormData({ ...formData, reference: e.target.value })}
            disabled={isLoading}
          />
        </div>
        {errors.reference && <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.reference}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="spinner h-4 w-4" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Send className="h-4 w-4" />
            <span>Pay Now</span>
          </div>
        )}
      </button>
    </form>
  );
};

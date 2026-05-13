import React, { useState } from 'react';
import { Phone, CreditCard, Send } from 'lucide-react';
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
  const [phoneSuffix, setPhoneSuffix] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!phoneSuffix) newErrors.phone = 'Phone number is required';
    else if (!/^\d{9}$/.test(phoneSuffix)) newErrors.phone = 'Must be 9 digits';
    
    if (!amount) newErrors.amount = 'Amount is required';
    else if (isNaN(Number(amount)) || Number(amount) <= 0) newErrors.amount = 'Must be > 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    await onSubmit({
      phone: `254${phoneSuffix}`,
      amount: Number(amount),
    });
  };

  const inputClasses = (field: string) => cn(
    "block w-full pr-3 py-4 border rounded-2xl text-base transition-all focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none font-medium",
    errors[field] ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 focus:bg-white"
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
          <div className="flex items-center">
            <span className="absolute left-11 text-slate-500 font-bold select-none">254</span>
            <input
              type="tel"
              placeholder="712345678"
              className={cn(inputClasses('phone'), "pl-[4.5rem]")}
              value={phoneSuffix}
              onChange={e => setPhoneSuffix(e.target.value.replace(/\D/g, '').slice(0, 9))}
              disabled={isLoading}
            />
          </div>
        </div>
        {errors.phone && <p className="text-xs text-red-500 font-medium mt-1 ml-1">{errors.phone}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 ml-1">Amount (KES)</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <CreditCard className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="number"
            placeholder="0.00"
            className={cn(inputClasses('amount'), "pl-12")}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {errors.amount && <p className="text-xs text-red-500 font-medium mt-1 ml-1">{errors.amount}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center py-5 px-6 border border-transparent rounded-2xl shadow-xl shadow-primary/20 text-base font-black text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.97] mt-4"
      >
        {isLoading ? (
          <div className="flex items-center space-x-3">
            <div className="spinner h-5 w-5 border-[3px]" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Send className="h-5 w-5" />
            <span>Confirm Payment</span>
          </div>
        )}
      </button>
    </form>
  );
};

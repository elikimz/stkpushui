import React, { useState } from 'react';
import { Phone, CreditCard, ChevronRight } from 'lucide-react';
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
    if (!phoneSuffix) newErrors.phone = 'Phone number required';
    else if (!/^\d{9}$/.test(phoneSuffix)) newErrors.phone = 'Invalid 9-digit number';
    
    if (!amount) newErrors.amount = 'Amount required';
    else if (isNaN(Number(amount)) || Number(amount) <= 0) newErrors.amount = 'Invalid amount';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Phone Input */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Phone className={cn("h-5 w-5 transition-colors", errors.phone ? "text-red-400" : "text-slate-300 group-focus-within:text-indigo-500")} />
          </div>
          <div className="flex items-center">
            <span className="absolute left-12 text-slate-400 font-bold text-base select-none">+254</span>
            <input
              type="tel"
              placeholder="700 000 000"
              className={cn(
                "block w-full pl-24 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-base font-bold transition-all focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 outline-none",
                errors.phone && "bg-red-50 border-red-100 focus:border-red-200 focus:ring-red-500/5"
              )}
              value={phoneSuffix}
              onChange={e => setPhoneSuffix(e.target.value.replace(/\D/g, '').slice(0, 9))}
              disabled={isLoading}
            />
          </div>
        </div>
        {errors.phone && <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">{errors.phone}</p>}
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Amount (KES)</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <CreditCard className={cn("h-5 w-5 transition-colors", errors.amount ? "text-red-400" : "text-slate-300 group-focus-within:text-indigo-500")} />
          </div>
          <input
            type="number"
            placeholder="0.00"
            className={cn(
              "block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-base font-bold transition-all focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 outline-none",
              errors.amount && "bg-red-50 border-red-100 focus:border-red-200 focus:ring-red-500/5"
            )}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {errors.amount && <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">{errors.amount}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-between py-4.5 px-8 rounded-2xl bg-slate-900 hover:bg-black text-white text-base font-black shadow-xl shadow-slate-200 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        {isLoading ? (
          <div className="flex items-center space-x-3 mx-auto">
            <div className="premium-spinner" />
            <span>Processing...</span>
          </div>
        ) : (
          <>
            <span>Complete Payment</span>
            <ChevronRight className="h-5 w-5" />
          </>
        )}
      </button>
    </form>
  );
};

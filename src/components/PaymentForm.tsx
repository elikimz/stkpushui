import React, { useState } from 'react';
import { Phone, CreditCard, Lock, ChevronRight } from 'lucide-react';
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
  const [amount, setAmount] = useState('1000');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeMethod, setActiveMethod] = useState<'mpesa' | 'card'>('mpesa');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (activeMethod === 'mpesa') {
      if (!phoneSuffix) newErrors.phone = 'Phone number is required';
      else if (!/^\d{9}$/.test(phoneSuffix)) newErrors.phone = 'Enter a valid 9-digit number';
    }
    
    if (!amount) newErrors.amount = 'Amount is required';
    else if (isNaN(Number(amount)) || Number(amount) <= 0) newErrors.amount = 'Invalid amount';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeMethod !== 'mpesa') return; // Only M-Pesa implemented
    if (!validate()) return;
    
    await onSubmit({
      phone: `254${phoneSuffix}`,
      amount: Number(amount),
    });
  };

  return (
    <div className="animate-slide-in">
      {/* Payment Method Selector */}
      <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
        <button
          onClick={() => setActiveMethod('mpesa')}
          className={cn(
            "flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-bold transition-all",
            activeMethod === 'mpesa' ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" className="h-4 mr-2" />
          M-Pesa
        </button>
        <button
          onClick={() => setActiveMethod('card')}
          className={cn(
            "flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-bold transition-all opacity-50 cursor-not-allowed",
            activeMethod === 'card' ? "bg-white shadow-sm text-primary" : "text-slate-500"
          )}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Card
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Phone Input */}
        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-slate-500 ml-1">Phone Number</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-slate-200 pr-3">
              <span className="text-slate-400 font-bold text-sm">KE</span>
            </div>
            <div className="flex items-center">
              <span className="absolute left-14 text-slate-600 font-bold text-base select-none">+254</span>
              <input
                type="tel"
                placeholder="712 345 678"
                className={cn(
                  "block w-full pl-[5.8rem] pr-4 py-4 bg-white border border-slate-200 rounded-xl text-base font-medium transition-all focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none input-shadow",
                  errors.phone && "border-red-400 focus:ring-red-100"
                )}
                value={phoneSuffix}
                onChange={e => setPhoneSuffix(e.target.value.replace(/\D/g, '').slice(0, 9))}
                disabled={isLoading}
              />
            </div>
          </div>
          {errors.phone && <p className="text-xs text-red-500 font-medium mt-1 ml-1">{errors.phone}</p>}
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-slate-500 ml-1">Amount to Pay</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-slate-400 font-bold text-base">KES</span>
            </div>
            <input
              type="number"
              placeholder="0.00"
              className={cn(
                "block w-full pl-14 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-base font-bold transition-all focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none input-shadow",
                errors.amount && "border-red-400 focus:ring-red-100"
              )}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {errors.amount && <p className="text-xs text-red-500 font-medium mt-1 ml-1">{errors.amount}</p>}
        </div>

        {/* Security Info */}
        <div className="flex items-center justify-center space-x-2 py-2">
          <Lock className="h-3 w-3 text-slate-400" />
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Payments are secure and encrypted</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || activeMethod !== 'mpesa'}
          className="w-full relative group flex items-center justify-center py-4 px-6 rounded-xl bg-[#635BFF] hover:bg-[#0A2540] text-white text-base font-bold shadow-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          <div className="absolute inset-0 w-0 bg-white/10 transition-all group-hover:w-full" />
          {isLoading ? (
            <div className="flex items-center space-x-3">
              <div className="premium-spinner" />
              <span>Authorizing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="flex-1 text-center">Pay KES {Number(amount).toLocaleString()}</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </button>
      </form>

      {/* Payment Logos */}
      <div className="mt-10 flex items-center justify-center space-x-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
      </div>
    </div>
  );
};

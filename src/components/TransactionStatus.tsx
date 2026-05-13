import React from 'react';
import { CheckCircle2, AlertCircle, Loader2, Copy, XCircle, Clock } from 'lucide-react';
import { STKPushResponse, PaymentStatusResponse } from '../types';

interface TransactionStatusProps {
  response: STKPushResponse | null;
  error: string | null;
  paymentStatus: PaymentStatusResponse | null;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  response,
  error,
  paymentStatus,
}) => {
  if (!response && !error) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (error) {
    return (
      <div className="mt-8 animate-in">
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-[13px] text-red-700 font-bold leading-tight">{error}</p>
        </div>
      </div>
    );
  }

  // Handle real-time payment status from polling
  if (paymentStatus) {
    const { status, message, reference } = paymentStatus;

    const statusConfig = {
      pending: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-100',
        icon: <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />,
        title: 'Processing Payment',
        titleColor: 'text-indigo-900',
        msgColor: 'text-indigo-700'
      },
      completed: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        icon: <CheckCircle2 className="h-6 w-6 text-emerald-500 shadow-sm" />,
        title: 'Payment Successful',
        titleColor: 'text-emerald-900',
        msgColor: 'text-emerald-700'
      },
      failed: {
        bg: 'bg-red-50',
        border: 'border-red-100',
        icon: <XCircle className="h-6 w-6 text-red-500" />,
        title: 'Payment Failed',
        titleColor: 'text-red-900',
        msgColor: 'text-red-700'
      },
      timeout: {
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        icon: <Clock className="h-6 w-6 text-amber-500" />,
        title: 'Session Timeout',
        titleColor: 'text-amber-900',
        msgColor: 'text-amber-700'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <div className="mt-8 space-y-4 animate-in">
        <div className={`p-6 rounded-3xl border-2 transition-colors duration-500 ${config.bg} ${config.border}`}>
          <div className="flex items-center space-x-4 mb-4">
            {config.icon}
            <div>
              <h3 className={`text-[15px] font-black ${config.titleColor}`}>
                {config.title}
              </h3>
              <p className={`text-[12px] font-bold opacity-70 ${config.msgColor}`}>
                {message}
              </p>
            </div>
          </div>
          
          <div className="bg-white/60 rounded-2xl p-4 flex items-center justify-between">
            <div className="overflow-hidden">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Ref ID</span>
              <code className="text-xs font-mono text-slate-800 font-black truncate block">
                {reference}
              </code>
            </div>
            <button 
              onClick={() => copyToClipboard(reference)}
              className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-indigo-500 transition-all active:scale-90"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {status === 'pending' && (
          <p className="text-center text-[11px] text-slate-400 font-bold uppercase tracking-wider animate-pulse">
            Please enter your PIN on your phone now
          </p>
        )}
      </div>
    );
  }

  return null;
};

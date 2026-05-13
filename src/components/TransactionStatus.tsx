import React from 'react';
import { CheckCircle2, AlertCircle, Loader2, Copy } from 'lucide-react';
import { STKPushResponse } from '../types';

interface TransactionStatusProps {
  response: STKPushResponse | null;
  error: string | null;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  response,
  error,
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

  if (response) {
    const isSuccess = response.status === 'success';
    
    return (
      <div className="mt-8 space-y-4 animate-in">
        <div className={`p-6 rounded-3xl border-2 ${
          isSuccess ? 'bg-emerald-50 border-emerald-100' : 'bg-indigo-50 border-indigo-100'
        }`}>
          <div className="flex items-center space-x-4 mb-4">
            {isSuccess ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-500 shadow-sm" />
            ) : (
              <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
            )}
            <div>
              <h3 className={`text-[15px] font-black ${isSuccess ? 'text-emerald-900' : 'text-indigo-900'}`}>
                {isSuccess ? 'STK Push Sent' : 'Processing...'}
              </h3>
              <p className={`text-[12px] font-bold opacity-70 ${isSuccess ? 'text-emerald-700' : 'text-indigo-700'}`}>
                {response.message}
              </p>
            </div>
          </div>
          
          <div className="bg-white/60 rounded-2xl p-4 flex items-center justify-between">
            <div className="overflow-hidden">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Ref ID</span>
              <code className="text-xs font-mono text-slate-800 font-black truncate block">
                {response.reference}
              </code>
            </div>
            <button 
              onClick={() => copyToClipboard(response.reference)}
              className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-indigo-500 transition-all active:scale-90"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400 font-bold uppercase tracking-wider">
          Please check your phone for the PIN prompt
        </p>
      </div>
    );
  }

  return null;
};

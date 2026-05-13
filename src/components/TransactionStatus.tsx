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
      <div className="mt-8 animate-fade-in">
        <div className="p-5 rounded-2xl bg-red-50 border border-red-100 flex items-start space-x-4">
          <div className="bg-red-500 p-1.5 rounded-full shrink-0">
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-[14px] font-bold text-red-900">Payment failed</h3>
            <p className="text-[13px] text-red-600 mt-1 leading-relaxed">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (response) {
    const isSuccess = response.status === 'success';
    
    return (
      <div className="mt-8 space-y-6 animate-fade-in">
        <div className={`p-6 rounded-2xl border ${
          isSuccess ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'
        }`}>
          <div className="flex items-center space-x-4 mb-4">
            {isSuccess ? (
              <div className="bg-emerald-500 p-2 rounded-full shadow-lg shadow-emerald-200">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
            ) : (
              <div className="bg-blue-500 p-2 rounded-full shadow-lg shadow-blue-200">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
            )}
            <div>
              <h3 className={`text-[15px] font-black ${isSuccess ? 'text-emerald-900' : 'text-blue-900'}`}>
                {isSuccess ? 'STK Push Sent' : 'Processing Payment'}
              </h3>
              <p className={`text-[13px] mt-0.5 font-medium ${isSuccess ? 'text-emerald-700' : 'text-blue-700'}`}>
                {response.message}
              </p>
            </div>
          </div>
          
          <div className="bg-white/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Reference ID</span>
              <button 
                onClick={() => copyToClipboard(response.reference)}
                className="text-slate-400 hover:text-primary p-1 rounded-md hover:bg-slate-100 transition-all"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            <code className="block text-sm font-mono text-slate-800 break-all font-bold">
              {response.reference}
            </code>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[12px] text-slate-400 font-medium">
            Waiting for PIN confirmation on your device...
          </p>
        </div>
      </div>
    );
  }

  return null;
};

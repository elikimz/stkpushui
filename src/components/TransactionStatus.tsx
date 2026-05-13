import React from 'react';
import { CheckCircle2, XCircle, Info, Copy } from 'lucide-react';
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
      <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start space-x-3 animate-in fade-in slide-in-from-top-2 duration-300">
        <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-red-800">Payment Failed</h3>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (response) {
    const isSuccess = response.status === 'success';
    
    return (
      <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className={`p-4 rounded-xl flex items-start space-x-3 border ${
          isSuccess ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'
        }`}>
          {isSuccess ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
          ) : (
            <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
          )}
          <div>
            <h3 className={`text-sm font-bold ${isSuccess ? 'text-emerald-800' : 'text-blue-800'}`}>
              {isSuccess ? 'STK Push Sent' : 'Processing Payment'}
            </h3>
            <p className={`text-sm mt-1 ${isSuccess ? 'text-emerald-600' : 'text-blue-600'}`}>
              {response.message}
            </p>
          </div>
        </div>

        {response.reference && (
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Transaction Reference</span>
              <button 
                onClick={() => copyToClipboard(response.reference)}
                className="text-slate-400 hover:text-primary transition-colors"
                title="Copy Reference"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            <code className="block text-sm font-mono text-slate-700 bg-white border border-slate-200 rounded-lg p-3 break-all">
              {response.reference}
            </code>
          </div>
        )}
      </div>
    );
  }

  return null;
};

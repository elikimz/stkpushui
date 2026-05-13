import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { PaymentForm } from './components/PaymentForm';
import { TransactionStatus } from './components/TransactionStatus';
import { initiateSTKPush } from './services/api';
import { STKPushRequest, STKPushResponse } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<STKPushResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async (data: STKPushRequest) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await initiateSTKPush(data);
      setResponse(result);
    } catch (err: any) {
      console.error('Payment Error:', err);
      const message = err.response?.data?.detail 
        ? (typeof err.response.data.detail === 'string' ? err.response.data.detail : JSON.stringify(err.response.data.detail))
        : 'Failed to connect to the payment server. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50'>
      <div className='w-full max-w-md'>
        {/* Logo/Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white mb-4 shadow-lg shadow-primary/30'>
            <ShieldCheck className='h-8 w-8' />
          </div>
          <h1 className='text-2xl font-black text-slate-900 tracking-tight'>PesaFlux Checkout</h1>
          <p className='text-slate-500 text-sm mt-1'>Secure M-Pesa STK Push Payment</p>
        </div>

        {/* Main Card */}
        <div className='bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden'>
          <div className='p-8'>
            <PaymentForm onSubmit={handlePayment} isLoading={isLoading} />
            <TransactionStatus response={response} error={error} />
          </div>
          
          {/* Footer inside card */}
          <div className='px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center space-x-2'>
            <div className='h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse' />
            <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Secure 256-bit SSL Encrypted</span>
          </div>
        </div>

        {/* External Footer */}
        <p className='text-center text-slate-400 text-xs mt-8'>
          &copy; {new Date().getFullYear()} PesaFlux. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default App;

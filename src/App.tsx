import React, { useState } from 'react';
import { ShieldCheck, Zap } from 'lucide-react';
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
        : 'Payment server unreachable. Please check your connection.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-[#f8fafc]">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />

      <div className="w-full max-w-[440px] relative">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2.5rem] bg-primary text-white mb-6 shadow-2xl shadow-primary/40 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <Zap className="h-10 w-10 fill-white" />
          </div>
          <h1 className="text-3xl font-[900] text-slate-900 tracking-tight mb-2">PesaFlux Checkout</h1>
          <div className="flex items-center justify-center space-x-2 text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium">Secure Payment Gateway</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="glass-card rounded-[2.5rem] border border-white overflow-hidden">
          <div className="p-8 sm:p-10">
            <PaymentForm onSubmit={handlePayment} isLoading={isLoading} />
            <TransactionStatus response={response} error={error} />
          </div>
          
          {/* Footer inside card */}
          <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100/50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live System</span>
            </div>
            <div className="flex space-x-3 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
              <span className="text-[10px] font-black italic text-slate-600">VISA</span>
              <span className="text-[10px] font-black italic text-slate-600">M-PESA</span>
            </div>
          </div>
        </div>

        {/* External Footer */}
        <div className="mt-10 text-center space-y-4">
          <p className="text-slate-400 text-xs font-medium">
            &copy; {new Date().getFullYear()} PesaFlux. Verified Secure Payment.
          </p>
          <div className="flex items-center justify-center space-x-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <a href="#" className="hover:text-primary transition-colors">Support</a>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

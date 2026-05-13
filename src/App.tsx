import React, { useState } from 'react';
import { PaymentForm } from './components/PaymentForm';
import { TransactionStatus } from './components/TransactionStatus';
import { initiateSTKPush } from './services/api';
import { STKPushRequest, STKPushResponse } from './types';
import { ShieldCheck, Globe, Lock } from 'lucide-react';

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
        : 'Payment gateway connection error. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#F9FAFB]">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-[500px] animate-in relative">
        {/* Top Branding */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center shadow-lg">
              <Globe className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-800">GlobalPay</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
            <Lock className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Secure SSL</span>
          </div>
        </div>

        {/* Main Checkout Card */}
        <div className="bg-white rounded-[2rem] checkout-card overflow-hidden">
          {/* Visual Banner */}
          <div className="h-32 premium-gradient relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
              </svg>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6">
              <h1 className="text-xl font-black mb-1">Secure Checkout</h1>
              <p className="text-white/80 text-xs font-medium">Enter your details to complete payment</p>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <PaymentForm onSubmit={handlePayment} isLoading={isLoading} />
            <TransactionStatus response={response} error={error} />
          </div>

          {/* Trust Footer */}
          <div className="bg-slate-50/80 px-10 py-6 border-t border-slate-100 flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-6 grayscale opacity-50">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" className="h-4" />
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-[11px] font-bold uppercase tracking-widest">PCI DSS Compliant Gateway</span>
            </div>
          </div>
        </div>

        {/* External Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-[11px] font-medium">
            By paying, you agree to our <a href="#" className="underline hover:text-slate-600">Terms of Service</a>. 
            Need help? <a href="#" className="underline hover:text-slate-600">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;

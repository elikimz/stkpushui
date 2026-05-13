import React, { useState } from 'react';
import { PaymentForm } from './components/PaymentForm';
import { TransactionStatus } from './components/TransactionStatus';
import { initiateSTKPush } from './services/api';
import { STKPushRequest, STKPushResponse } from './types';
import { ShoppingBag, ChevronLeft } from 'lucide-react';

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
        : 'Could not connect to the payment gateway. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Side: Order Summary (Hidden on mobile or stacked) */}
      <div className="lg:w-[45%] bg-[#F6F9FC] p-8 lg:p-20 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
        <div>
          <button className="flex items-center text-slate-400 hover:text-slate-600 text-sm font-bold transition-colors mb-12">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to store
          </button>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">PesaFlux Store</h2>
                <h1 className="text-2xl font-black text-[#32325d]">Complete your order</h1>
              </div>
            </div>

            <div className="bg-white/50 rounded-3xl p-8 space-y-6 border border-white">
              <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl skeleton" />
                  <div>
                    <p className="font-bold text-[#32325d]">Premium Subscription</p>
                    <p className="text-sm text-slate-500">Billed monthly</p>
                  </div>
                </div>
                <p className="font-black text-[#32325d]">KES 1,000</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="text-[#32325d] font-bold">KES 1,000.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Processing Fee</span>
                  <span className="text-[#32325d] font-bold">KES 0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                <span className="text-lg font-black text-[#32325d]">Total</span>
                <span className="text-2xl font-black text-[#32325d]">KES 1,000.00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <p className="text-xs text-slate-400 font-medium">
            Powered by <span className="font-black text-slate-600">PesaFlux</span> &bull; <a href="#" className="hover:underline">Terms</a> &bull; <a href="#" className="hover:underline">Privacy</a>
          </p>
        </div>
      </div>

      {/* Right Side: Payment Form */}
      <div className="lg:w-[55%] p-8 lg:p-20 flex flex-col justify-center items-center">
        <div className="w-full max-w-[440px]">
          <div className="mb-10">
            <h2 className="text-xl font-black text-[#32325d] mb-2">Payment Details</h2>
            <p className="text-slate-500 font-medium text-sm">Choose your payment method and complete your purchase.</p>
          </div>

          <div className="bg-white rounded-3xl premium-shadow border border-slate-50 overflow-hidden">
            <div className="p-8 sm:p-10">
              <PaymentForm onSubmit={handlePayment} isLoading={isLoading} />
              <TransactionStatus response={response} error={error} />
            </div>
          </div>

          <div className="mt-8 lg:hidden text-center">
             <p className="text-xs text-slate-400 font-medium">
              Powered by <span className="font-black text-slate-600">PesaFlux</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

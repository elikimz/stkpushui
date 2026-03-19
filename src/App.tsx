import { useState } from "react";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://stk-gtbwa2evbsgfadfj.southafricanorth-01.azurewebsites.net";

type Status = "idle" | "loading" | "success" | "error";

interface PaymentResponse {
  success: boolean;
  message: string;
  transaction_request_id?: string;
}

export default function App() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<PaymentResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResult(null);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/payment/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount: parseFloat(amount) }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Payment request failed");
      }

      setResult(data);
      setStatus(data.success ? "success" : "error");
      if (!data.success) setErrorMsg(data.message || "Payment failed");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setResult(null);
    setErrorMsg("");
    setPhone("");
    setAmount("");
  };

  return (
    <div className="page">
      <div className="card">
        {/* Header */}
        <div className="card-header">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
            </svg>
          </div>
          <h1>Pay with M-Pesa</h1>
          <p className="subtitle">Enter your details to receive an STK Push prompt on your phone</p>
        </div>

        {/* Form */}
        {status !== "success" && (
          <form onSubmit={handleSubmit} className="form" noValidate>
            <div className="field">
              <label htmlFor="phone">Phone Number</label>
              <div className="input-wrapper">
                <span className="input-prefix">🇰🇪</span>
                <input
                  id="phone"
                  type="tel"
                  placeholder="0712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={status === "loading"}
                  autoComplete="tel"
                />
              </div>
              <span className="hint">Safaricom number registered with M-Pesa</span>
            </div>

            <div className="field">
              <label htmlFor="amount">Amount (KES)</label>
              <div className="input-wrapper">
                <span className="input-prefix">KES</span>
                <input
                  id="amount"
                  type="number"
                  placeholder="100"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  disabled={status === "loading"}
                />
              </div>
            </div>

            {status === "error" && (
              <div className="alert alert-error" role="alert">
                <span className="alert-icon">✕</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-pay"
              disabled={status === "loading" || !phone || !amount}
            >
              {status === "loading" ? (
                <>
                  <span className="spinner" />
                  Sending request…
                </>
              ) : (
                "Pay Now"
              )}
            </button>
          </form>
        )}

        {/* Success state */}
        {status === "success" && result && (
          <div className="success-state">
            <div className="success-icon">✓</div>
            <h2>Check Your Phone</h2>
            <p>
              An M-Pesa prompt has been sent to <strong>{phone}</strong>.
              Enter your PIN to complete the payment of <strong>KES {amount}</strong>.
            </p>
            {result.transaction_request_id && (
              <p className="txn-id">
                Transaction ID: <code>{result.transaction_request_id}</code>
              </p>
            )}
            <button className="btn-reset" onClick={handleReset}>
              Make another payment
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="card-footer">
          <span>Secured by</span>
          <strong>Pesaflux</strong>
          <span>·</span>
          <span>M-Pesa STK Push</span>
        </div>
      </div>
    </div>
  );
}

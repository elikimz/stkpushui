/**
 * Design philosophy: Swiss International Typographic Style adapted for mobile-money checkout.
 * The component uses an asymmetrical form-and-ledger layout, deep green trust cues, warm paper surfaces,
 * monospaced transaction labels, and restrained receipt-style feedback.
 */
import { FormEvent, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, LockKeyhole, ReceiptText, Smartphone } from 'lucide-react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663645998121/YoiMkoZxooddPyLq9QJb4e/stkpush-hero-ledger-Qjnjy5EGVmRmx3xmuEU5mz.webp';
const RECEIPT_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663645998121/YoiMkoZxooddPyLq9QJb4e/stkpush-receipt-card-HVVe6Sh4oGRBqv49cAG8ws.webp';
const SECURITY_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663645998121/YoiMkoZxooddPyLq9QJb4e/stkpush-security-token-XdSqod8UiUMy7k5SFSsJTo.webp';
const PHONE_PATTERN = /^2547\d{8}$/;

type PaymentResponse = Record<string, unknown>;

function getResponseMessage(data: unknown): string {
  if (!data || typeof data !== 'object') return 'Payment request submitted.';

  const record = data as Record<string, unknown>;
  const candidates = ['message', 'Message', 'description', 'Description', 'status', 'Status', 'response', 'Response'];

  for (const key of candidates) {
    const value = record[key];
    if (typeof value === 'string' && value.trim().length > 0) return value;
  }

  return 'Payment request submitted. Check your phone and enter M-Pesa PIN.';
}

function formatJson(data: unknown): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

export default function App() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('1');
  const [reference] = useState('Order 1001');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<PaymentResponse | null>(null);

  const phoneIsValid = useMemo(() => PHONE_PATTERN.test(phone), [phone]);
  const amountIsValid = useMemo(() => Number(amount) > 0, [amount]);
  const canSubmit = phoneIsValid && amountIsValid && !isLoading;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResponse(null);

    if (!phoneIsValid) {
      setError('Enter phone number in 2547XXXXXXXX format.');
      return;
    }

    if (!amountIsValid) {
      setError('Enter an amount greater than zero.');
      return;
    }

    setIsLoading(true);

    try {
      const apiResponse = await fetch(`${API_BASE_URL}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          phone,
          reference,
        }),
      });

      const contentType = apiResponse.headers.get('content-type') ?? '';
      const data = contentType.includes('application/json') ? await apiResponse.json() : await apiResponse.text();

      if (!apiResponse.ok) {
        const detail = typeof data === 'object' && data !== null && 'detail' in data ? (data as { detail: unknown }).detail : data;
        throw new Error(typeof detail === 'string' ? detail : formatJson(detail));
      }

      setResponse(data as PaymentResponse);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Payment request failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-panel" aria-label="STK Push payment panel">
        <div className="hero-art" style={{ backgroundImage: `url(${HERO_IMAGE})` }} aria-hidden="true" />

        <div className="payment-card">
          <p className="eyebrow">Pesaflux STK Push</p>
          <h1>Send a secure M-Pesa prompt to your phone.</h1>
          <p className="intro">Enter the customer phone number and amount. The backend will initiate the request through Pesaflux and return the provider response here.</p>

          <div className="notice" role="note">
            <AlertCircle size={20} aria-hidden="true" />
            <p>You will receive an M-Pesa prompt. The name may appear as <strong>PESAFLUX</strong>.</p>
          </div>

          <form className="payment-form" onSubmit={handleSubmit}>
            <label htmlFor="phone">
              <span>Phone number</span>
              <input
                id="phone"
                name="phone"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="2547XXXXXXXX"
                value={phone}
                onChange={(event) => setPhone(event.target.value.trim())}
                aria-invalid={phone.length > 0 && !phoneIsValid}
              />
            </label>

            <label htmlFor="amount">
              <span>Amount</span>
              <input
                id="amount"
                name="amount"
                inputMode="decimal"
                placeholder="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                aria-invalid={amount.length > 0 && !amountIsValid}
              />
            </label>

            <div className="reference-row">
              <span>Reference</span>
              <strong>{reference}</strong>
            </div>

            <button type="submit" disabled={!canSubmit}>
              {isLoading ? (
                <>
                  <Loader2 className="spin" size={18} aria-hidden="true" /> Processing
                </>
              ) : (
                <>
                  <Smartphone size={18} aria-hidden="true" /> Pay now
                </>
              )}
            </button>
          </form>
        </div>

        <aside className="ledger-card" aria-label="Payment guidance and response">
          <img className="receipt-art" src={RECEIPT_IMAGE} alt="Abstract receipt and mobile prompt illustration" />

          <div className="step-list">
            <div className="step">
              <span>01</span>
              <p>Submit phone number in <strong>2547XXXXXXXX</strong> format.</p>
            </div>
            <div className="step">
              <span>02</span>
              <p>Pesaflux sends the STK Push prompt to the phone.</p>
            </div>
            <div className="step">
              <span>03</span>
              <p>Check your phone and enter M-Pesa PIN.</p>
            </div>
          </div>

          <div className="security-note">
            <img src={SECURITY_IMAGE} alt="Abstract payment security shield" />
            <div>
              <strong>Prompt name note</strong>
              <p>The Paying to name is controlled by Safaricom/Pesaflux and should not be altered in the app.</p>
            </div>
          </div>

          {error && (
            <div className="response-box response-error" role="alert">
              <AlertCircle size={20} aria-hidden="true" />
              <div>
                <strong>Request failed</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {response && (
            <div className="response-box response-success" role="status">
              <CheckCircle2 size={20} aria-hidden="true" />
              <div>
                <strong>{getResponseMessage(response)}</strong>
                <p>Check your phone and enter M-Pesa PIN.</p>
                <details>
                  <summary>Provider response</summary>
                  <pre>{formatJson(response)}</pre>
                </details>
              </div>
            </div>
          )}

          <div className="api-chip">
            <LockKeyhole size={16} aria-hidden="true" />
            <span>POST {API_BASE_URL}/pay</span>
          </div>
          <div className="api-chip">
            <ReceiptText size={16} aria-hidden="true" />
            <span>Reference: {reference}</span>
          </div>
        </aside>
      </section>
    </main>
  );
}

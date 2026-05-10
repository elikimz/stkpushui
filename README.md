# PesaFlux Payment UI

A clean React frontend for PesaFlux STK Push payments.

## Features

- ✅ Simple payment form
- ✅ Real-time validation
- ✅ Loading states
- ✅ Error handling
- ✅ Transaction status display

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your backend URL
```

### 3. Run Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
pnpm build
```

## API Integration

The frontend communicates with the backend at `http://localhost:8000` (configurable via `VITE_API_URL`).

### Payment Flow

1. User enters phone number and amount
2. Frontend validates input
3. Sends POST request to `/api/pay`
4. Shows loading state
5. Displays response (success or error)
6. User checks phone for STK prompt

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: `http://localhost:8000`)

## Project Structure

```
src/
├── main.tsx          # React entry point
├── App.tsx           # Main app component
├── App.css           # Styling
├── components/
│   ├── PaymentForm.tsx    # Payment form component
│   ├── TransactionStatus.tsx  # Status display
│   └── LoadingSpinner.tsx     # Loading indicator
├── services/
│   └── api.ts        # API client
└── types/
    └── index.ts      # TypeScript types
```

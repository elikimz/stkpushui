# Pesaflux Payment UI

A minimal React + TypeScript frontend for initiating M-Pesa STK Push payments via [Pesaflux](https://api.pesaflux.co.ke).

## Setup

```bash
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend URL
pnpm install
pnpm dev
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |

## Features

- Phone number input with automatic format normalisation (07XXXXXXXX → 2547XXXXXXXX)
- Amount input in KES
- Loading spinner while request is in flight
- Success screen showing transaction ID
- Error display for failed requests
- Fully responsive, works on mobile

## Build

```bash
pnpm build
```

Output is in `dist/`.

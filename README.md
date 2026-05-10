# STK Push Payment UI

This repository contains a simple React frontend for initiating M-Pesa STK Push payments through the FastAPI backend.

> **Payment flow:** UI → FastAPI backend at `http://localhost:8000/pay` → Pesaflux API → M-Pesa STK Push prompt on the user's phone.

## Features

| Feature | Description |
| --- | --- |
| Payment form | Captures phone number and amount. |
| Phone validation | Requires `2547XXXXXXXX` format before submission. |
| Loading state | Disables the payment button while the backend request is running. |
| User guidance | Warns that the M-Pesa prompt may show **PESAFLUX**. |
| Response handling | Displays the backend/Pesaflux response and reminds the user to enter their M-Pesa PIN. |

## Run locally

```bash
pnpm install
pnpm dev
```

The UI expects the backend to be running on `http://localhost:8000` by default. To use a different backend URL, create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Backend request

The payment button sends:

```http
POST http://localhost:8000/pay
Content-Type: application/json
```

```json
{
  "amount": "1",
  "phone": "2547XXXXXXXX",
  "reference": "Order 1001"
}
```

## Important note

Do not attempt to change or hide the name shown in the M-Pesa STK prompt. The **Paying to** name is controlled by Safaricom/Pesaflux, and the UI clearly informs users that the prompt may appear as **PESAFLUX**.

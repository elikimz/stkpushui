# PesaFlux Checkout UI

A modern, minimal, and mobile-responsive frontend for initiating M-Pesa STK Push payments via the PesaFlux STK Push API.

## Features

- ⚡️ Built with **React 19** and **Vite**
- 🎨 Styled with **Tailwind CSS**
- 🛡️ **Lucide React** icons for a professional look
- 📱 Fully responsive design
- 🔄 Real-time loading states and feedback
- 📋 Copy-to-clipboard for transaction references

## Setup

### 1. Clone and install dependencies

```bash
git clone https://github.com/elikimz/stkpushui.git
cd stkpushui
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Set VITE_API_URL to your backend URL
# Example: VITE_API_URL=https://your-api.azurewebsites.net
```

### 3. Run for development

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## Project Structure

```
stkpushui/
├── src/
│   ├── components/
│   │   ├── PaymentForm.tsx        # Payment input form
│   │   └── TransactionStatus.tsx  # Success/Error feedback
│   ├── services/
│   │   └── api.ts                 # Axios API client
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces
│   ├── App.tsx                    # Main layout and logic
│   ├── App.css                    # Tailwind directives
│   └── main.tsx                   # React entry point
├── tailwind.config.js
├── postcss.config.js
└── index.html
```

## Tech Stack

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

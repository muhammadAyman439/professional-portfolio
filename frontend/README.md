# Professional Portfolio - Frontend

This is the React frontend for the professional portfolio website.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Wouter** - Client-side routing
- **React Query** - Data fetching and caching
- **Framer Motion** - Animations

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm

### Installation

```bash
pnpm install
```

### Development

1. Copy `.env` file and configure your API URL:

```bash
# .env
VITE_API_BASE_URL=http://localhost:4000/api
```

2. Start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
pnpm build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
pnpm preview
```

## Environment Variables

- `VITE_API_BASE_URL` - The base URL for the backend API (required)
- `VITE_EMAILJS_SERVICE_ID` - EmailJS service ID for sending subscriber confirmations
- `VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID` - EmailJS template ID used for the welcome email
- `VITE_EMAILJS_PUBLIC_KEY` - EmailJS public key used by the browser client

## Deployment

### Netlify

1. Connect your repository to Netlify
2. Set build command: `pnpm build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_BASE_URL` pointing to your deployed backend

### Vercel

1. Connect your repository to Vercel
2. Set build command: `pnpm build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_BASE_URL` pointing to your deployed backend

### Other Platforms

The frontend is a static site that can be deployed anywhere (AWS S3, Cloudflare Pages, etc.). Just:
1. Build the project: `pnpm build`
2. Serve the `dist` directory
3. Ensure `VITE_API_BASE_URL` is set correctly at build time

## Project Structure

```
frontend/
├── public/          # Static assets
├── src/
│   ├── api/         # API client and data fetching
│   ├── components/  # React components
│   ├── contexts/    # React contexts
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utility functions
│   ├── pages/       # Page components
│   ├── styles/      # Global styles
│   ├── types/       # TypeScript types
│   ├── App.tsx      # Main app component
│   └── main.tsx     # Entry point
├── index.html       # HTML template
└── vite.config.ts   # Vite configuration
```

## Features

- 🎨 Modern, responsive UI with Tailwind CSS
- 🚀 Fast page loads with Vite
- 📱 Mobile-friendly design
- 🌙 Dark mode support
- ♿ Accessible components
- 🔍 SEO optimized
- 📊 Performance optimized

## License

MIT


# Professional Portfolio - CMS Backend

This project contains both the CMS frontend and the API backend, all integrated in a single Next.js application.

## Tech Stack

- **Next.js 15** - CMS frontend & API routes framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Prisma** - Database ORM (SQLite)
- **Resend** - Email service

## Project Structure

```
cms-backend/
├── src/                  # Next.js application
│   ├── app/             # App router pages & API routes
│   ├── components/      # React components
│   ├── lib/             # Server utilities (Prisma, auth, validation)
│   └── types/           # TypeScript types
├── data/                # Seed data JSON files
├── prisma/              # Database schema and migrations
├── scripts/             # Utility scripts
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm

### Installation

```bash
pnpm install
```

### Environment Setup

1. Copy `.env.local` and configure:

```bash
# .env.local

# Database
DATABASE_URL="file:./dev.db"

# Admin token for CMS access
CMS_ADMIN_TOKEN=your_secure_token_here

# Email service (optional, for contact form)
RESEND_API_KEY=your_resend_api_key_here
```

2. Generate a secure admin token:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Database Setup

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy

# Seed the database with initial data
pnpm seed
```

### Development

Run a single command to start both the CMS UI and API routes:

```bash
pnpm dev
```

This starts the Next.js app (and all `/api` endpoints) on `http://localhost:3000`. Then open the CMS in your browser.

### Production Build

```bash
pnpm build
pnpm start
```

This will run the compiled Next.js app (including API routes) on the configured port.

## Deployment

### Vercel (Recommended)

The CMS and API are integrated in a single Next.js app. Deploy to Vercel:

1. Connect your repository to Vercel
2. Configure environment variables:
   - `DATABASE_URL` - Your production database URL
   - `CMS_ADMIN_TOKEN` - Secure admin token
   - `ALLOWED_ORIGINS` - Frontend URLs (e.g., `https://your-frontend.com`)
   - `RESEND_API_KEY` - (Optional) For email functionality
3. Vercel will automatically:
   - Install dependencies
   - Generate Prisma client
   - Build the Next.js app
   - Deploy API routes as serverless functions

### Other Platforms

For Railway, Render, or similar:

1. Set build command: `pnpm install && pnpm prisma generate && pnpm build`
2. Set start command: `pnpm start`
3. Configure environment variables (same as Vercel)
4. Run database migrations: `pnpm prisma migrate deploy`

## Database Management

### View Database
```bash
pnpm prisma studio
```

### Create a Migration
```bash
pnpm prisma migrate dev --name your_migration_name
```

### Backup Database
```bash
pnpm backup
```

### Test Database Connection
```bash
pnpm test:db
```

## API Endpoints

All API endpoints are prefixed with `/api/`:

### Content Management
- `GET /api/content/profile` - Get profile data
- `PUT /api/content/profile` - Update profile
- `GET /api/content/case-studies` - List case studies
- `POST /api/content/case-studies` - Create case study
- `PUT /api/content/case-studies/:id` - Update case study
- `DELETE /api/content/case-studies/:id` - Delete case study
- `GET /api/content/insights` - List insights
- `POST /api/content/insights` - Create insight
- `PUT /api/content/insights/:id` - Update insight
- `DELETE /api/content/insights/:id` - Delete insight
- `GET /api/content/faqs` - List FAQs
- `POST /api/content/faqs` - Create FAQ
- `PUT /api/content/faqs/:id` - Update FAQ
- `DELETE /api/content/faqs/:id` - Delete FAQ

### Authentication
- `POST /api/content/verify-token` - Verify admin token

### File Upload
- `POST /api/upload` - Upload image

### Email
- `POST /api/email/contact` - Send contact form email

## Security

- All CMS operations require authentication via Bearer token
- Token is stored in localStorage and sent with each request
- API validates token on every request
- Set a strong `CMS_ADMIN_TOKEN` in production
- CORS is configured to allow requests from your frontend domain
  - In development: All origins are allowed for easier testing
  - In production: Set `ALLOWED_ORIGINS` environment variable with your frontend URLs

## Environment Variables

### Required
- `DATABASE_URL` - Database connection string
- `CMS_ADMIN_TOKEN` - Admin authentication token

### Optional
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins (for production)
  - Example: `https://your-frontend.com,https://www.your-frontend.com`
  - In development, all origins are allowed by default
  - Default: localhost ports (3000, 5173, 5174)
- `RESEND_API_KEY` - For email functionality
- `NODE_ENV` - Environment mode (`development` or `production`)

## License

MIT


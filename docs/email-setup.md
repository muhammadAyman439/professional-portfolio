# Email & Newsletter Configuration

This project uses **EmailJS** for subscriber-facing emails and **Resend** for owner/admin notifications.

## React Frontend (`frontend/`)

Set the following Vite environment variables (e.g. in `frontend/.env`):

- `VITE_API_BASE_URL` – URL of the CMS backend API.
- `VITE_EMAILJS_SERVICE_ID` – EmailJS service ID used for confirmation emails.
- `VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID` – EmailJS template ID for the welcome/confirmation message.
- `VITE_EMAILJS_PUBLIC_KEY` – EmailJS public key for the browser client.

Flow: the React app sends the confirmation email via EmailJS, then calls the backend to persist the subscription and trigger the Resend admin notification.

## CMS Frontend (`cms-backend/`, Next.js)

Add these public environment variables (e.g. in `cms-backend/.env.local`):

- `NEXT_PUBLIC_EMAILJS_SERVICE_ID` – EmailJS service ID for broadcast emails.
- `NEXT_PUBLIC_EMAILJS_NEW_INSIGHT_TEMPLATE_ID` – Template used when broadcasting new insights.
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` – EmailJS public key for the CMS client.
- `NEXT_PUBLIC_PORTFOLIO_BASE_URL` (optional) – Canonical URL for the public portfolio; used to build insight links. Falls back to the current origin if omitted.

When an insight is created through the CMS, the client fetches the subscriber list and sends each recipient an EmailJS message using the template above.

## CMS Backend (`cms-backend/` API)

The backend keeps subscriber records and sends you notifications via Resend. Configure the following (non-public) environment variables:

- `RESEND_API_KEY` – Resend API key (required).
- `FROM_EMAIL` – Email address verified in Resend to use as the sender (defaults to `onboarding@resend.dev`).
- `CONTACT_EMAIL` – Destination for admin notifications (fallbacks to `PROFILE_EMAIL` if omitted).

> The backend no longer calls EmailJS directly; all subscriber-facing emails are handled from the browser clients.

## EmailJS Templates

Create two templates in EmailJS:

1. **Newsletter Confirmation** – triggered by the React frontend.
   - Expected params: `subscriber_email`, `to_email`, `email`, `user_email`, `reply_to`, `name`, `websiteLink`.
2. **New Insight Broadcast** – triggered by the CMS frontend.
   - Expected params: `subscriber_email`, `to_email`, `email`, `user_email`, `name`, `title`, `summary`, `link`.

Ensure both templates allow the sender email configured in your EmailJS service.


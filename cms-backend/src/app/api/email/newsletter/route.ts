import { NextRequest } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { handleError, jsonResponse } from "@/lib/http";
import { parseValidation } from "@/lib/validation-helpers";
import { addNewsletterSubscriber } from "@/lib/content-store";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const payload = parseValidation(newsletterSchema, await request.json());
    const subscriberEmail = payload.email.trim();

    const adminEmail = process.env.CONTACT_EMAIL || process.env.PROFILE_EMAIL;
    if (!adminEmail) {
      throw new Error(
        "Newsletter configuration error: CONTACT_EMAIL or PROFILE_EMAIL must be set"
      );
    }

    if (!process.env.RESEND_API_KEY) {
      throw new Error("Email service not configured: Missing RESEND_API_KEY");
    }

    const { created } = await addNewsletterSubscriber(subscriberEmail);
    if (!created) {
      return jsonResponse({
        success: true,
        message: "You're already subscribed to the newsletter.",
      });
    }

    const notification = await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to: adminEmail,
      subject: "New Newsletter Subscription",
      html: newsletterAdminTemplate(subscriberEmail),
    });

    if (notification.error) {
      console.error(
        "[Email] Resend API error",
        notification.error
      );
      throw new Error("Failed to process subscription. Please try again later.");
    }

    return jsonResponse({
      success: true,
      message: "Successfully subscribed! Check your email for confirmation.",
    });
  } catch (error) {
    return handleError(error);
  }
}

function newsletterAdminTemplate(email: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Newsletter Subscription</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎉 New Newsletter Subscriber</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0; font-size: 16px;">
              <strong style="color: #667eea;">Email:</strong>
              <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
            </p>
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>Subscribed:</strong> ${new Date().toLocaleString("en-US", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

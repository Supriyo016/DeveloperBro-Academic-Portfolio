import { Resend } from "resend";
import type { ContactInput } from "@/lib/validation/contact";

export type SendOutcome = "sent" | "unconfigured" | "failed";

// Messages go to the owner's Gmail. Resend's shared sender works without a verified domain, as long as the
// Resend account was created with the receiving address. Both can be overridden in the environment.
const DEFAULT_TO = "supriyo.sarkar016@gmail.com";
const DEFAULT_FROM = "DeveloperBro. contact form <onboarding@resend.dev>";

export async function sendContactEmail(input: ContactInput): Promise<SendOutcome> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || DEFAULT_TO;
  const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;
  if (!apiKey) return "unconfigured";

  const { error } = await new Resend(apiKey).emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `[Portfolio] ${input.subject}`,
    text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
  });

  if (error) {
    console.error("Contact email failed:", error.name);
    return "failed";
  }
  return "sent";
}

import { Resend } from "resend";
import type { ContactInput } from "@/lib/validation/contact";

export type SendOutcome = "sent" | "unconfigured" | "failed";

export async function sendContactEmail(input: ContactInput): Promise<SendOutcome> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return "unconfigured";

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

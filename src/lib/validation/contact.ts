import { z } from "zod";

const singleLine = (value: string) => !/[\r\n]/.test(value);

export const contactSchema = z.strictObject({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Name is too long.").refine(singleLine, "Name must be one line."),
  email: z.email("Please enter a valid email address.").max(254, "Email is too long."),
  subject: z.string().trim().min(3, "Please add a subject.").max(150, "Subject is too long.").refine(singleLine, "Subject must be one line."),
  message: z.string().trim().min(20, "Please write at least 20 characters.").max(5000, "Message is too long."),
  verification_note: z.string().max(200).optional(),
  fillMs: z.number().int().nonnegative().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const MIN_FILL_MS = 2500;

export const isHoneypotHit = (input: ContactInput) => Boolean(input.verification_note);

export const isTooFast = (input: ContactInput) => input.fillMs === undefined || input.fillMs < MIN_FILL_MS;

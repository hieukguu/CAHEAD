import { z } from "zod";

export const CONTACT_BODY_LIMIT = 16 * 1024;
export const contactServices = [
  "Affiliate marketing", "Publisher partnerships", "Performance marketing",
  "Content & SEO", "Not sure yet",
] as const;

const optionalText = (max: number) => z.string().trim().max(max).optional().default("");
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name (at least 2 characters).").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  company: z.string().trim().min(1, "Enter your company name.").max(160),
  website: z.string().trim().min(1, "Enter your company website.").max(500).refine((value) => {
    try { return ["https:", "http:"].includes(new URL(value).protocol); }
    catch { return false; }
  }, "Enter a full website address beginning with https:// or http://."),
  service: z.enum(contactServices),
  budget: optionalText(100),
  message: z.string().trim().min(20, "Tell us a little more (at least 20 characters).").max(5000),
  consent: z.literal(true, { error: "Please agree to be contacted about your inquiry." }),
  fax: optionalText(200),
  startedAt: z.number().finite().int().positive(),
  turnstileToken: optionalText(2048),
});

export type ContactSubmission = z.infer<typeof contactSchema>;

export function validateContact(body: unknown, now = Date.now()):
  | { success: true; data: ContactSubmission }
  | { success: false; errors: Record<string, string>; message: string } {
  const result = contactSchema.safeParse(body);
  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    return { success: false, errors, message: "Please check the highlighted fields." };
  }
  if (result.data.fax || result.data.startedAt > now || now - result.data.startedAt < 1500 || now - result.data.startedAt > 24 * 60 * 60 * 1000) {
    return { success: false, errors: {}, message: "We could not verify this submission. Please refresh the page and try again." };
  }
  return { success: true, data: result.data };
}

export function contactEmailText(data: ContactSubmission) {
  return [
    "New CAhead website inquiry", "",
    `Name: ${data.name}`, `Email: ${data.email}`, `Company: ${data.company}`,
    `Website: ${data.website}`, `Service: ${data.service}`,
    `Budget: ${data.budget || "Not provided"}`, "", "Message:", data.message,
    "", "Consent to respond to this inquiry: Yes",
  ].join("\n");
}

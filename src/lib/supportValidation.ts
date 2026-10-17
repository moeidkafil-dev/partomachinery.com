import { z } from "zod";
import type { SupportResult } from "./types";

/**
 * Support / inquiry validation — shared by the client form and the API route
 * (server-side validation is mandatory per SECURITY_PRIVACY.md).
 * Trim + length limits + reasonable email check; field-specific errors.
 */

export const supportRequestSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "Name is limited to 80 characters."),
  replyEmail: z
    .string()
    .trim()
    .min(5, "A reply address is required.")
    .max(120, "Email is limited to 120 characters.")
    .email("Please enter a valid email address."),
  category: z.enum(["technical", "sales", "service", "other"], {
    message: "Please choose a category.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Please describe your request (at least 10 characters).")
    .max(2000, "Message is limited to 2000 characters."),
  company: z.string().trim().max(120, "Company is limited to 120 characters.").optional(),
  productId: z.string().trim().max(40).optional(),
});

export type SupportRequestInput = z.infer<typeof supportRequestSchema>;

export interface ValidationResult {
  ok: boolean;
  data?: SupportRequestInput;
  fieldErrors: Record<string, string>;
}

export function validateSupportRequest(input: unknown): ValidationResult {
  const parsed = supportRequestSchema.safeParse(input);
  if (parsed.success) {
    return { ok: true, data: parsed.data, fieldErrors: {} };
  }
  const fieldErrors: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path.join(".") || "form";
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { ok: false, fieldErrors };
}

/** Typed client for the /api/support boundary. */
export async function submitSupportRequest(
  payload: SupportRequestInput,
): Promise<{ httpStatus: number; result: SupportResult }> {
  try {
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    const result = normalizeResult(body, res.status);
    return { httpStatus: res.status, result };
  } catch {
    return {
      httpStatus: 0,
      result: {
        status: "unavailable",
        message: "The request could not be sent. Check your connection and try again — your input has been preserved.",
      },
    };
  }
}

function normalizeResult(body: unknown, httpStatus: number): SupportResult {
  if (
    body &&
    typeof body === "object" &&
    "status" in body &&
    typeof (body as { status: unknown }).status === "string"
  ) {
    const status = (body as { status: string }).status;
    if (["accepted", "validation_error", "rate_limited", "unavailable", "unconfigured"].includes(status)) {
      return body as SupportResult;
    }
  }
  if (httpStatus === 429) return { status: "rate_limited" };
  return {
    status: "unavailable",
    message: "The service responded unexpectedly. Your input has been preserved — please try again shortly.",
  };
}

import { NextResponse } from "next/server";
import { validateSupportRequest } from "@/lib/supportValidation";

/**
 * Support / inquiry endpoint (SUPPORT_TICKET_SPEC).
 *
 * State machine truth policy:
 *   - No backend configured (default): returns `unconfigured` — the UI must
 *     never fake a successful submission.
 *   - Configure SUPPORT_WEBHOOK_URL (server-side only secret) to enable real
 *     delivery: the route forwards the validated payload server-side.
 *
 * Server-side validation runs here regardless of the client, per
 * SECURITY_PRIVACY.md. No secrets are exposed to the client bundle.
 */

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "validation_error", fieldErrors: { form: "Malformed request body." } },
      { status: 400 }
    );
  }

  const v = validateSupportRequest(body);
  if (!v.ok || !v.data) {
    return NextResponse.json(
      { status: "validation_error", fieldErrors: v.fieldErrors },
      { status: 422 }
    );
  }

  const endpoint = process.env.SUPPORT_WEBHOOK_URL;
  if (!endpoint) {
    return NextResponse.json({
      status: "unconfigured",
      message:
        "Online submission is not configured on this deployment. The request was validated but not delivered.",
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v.data),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (upstream.ok) {
      const data = (await upstream.json().catch(() => null)) as { referenceId?: string } | null;
      return NextResponse.json({ status: "accepted", referenceId: data?.referenceId });
    }
    if (upstream.status === 429) {
      const retry = upstream.headers.get("retry-after");
      return NextResponse.json({
        status: "rate_limited",
        retryAfterSeconds: retry ? Number(retry) || undefined : undefined,
      });
    }
    if (upstream.status === 422 || upstream.status === 400) {
      const data = (await upstream.json().catch(() => null)) as
        | { fieldErrors?: Record<string, string> }
        | null;
      return NextResponse.json(
        { status: "validation_error", fieldErrors: data?.fieldErrors ?? {} },
        { status: 422 }
      );
    }
    return NextResponse.json({
      status: "unavailable",
      message: "The receiving service reported an error. Please try again later.",
    });
  } catch {
    return NextResponse.json({
      status: "unavailable",
      message: "The receiving service could not be reached. Please try again later.",
    });
  }
}

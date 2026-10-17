"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { product } from "@/lib/content";
import { useSiteUi } from "@/lib/store";
import { submitSupportRequest, validateSupportRequest, type SupportRequestInput } from "@/lib/supportValidation";
import type { SupportResult } from "@/lib/types";

type FormState = "idle" | "submitting" | "success" | "failure" | "unconfigured";

const CATEGORIES: Array<{ value: SupportRequestInput["category"]; label: string }> = [
  { value: "technical", label: "Technical" },
  { value: "sales", label: "Sales / inquiry" },
  { value: "service", label: "Service" },
  { value: "other", label: "Other" },
];

/**
 * Support / inquiry dialog (SUPPORT_TICKET_SPEC).
 *
 * The inner form is keyed by the store epoch, so every open session starts
 * from a clean, freshly-initialized form — no setState-in-effect resets.
 * Input is preserved across recoverable failures because a failure never
 * clears `fields`; only closing and reopening does.
 */
export function SupportPanel() {
  const open = useSiteUi((s) => s.supportOpen);
  const epoch = useSiteUi((s) => s.supportEpoch);
  const productContext = useSiteUi((s) => s.supportProductContext);
  const closeSupport = useSiteUi((s) => s.closeSupport);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) closeSupport();
      }}
    >
      <SupportPanelInner
        key={epoch}
        open={open}
        productContext={productContext}
        onClose={closeSupport}
      />
    </Dialog>
  );
}

interface FormFields {
  fullName: string;
  replyEmail: string;
  category: string;
  message: string;
  company: string;
}

function SupportPanelInner({
  open,
  productContext,
  onClose,
}: {
  open: boolean;
  productContext?: string;
  onClose: () => void;
}) {
  const [fields, setFields] = useState<FormFields>(() => ({
    fullName: "",
    replyEmail: "",
    category: "",
    message: productContext ? `I am interested in ${productContext}. ` : "",
    company: "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formState, setFormState] = useState<FormState>("idle");
  const [result, setResult] = useState<SupportResult | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  // Move focus into the panel on open (dialog behavior contract).
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [open]);

  const set =
    (key: keyof FormFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFields((f) => ({ ...f, [key]: e.target.value }));
      setErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: SupportRequestInput = {
      fullName: fields.fullName,
      replyEmail: fields.replyEmail,
      category: (fields.category || "other") as SupportRequestInput["category"],
      message: fields.message,
      company: fields.company || undefined,
      productId: productContext ? product.slug : undefined,
    };
    const v = validateSupportRequest(payload);
    if (!v.ok) {
      setErrors(v.fieldErrors);
      setFormState("idle");
      return;
    }
    setErrors({});
    setFormState("submitting");
    const { result: r } = await submitSupportRequest(v.data!);
    setResult(r);
    if (r.status === "accepted") setFormState("success");
    else if (r.status === "unconfigured") setFormState("unconfigured");
    else setFormState("failure");
  }

  const statusMessage = (() => {
    if (!result) return null;
    switch (result.status) {
      case "accepted":
        return {
          tone: "ok" as const,
          text: `Request received.${result.referenceId ? ` Reference: ${result.referenceId}.` : ""} The team will reply to ${fields.replyEmail}.`,
        };
      case "unconfigured":
        return {
          tone: "warn" as const,
          text: "Online submission is not active yet, so your message was NOT sent — and we will not pretend it was. Your input is preserved below; approved direct contacts will appear here as soon as they are published.",
        };
      case "rate_limited":
        return {
          tone: "warn" as const,
          text: "Too many requests in a short time. Please wait a moment and try again — your input has been preserved.",
        };
      default:
        return {
          tone: "warn" as const,
          text:
            (result.status === "unavailable" && result.message) ||
            "The request could not be delivered. Your input has been preserved — please try again shortly.",
        };
    }
  })();

  return (
    <DialogContent className="max-h-[92vh] overflow-y-auto border-[rgba(233,241,237,0.12)] bg-[#06120e] sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="font-display text-xl">Support & inquiry</DialogTitle>
        <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
          Ask about the {product.displayName.replace(" Line", " line")}, service or
          documentation. Required fields are marked with an asterisk.
        </DialogDescription>
      </DialogHeader>

      {formState === "success" ? (
        <div className="rounded-lg border border-[rgba(47,111,87,0.5)] bg-[rgba(47,111,87,0.12)] p-4" role="status">
          <p className="font-semibold text-[#7fd6b0]">Request accepted</p>
          <p className="mt-1 text-sm text-[#c7d6cf]">{statusMessage?.text}</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 inline-flex h-10 items-center rounded-md bg-[#0b231b] px-4 text-sm font-semibold text-[#e9f1ed] hover:bg-[#123528] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640]"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {(formState === "unconfigured" || formState === "failure") && statusMessage && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-[rgba(251,54,64,0.4)] bg-[rgba(251,54,64,0.08)] p-4 text-sm leading-relaxed text-[#f3b8bc]"
            >
              {statusMessage.text}
            </div>
          )}

          <div className="grid gap-4">
            <Field label="Full name" id="sup-name" required error={errors.fullName}>
              <input
                id="sup-name"
                ref={firstFieldRef}
                type="text"
                autoComplete="name"
                value={fields.fullName}
                onChange={set("fullName")}
                aria-required="true"
                aria-invalid={!!errors.fullName}
                className={inputCls(!!errors.fullName)}
                maxLength={80}
              />
            </Field>

            <Field label="Reply email" id="sup-email" required error={errors.replyEmail}>
              <input
                id="sup-email"
                type="email"
                autoComplete="email"
                value={fields.replyEmail}
                onChange={set("replyEmail")}
                aria-required="true"
                aria-invalid={!!errors.replyEmail}
                className={inputCls(!!errors.replyEmail)}
                maxLength={120}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Category" id="sup-cat" required error={errors.category}>
                <select
                  id="sup-cat"
                  value={fields.category}
                  onChange={set("category")}
                  aria-required="true"
                  aria-invalid={!!errors.category}
                  className={inputCls(!!errors.category)}
                >
                  <option value="">Select…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Company (optional)" id="sup-company" error={errors.company}>
                <input
                  id="sup-company"
                  type="text"
                  autoComplete="organization"
                  value={fields.company}
                  onChange={set("company")}
                  className={inputCls(!!errors.company)}
                  maxLength={120}
                />
              </Field>
            </div>

            <Field label="Message" id="sup-msg" required error={errors.message}>
              <textarea
                id="sup-msg"
                rows={5}
                value={fields.message}
                onChange={set("message")}
                aria-required="true"
                aria-invalid={!!errors.message}
                className={`${inputCls(!!errors.message)} resize-y`}
                maxLength={2000}
              />
              <p className="mt-1 text-right text-[11px] text-muted-foreground">
                {fields.message.length}/2000
              </p>
            </Field>

            {productContext && (
              <p className="rounded-md border border-[rgba(233,241,237,0.1)] bg-[rgba(233,241,237,0.04)] px-3 py-2 text-xs text-muted-foreground">
                Attached context: <span className="text-[#e9f1ed]">{productContext}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={formState === "submitting"}
              className="inline-flex h-11 items-center justify-center rounded-md bg-[#fb3640] px-5 text-sm font-semibold text-[#160409] transition-colors hover:bg-[#ff4d56] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formState === "submitting" ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#160409] border-t-transparent" />
                  Sending…
                </span>
              ) : (
                "Send request"
              )}
            </button>

            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Only the fields above are collected, and only to answer your request. No
              analytics, no tracking. This site submits nothing without an honest status.
            </p>
          </div>
        </form>
      )}
    </DialogContent>
  );
}

function inputCls(hasError: boolean): string {
  return `h-10 w-full rounded-md border bg-[rgba(4,16,11,0.7)] px-3 text-sm text-[#e9f1ed] placeholder:text-[#5c7168] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#fb3640] ${
    hasError ? "border-[#fb3640]" : "border-[rgba(233,241,237,0.16)]"
  }`;
}

function Field({
  label,
  id,
  required,
  error,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium tracking-wide text-[#c7d6cf]">
        {label}
        {required && (
          <span className="ml-0.5 text-[#fb3640]" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-[#ff8a91]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#fb3640]" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { company } from "@/lib/content";
import { submitSupportRequest, validateSupportRequest, type SupportRequestInput } from "@/lib/supportValidation";
import type { SupportResult } from "@/lib/types";

type State = "idle" | "submitting" | "success" | "failure" | "unconfigured";

/**
 * Contact / inquiry — same typed API boundary as the support panel.
 * Honest states only: no fake success without a real backend acceptance.
 */
export function Contact() {
  const [fields, setFields] = useState({
    fullName: "",
    replyEmail: "",
    category: "",
    message: "",
    company: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<SupportResult | null>(null);

  const set =
    (key: keyof typeof fields) =>
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
    };
    const v = validateSupportRequest(payload);
    if (!v.ok) {
      setErrors(v.fieldErrors);
      return;
    }
    setErrors({});
    setState("submitting");
    const { result: r } = await submitSupportRequest(v.data!);
    setResult(r);
    if (r.status === "accepted") setState("success");
    else if (r.status === "unconfigured") setState("unconfigured");
    else setState("failure");
  }

  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow text-[#ff5560]">Contact</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Tell us what your line must do.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#c7d6cf]">
            Material, formulation, target output, timeline — the more the team knows, the
            more precise the answer. Requests composed here are validated before anything
            is sent, and you always see the true delivery status.
          </p>
          <div className="mt-8 rounded-xl border border-[rgba(233,241,237,0.1)] bg-[#071712] p-5">
            <h3 className="font-display text-sm font-semibold tracking-[0.12em]">DIRECT CONTACT</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#9db2a7]">
              {company.contactStatusNotice}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[rgba(233,241,237,0.1)] bg-[#071712] p-6 sm:p-8">
          {state === "success" ? (
            <div className="rounded-lg border border-[rgba(47,111,87,0.5)] bg-[rgba(47,111,87,0.12)] p-5" role="status">
              <p className="font-semibold text-[#7fd6b0]">Request accepted</p>
              <p className="mt-1 text-sm text-[#c7d6cf]">
                The team will reply to {fields.replyEmail}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="grid gap-5">
              {(state === "unconfigured" || state === "failure") && (
                <div
                  role="alert"
                  className="rounded-lg border border-[rgba(251,54,64,0.4)] bg-[rgba(251,54,64,0.08)] p-4 text-sm leading-relaxed text-[#f3b8bc]"
                >
                  {state === "unconfigured"
                    ? "Online submission is not active yet — your message was NOT sent, and we will not pretend otherwise. Your input is preserved below; approved direct contacts will be published here as soon as they are finalized."
                    : result?.status === "unavailable" && result.message
                      ? result.message
                      : "The request could not be delivered right now. Your input has been preserved — please try again shortly."}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" id="ct-name" required error={errors.fullName}>
                  <input
                    id="ct-name"
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
                <Field label="Reply email" id="ct-email" required error={errors.replyEmail}>
                  <input
                    id="ct-email"
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
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Category" id="ct-cat" required error={errors.category}>
                  <select
                    id="ct-cat"
                    value={fields.category}
                    onChange={set("category")}
                    aria-required="true"
                    aria-invalid={!!errors.category}
                    className={inputCls(!!errors.category)}
                  >
                    <option value="">Select…</option>
                    <option value="technical">Technical</option>
                    <option value="sales">Sales / inquiry</option>
                    <option value="service">Service</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
                <Field label="Company (optional)" id="ct-company" error={errors.company}>
                  <input
                    id="ct-company"
                    type="text"
                    autoComplete="organization"
                    value={fields.company}
                    onChange={set("company")}
                    className={inputCls(!!errors.company)}
                    maxLength={120}
                  />
                </Field>
              </div>

              <Field label="Message" id="ct-msg" required error={errors.message}>
                <textarea
                  id="ct-msg"
                  rows={5}
                  value={fields.message}
                  onChange={set("message")}
                  aria-required="true"
                  aria-invalid={!!errors.message}
                  className={`${inputCls(!!errors.message)} resize-y`}
                  maxLength={2000}
                  placeholder="Application, materials, target output, questions…"
                />
              </Field>

              <button
                type="submit"
                disabled={state === "submitting"}
                className="inline-flex h-11 items-center justify-center rounded-md bg-[#fb3640] px-5 text-sm font-semibold text-[#160409] transition-colors hover:bg-[#ff4d56] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state === "submitting" ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#160409] border-t-transparent" />
                    Sending…
                  </span>
                ) : (
                  "Send inquiry"
                )}
              </button>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Required fields are marked with an asterisk. Only the fields above are
                collected, and only to answer your request.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
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

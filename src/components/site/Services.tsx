"use client";

import { ClipboardList, FileText, Wrench } from "lucide-react";
import { faq, services } from "@/lib/content";
import { useSiteUi } from "@/lib/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ICONS = {
  clipboard: ClipboardList,
  file: FileText,
  wrench: Wrench,
} as const;

export function Services() {
  const openSupport = useSiteUi((s) => s.openSupport);

  return (
    <section id="services" className="relative border-t border-[rgba(233,241,237,0.07)] bg-[#03120c]">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow text-[#ff5560]">Services & support</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              A line purchase is a relationship, not a shipment.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#c7d6cf]">
              The same channel handles pre-sale questions and after-sale support. Every
              request is answered by the Parto Plastic team — the bot just opens the door.
            </p>
            <button
              type="button"
              onClick={() => openSupport()}
              className="mt-7 inline-flex h-11 items-center rounded-md bg-[#fb3640] px-5 text-sm font-semibold text-[#160409] transition-colors hover:bg-[#ff4d56] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640]"
            >
              Open support
            </button>
          </div>

          <div className="grid gap-5">
            {services.map((s) => {
              const Icon = ICONS[s.icon];
              return (
                <article
                  key={s.id}
                  className="group rounded-xl border border-[rgba(233,241,237,0.1)] bg-[#071712] p-6 transition-colors hover:border-[rgba(233,241,237,0.2)]"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(251,54,64,0.1)] text-[#fb3640]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#9db2a7]">{s.body}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" className="mt-24 grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <p className="eyebrow text-[#ff5560]">FAQ</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Straight answers.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#c7d6cf]">
              If a question is not covered here, the support panel is one click away — and
              it reaches the same people who build the line.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={item.id} value={item.id} className="border-[rgba(233,241,237,0.1)]">
                <AccordionTrigger className="text-left font-display text-base font-medium hover:text-[#ff8a91] hover:no-underline [&[data-state=open]>svg]:text-[#fb3640]">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-[#9db2a7]">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

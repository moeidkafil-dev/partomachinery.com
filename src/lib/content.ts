import type { FaqItem, Product, ProductCategory } from "./types";

/**
 * Central content source (Data Truth Policy).
 * ------------------------------------------------------------------
 * VERIFIED inputs supplied by the client:
 *  - Company identity: logo `parto_plastic_logo.jpg` reads
 *    "MACHINERY / PARTO PLASTIC" -> company name "Parto Plastic Machinery".
 *  - Featured product: "HTE75 Twin-Screw Compounding & Pelletizing Line"
 *    (master execution prompt + PRD package).
 *  - Line footage (15.04 s PixVerse clip) and supplied concept renders.
 *
 * NOT verified / NOT invented:
 *  - Numeric machine specifications. No verified datasheet was supplied,
 *    so every specification row below is `verified: false` and its value
 *    is rendered publicly as "Provided on request".
 *  - Contact details, certifications, customer names, history, awards.
 *    Placeholders are rendered as honest "to be confirmed" notices.
 */

export const company = {
  name: "Parto Plastic Machinery",
  shortName: "Parto Plastic",
  /** Read directly from the supplied official logo. */
  logoSrc: "/media/brand/parto_logo_transparent_sm.png",
  logoAlt: "Parto Plastic Machinery logo",
  tagline: "Twin-screw compounding & pelletizing lines",
  /**
   * Approved contact details have not been supplied yet. The site never
   * invents an email/phone; the inquiry form is presented as the channel.
   */
  contactStatusNotice:
    "Direct contact details are being finalized. The inquiry form is the fastest way to reach the Parto Plastic team.",
} as const;

export const categories: ProductCategory[] = [
  {
    id: "compounding",
    name: "Compounding & Pelletizing",
    description:
      "Twin-screw lines that blend, compound and pelletize polymer formulations into transferable pellets.",
  },
];

export const product: Product = {
  id: "hte75",
  slug: "hte75",
  displayName: "HTE75 Twin-Screw Compounding & Pelletizing Line",
  categoryId: "compounding",
  summary:
    "A co-rotating twin-screw compounding and pelletizing line, presented from actual factory-floor footage. The line integrates gravimetric feeding, modular barrel sections, process control cabinets and pellet discharge on one continuous production axis.",
  applications: [
    "Polymer compounding into pelletized output",
    "Blending and homogenization of formulated feeds",
    "Production-scale pelletizing runs",
  ],
  features: [
    "Continuous feed hopper and feeder section, visible at the head of the line",
    "Modular twin-screw barrel sections along the process axis",
    "Line-side control cabinets with at-a-glance status lighting",
    "Elevated service platform and stair access along the machine",
    "Pellet discharge and collection conveyor at the line exit",
  ],
  specifications: [
    { id: "throughput", label: "Throughput range", value: "Provided on request", verified: false },
    { id: "screw-diameter", label: "Screw diameter", value: "Provided on request", verified: false },
    { id: "screw-lw", label: "Screw L/D ratio", value: "Provided on request", verified: false },
    { id: "drive", label: "Main drive power", value: "Provided on request", verified: false },
    { id: "heating", label: "Heating / cooling zones", value: "Provided on request", verified: false },
    { id: "pelletizing", label: "Pelletizing method", value: "Provided on request", verified: false },
  ],
  modelAssetPath: undefined,
  posterAssetPath: "/media/posters/hero_poster.jpg",
  gallery: [
    {
      src: "/media/gallery/still_pellets.jpg",
      alt: "Wide view of the HTE75 line with pellet conveyor in the foreground",
      caption: "Line overview with pellet discharge — footage still",
      kind: "footage-still",
    },
    {
      src: "/media/gallery/still_barrels.jpg",
      alt: "Twin-screw barrel sections and control cabinets of the HTE75 line",
      caption: "Barrel sections and control cabinets — footage still",
      kind: "footage-still",
    },
    {
      src: "/media/gallery/render_01.jpg",
      alt: "Concept render of the compounding line in a dark production hall",
      caption: "Concept render — supplied asset",
      kind: "render",
    },
    {
      src: "/media/gallery/render_02.jpg",
      alt: "Drive end of the compounding extruder, concept render",
      caption: "Drive end study — concept render",
      kind: "render",
    },
    {
      src: "/media/gallery/render_03.jpg",
      alt: "Gravimetric feeder hoppers above the line, concept render",
      caption: "Feeding station study — concept render",
      kind: "render",
    },
    {
      src: "/media/gallery/render_04.jpg",
      alt: "Die and pelletizing detail, concept render",
      caption: "Pelletizing head study — concept render",
      kind: "render",
    },
  ],
  documentation: [],
  inquirySubject: "Technical inquiry: HTE75 Twin-Screw Compounding & Pelletizing Line",
  status: "published",
};

export const services = [
  {
    id: "selection",
    title: "Inquiry & line selection",
    body: "Share your material, formulation target and output goals. The Parto Plastic team responds with a configuration proposal and the specification data relevant to your case.",
    icon: "clipboard" as const,
  },
  {
    id: "documentation",
    title: "Documentation",
    body: "Verified datasheets, layout drawings and utility requirements are issued through the team on request — published claims on this site stay conservative until data is verified.",
    icon: "file" as const,
  },
  {
    id: "service",
    title: "Service coordination",
    body: "Commissioning, spare parts and service questions are routed through the same support channel. Describe the issue and the team will coordinate the response.",
    icon: "wrench" as const,
  },
];

export const faq: FaqItem[] = [
  {
    id: "what-does-hte75-do",
    question: "What is the HTE75 line built for?",
    answer:
      "The HTE75 is a twin-screw compounding and pelletizing line: it takes a formulated feed, compounds it along modular barrel sections and discharges finished pellets. The footage on this site shows the actual line layout from feed hopper to pellet conveyor.",
  },
  {
    id: "verified-specs",
    question: "Where can I get verified specifications?",
    answer:
      "A certified specification datasheet for the HTE75 is in final verification and has not been published on this site yet. Use the inquiry form and the team will send the datasheet directly — we prefer that over publishing unconfirmed numbers.",
  },
  {
    id: "see-it-run",
    question: "Can I see the line running?",
    answer:
      "The scroll experience on this page is built from real footage of the line. If you need a full-length video, a live walkthrough or a visit, say so in your inquiry and the team will arrange it with you.",
  },
  {
    id: "start-inquiry",
    question: "How do I start an inquiry?",
    answer:
      "Open the support panel (bottom-right bot, or the Support button) or use the contact form. Required fields are your name, a reply address, a category and a short message. If you start from the HTE75 section, the product context is attached automatically.",
  },
  {
    id: "online-submission",
    question: "Is online submission active?",
    answer:
      "Online submission is being connected. The form validates and prepares your request today, and shows an honest status instead of pretending a message was sent. Approved direct contacts will be published here once finalized.",
  },
];

export const navLinks = [
  { href: "#the-line", label: "The Line" },
  { href: "#machinery", label: "HTE75" },
  { href: "#capability", label: "Capability" },
  { href: "#gallery", label: "Gallery" },
  { href: "#services", label: "Services" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
] as const;

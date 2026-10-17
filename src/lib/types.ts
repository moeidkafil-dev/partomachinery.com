/**
 * Data contracts — Parto Plastic Machinery website.
 * Mirrors `architecture/DATA_CONTRACTS.md` from the project PRD package.
 * Product/company facts live ONLY in `content.ts`. Unverified values are
 * never published as facts (see Data Truth Policy).
 */

export type PublicationStatus = "draft" | "published";

export interface ProductSpecification {
  id: string;
  label: string;
  /** Only rendered publicly when `verified` is true. */
  value: string;
  unit?: string;
  verified: boolean;
  internalSourceNote?: string;
}

export interface Product {
  id: string;
  slug: string;
  displayName: string;
  categoryId: string;
  summary: string;
  applications: string[];
  features: string[];
  specifications: ProductSpecification[];
  modelAssetPath?: string;
  posterAssetPath?: string;
  gallery: Array<{ src: string; alt: string; caption: string; kind: "render" | "footage-still" }>;
  documentation: Array<{ label: string; href: string }>;
  inquirySubject: string;
  status: PublicationStatus;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export type SupportCategory = "technical" | "sales" | "service" | "other";

export interface SupportRequest {
  fullName: string;
  replyEmail: string;
  category: SupportCategory;
  message: string;
  company?: string;
  productId?: string;
}

export type SupportResult =
  | { status: "accepted"; referenceId?: string }
  | { status: "validation_error"; fieldErrors: Record<string, string> }
  | { status: "rate_limited"; retryAfterSeconds?: number }
  | { status: "unavailable"; message: string }
  | { status: "unconfigured"; message: string };

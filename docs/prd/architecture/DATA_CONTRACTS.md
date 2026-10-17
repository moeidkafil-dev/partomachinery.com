# Data Contracts

```ts
type PublicationStatus = "draft" | "published";
type ProductSpecification = {
  id: string; label: string; value: string; unit?: string;
  verified: boolean; internalSourceNote?: string;
};
type Product = {
  id: string; slug: string; displayName: string; categoryId: string;
  summary: string; applications: string[]; features: string[];
  specifications: ProductSpecification[]; modelAssetPath?: string;
  posterAssetPath?: string; gallery: string[];
  documentation: Array<{label: string; href: string}>;
  inquirySubject: string; status: PublicationStatus;
};
type SupportRequest = {
  fullName: string; replyEmail: string;
  category: "technical" | "sales" | "service" | "other";
  message: string; company?: string; productId?: string;
  referenceNumber?: string;
};
type SupportResult =
 | {status:"accepted"; referenceId?:string}
 | {status:"validation_error"; fieldErrors:Record<string,string>}
 | {status:"rate_limited"; retryAfterSeconds?:number}
 | {status:"unavailable"; message:string}
 | {status:"unconfigured"; message:string};
```
Unverified/draft facts are not published as truth. Validate URLs; never render user input as trusted HTML.

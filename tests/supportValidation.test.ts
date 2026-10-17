/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";
import { validateSupportRequest } from "../src/lib/supportValidation";

const valid = {
  fullName: "Jane Engineer",
  replyEmail: "jane@example.com",
  category: "technical",
  message: "We need throughput data for a PP compounding duty.",
};

describe("validateSupportRequest", () => {
  test("accepts a complete valid request", () => {
    const v = validateSupportRequest(valid);
    expect(v.ok).toBe(true);
    expect(v.data?.fullName).toBe("Jane Engineer");
    expect(v.fieldErrors).toEqual({});
  });

  test("trims whitespace", () => {
    const v = validateSupportRequest({ ...valid, fullName: "  Jane  ", replyEmail: " jane@example.com " });
    expect(v.ok).toBe(true);
    expect(v.data?.fullName).toBe("Jane");
    expect(v.data?.replyEmail).toBe("jane@example.com");
  });

  test("rejects blank / short names with field error", () => {
    const v = validateSupportRequest({ ...valid, fullName: "   " });
    expect(v.ok).toBe(false);
    expect(v.fieldErrors.fullName).toBeTruthy();
  });

  test("rejects invalid email", () => {
    const v = validateSupportRequest({ ...valid, replyEmail: "not-an-email" });
    expect(v.ok).toBe(false);
    expect(v.fieldErrors.replyEmail).toBeTruthy();
  });

  test("rejects unknown category", () => {
    const v = validateSupportRequest({ ...valid, category: "pr" });
    expect(v.ok).toBe(false);
    expect(v.fieldErrors.category).toBeTruthy();
  });

  test("rejects too-short and too-long messages", () => {
    expect(validateSupportRequest({ ...valid, message: "short" }).ok).toBe(false);
    expect(validateSupportRequest({ ...valid, message: "x".repeat(2001) }).ok).toBe(false);
  });

  test("enforces name length limits", () => {
    expect(validateSupportRequest({ ...valid, fullName: "x".repeat(81) }).ok).toBe(false);
  });

  test("company/productId are optional", () => {
    const v = validateSupportRequest(valid);
    expect(v.ok).toBe(true);
    expect(v.data?.company).toBeUndefined();
    expect(v.data?.productId).toBeUndefined();
  });

  test("rejects non-object input safely", () => {
    expect(validateSupportRequest(null).ok).toBe(false);
    expect(validateSupportRequest(42).ok).toBe(false);
    expect(validateSupportRequest("nope").ok).toBe(false);
  });
});

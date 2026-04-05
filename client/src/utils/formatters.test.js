import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  truncateText,
  calculateDiscount,
} from "./formatters";

describe("formatters utilities", () => {
  describe("formatCurrency", () => {
    it("should format USD to INR correctly (EXCHANGE_RATE = 92)", () => {
      // 10 USD * 92 = 920 INR
      const result = formatCurrency(10);
      // Remove non-breaking spaces and fix matching for Indian currency formatting
      expect(result.replace(/\s/g, " ")).toMatch(/₹\s?920\.00/);
    });

    it("should handle zero amount", () => {
      const result = formatCurrency(0);
      expect(result.replace(/\s/g, " ")).toMatch(/₹\s?0\.00/);
    });
  });

  describe("formatDate", () => {
    it("should format date in en-IN long format", () => {
      const date = "2024-01-15";
      const result = formatDate(date);
      expect(result).toBe("15 January 2024");
    });
  });

  describe("formatDateTime", () => {
    it("should format date and time correctly", () => {
      const date = "2024-01-15T14:30:00Z";
      const result = formatDateTime(date);
      // Check for date and existence of time-like pattern (e.g., 8:00 pm, 20:00)
      expect(result).toContain("15 Jan 2024");
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe("truncateText", () => {
    it("should return same text if within limit", () => {
      const text = "Short text";
      expect(truncateText(text, 20)).toBe(text);
    });

    it("should truncate and add ellipsis if exceeds limit", () => {
      const text = "This is a very long text that should be truncated";
      const result = truncateText(text, 10);
      expect(result).toBe("This is a...");
      expect(result.length).toBeLessThan(text.length);
    });

    it("should use default length of 100", () => {
      const longText = "a".repeat(110);
      const result = truncateText(longText);
      expect(result.endsWith("...")).toBe(true);
      expect(result.length).toBe(103);
    });
  });

  describe("calculateDiscount", () => {
    it("should calculate correct discount percentage", () => {
      expect(calculateDiscount(1000, 800)).toBe(20);
      expect(calculateDiscount(500, 250)).toBe(50);
    });

    it("should round the percentage", () => {
      // (100 - 33.33) / 100 = 66.66% discount or (100-66.66)/100 = 33.33% discount
      // Suppose original is 3, sale is 2. (3-2)/3 = 0.3333...
      expect(calculateDiscount(3, 2)).toBe(33);
    });
  });
});

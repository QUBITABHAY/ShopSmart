import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  validatePassword,
  validateRequired,
  isValidPhone,
  isValidZipCode,
} from "./validators";

describe("validators", () => {
  describe("isValidEmail", () => {
    it("should return true for valid emails", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co.in")).toBe(true);
    });

    it("should return false for invalid emails", () => {
      expect(isValidEmail("test@example")).toBe(false);
      expect(isValidEmail("test.example.com")).toBe(false);
      expect(isValidEmail("@domain.com")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("should return valid for strong passwords", () => {
      const result = validatePassword("Password123");
      expect(result.valid).toBe(true);
    });

    it("should fail for short passwords", () => {
      const result = validatePassword("Pass1");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("at least 8 characters");
    });

    it("should fail if no uppercase letter", () => {
      const result = validatePassword("password123");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("uppercase letter");
    });

    it("should fail if no lowercase letter", () => {
      const result = validatePassword("PASSWORD123");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("lowercase letter");
    });

    it("should fail if no number", () => {
      const result = validatePassword("Password");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("contain a number");
    });
  });

  describe("validateRequired", () => {
    it("should return valid for non-empty values", () => {
      expect(validateRequired("test", "Name").valid).toBe(true);
    });

    it("should return invalid for empty or whitespace values", () => {
      expect(validateRequired("", "Name").valid).toBe(false);
      expect(validateRequired(" ", "Name").valid).toBe(false);
      expect(validateRequired(null, "Name").valid).toBe(false);
    });
  });

  describe("isValidPhone", () => {
    it("should return true for valid phone numbers", () => {
      expect(isValidPhone("1234567890")).toBe(true);
      expect(isValidPhone("+91 1234567890")).toBe(true);
      expect(isValidPhone("123-456-7890")).toBe(true);
    });

    it("should return false for invalid phone numbers", () => {
      expect(isValidPhone("123")).toBe(false);
      expect(isValidPhone("abc1234567")).toBe(false);
    });
  });

  describe("isValidZipCode", () => {
    it("should return true for valid 6-digit zip codes", () => {
      expect(isValidZipCode("123456")).toBe(true);
    });

    it("should return false for invalid zip codes", () => {
      expect(isValidZipCode("12345")).toBe(false);
      expect(isValidZipCode("1234567")).toBe(false);
      expect(isValidZipCode("abcdef")).toBe(false);
    });
  });
});

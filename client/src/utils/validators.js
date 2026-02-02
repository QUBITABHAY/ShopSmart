/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePassword(password) {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain an uppercase letter",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain a lowercase letter",
    };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain a number" };
  }
  return { valid: true, message: "" };
}

/**
 * Validate required field
 * @param {string} value
 * @param {string} fieldName
 * @returns {{ valid: boolean, message: string }}
 */
export function validateRequired(value, fieldName) {
  if (!value || value.trim() === "") {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true, message: "" };
}

/**
 * Validate phone number
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate zip code
 * @param {string} zipCode
 * @returns {boolean}
 */
export function isValidZipCode(zipCode) {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
}

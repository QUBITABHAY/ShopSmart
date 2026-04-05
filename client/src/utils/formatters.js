const EXCHANGE_RATE = 92;

/**
 * Format price as currency (Converts from USD to INR)
 * @param {number} amount - Amount in USD
 * @param {string} currency - Target currency code
 * @returns {string}
 */
export function formatCurrency(amount, currency = "INR") {
  const convertedAmount = amount * EXCHANGE_RATE;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(convertedAmount);
}

/**
 * Format date in readable format
 * @param {string | Date} date
 * @returns {string}
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Format date with time
 * @param {string | Date} date
 * @returns {string}
 */
export function formatDateTime(date) {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Calculate discount percentage
 * @param {number} originalPrice
 * @param {number} salePrice
 * @returns {number}
 */
export function calculateDiscount(originalPrice, salePrice) {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

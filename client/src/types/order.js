/**
 * @typedef {Object} OrderItem
 * @property {string} id
 * @property {string} productId
 * @property {string} name
 * @property {number} price
 * @property {number} quantity
 */

/**
 * @typedef {Object} ShippingAddress
 * @property {string} street
 * @property {string} city
 * @property {string} state
 * @property {string} zipCode
 * @property {string} country
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} userId
 * @property {OrderItem[]} items
 * @property {number} totalAmount
 * @property {'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'} status
 * @property {ShippingAddress} shippingAddress
 * @property {string} createdAt
 */

export {};

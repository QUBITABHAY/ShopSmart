/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {string} [imageUrl]
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number} stock
 * @property {string} category
 * @property {string} imageUrl
 * @property {string[]} [images]
 * @property {number} [rating]
 * @property {number} [reviewCount]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} ProductFilters
 * @property {string} [category]
 * @property {number} [minPrice]
 * @property {number} [maxPrice]
 * @property {string} [search]
 * @property {string} [sortBy]
 */

export {};

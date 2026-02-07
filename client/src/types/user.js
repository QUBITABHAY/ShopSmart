/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {'admin' | 'customer'} role
 * @property {string} [avatar]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} AuthState
 * @property {User | null} user
 * @property {string | null} token
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} email
 * @property {string} password
 * @property {string} name
 */

export {};

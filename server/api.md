# ShopSmart API Documentation

Base URL: `/api`

## Authentication
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login and get JWT token |
| GET | `/auth/profile` | User | Get current user's profile |
| PUT | `/auth/profile` | User | Update current user's profile |

## Products
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| GET | `/products` | Public | Get all products (supports query params: category, search, minPrice, maxPrice, page, limit) |
| GET | `/products/:id` | Public | Get a single product by ID |
| POST | `/products` | Admin | Create a new product |
| PUT | `/products/:id` | Admin | Update a product |
| DELETE | `/products/:id` | Admin | Delete a product |
| GET | `/products/category/:categoryId` | Public | Get products by category |

## Categories
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| GET | `/categories` | Public | Get all categories |
| GET | `/categories/:id` | Public | Get a single category by ID |
| POST | `/categories` | Admin | Create a new category |
| PUT | `/categories/:id` | Admin | Update a category |
| DELETE | `/categories/:id` | Admin | Delete a category |

## Cart
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| GET | `/cart` | User | Get user's cart |
| POST | `/cart` | User | Add item to cart |
| DELETE | `/cart` | User | Clear user's cart |
| PUT | `/cart/:itemId` | User | Update item quantity in cart |
| DELETE | `/cart/:itemId` | User | Remove item from cart |

## Orders
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| POST | `/orders` | User | Create a new order |
| GET | `/orders` | User | Get current user's orders |
| GET | `/orders/:id` | User/Admin | Get specific order details |
| PATCH | `/orders/:id/status` | Admin | Update order status |
| PATCH | `/orders/:id/cancel` | User/Admin | Cancel a pending order |

## Addresses
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| GET | `/addresses` | User | Get all addresses for user |
| GET | `/addresses/:id` | User | Get a single address by ID |
| POST | `/addresses` | User | Add a new address |
| PUT | `/addresses/:id` | User | Update an address |
| DELETE | `/addresses/:id` | User | Delete an address |
| PUT | `/addresses/:id/default` | User | Set an address as default |

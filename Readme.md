# 📚 BookBazaar API

A comprehensive e-commerce platform for buying and selling books, built with Node.js, Express.js, and MongoDB. This RESTful API provides complete functionality for user authentication, book management, shopping cart, order processing, and payment integration.

## 🚀 Quick Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bookBazaar
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Configure your environment variables (see [Environment Variables](#environment-variables) section)

4. **Start MongoDB**

   ```bash
   # Using Docker Compose (Recommended)
   docker-compose up -d

   # Or start MongoDB locally
   mongod
   ```

5. **Run the application**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The API will be available at `http://localhost:8000`

## 🏗️ Project Structure

```
bookBazaar/
├── src/
│   ├── controllers/          # Business logic handlers
│   ├── models/              # Database models
│   ├── routes/              # API route definitions
│   ├── middlewares/         # Custom middleware functions
│   ├── validators/          # Input validation schemas
│   ├── utils/               # Utility functions
│   │   ├── cloudinary.js    # Image upload service
│   │   ├── mail.js          # Email functionality
│   │   └── tokenGeneration.js # JWT token utilities
│   ├── db/                  # Database configuration
│   └── app.js               # Express app configuration
├── public/                  # Static files and uploads
├── docker-compose.yml       # MongoDB container setup
└── package.json
```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/bookBazaar

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration (Mailtrap for Development)
MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your_mailtrap_username
MAILTRAP_SMTP_PASS=your_mailtrap_password
MAILTRAP_SMTP_SENDEREMAIL=noreply@bookbazaar.com
```

## 📋 API Endpoints

### Authentication Routes (`/api/v1/auth`)

#### Register User

```http
POST /api/v1/auth/register
Content-Type: multipart/form-data
```

**Request Body:**

```json
{
  "username": "johndoe",
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "avatar": "file" // Image file
}
```

**Response:**

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "_id": "user_id",
    "username": "johndoe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": {
      "url": "cloudinary_url"
    }
  }
}
```

#### Login User

```http
POST /api/v1/auth/login
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User logged in successfully",
  "user": {
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

#### Get User Profile

```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "user": {
    "_id": "user_id",
    "username": "johndoe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": {
      "url": "cloudinary_url"
    }
  }
}
```

#### Generate API Key

```http
POST /api/v1/auth/api-key
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "expiresAt": "2024-12-31T23:59:59.000Z"
}
```

### Book Routes (`/api/v1/books`)

#### Get All Books

```http
GET /api/v1/books?page=1&limit=10&search=javascript&genre=fiction&author=author_id&sortBy=createdAt&order=desc
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)
- `search` (optional): Search in title and description
- `genre` (optional): Filter by genre
- `author` (optional): Filter by author ID
- `sortBy` (optional): Sort field (default: createdAt)
- `order` (optional): Sort order - asc/desc (default: desc)

**Response:**

```json
{
  "success": true,
  "message": "Books fetched successfully",
  "books": [
    {
      "_id": "book_id",
      "title": "JavaScript: The Good Parts",
      "description": "A comprehensive guide to JavaScript",
      "author": {
        "_id": "author_id",
        "username": "author_name",
        "fullName": "Author Full Name"
      },
      "price": 29.99,
      "stock": 50,
      "genre": "Programming",
      "ISBN": "978-0596517748",
      "coverImage": "cloudinary_url",
      "publisher": "O'Reilly Media",
      "publishedDate": "2008-05-15"
    }
  ],
  "metadata": {
    "totalPages": 5,
    "currentPage": 1,
    "currentLimit": 10
  }
}
```

#### Get Book by ID

```http
GET /api/v1/books/:id
Authorization: Bearer <access_token>
```

#### Add New Book (Admin Only)

```http
POST /api/v1/books
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:**

```json
{
  "title": "New Book Title",
  "description": "Book description",
  "author": "author_id",
  "genre": "Fiction",
  "price": 19.99,
  "stock": 100,
  "ISBN": "978-1234567890",
  "publisher": "Publisher Name",
  "publishedDate": "2024-01-01",
  "coverImage": "file" // Image file
}
```

#### Update Book (Admin Only)

```http
PUT /api/v1/books/:id
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Delete Book (Admin Only)

```http
DELETE /api/v1/books/:id
Authorization: Bearer <access_token>
```

### Cart Routes (`/api/v1/cart`)

#### Add Item to Cart

```http
POST /api/v1/cart
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "book": "book_id",
  "quantity": 2
}
```

#### Get Cart Items

```http
GET /api/v1/cart?page=1&limit=10
Authorization: Bearer <access_token>
```

#### Update Cart Item

```http
PUT /api/v1/cart/:itemId
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "quantity": 3
}
```

#### Remove Cart Item

```http
DELETE /api/v1/cart/:itemId
Authorization: Bearer <access_token>
```

### Order Routes (`/api/v1/orders`)

#### Create Order

```http
POST /api/v1/orders
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "_id": "order_id",
    "user": "user_id",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "items": [
      {
        "book": "book_id",
        "quantity": 2,
        "priceAtPurchase": 29.99
      }
    ],
    "totalAmount": 59.98,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Note:** An order confirmation email is automatically sent to the user's registered email address upon successful order creation.

#### Get User Orders

```http
GET /api/v1/orders?page=1&limit=10
Authorization: Bearer <access_token>
```

#### Get Order Details

```http
GET /api/v1/orders/:id
Authorization: Bearer <access_token>
```

### Payment Routes (`/api/v1/payment`)

#### Create Razorpay Order

```http
POST /api/v1/payment/order
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "orderId": "order_id",
  "currency": "INR"
}
```

**Response:**

```json
{
  "success": true,
  "orderId": "razorpay_order_id",
  "amount": 5998,
  "currency": "INR"
}
```

#### Verify Payment

```http
POST /api/v1/payment/verify
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature"
}
```

### Review Routes (`/api/v1/books/:bookId/reviews`)

#### Add Review

```http
POST /api/v1/books/:bookId/reviews
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "rating": 5,
  "comment": "Excellent book! Highly recommended."
}
```

#### Get Reviews

```http
GET /api/v1/books/:bookId/reviews?page=1&limit=10
Authorization: Bearer <access_token>
```

#### Delete Review (Admin Only)

```http
DELETE /api/v1/books/:bookId/reviews/:id
Authorization: Bearer <access_token>
```

## 📧 Email Functionality

The BookBazaar API includes comprehensive email functionality for order confirmations and customer communication.

### Email Features

- **Order Confirmation Emails**: Automatically sent when a user places an order
- **Professional Email Templates**: Using Mailgen for beautiful, responsive email designs
- **Mailtrap Integration**: Safe email testing environment for development

### Email Configuration

The system uses **Mailtrap** for email testing and development:

1. **Sign up for Mailtrap**: Visit [mailtrap.io](https://mailtrap.io) and create an account
2. **Get SMTP credentials**: From your Mailtrap inbox settings
3. **Configure environment variables**: Add the Mailtrap credentials to your `.env` file

### Email Templates

#### Order Confirmation Email

When a user successfully places an order, they receive a professional email containing:

- **Order Details**: Order ID, items purchased, quantities, and prices
- **Itemized Table**: Clean table showing each book with quantity and price
- **Total Amount**: Final order total
- **Branding**: BookBazaar branding and professional styling

### Email Dependencies

- **nodemailer**: For sending emails via SMTP
- **mailgen**: For generating beautiful HTML email templates

### Production Email Setup

For production deployment, replace Mailtrap credentials with your production email service:

```env
# Production Email Configuration
MAILTRAP_SMTP_HOST=your_production_smtp_host
MAILTRAP_SMTP_PORT=587
MAILTRAP_SMTP_USER=your_production_email
MAILTRAP_SMTP_PASS=your_production_password
MAILTRAP_SMTP_SENDEREMAIL=noreply@yourdomain.com
```

### Email Error Handling

- Email sending failures are logged but don't affect order creation
- Orders are created successfully even if email delivery fails
- Comprehensive error logging for debugging email issues

## 🔐 Authentication & Authorization

### JWT Tokens

- **Access Token**: Short-lived token for API access (24 hours)
- **Refresh Token**: Long-lived token for token renewal (7 days)
- Tokens are stored in HTTP-only cookies for security

### User Roles

- **user**: Can browse books, add to cart, place orders, write reviews
- **admin**: All user permissions + book management, review moderation

### API Key Authentication (Optional)

- Generate API keys for programmatic access
- Keys can have custom expiration dates
- Use `X-API-Key` header for authentication

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Payment**: Razorpay integration
- **Email**: Nodemailer + Mailgen for email templates
- **Validation**: Express Validator
- **Security**: bcryptjs for password hashing
- **Development**: Nodemon for hot reloading

## 🚀 Deployment

### Using Docker

1. **Build the application**

   ```bash
   docker build -t bookbazaar-api .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Environment Setup for Production

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set up proper CORS origins
4. Configure production Cloudinary credentials
5. Set up Razorpay production keys
6. Configure production email service (replace Mailtrap with production SMTP)

## 📝 API Response Format

All API responses follow a consistent format:

**Success Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    /* response data */
  },
  "metadata": {
    /* pagination info */
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 🔍 Error Handling

The API includes comprehensive error handling for:

- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

## 📊 Database Models

- **User**: User accounts with authentication
- **Book**: Book catalog with metadata
- **CartItem**: Shopping cart items
- **Order**: Order management
- **Payment**: Payment tracking
- **Review**: Book reviews and ratings
- **ApiKey**: API key management


## 📄 License

This project is licensed under the ISC License.

---

**Made by ❤️ Sumit Tomar**


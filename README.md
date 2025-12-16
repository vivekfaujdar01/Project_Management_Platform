# Project Management Platform Backend

A project management platform for beginners, built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Register and Login with JWT support (Access & Refresh Tokens).
- **Email Verification**: Integration with Nodemailer and Mailgen for email verification.
- **Secure**: Password hashing with Bcrypt, secure cookies.
- **Health Check**: Endpoint to verify API status.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT, Bcrypt
- **Email**: Nodemailer, Mailgen

## Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd ProjectManagementPlatform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Environment Variables:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=8000
   MONGODB_URI=<your_mongodb_connection_string>
   CORS_ORIGIN=*
   ACCESS_TOKEN_SECRET=<your_access_token_secret>
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
   REFRESH_TOKEN_EXPIRY=10d
   # Email Configuration (for Nodemailer)
   EMAIL_HOST=<your_email_host>
   EMAIL_PORT=<your_email_port>
   EMAIL_USER=<your_email_user>
   EMAIL_PASS=<your_email_password>
   ```

4. Run the application:
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Health Check

- **Endpoint**: `GET /api/v1/healthcheck`
- **Description**: Checks if the server is running.
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "message": "Server is running"
    },
    "message": "API is healthy",
    "success": true
  }
  ```

### Authentication

#### Register User

- **Endpoint**: `POST /api/v1/auth/register`
- **Description**: Registers a new user and sends a verification email.
- **Body** (`application/json`):
  | Field | Type | Required | Description |
  |-------|------|----------|-------------|
  | `email` | String | Yes | Valid email address |
  | `username` | String | Yes | Minimum 3 characters |
  | `password` | String | Yes | Minimum 6 characters |
  | `fullName` | String | No | Full name of the user (Validated but currently strictly not saved in some controller versions, please verify) |

- **Response** (201 Created):
  ```json
  {
    "statusCode": 201,
    "data": {
      "user": {
        "_id": "...",
        "username": "...",
        "email": "...",
        "isEmailVerified": false,
        "createdAt": "...",
        "updatedAt": "..."
      }
    },
    "message": "User registered successfully. Please check your email to verify your account",
    "success": true
  }
  ```

#### Login User

- **Endpoint**: `POST /api/v1/auth/login`
- **Description**: Authenticates a user and returns access/refresh tokens.
- **Body** (`application/json`):
  | Field | Type | Required | Description |
  |-------|------|----------|-------------|
  | `email` | String | Yes | Registered email |
  | `password` | String | Yes | User password |

- **Response** (200 OK):
  - Sets `accessToken` and `refreshToken` as HTTP-only cookies.
  - JSON Body:
  ```json
  {
    "statusCode": 200,
    "data": {
      "user": {
        "_id": "...",
        "username": "...",
        "email": "...",
        "isEmailVerified": true,
        ...
      }
    },
    "message": "User logged in successfully",
    "success": true
  }
  ```

## Project Structure

```
src/
├── controllers/    # Request handlers (Auth, Healthcheck)
├── db/            # Database connection logic
├── middlewares/   # Express middlewares (Validation, etc.)
├── models/        # Mongoose/MongoDB models (User)
├── routes/        # API route definitions
├── utils/         # Utility functions (ApiResponse, ApiError, AsyncHandler, Mail)
├── validators/    # specific validators using express-validator
├── app.js         # Express app configuration
└── index.js       # Entry point
```

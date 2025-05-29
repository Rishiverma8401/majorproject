# NGO Connect Backend API

A comprehensive API for NGO Connect platform, designed to facilitate donations and resource exchange between donors and NGOs.

## Features

- User authentication and role-based access control
- NGO profile management
- Multiple donation types (monetary, goods, organ)
- Resource exchange between NGOs
- Dashboard and reporting

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Stripe Integration (placeholder)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas URI)
- npm or yarn

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ngo-connect.git
cd ngo-connect/backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables - create a `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ngo-connect
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=24h
NODE_ENV=development
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Running the Application

Start development server:
```bash
npm run dev
```

For production:
```bash
npm start
```

## API Documentation

The API follows RESTful conventions. Here are the main endpoints:

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get a specific user (admin only)
- `POST /api/users` - Create a user (admin only)
- `PUT /api/users/:id` - Update a user (admin only)
- `DELETE /api/users/:id` - Delete a user (admin only)

### NGOs

- `GET /api/ngos` - Get all NGOs
- `GET /api/ngos/:id` - Get a specific NGO
- `POST /api/ngos` - Create an NGO profile
- `PUT /api/ngos/:id` - Update an NGO profile
- `DELETE /api/ngos/:id` - Delete an NGO profile
- `GET /api/ngos/radius/:zipcode/:distance` - Get NGOs within a radius
- `POST /api/ngos/:id/requirements` - Add an NGO requirement
- `PUT /api/ngos/:id/documents` - Upload NGO documents
- `PUT /api/ngos/:id/verify` - Verify an NGO (admin only)

### Donations

- `GET /api/donations` - Get all donations
- `GET /api/donations/:id` - Get a specific donation
- `POST /api/donations/monetary` - Create a monetary donation
- `POST /api/donations/goods` - Create a goods donation
- `POST /api/donations/organ` - Create an organ donation registration
- `PUT /api/donations/:id/status` - Update donation status
- `GET /api/donations/stats` - Get donation statistics (admin only)

### Resources

- `GET /api/resources` - Get all resources
- `GET /api/resources/:id` - Get a specific resource
- `POST /api/resources` - Create a resource
- `PUT /api/resources/:id` - Update a resource
- `DELETE /api/resources/:id` - Delete a resource
- `POST /api/resources/:id/exchange` - Request a resource exchange
- `PUT /api/resources/:id/exchange/:exchangeId` - Respond to exchange request
- `PUT /api/resources/:id/exchange/:exchangeId/rate` - Rate an exchange

## Testing

A Postman collection is included in the repository (`postman_collection.json`) which can be imported into Postman for API testing.

## License

MIT 
# Food Delivery Backend API

NestJS backend for the Campus Food Delivery System.

## Setup for Deployment to Render

This backend is configured for easy deployment to Render.com, with continuous integration setup from GitHub.

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- GitHub repository connected to Render

### Environment Variables

The following environment variables need to be set in Render:

- `NODE_ENV` - Set to "production" for deployment
- `PORT` - Automatically set by Render
- `DATABASE_URL` - PostgreSQL connection string (provided by Render if using their PostgreSQL service)
- `JWT_SECRET` - Secret key for JWT authentication
- `JWT_EXPIRATION` - Token expiration time (e.g., "1d")

### Deployment Steps

1. **Create a PostgreSQL Database on Render**
   - Go to the Render Dashboard → New → PostgreSQL
   - Give it a name (e.g., "food-delivery-db")
   - Choose the Free plan and region closest to your users
   - Click "Create Database"
   - Save the "Internal Database URL" connection string

2. **Create a Web Service for the Backend**
   - Go to the Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Configure the service:
     - Name: "food-delivery-api"
     - Runtime: Node
     - Build Command: `npm install && npm run build`
     - Start Command: `npm run start:prod`
     - Set the "DATABASE_URL" environment variable to your PostgreSQL database connection string
     - Set the "JWT_SECRET" environment variable to a secure random string
     - Set the "JWT_EXPIRATION" to "1d" (or your preferred duration)

3. **Auto-deploy on Push**
   - Render will automatically deploy when you push to the main branch

### Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm run start:dev

# Build the application
npm run build

# Start the production server
npm run start:prod
```

### Health Check Endpoint

The API includes a health check endpoint at `/api/health` that Render uses to monitor the service status.

### API Documentation

When the service is running, you can access the Swagger API documentation at `/api/docs`.

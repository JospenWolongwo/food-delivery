# Campus Food Delivery System

A comprehensive platform designed to connect university students with local food vendors through an efficient subscription-based meal delivery service. The system uses AI-driven demand matching to optimize delivery logistics and help vendors expand their reach across university campuses.

## Project Structure

```
food-delivery/
├── web-app/               # React frontend for customers and admin
├── mobile-app/            # React Native mobile application
├── server/                # NestJS backend services
└── docker/                # Docker configuration files
```

## Technology Stack

### Web Application (React)
- React 18 with TypeScript
- Redux Toolkit for state management
- React Router v6 for navigation
- GSAP for advanced animations
- Tailwind CSS for styling

### Mobile Application (React Native)
- React Native with TypeScript
- React Navigation v6
- React Native Reanimated for animations
- Redux Toolkit with persist for state management

### Backend (NestJS)
- NestJS with TypeScript
- TypeORM for database operations with PostgreSQL
- JWT for authentication
- RESTful API design

### DevOps
- Docker with Docker Compose for development and production

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)

### Development Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/food-delivery.git
   cd food-delivery
   ```

2. Start the development environment using Docker:
   ```
   cd docker
   docker-compose up
   ```

   This will start all services:
   - Backend API: http://localhost:3000
   - Web Application: http://localhost:5173
   - PostgreSQL Database: localhost:5432
   - Redis Cache: localhost:6379
   - MailHog (for email testing): http://localhost:8025

3. For developing without Docker:

   Backend (NestJS):
   ```
   cd server
   npm install
   npm run start:dev
   ```

   Web Application (React):
   ```
   cd web-app
   npm install
   npm run dev
   ```

   Mobile Application (React Native):
   ```
   cd mobile-app
   npm install
   npm start
   ```

## Production Deployment

To deploy the application to production:

1. Create a `.env` file in the docker directory with your production settings.

2. Build and start the production containers:
   ```
   cd docker
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Features

- User authentication and authorization
- Restaurant and meal browsing
- Cart and checkout functionality
- Subscription plan management
- Order tracking with real-time updates
- Vendor management for restaurants
- Admin dashboard for system management

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

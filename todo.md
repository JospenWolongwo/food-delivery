# Campus Food Delivery System - Technical Guidelines

## Project Overview

This document outlines the technical guidelines for developing the Campus Food Delivery System, a comprehensive platform designed to connect university students with local food vendors through an efficient subscription-based meal delivery service.

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

- **Core Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **Routing**: React Router v6
- **Styling**:
  - Tailwind CSS for utility-first styling
  - CSS Modules for component-specific styles
- **Animation & UI/UX**:
  - GSAP (GreenSock Animation Platform) for advanced animations
  - Framer Motion for micro-interactions
  - react-spring for physics-based animations
- **Form Management**: React Hook Form with Zod for validation
- **Data Visualization**: Recharts for analytics dashboards
- **Testing**:
  - Jest for unit testing
  - React Testing Library for component testing
  - Cypress for E2E testing
- **Build Tools**: Vite for faster development and building

### Mobile Application (React Native)

- **Core Framework**: React Native with TypeScript
- **Navigation**: React Navigation v6
- **State Management**: Redux Toolkit with persist for offline capability
- **UI Components**:
  - React Native Paper for material design components
  - React Native Reanimated for fluid animations
  - React Native Gesture Handler for advanced touch handling
- **Maps & Location**: React Native Maps with Google Maps API integration
- **Notifications**: Firebase Cloud Messaging (FCM) for push notifications
- **Offline Support**: Watermelon DB for local database
- **Analytics**: Firebase Analytics / Amplitude
- **Testing**:
  - Jest for unit testing
  - Detox for E2E testing
- **Build & Deployment**:
  - Expo EAS for managed builds and OTA updates
  - Fastlane for CI/CD pipeline

### Backend (NestJS)

- **Core Framework**: NestJS with TypeScript
- **Database**:
  - PostgreSQL for primary data storage
  - TypeORM for object-relational mapping
  - Redis for caching and session management
- **Authentication**: JWT with refresh token rotation
- **API Documentation**: Swagger/OpenAPI
- **Real-time Communication**: Socket.io for order tracking
- **File Storage**: AWS S3 for images and assets
- **Payment Processing**:
  - Integration with MTN Mobile Money
  - Integration with Orange Money
- **Geolocation Services**: Google Maps Geocoding and Distance Matrix APIs
- **Email Service**: SendGrid/Mailgun for transactional emails
- **SMS Service**: Twilio/Vonage for delivery notifications
- **Testing**:
  - Jest for unit testing
  - Supertest for API testing
  - Pactum for contract testing
- **Monitoring**: Prometheus and Grafana

### DevOps & Infrastructure

- **Containerization**: Docker with Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**:
  - AWS EC2 or DigitalOcean for backend services
  - Vercel for web frontend
  - Firebase App Distribution for mobile testing
- **Monitoring & Logging**:
  - ELK Stack (Elasticsearch, Logstash, Kibana)
  - Sentry for error tracking
- **Infrastructure as Code**: Terraform

## Feature Implementation Checklist

### Backend Features

#### Authentication & User Management

- [x] User registration and login
- [ ] Social authentication (Google, Facebook)
- [x] Role-based access control (Customer, Vendor, Admin)
- [x] Password reset and recovery
- [x] Profile management
- [ ] Email verification

#### Meal Management

- [x] CRUD operations for meals
- [x] Meal categories and filtering
- [x] Meal availability management
- [x] Vendor relationship

#### Order Management

- [x] Order creation and tracking
- [x] Order status management
- [x] Order filtering and searching
- [x] Assignment of delivery agents

#### Vendor Management

- [x] CRUD operations for vendors
- [x] Vendor activation control
- [x] Vendor meals relationship
- [x] Vendor search and filtering

### Web Application Features

#### Authentication & User Management

- [ ] User registration and login
- [ ] Social authentication (Google, Facebook)
- [ ] Role-based access control (Customer, Vendor, Admin)
- [ ] Password reset and recovery
- [ ] Profile management
- [ ] Email verification

#### Customer Interface

- [ ] Dashboard with order history and recommendations
- [ ] Restaurant and meal browsing with advanced filters
- [ ] Meal search functionality
- [ ] Animated meal cards with GSAP animations
- [ ] Detailed meal and vendor views
- [ ] Shopping cart with drag-and-drop interactions
- [ ] Checkout process with payment integration
- [ ] Order tracking with real-time updates
- [ ] Subscription plan management
- [ ] Rating and review system
- [ ] Favorite meals and vendors
- [ ] Notification center

#### Vendor Dashboard

- [ ] Order management system
- [ ] Menu management
- [ ] Inventory control
- [ ] Business analytics dashboard with Recharts
- [ ] Sales reports and visualizations
- [ ] Customer feedback and ratings view
- [ ] Profile and store settings
- [ ] Delivery zone management
- [ ] Virtual kitchen management
- [ ] Promotion and discount creation

#### Admin Panel

- [ ] User management
- [ ] Vendor approval and management
- [ ] Content moderation
- [ ] System analytics and reporting
- [ ] Subscription plan configuration
- [ ] Payment gateway settings
- [ ] Global settings management
- [ ] Support ticket system

### Mobile Application Features

#### Core Features

- [ ] Cross-platform compatibility (iOS and Android)
- [ ] Offline mode with data synchronization
- [ ] Biometric authentication
- [ ] Deep linking for promotions
- [ ] Location services with permission handling
- [ ] Push notification handling

#### Customer Experience

- [ ] Personalized home screen with recommendations
- [ ] Interactive meal discovery
- [ ] Advanced animations for meal browsing using React Native Reanimated
- [ ] Pull-to-refresh with custom animations
- [ ] Location-based restaurant suggestions
- [ ] Meal search with voice input
- [ ] AR view for meal visualization (premium feature)
- [ ] Social sharing of favorite meals
- [ ] Order placement and payment
- [ ] Real-time order tracking with maps integration
- [ ] In-app chat with delivery personnel
- [ ] Digital wallet for easy payments
- [ ] Loyalty program with gamification elements

#### Delivery Agent Interface

- [ ] Order pickup and delivery management
- [ ] Navigation with optimized routes
- [ ] Status updates and delivery confirmation
- [ ] Earnings tracking and history
- [ ] Schedule management
- [ ] Customer communication

### Backend Services

#### API Services

- [ ] RESTful API endpoints for all features
- [ ] GraphQL API for flexible data fetching
- [ ] Webhooks for third-party integrations
- [ ] API versioning and documentation
- [ ] Rate limiting and request throttling

#### Core Services

- [ ] User service
- [ ] Authentication service
- [ ] Meal and vendor service
- [ ] Order service
- [ ] Subscription service
- [ ] Payment service
- [ ] Notification service
- [ ] Recommendation service
- [ ] Delivery management service
- [ ] Analytics service

#### Advanced Features

- [ ] Machine learning-based meal recommendations
- [ ] Demand forecasting for vendors
- [ ] Delivery route optimization
- [ ] Dynamic pricing based on demand
- [ ] Fraud detection system
- [ ] A/B testing framework
- [ ] Feature flag system

## Docker Setup Guidelines

### Development Environment

Each component (web-app, mobile-app, server) should have its own Dockerfile for development:

```
food-delivery/
├── web-app/
│   ├── Dockerfile.dev
│   └── .dockerignore
├── mobile-app/
│   ├── Dockerfile.dev
│   └── .dockerignore
├── server/
│   ├── Dockerfile.dev
│   └── .dockerignore
└── docker/
    ├── docker-compose.yml
    ├── .env.example
    └── scripts/
        ├── init-db.sh
        └── seed-db.sh
```

The main docker-compose.yml will define all services:

```yaml
version: "3.8"

services:
  # Backend services
  api:
    build:
      context: ../server
      dockerfile: Dockerfile.dev
    volumes:
      - ../server:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/food_delivery
      - REDIS_URL=redis://redis:6379

  # Database
  postgres:
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=food_delivery
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ../docker/scripts/init-db.sh:/docker-entrypoint-initdb.d/init-db.sh

  # Cache
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  # Web application
  web:
    build:
      context: ../web-app
      dockerfile: Dockerfile.dev
    volumes:
      - ../web-app:/app
      - /app/node_modules
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:3000/api

  # Additional services for development
  mailhog:
    image: mailhog/mailhog
    ports:
      - "8025:8025"
      - "1025:1025"

volumes:
  postgres-data:
  redis-data:
```

### Production Environment

For production, create separate optimized Dockerfiles:

```
food-delivery/
├── web-app/
│   ├── Dockerfile.prod
├── mobile-app/
│   ├── Dockerfile.prod (for build environment)
├── server/
│   ├── Dockerfile.prod
└── docker/
    └── docker-compose.prod.yml
```

The production docker-compose file should be configured for security, performance, and reliability:

- Use specific version tags for all images
- Remove development-only volumes
- Configure appropriate restart policies
- Set up health checks
- Implement proper logging
- Use Docker secrets for sensitive information
- Configure appropriate resource constraints

## Development Workflow Guidelines

1. **Local Development**:

   - Clone the repository
   - Run `docker-compose up` to start all services
   - Web app will be available at http://localhost:5173
   - API will be available at http://localhost:3000
   - API documentation will be available at http://localhost:3000/api/docs

2. **Code Quality**:

   - Use ESLint and Prettier for code formatting
   - Follow TypeScript best practices
   - Write unit tests for all business logic
   - Perform code reviews before merging

3. **Git Workflow**:

   - Follow GitFlow branching model
   - Use feature branches for new features
   - Use pull requests for code reviews
   - Require CI checks to pass before merging

4. **Deployment Pipeline**:
   - Develop → Staging → Production
   - Automated tests on each push
   - Automated builds for staging environment
   - Manual approval for production deployment

## Performance Optimization Guidelines

1. **Web Application**:

   - Implement code splitting and lazy loading
   - Optimize images and assets
   - Use React.memo and useMemo for expensive computations
   - Implement virtualized lists for long data sets
   - Utilize service workers for offline capability

2. **Mobile Application**:

   - Use React Native Flipper for debugging
   - Avoid unnecessary re-renders
   - Optimize images with proper sizing and formats
   - Use Hermes JavaScript engine
   - Implement gesture responder system efficiently

3. **Backend Services**:
   - Implement database indexing strategies
   - Use caching effectively (Redis)
   - Optimize database queries
   - Implement horizontal scaling for services
   - Use connection pooling

## Security Guidelines

1. **Authentication**:

   - Implement JWT with short expiration and refresh tokens
   - Store tokens securely (HttpOnly cookies, secure storage)
   - Implement CSRF protection
   - Rate limit authentication attempts

2. **Data Protection**:

   - Validate all user input
   - Implement proper error handling
   - Use parametrized queries to prevent SQL injection
   - Implement proper access control checks

3. **API Security**:
   - Use HTTPS only
   - Implement rate limiting
   - Use proper CORS configuration
   - Validate request payloads
   - Implement API keys for third-party services

## Monitoring and Analytics

1. **Application Monitoring**:

   - Implement health check endpoints
   - Set up error tracking with Sentry
   - Configure performance monitoring
   - Log critical operations

2. **Business Analytics**:
   - Track user acquisition metrics
   - Monitor order completion rate
   - Track delivery performance
   - Analyze user engagement and retention

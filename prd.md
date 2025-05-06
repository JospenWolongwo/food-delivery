# Campus Meal Delivery System PRD

## Overview

The Campus Meal Delivery System is a platform designed to connect university students with local food vendors, providing an efficient meal delivery service through subscription plans. The system uses AI-driven demand matching to optimize delivery logistics and help vendors expand their reach across university campuses.

## Problem Statement

- Students waste 7+ hours/week hunting for affordable meals, while their favorite local eateries are just 2km away but inaccessible due to fragmented delivery logistics.
- Campus restaurants lose 60% of potential revenue because they're trapped in a single location, with no tools to predict demand or expand to new markets.

## Solution

A comprehensive platform that offers:

- Subscription-based meal plans for students
- AI-driven recommendations and demand forecasting
- Fast and reliable delivery service
- Virtual kitchen capabilities for vendors to scale across campuses

## Metrics of Success

- 87% student interest achieved in initial surveys
- 500+ student waitlist signups
- 15 vendor partnerships established

## User Roles

The system will support three primary user roles:

1. **CUSTOMER** - Students/end users who purchase and receive meals
2. **DELIVERY_AGENT** - Personnel responsible for delivering orders
3. **ADMIN** - System administrators who manage the platform

## Core Entities

### User

- **Attributes**:

  - Long id
  - String name
  - String email
  - String password
  - String phoneNumber
  - UserRole role
  - List<Order> orders

- **Methods**:
  - createOrder(Meal meal, int quantity): Order

### Order

- **Attributes**:

  - Long id
  - User customer
  - List<Meal> meals
  - OrderStatus status (PENDING, CONFIRMED, DELIVERED, CANCELLED)
  - Payment payment
  - Delivery delivery

- **Methods**:
  - placeOrder(): Boolean
  - cancelOrder(): Boolean

### Subscription

- **Attributes**:

  - Long id
  - User subscriber
  - String planName
  - Double monthlyFee
  - List<Meal> includedMeals

- **Methods**:
  - subscribe(): Boolean
  - cancelSubscription(): Boolean

### Meal

- **Attributes**:
  - Long id
  - String name
  - String description
  - Double price
  - String category
  - Vendor vendor

### Vendor

- **Attributes**:
  - Long id
  - String name
  - String address
  - String phoneNumber
  - List<Meal> meals

### Delivery

- **Attributes**:

  - Long id
  - Order order
  - User deliveryAgent
  - String trackingNumber
  - Boolean delivered

- **Methods**:
  - deliverOrder(): Boolean

### Payment

- **Attributes**:

  - Long id
  - Order order
  - Double amount
  - PaymentStatus status (PENDING, PAID, FAILED)
  - String transactionId

- **Methods**:
  - processPayment(): Boolean

## Feature Requirements

### 1. User Management

- User registration and authentication
- Profile management
- Role-based access control

### 2. Subscription Management

- Multiple subscription plans (e.g., 10 meals/week for 10,000 FCFA)
- Subscription activation and cancellation
- Meal credits tracking

### 3. Meal Management

- Meal creation and cataloging
- Category organization
- Pricing and description management
- Vendor association

### 4. Order Processing

- Meal selection and ordering
- Order status tracking
- Order history
- Order cancellation

### 5. Delivery Management

- Delivery agent assignment
- Real-time delivery tracking
- Delivery status updates
- Optimized routes for delivery agents
- Guaranteed delivery within 30 minutes

### 6. Payment Processing

- Secure payment handling
- Transaction recording
- Payment status tracking
- Support for multiple payment methods

### 7. Vendor Management

- Vendor registration and profile management
- Menu management
- Virtual kitchen capabilities
- Performance analytics

### 8. AI-Driven Features

- Personalized meal recommendations based on user preferences
- Demand forecasting and heatmaps
- Delivery route optimization
- Vendor expansion suggestions

## Technical Requirements

### Backend

- RESTful API development
- Database design and implementation
- Authentication and authorization
- Business logic implementation
- Integration with payment gateways

### Frontend

- Mobile application for customers
- Web portal for vendors and administrators
- Real-time tracking interface
- User-friendly subscription management

### Infrastructure

- Cloud-based deployment
- Scalable architecture
- Data backup and recovery
- Security measures

## Non-Functional Requirements

- **Performance**: The system should handle concurrent orders and deliver meals within 30 minutes.
- **Scalability**: The platform should support addition of new campuses and vendors without significant infrastructure changes.
- **Reliability**: The system should be available 24/7 with minimal downtime.
- **Security**: User data, payment information, and transactions should be secured.
- **Usability**: Intuitive interfaces for all user roles.

## Future Enhancements

- Integration with university meal plans and cafeterias
- Expansion to multiple cities and regions
- Advanced analytics for business intelligence
- Sustainability initiatives (eco-friendly packaging, carbon-neutral delivery)

## Implementation Timeline

1. **Phase 1** - Core functionality (user management, meal ordering, basic delivery)
2. **Phase 2** - Subscription system and payment integration
3. **Phase 3** - AI recommendations and demand forecasting
4. **Phase 4** - Virtual kitchen platform and expansion tools

## Contact Information

Jospen Wolongwo

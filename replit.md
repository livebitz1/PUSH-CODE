# Santepheap Dental Clinic Booking System

## Overview

This is the official booking system for Santepheap Dental Clinic, an ISO 9001:2015 certified dental clinic in Cambodia. The platform serves locals, expatriates, and international tourists with multilingual support (English/Khmer), qualified dentist profiles, and flexible appointment booking with video consultation or clinic visit options. Built with React, Express.js, and PostgreSQL with a clean, professional medical design.

## User Preferences

Preferred communication style: Simple, everyday language.
Design inspiration: Clean, professional medical websites like smilegeneration.com
Color scheme: Blue (#0077B6), White (#FFFFFF), Light Gray (#E5E7EB)
Target audience: Local Cambodians, expatriates, and international tourists

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit OpenID Connect (OIDC)
- **Session Management**: express-session with PostgreSQL store
- **API**: RESTful endpoints for CRUD operations

### Database Design
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts`
- **Migration**: Drizzle Kit for schema management
- **Connection**: Neon serverless PostgreSQL

## Key Components

### Authentication System
- **Provider**: Replit OIDC authentication
- **Session Storage**: PostgreSQL-backed sessions
- **User Management**: Automatic user creation/update on login
- **Protected Routes**: Middleware-based route protection

### Core Entities
1. **Users**: Profile information and authentication data
2. **Dentists**: Provider profiles with Cambodia-specific locations (Phnom Penh, Siem Reap, Battambang, Sihanoukville), specialties, multilingual support
3. **Appointments**: Booking records with status management (video/clinic options)
4. **Time Slots**: Available appointment times for dentists across different cities

### UI Components
- **Component Library**: shadcn/ui with Radix UI primitives
- **Styling System**: CSS variables for medical theming (Blue #0077B6, White #FFFFFF, Light Gray #E5E7EB)
- **Responsive Design**: Mobile-first approach
- **Toast Notifications**: User feedback system
- **Custom Components**: DentistCard, BookingFlow, PatientTestimonials, ServicesGrid, DentalEducation

## Data Flow

### Authentication Flow
1. User clicks login → Redirects to Replit OIDC
2. OIDC validates user → Returns to callback endpoint
3. User data stored/updated in database
4. Session created with PostgreSQL store
5. User redirected to protected routes

### Appointment Booking Flow
1. User browses available dentists
2. Selects dentist and opens booking modal
3. Chooses consultation type, date, and time
4. Submits appointment request
5. System validates availability and creates booking
6. User receives confirmation and can view in dashboard

### Data Validation
- **Schema Validation**: Zod schemas for runtime validation
- **Database Constraints**: Drizzle schema definitions
- **Frontend Validation**: Form validation with React Hook Form

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Connection**: WebSocket-based connection pooling
- **Environment**: `DATABASE_URL` configuration required

### Authentication
- **Replit OIDC**: OpenID Connect provider
- **Required Variables**: `REPL_ID`, `ISSUER_URL`, `SESSION_SECRET`
- **Session Store**: PostgreSQL-backed session storage

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **TanStack Query**: Server state management

## Deployment Strategy

### Development Environment
- **Server**: Express.js with Vite middleware
- **Hot Reload**: Vite HMR for frontend changes
- **Database**: Development database connection
- **Error Handling**: Runtime error overlay

### Production Build
- **Frontend**: Vite build with static asset optimization
- **Backend**: ESBuild bundling for Node.js
- **Database**: Production PostgreSQL connection
- **Deployment**: Single-file distribution

### Environment Configuration
- **Development**: `NODE_ENV=development`
- **Production**: `NODE_ENV=production`
- **Database**: `DATABASE_URL` for connection string
- **Authentication**: Replit-specific environment variables

### Build Process
1. Frontend assets compiled with Vite
2. Backend bundled with ESBuild
3. Static files served from `dist/public`
4. Server runs from `dist/index.js`

## Technical Decisions

### Database Choice
- **PostgreSQL**: Chosen for ACID compliance and complex queries
- **Drizzle ORM**: Type-safe queries with good PostgreSQL support
- **Neon**: Serverless PostgreSQL for scalability

### Authentication Strategy
- **Replit OIDC**: Integrated authentication for Replit environment
- **Session-based**: Traditional sessions for web application
- **PostgreSQL Sessions**: Persistent session storage

### Frontend Architecture
- **React + TypeScript**: Type safety and component reusability
- **TanStack Query**: Efficient server state management
- **shadcn/ui**: Consistent, accessible component library
- **Professional Medical Design**: Clean, trustworthy aesthetic inspired by modern dental websites

### API Design
- **REST**: Simple, stateless API endpoints
- **JSON**: Standard data format
- **Error Handling**: Consistent error responses
- **Validation**: Schema-based request validation

### Localization Strategy
- **Multilingual Support**: English and Khmer language options
- **Cultural Adaptation**: Cambodia-specific locations and pricing (USD/KHR)
- **Tourist-Friendly**: Flexible scheduling and international payment support

## Recent Changes

### July 2025
- ✓ Enhanced landing page with Cambodia-specific content and multilingual support
- ✓ Updated color scheme to professional medical palette (Blue #0077B6, White #FFFFFF, Light Gray #E5E7EB)
- ✓ Added comprehensive patient testimonials with local, expat, and tourist perspectives
- ✓ Created dental education section with health tips and tourism guidance
- ✓ Built services grid with 8 key dental services and pricing
- ✓ Implemented booking flow component with video/clinic consultation options
- ✓ Updated dentist profiles with Cambodia locations and bilingual capabilities
- ✓ Added "Why Choose Us" section highlighting multilingual support and nationwide coverage
- ✓ Removed Product section from homepage and added Shop Products button in header
- ✓ Implemented testimonials slider with 3 testimonials at a time and auto-play
- ✓ Added custom dental procedure banner image to hero section
- ✓ Fixed products page 404 error by making it accessible to all users
- ✓ Removed redundant "How It Works" section from homepage
- ✓ Created reusable Footer component and added to all pages (home, products, booking)
- ✓ Added proper navigation header to products page with back to home functionality
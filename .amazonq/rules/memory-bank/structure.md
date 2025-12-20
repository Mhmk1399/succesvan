# Project Structure

## Directory Organization

### `/app` - Next.js App Router
Application routes and API endpoints following Next.js 16 App Router conventions.

**Route Pages**:
- `/` - Homepage with hero, van listings, and testimonials
- `/aboutus` - Company information and team
- `/reservation` - Main booking flow with confirmation
- `/customerDashboard` - Customer portal for managing bookings and profile
- `/dashboard` - Admin panel for fleet and reservation management
- `/register` - User registration
- `/contact-us` - Contact form
- `/blog` - Blog listing and individual posts
- Location-specific pages: `/van-hire-{area}` for SEO-optimized local landing pages

**API Routes** (`/app/api`):
- `auth/` - Login, registration, JWT token management
- `vehicles/` - CRUD operations for van fleet
- `reservations/` - Booking creation, retrieval, updates
- `offices/` - Rental location management
- `categories/` & `types/` - Vehicle classification
- `addons/` - Additional services and equipment
- `users/` - Customer profile and license management
- `testimonials/` - Customer reviews
- `stats/` - Analytics and reporting
- `fleet-status/` - Real-time availability
- `ai-agent/` - Conversational AI booking
- `fast-agent/` - Quick booking assistant
- `conversation/` - Voice interaction handling
- `parse-voice/` - Voice command processing
- `upload/` - S3 file uploads

### `/components` - React Components
Organized by feature domain and reusability.

**`/global`** - Shared across application:
- `Navbar.tsx` - Main navigation with auth state
- `footer.tsx` - Site footer
- `vanListing.tsx` - Vehicle grid display with filtering
- `ReservationForm.tsx` - Multi-step booking form
- `ReservationModal.tsx` - Quick booking popup
- `AIAgentModal.tsx` - Conversational AI interface
- `FastAgentModal.tsx` - Rapid booking interface
- `ConversationalModal.tsx` - Voice interaction UI
- `VoiceConfirmationModal.tsx` - Voice booking confirmation
- `AddOnsModal.tsx` - Add-ons selection
- `blogListing.tsx` - Blog post grid
- `breadcrumbs.tsx` - Navigation breadcrumbs
- `seoDesc.tsx` - SEO metadata component

**`/dashboard`** - Admin components:
- `dashboard.tsx` - Main admin layout
- `DynamicTableView.tsx` - Generic CRUD table
- `ReservationsManagement.tsx` - Booking administration
- `CreateVehicleForm.tsx` - Vehicle creation
- `CreateOfficeForm.tsx` - Location creation
- `CreateCategoryForm.tsx` - Category management
- `CreateAddOnForm.tsx` - Add-on creation
- `SpecialDaysManagement.tsx` - Pricing rules
- `TestimonialsManagement.tsx` - Review moderation
- `TypesManagement.tsx` - Vehicle type management
- `ContactsManagement.tsx` - Customer inquiries

**`/customerDashboard`** - Customer portal:
- `CustomerDashboard.tsx` - Main customer layout with tabs
- `ProfileContent.tsx` - Profile editing and license upload

**`/static`** - Landing page sections:
- `HeroSlider.tsx` - Homepage hero carousel
- `homeContainer.tsx` - Homepage layout
- `reservation.tsx` - Reservation section
- `testominial.tsx` - Testimonials display
- `fAQSection.tsx` - FAQ accordion
- `whyus.tsx` - Value propositions
- Area-specific components for local pages

**`/auth`** - Authentication:
- `AuthForm.tsx` - Login/register form

**`/ui`** - Reusable UI elements:
- `CustomSelect.tsx` - Styled select dropdown
- `TimePickerInput.tsx` - Time selection
- `TimeSelect.tsx` - Time dropdown
- `FloatingActionMenu.tsx` - Floating action button
- `smoothScrollProvider.tsx.tsx` - Smooth scroll wrapper

### `/model` - Mongoose Schemas
MongoDB data models defining database structure.

- `user.ts` - Customer accounts with auth and license data
- `vehicle.ts` - Van fleet with specs and availability
- `reservation.ts` - Booking records with pricing
- `office.ts` - Rental locations
- `category.ts` - Vehicle categories (e.g., Small Van, Large Van)
- `type.ts` - Vehicle types (e.g., Manual, Automatic)
- `addOn.ts` - Additional services
- `testimonial.ts` - Customer reviews
- `verification.ts` - Email/phone verification

### `/hooks` - Custom React Hooks
Reusable stateful logic and API interactions.

- `usePriceCalculation.ts` - Dynamic pricing with special days
- `useFleetStatus.ts` - Real-time vehicle availability
- `useStats.ts` - Dashboard analytics
- `useRecentReservations.ts` - Recent booking data
- `useAIAgent.ts` - AI conversation management
- `useFastAgent.ts` - Quick booking logic
- `useConversationalVoice.ts` - Voice interaction state
- `useVoiceRecording.ts` - Audio recording handling

### `/lib` - Utility Libraries
Core business logic and external service integrations.

- `auth.ts` - JWT token generation and validation
- `openai.ts` - OpenAI API client configuration
- `ai-agent.ts` - Conversational AI logic
- `fast-agent.ts` - Quick booking AI
- `comprehensive-rag.ts` - RAG system for AI context
- `rag-context.ts` - Context retrieval for AI
- `s3.ts` - AWS S3 file operations
- `sms.ts` - Twilio SMS notifications
- `specialDaysHelper.ts` - Special pricing calculations
- `api-response.ts` - Standardized API responses
- `toast.tsx` - Toast notification helper
- `data.ts` - Static data and constants
- `areas.tsx` - Location data

### `/types` - TypeScript Definitions
Type definitions for type safety.

- `type.ts` - Core application types (Vehicle, Reservation, User, etc.)
- `react-datepicker.d.ts` - Third-party library types

### `/context` - React Context
Global state management.

- `AuthContext.tsx` - Authentication state and user session

### `/utils` - Utility Functions
Helper functions and constants.

- `timeSlots.ts` - Time slot generation for bookings

### `/public` - Static Assets
Images, videos, and static files served directly.

- `/assets/images/` - Vehicle photos, logos, team photos
- `/assets/videos/` - Promotional videos

### `/scripts` - Automation Scripts
Setup and maintenance scripts.

- `setup-s3-cors.js` - Configure S3 CORS
- `setup-s3-public.js` - Configure S3 public access

## Architectural Patterns

### Full-Stack Next.js Architecture
- **Server Components**: Default for pages, optimized for SEO
- **Client Components**: Interactive UI with "use client" directive
- **API Routes**: RESTful endpoints in `/app/api`
- **Server Actions**: Form submissions and mutations

### Data Flow
1. **Client** → API Route → Model → MongoDB
2. **Client** → Custom Hook → API Route → Response
3. **AI Agent** → RAG System → OpenAI → Structured Response

### State Management
- **Server State**: SWR for data fetching and caching
- **Client State**: React useState/useEffect
- **Global State**: React Context for auth
- **Form State**: Controlled components

### Authentication Flow
1. User submits credentials → `/api/auth/login`
2. Server validates → generates JWT token
3. Token stored in localStorage
4. Protected routes check token validity
5. Admin routes verify role permissions

### Booking Flow
1. Customer selects vehicle and dates
2. `usePriceCalculation` calculates total with special days
3. `useFleetStatus` checks availability
4. Reservation created via `/api/reservations`
5. SMS confirmation sent via Twilio
6. Admin reviews in dashboard

### AI Booking Flow
1. Customer opens AI modal (conversational or fast)
2. User input → `/api/ai-agent` or `/api/fast-agent`
3. RAG system retrieves context (vehicles, offices, pricing)
4. OpenAI generates structured response
5. Extracted data populates reservation form
6. User confirms and submits booking

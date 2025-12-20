# Technology Stack

## Core Technologies

### Frontend Framework
- **Next.js 16.0.7** - React framework with App Router
- **React 19.2.1** - UI library
- **TypeScript 5** - Type-safe JavaScript

### Backend & Database
- **Next.js API Routes** - Serverless API endpoints
- **Mongoose 8.20.1** - MongoDB ODM
- **MongoDB** - NoSQL database

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **GSAP 3.13.0** - Animation library
- **Lenis 1.3.15** - Smooth scrolling

## Key Dependencies

### Authentication & Security
- **jsonwebtoken 9.0.2** - JWT token generation
- **jose 6.1.3** - JWT verification
- **bcryptjs 3.0.3** - Password hashing

### AI & Machine Learning
- **openai 6.10.0** - OpenAI API client for GPT models
- RAG (Retrieval-Augmented Generation) system for context-aware AI

### Cloud Services
- **@aws-sdk/client-s3 3.940.0** - AWS S3 client
- **@aws-sdk/s3-request-presigner 3.940.0** - S3 presigned URLs
- **twilio 5.10.6** - SMS notifications

### UI Components & Forms
- **react-datepicker 8.9.0** - Date selection
- **react-date-range 2.0.1** - Date range picker
- **react-time-picker 8.0.2** - Time selection
- **react-clock 6.0.0** - Clock display
- **@mui/x-date-pickers 8.18.0** - Material UI date pickers
- **react-icons 5.5.0** - Icon library
- **react-hot-toast 2.6.0** - Toast notifications
- **swiper 12.0.3** - Carousel/slider

### Data Fetching & State
- **swr 2.3.6** - Data fetching and caching
- **date-fns 4.1.0** - Date manipulation
- **dayjs 1.11.19** - Date parsing and formatting

## Development Tools

### Code Quality
- **ESLint 9** - Linting
- **eslint-config-next 16.0.7** - Next.js ESLint config

### TypeScript Types
- **@types/node** - Node.js types
- **@types/react 19** - React types
- **@types/react-dom 19** - React DOM types
- **@types/bcryptjs** - bcryptjs types
- **@types/jsonwebtoken** - JWT types
- **@types/react-date-range** - Date range types

## Environment Configuration

### Required Environment Variables
```
# Database
MONGODB_URI=<mongodb-connection-string>

# Authentication
JWT_SECRET=<secret-key>

# AWS S3
AWS_ACCESS_KEY_ID=<aws-key>
AWS_SECRET_ACCESS_KEY=<aws-secret>
AWS_REGION=<region>
AWS_S3_BUCKET=<bucket-name>

# Twilio SMS
TWILIO_ACCOUNT_SID=<twilio-sid>
TWILIO_AUTH_TOKEN=<twilio-token>
TWILIO_PHONE_NUMBER=<twilio-phone>

# OpenAI
OPENAI_API_KEY=<openai-key>

# Application
NEXT_PUBLIC_API_URL=<api-base-url>
```

## Development Commands

### Local Development
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing Scripts
```bash
node test-api.js         # Test API endpoints
node test-auth.js        # Test authentication
node test-offices.js     # Test office endpoints
node test-vehicles.js    # Test vehicle endpoints
```

### AWS S3 Setup
```bash
node scripts/setup-s3-cors.js      # Configure S3 CORS
node scripts/setup-s3-public.js    # Configure S3 public access
```

## Build Configuration

### Next.js Config (`next.config.ts`)
- TypeScript configuration
- Image optimization settings
- API route configuration

### TypeScript Config (`tsconfig.json`)
- Strict type checking
- Path aliases
- Module resolution

### Tailwind Config
- Custom color palette
- Responsive breakpoints
- Custom utilities

### PostCSS Config (`postcss.config.mjs`)
- Tailwind CSS processing
- Autoprefixer

## API Documentation

### Postman Collection
`SuccessVan_API.postman_collection.json` - Complete API endpoint collection for testing

## Additional Documentation

### Project Guides
- `RAG_SYSTEM.md` - RAG implementation details
- `VOICE_RESERVATION_GUIDE.md` - Voice booking system
- `CONVERSATIONAL_AI_GUIDE.md` - AI agent implementation
- `VOICE_MODES_COMPARISON.md` - Voice mode differences
- `VOICE_LOGGING_GUIDE.md` - Voice interaction logging
- `AGENT_STRATEGIES.md` - AI agent strategies
- `ADDON_CHANGES.md` - Add-on system changes

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement approach

## Performance Optimizations
- Next.js automatic code splitting
- Image optimization with next/image
- Font optimization with next/font (Geist)
- SWR caching for API responses
- Server-side rendering for SEO
- Static generation for landing pages

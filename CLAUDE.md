# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **multi-business website with CMS** built with Next.js 15 and TypeScript. The project allows creating dynamic business pages using reusable templates, with an admin CMS for content management.

## Development Commands

```bash
# Development
npm run dev        # Start development server with Turbopack

# Production  
npm run build      # Build for production with Turbopack
npm run start      # Start production server

# Package management
npm install        # Install dependencies
```

## Architecture & Structure

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB (planned)
- **Authentication**: NextAuth.js (planned)

### App Structure
```
app/
├── (admin)/           # Admin CMS routes (planned)
├── business/[slug]/   # Dynamic business pages (planned)
├── api/              # API routes (planned)
├── globals.css       # Global styles with Tailwind
├── layout.tsx        # Root layout
└── page.tsx          # Homepage
```

### Component Architecture (Planned)
```
components/
├── admin/                    # Admin-only components
├── business-templates/       # 15+ business page templates
│   ├── GasStationTemplate.tsx
│   ├── HotelTemplate.tsx
│   ├── FarmingTemplate.tsx
│   └── ...                  # More templates per IMPLEMENTATION_PLAN.md
├── shared/                  # Reusable sections (Hero, Services, etc.)
└── ui/                      # Base UI components
```

## Key Development Patterns

### Business Templates
Each business template follows this pattern:
- Receives `business`, `content`, and `template` props
- Applies business-specific branding via CSS custom properties
- Uses shared components (Hero, Services, About, Gallery, Contact)
- Supports theme-based styling

### Dynamic Routing
- `/business/[slug]` pages are generated based on MongoDB business records
- Template selection is dynamic based on business.template field
- SEO metadata is generated per business

### Content Management
- Admin CMS at `/admin` for managing businesses and content
- Section-based content editing (hero, about, services, gallery, testimonials)
- Media library for image/video management
- Template-driven field validation

## Database Schema

### Key Collections (MongoDB)
- `businesses` - Business info, branding, SEO data
- `business_content` - Content organized by businessId and section
- `business_templates` - Template definitions with field schemas
- `media` - Uploaded files metadata

## Path Aliases

Uses `@/*` path mapping to project root via tsconfig.json paths configuration.

## Important Implementation Details

### Template System
Templates are selected dynamically based on `business.template` field. Each template:
- Has its own component in `components/business-templates/`
- Follows consistent theming patterns
- Supports business-specific customizations

### Content Structure
Content is organized by sections:
- `hero` - Main banner with CTA buttons
- `services` - Service listings with features/pricing
- `about` - Business story, mission, stats  
- `gallery` - Image galleries with captions
- `testimonials` - Customer reviews and ratings

### Responsive Design
All templates use Tailwind CSS for mobile-first responsive design with consistent breakpoints.

## Development Notes

- This is a fresh Next.js project based on the default template
- The project uses Turbopack for faster development builds
- Tailwind CSS v4 with PostCSS integration
- TypeScript configured for strict type checking
- Implementation follows the detailed plan in IMPLEMENTATION_PLAN.md

## Testing Strategy (Planned)

- Unit tests for components using Jest + React Testing Library
- API endpoint testing
- Template rendering tests with mock business data
- End-to-end tests for admin workflows
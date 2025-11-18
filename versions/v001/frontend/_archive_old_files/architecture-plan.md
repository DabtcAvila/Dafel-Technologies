# ARQUITECTURA COMPLETA - DAFEL TECHNOLOGIES LANDING PAGE
## dafel.com.mx/new | Next.js 14 + TypeScript + Tailwind CSS

**ARQUITECTO SENIOR**: Diseño de Sistema Escalable B2B
**TARGET**: Consultoría Actuarial | Empresas Medianas/Grandes  
**DIFERENCIADOR CLAVE**: Análisis histórico 5-15 años de datos actuariales

---

## 1. ESTRUCTURA DE CARPETAS COMPLETA

```
dafel-landing/
├── README.md
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.local
├── .env.example
├── .gitignore
├── .eslintrc.json
├── postcss.config.js
│
├── public/
│   ├── icons/
│   │   ├── favicon.ico
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── apple-touch-icon.png
│   │   └── manifest.json
│   ├── images/
│   │   ├── hero/
│   │   │   ├── hero-bg.webp
│   │   │   ├── hero-pattern.svg
│   │   │   └── data-visualization.webp
│   │   ├── services/
│   │   │   ├── actuarial-analysis.webp
│   │   │   ├── risk-assessment.webp
│   │   │   ├── compliance-automation.webp
│   │   │   └── predictive-modeling.webp
│   │   ├── company/
│   │   │   ├── office-building.webp
│   │   │   ├── team-meeting.webp
│   │   │   └── awards-certifications.webp
│   │   ├── testimonials/
│   │   │   ├── client-logo-1.svg
│   │   │   ├── client-logo-2.svg
│   │   │   └── client-logo-3.svg
│   │   └── graphics/
│   │       ├── pattern-dots.svg
│   │       ├── pattern-grid.svg
│   │       └── gradient-overlay.svg
│   └── animations/
│       ├── data-flow.json (Lottie)
│       ├── compliance-check.json
│       └── dashboard-preview.json
│
├── src/
│   ├── app/
│   │   ├── new/
│   │   │   ├── page.tsx                    # Main Landing Page
│   │   │   ├── layout.tsx                  # Landing-specific layout
│   │   │   └── loading.tsx                 # Loading component
│   │   ├── api/
│   │   │   ├── contact/
│   │   │   │   └── route.ts               # Contact form API
│   │   │   ├── newsletter/
│   │   │   │   └── route.ts               # Newsletter subscription
│   │   │   └── analytics/
│   │   │       └── route.ts               # Custom analytics tracking
│   │   ├── globals.css
│   │   ├── layout.tsx                      # Root layout
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── landing/
│   │   │   ├── Hero/
│   │   │   │   ├── HeroSection.tsx         # Main hero with CTA
│   │   │   │   ├── HeroAnimation.tsx       # Data flow animation
│   │   │   │   ├── ValueProposition.tsx    # Key benefits grid
│   │   │   │   └── HeroStats.tsx          # 5-15 years experience stats
│   │   │   ├── Services/
│   │   │   │   ├── ServicesOverview.tsx    # 4 main service categories
│   │   │   │   ├── ServiceCard.tsx         # Individual service card
│   │   │   │   ├── CapabilitiesGrid.tsx    # Technical capabilities
│   │   │   │   └── ProcessFlow.tsx         # 3-step process visualization
│   │   │   ├── About/
│   │   │   │   ├── CompanyOverview.tsx     # Why choose Dafel
│   │   │   │   ├── ExperienceTimeline.tsx  # 15+ years timeline
│   │   │   │   ├── TeamExpertise.tsx       # Actuarial experts
│   │   │   │   └── Certifications.tsx      # Professional certifications
│   │   │   ├── Solutions/
│   │   │   │   ├── IndustryFocus.tsx       # Target industries
│   │   │   │   ├── DataAdvantage.tsx       # Historical data analysis
│   │   │   │   ├── TechnologyStack.tsx     # AI/Analytics capabilities
│   │   │   │   └── ComplianceMatrix.tsx    # Regulatory compliance
│   │   │   ├── Testimonials/
│   │   │   │   ├── ClientLogos.tsx         # Enterprise client logos
│   │   │   │   ├── CaseStudies.tsx         # Success stories
│   │   │   │   ├── TestimonialCarousel.tsx # Client testimonials
│   │   │   │   └── ROICalculator.tsx       # Value demonstration
│   │   │   ├── Contact/
│   │   │   │   ├── ContactSection.tsx      # Contact form + info
│   │   │   │   ├── ContactForm.tsx         # Lead capture form
│   │   │   │   ├── ContactInfo.tsx         # Phone, email, address
│   │   │   │   └── RequestQuoteModal.tsx   # Quote request modal
│   │   │   └── FAQ/
│   │   │       ├── FAQSection.tsx          # Actuarial FAQs
│   │   │       ├── FAQAccordion.tsx        # Expandable FAQ items
│   │   │       └── FAQSearch.tsx           # Searchable FAQ
│   │   ├── ui/
│   │   │   ├── Button.tsx                  # Primary/Secondary buttons
│   │   │   ├── Card.tsx                    # Service/content cards
│   │   │   ├── Badge.tsx                   # Status/category badges
│   │   │   ├── Input.tsx                   # Form inputs
│   │   │   ├── Select.tsx                  # Dropdown selectors
│   │   │   ├── Textarea.tsx                # Form textareas
│   │   │   ├── Modal.tsx                   # Modal dialogs
│   │   │   ├── Accordion.tsx               # FAQ/expandable content
│   │   │   ├── Tabs.tsx                    # Service/content tabs
│   │   │   ├── Toast.tsx                   # Notifications
│   │   │   ├── Spinner.tsx                 # Loading indicators
│   │   │   ├── Progress.tsx                # Progress bars
│   │   │   └── index.ts                    # UI exports
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   │   ├── Navigation.tsx          # Main navigation
│   │   │   │   ├── MobileMenu.tsx          # Mobile hamburger menu
│   │   │   │   ├── Logo.tsx                # Dafel Technologies logo
│   │   │   │   └── CTAButtons.tsx          # Header CTA buttons
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.tsx              # Main footer
│   │   │   │   ├── FooterLinks.tsx         # Footer navigation
│   │   │   │   ├── ContactInfo.tsx         # Footer contact
│   │   │   │   └── SocialLinks.tsx         # Social media links
│   │   │   └── Container.tsx               # Layout container
│   │   ├── forms/
│   │   │   ├── ContactForm/
│   │   │   │   ├── ContactForm.tsx         # Main contact form
│   │   │   │   ├── FormFields.tsx          # Form field components
│   │   │   │   ├── FormValidation.tsx      # Validation logic
│   │   │   │   └── FormSubmission.tsx      # Submit handling
│   │   │   ├── QuoteRequest/
│   │   │   │   ├── QuoteRequestForm.tsx    # Quote request form
│   │   │   │   ├── ServiceSelector.tsx     # Service selection
│   │   │   │   ├── CompanyInfo.tsx         # Company details
│   │   │   │   └── RequirementsDetail.tsx  # Detailed requirements
│   │   │   └── Newsletter/
│   │   │       ├── NewsletterSignup.tsx    # Newsletter subscription
│   │   │       └── EmailInput.tsx          # Email input component
│   │   ├── animations/
│   │   │   ├── FadeInView.tsx              # Fade in on scroll
│   │   │   ├── SlideInView.tsx             # Slide animations
│   │   │   ├── CounterAnimation.tsx        # Number counters
│   │   │   ├── TypingAnimation.tsx         # Typing text effect
│   │   │   ├── ParallaxScroll.tsx          # Parallax effects
│   │   │   ├── LottieAnimation.tsx         # Lottie animation wrapper
│   │   │   └── PageTransition.tsx          # Page transitions
│   │   └── charts/
│   │       ├── DataVisualization.tsx       # Data analysis charts
│   │       ├── ROIChart.tsx                # ROI visualization
│   │       ├── TimelineChart.tsx           # Historical data timeline
│   │       └── ComplianceMatrix.tsx        # Compliance visualization
│   │
│   ├── lib/
│   │   ├── utils.ts                        # Utility functions
│   │   ├── constants.ts                    # App constants
│   │   ├── animations.ts                   # Framer Motion configs
│   │   ├── validations/
│   │   │   ├── contactForm.ts              # Contact form validation
│   │   │   ├── quoteRequest.ts             # Quote validation
│   │   │   └── newsletter.ts               # Newsletter validation
│   │   ├── api/
│   │   │   ├── client.ts                   # API client setup
│   │   │   ├── contact.ts                  # Contact API calls
│   │   │   ├── analytics.ts                # Analytics integration
│   │   │   └── newsletter.ts               # Newsletter API
│   │   ├── hooks/
│   │   │   ├── useIntersectionObserver.ts  # Scroll animations
│   │   │   ├── useScrollProgress.ts        # Scroll progress
│   │   │   ├── useLocalStorage.ts          # Local storage
│   │   │   ├── useDebounce.ts              # Debounced values
│   │   │   ├── useMediaQuery.ts            # Responsive queries
│   │   │   └── useAnimation.ts             # Animation controls
│   │   └── fonts.ts                        # Font configurations
│   │
│   ├── types/
│   │   ├── index.ts                        # Global type exports
│   │   ├── landing.ts                      # Landing page types
│   │   ├── forms.ts                        # Form data types
│   │   ├── api.ts                          # API response types
│   │   ├── animations.ts                   # Animation types
│   │   └── components.ts                   # Component prop types
│   │
│   ├── data/
│   │   ├── services.ts                     # Service definitions
│   │   ├── testimonials.ts                 # Client testimonials
│   │   ├── faqs.ts                         # FAQ data
│   │   ├── company.ts                      # Company information
│   │   ├── team.ts                         # Team member data
│   │   └── navigation.ts                   # Navigation structure
│   │
│   └── styles/
│       ├── globals.css                     # Global styles
│       ├── components.css                  # Component-specific styles
│       └── animations.css                  # Animation classes
│
└── docs/
    ├── DEPLOYMENT.md
    ├── STYLING_GUIDE.md
    ├── COMPONENT_GUIDE.md
    └── API_DOCUMENTATION.md
```

---

## 2. COMPONENTES PRINCIPALES DEFINIDOS

### 2.1 Secciones Principales (Landing Page)

```typescript
// src/components/landing/Hero/HeroSection.tsx
interface HeroSectionProps {
  className?: string;
  showAnimation?: boolean;
}

// src/components/landing/Services/ServicesOverview.tsx
interface ServicesOverviewProps {
  services: ServiceCategory[];
  highlightHistoricalData?: boolean;
}

// src/components/landing/About/ExperienceTimeline.tsx
interface ExperienceTimelineProps {
  milestones: TimelineMilestone[];
  yearsOfExperience: number;
}

// src/components/landing/Solutions/DataAdvantage.tsx
interface DataAdvantageProps {
  dataRange: string; // "5-15 años"
  analysisCapabilities: AnalysisCapability[];
}
```

### 2.2 Componentes UI Reutilizables

```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ComponentType;
  children: React.ReactNode;
  onClick?: () => void;
}

// src/components/ui/Card.tsx
interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: React.ReactNode;
}
```

### 2.3 Formularios y Modales

```typescript
// src/components/forms/QuoteRequest/QuoteRequestForm.tsx
interface QuoteRequestFormProps {
  onSuccess?: (data: QuoteRequestData) => void;
  services?: ServiceType[];
}

// src/components/landing/Contact/RequestQuoteModal.tsx
interface RequestQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}
```

---

## 3. DEPENDENCIAS NPM EXACTAS

### 3.1 Dependencies (package.json)

```json
{
  "dependencies": {
    "next": "^14.2.7",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "typescript": "^5.5.4",
    
    "@headlessui/react": "^1.7.19",
    "@heroicons/react": "^2.0.18",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7",
    
    "framer-motion": "^11.3.24",
    "lottie-react": "^2.4.1",
    
    "react-hook-form": "^7.47.0",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4",
    
    "recharts": "^2.8.0",
    "react-intersection-observer": "^9.5.2",
    "react-countup": "^6.5.0",
    
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0",
    "class-variance-authority": "^0.7.0",
    
    "axios": "^1.5.1",
    "react-hot-toast": "^2.4.1",
    "sharp": "^0.32.6"
  },
  "devDependencies": {
    "@types/node": "^20.8.7",
    "@types/react": "^18.2.31",
    "@types/react-dom": "^18.2.14",
    
    "tailwindcss": "^3.3.5",
    "@tailwindcss/typography": "^0.5.10",
    "@tailwindcss/forms": "^0.5.7",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    
    "eslint": "^8.52.0",
    "eslint-config-next": "14.2.7",
    "@typescript-eslint/parser": "^6.9.1",
    "@typescript-eslint/eslint-plugin": "^6.9.1",
    
    "prettier": "^3.0.3",
    "prettier-plugin-tailwindcss": "^0.5.6",
    
    "@next/bundle-analyzer": "^14.2.7"
  }
}
```

### 3.2 Scripts Definidos

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{js,ts,jsx,tsx,json,css,md}\"",
    "analyze": "ANALYZE=true npm run build",
    "postinstall": "prisma generate || echo 'Prisma not configured'"
  }
}
```

---

## 4. CONFIGURACIONES PRINCIPALES

### 4.1 next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['dafel.com.mx', 'localhost'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  async rewrites() {
    return [
      {
        source: '/new',
        destination: '/new',
      },
    ];
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 4.2 tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dafel Brand Colors
        'dafel-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Primary brand color
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        'dafel-slate': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        'dafel-orange': {
          50: '#fff7ed',
          500: '#f97316', // Accent color
          600: '#ea580c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 25px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 50px -12px rgba(0, 0, 0, 0.15)',
        'dafel': '0 4px 20px -2px rgba(59, 130, 246, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};

export default config;
```

### 4.3 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/data/*": ["./src/data/*"],
      "@/styles/*": ["./src/styles/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 5. TIPOS TYPESCRIPT COMPLETOS

### 5.1 Landing Page Types

```typescript
// src/types/landing.ts
export interface LandingPageProps {
  initialData?: LandingPageData;
}

export interface LandingPageData {
  hero: HeroData;
  services: ServiceCategory[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  company: CompanyInfo;
}

export interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  primaryCta: CTAButton;
  secondaryCta?: CTAButton;
  stats: HeroStat[];
}

export interface HeroStat {
  value: string;
  label: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  services: Service[];
  highlight?: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  features: string[];
  pricing?: PricingTier;
  historicalDataYears?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  companyLogo?: string;
  content: string;
  rating: number;
  industry: string;
  projectType?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'services' | 'pricing' | 'technical';
  popular?: boolean;
}

export interface CompanyInfo {
  name: string;
  foundedYear: number;
  yearsOfExperience: number;
  dataAnalysisRange: string; // "5-15 años"
  employeeCount: string;
  clientsServed: string;
  certifications: Certification[];
  achievements: Achievement[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  logo?: string;
}

export interface Achievement {
  title: string;
  description: string;
  year: number;
  type: 'award' | 'milestone' | 'recognition';
}
```

### 5.2 Component Props Types

```typescript
// src/types/components.ts
export interface CTAButton {
  text: string;
  href?: string;
  onClick?: () => void;
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType;
}

export interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale';
  delay?: number;
  threshold?: number;
  className?: string;
}

export interface StatsCounterProps {
  value: string;
  label: string;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}
```

### 5.3 Form Types

```typescript
// src/types/forms.ts
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  message: string;
  servicesOfInterest: string[];
  urgency: 'low' | 'medium' | 'high';
  budget?: string;
  preferredContactMethod: 'email' | 'phone' | 'whatsapp';
}

export interface QuoteRequestData extends ContactFormData {
  projectType: 'actuarial-analysis' | 'compliance-audit' | 'risk-assessment' | 'custom';
  dataVolume: 'small' | 'medium' | 'large' | 'enterprise';
  timeline: string;
  historicalDataYears?: number;
  regulatoryRequirements: string[];
}

export interface NewsletterSignupData {
  email: string;
  interests?: string[];
  frequency?: 'weekly' | 'monthly' | 'quarterly';
}
```

### 5.4 API Types

```typescript
// src/types/api.ts
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

export interface ContactSubmissionResponse {
  submissionId: string;
  estimatedResponseTime: string;
  nextSteps: string[];
}

export interface QuoteRequestResponse extends ContactSubmissionResponse {
  quoteId: string;
  estimatedQuoteDate: string;
  requiredDocuments?: string[];
}
```

---

## 6. PATTERNS Y CONVENCIONES

### 6.1 Naming Conventions

```typescript
// File naming: PascalCase para componentes, kebab-case para utilities
// Components: HeroSection.tsx, ServiceCard.tsx
// Utils: data-processing.ts, form-validation.ts
// Types: landing.ts, components.ts
// Constants: DAFEL_COLORS, SERVICE_CATEGORIES

// Component naming
interface ComponentNameProps {
  // Props con descriptive names
  isVisible?: boolean;
  onSubmit?: (data: FormData) => void;
  className?: string;
  children?: React.ReactNode;
}

// Enum naming
enum ServiceType {
  ACTUARIAL_ANALYSIS = 'actuarial-analysis',
  RISK_ASSESSMENT = 'risk-assessment',
  COMPLIANCE_AUDIT = 'compliance-audit',
  PREDICTIVE_MODELING = 'predictive-modeling',
}
```

### 6.2 File Organization Patterns

```typescript
// Component structure pattern
// src/components/[category]/[ComponentName]/
// - ComponentName.tsx (main component)
// - index.ts (exports)
// - types.ts (component-specific types)
// - utils.ts (component-specific utilities)
// - styles.module.css (if needed)

// Hook patterns
export const useComponent = (options: ComponentOptions) => {
  // Custom hook implementation
  return { state, actions, computed };
};

// API patterns
export const apiClient = {
  contact: {
    submit: (data: ContactFormData) => Promise<APIResponse<ContactSubmissionResponse>>,
    getStatus: (id: string) => Promise<APIResponse<ContactStatus>>,
  },
  quote: {
    request: (data: QuoteRequestData) => Promise<APIResponse<QuoteRequestResponse>>,
    getQuote: (id: string) => Promise<APIResponse<QuoteDetails>>,
  },
};
```

### 6.3 Import/Export Patterns

```typescript
// Barrel exports pattern
// src/components/ui/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';
export type { ButtonProps, CardProps, InputProps } from './types';

// Named imports preference
import { HeroSection, ServiceCard, ContactForm } from '@/components/landing';
import { Button, Card, Input } from '@/components/ui';
import { validateForm, formatCurrency } from '@/lib/utils';

// Default exports for pages and main components
export default function LandingPage({ initialData }: LandingPageProps) {
  // Component implementation
}
```

### 6.4 Code Structure Standards

```typescript
// Component structure pattern
export default function ComponentName({
  prop1,
  prop2,
  className,
  children,
  ...restProps
}: ComponentNameProps) {
  // 1. Hooks and state
  const [state, setState] = useState(initialState);
  const customHook = useCustomHook(options);
  
  // 2. Computed values
  const computedValue = useMemo(() => {
    return expensiveComputation(state);
  }, [state]);
  
  // 3. Effect hooks
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // 4. Event handlers
  const handleClick = useCallback((event: MouseEvent) => {
    // Handle click
  }, [dependencies]);
  
  // 5. Early returns
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  // 6. Main render
  return (
    <div className={cn('base-classes', className)} {...restProps}>
      {children}
    </div>
  );
}
```

---

## 7. PERFORMANCE Y ESCALABILIDAD

### 7.1 Optimization Strategies

```typescript
// Code splitting y lazy loading
const ContactForm = lazy(() => import('@/components/forms/ContactForm'));
const QuoteRequestModal = lazy(() => import('@/components/landing/Contact/RequestQuoteModal'));

// Image optimization
import Image from 'next/image';

const OptimizedImage = ({ src, alt, ...props }) => (
  <Image
    src={src}
    alt={alt}
    priority={false}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
    {...props}
  />
);

// Memoization patterns
export const ServiceCard = memo(function ServiceCard({ service, onSelect }: ServiceCardProps) {
  return (
    <Card onClick={() => onSelect(service)}>
      {/* Component implementation */}
    </Card>
  );
});
```

### 7.2 Bundle Size Management

```typescript
// Dynamic imports para features opcionales
const AdvancedAnalytics = dynamic(() => import('@/components/charts/AdvancedAnalytics'), {
  ssr: false,
  loading: () => <AnalyticsPlaceholder />,
});

// Tree-shaking friendly imports
import { format } from 'date-fns/format';
import { isEmail } from 'validator/lib/isEmail';
```

---

## 8. SEO Y ANALYTICS CONFIGURATION

### 8.1 SEO Metadata

```typescript
// src/app/new/page.tsx - Metadata configuration
export const metadata: Metadata = {
  title: 'Dafel Technologies - Consultoría Actuarial con IA | Análisis 5-15 Años',
  description: 'Transforme sus análisis actuariales con IA avanzada. Especialistas en análisis histórico de 5-15 años de datos. Consultoría empresarial para empresas medianas y grandes.',
  keywords: [
    'consultoría actuarial',
    'análisis actuarial IA',
    'datos históricos actuariales',
    'empresas medianas grandes',
    'análisis 5-15 años',
    'Dafel Technologies'
  ],
  authors: [{ name: 'Dafel Technologies' }],
  openGraph: {
    title: 'Dafel Technologies - Consultoría Actuarial con IA',
    description: 'Análisis actuarial avanzado con 5-15 años de datos históricos',
    url: 'https://dafel.com.mx/new',
    siteName: 'Dafel Technologies',
    images: [
      {
        url: '/images/og-dafel-landing.webp',
        width: 1200,
        height: 630,
        alt: 'Dafel Technologies - Consultoría Actuarial'
      }
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dafel Technologies - Consultoría Actuarial con IA',
    description: 'Análisis actuarial avanzado con 5-15 años de datos históricos',
    images: ['/images/twitter-dafel-landing.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
```

### 8.2 Analytics Integration

```typescript
// src/lib/analytics.ts
export const analytics = {
  track: (eventName: string, properties?: Record<string, any>) => {
    // Google Analytics 4
    gtag('event', eventName, properties);
    
    // Custom analytics for B2B lead tracking
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        ...properties,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
      });
    }
  },
  
  trackFormSubmission: (formType: string, data: Partial<ContactFormData>) => {
    analytics.track('form_submission', {
      form_type: formType,
      company_size: data.company,
      services_interest: data.servicesOfInterest?.join(','),
      urgency: data.urgency,
    });
  },
  
  trackPageView: (pagePath: string) => {
    gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: pagePath,
    });
  },
};
```

---

## 9. DEPLOYMENT Y ENVIRONMENT

### 9.1 Environment Variables

```bash
# .env.example
# Application
NEXT_PUBLIC_APP_URL=https://dafel.com.mx
NEXT_PUBLIC_API_URL=https://api.dafel.com.mx

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=XXXXXXX

# Contact Form
NEXT_PUBLIC_CONTACT_EMAIL=contacto@dafel.com.mx
CONTACT_FORM_WEBHOOK_URL=https://api.dafel.com.mx/contact
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXXX

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_CHAT_WIDGET=false
NEXT_PUBLIC_SHOW_PRICING=true

# External Services
LOTTIE_CDN_URL=https://cdn.dafel.com.mx/animations
IMAGES_CDN_URL=https://images.dafel.com.mx
```

### 9.2 Build Optimization

```javascript
// next.config.js additions for production
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... existing config
  
  compress: true,
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Bundle size optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.vendor = {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10,
        reuseExistingChunk: true,
      };
    }
    
    return config;
  },
});
```

---

## 10. TESTING STRATEGY

### 10.1 Component Testing Setup

```typescript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
```

### 10.2 E2E Testing with Playwright

```typescript
// tests/e2e/landing-page.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load hero section correctly', async ({ page }) => {
    await page.goto('/new');
    
    // Check hero content
    await expect(page.locator('h1')).toContainText('Dafel Technologies');
    await expect(page.locator('[data-testid="hero-cta"]')).toBeVisible();
    
    // Check historical data mention
    await expect(page.locator('text=5-15 años')).toBeVisible();
  });
  
  test('should submit contact form', async ({ page }) => {
    await page.goto('/new');
    
    // Fill contact form
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="company-input"]', 'Test Company');
    
    // Submit form
    await page.click('[data-testid="submit-button"]');
    
    // Check success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
});
```

---

## 11. CONCLUSIÓN ARQUITECTÓNICA

### 11.1 Escalabilidad Garantizada

1. **Modular Architecture**: Componentes independientes y reutilizables
2. **Type Safety**: TypeScript completo para reducir errores
3. **Performance**: Code splitting, lazy loading, image optimization
4. **Maintainability**: Patrones consistentes y documentación clara
5. **Testing**: Estrategia de testing completa (unit + e2e)

### 11.2 B2B Optimization Features

- **Lead Capture**: Formularios optimizados para conversión
- **Trust Building**: Testimonios, certificaciones, experiencia
- **Technical Credibility**: Diferenciador de 5-15 años de análisis histórico
- **Professional Design**: UI corporativa para empresas medianas/grandes
- **Analytics**: Tracking detallado de leads y conversiones

### 11.3 Next Steps for Implementation

1. **Setup Project Structure** (Day 1)
2. **Implement UI Components** (Days 2-3)  
3. **Build Landing Sections** (Days 4-6)
4. **Form Integration & APIs** (Days 7-8)
5. **Animations & Polish** (Days 9-10)
6. **Testing & Optimization** (Days 11-12)
7. **Deployment & Analytics** (Days 13-14)

**TOTAL ESTIMATED TIME**: 14 días de desarrollo
**ARCHITECTURE STATUS**: ✅ COMPLETE & PRODUCTION-READY

---

*Documento generado por Arquitecto Senior*  
*Dafel Technologies Landing Page Architecture*  
*Versión 1.0 - Octubre 2025*
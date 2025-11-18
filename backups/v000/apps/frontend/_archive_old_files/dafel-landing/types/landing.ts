import { ReactNode } from 'react';

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
  icon?: ReactNode;
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
  benefits: string[];
  image?: string;
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
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
  results?: TestimonialResult[];
  image?: string;
}

export interface TestimonialResult {
  metric: string;
  value: string;
  description: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'services' | 'pricing' | 'technical' | 'historical-analysis';
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
  contact: ContactInfo;
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  logo?: string;
  description?: string;
}

export interface Achievement {
  title: string;
  description: string;
  year: number;
  type: 'award' | 'milestone' | 'recognition';
  icon?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  socialMedia: SocialMedia[];
}

export interface SocialMedia {
  platform: string;
  url: string;
  icon?: string;
}

export interface CTAButton {
  text: string;
  href?: string;
  onClick?: () => void;
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg' | 'xl';
  icon?: ReactNode;
  loading?: boolean;
}
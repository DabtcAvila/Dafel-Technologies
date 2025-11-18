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
  yearsOfReports?: '3-5' | '6-10' | '10+';
  currentChallenge?: string;
}

export interface QuoteRequestData extends ContactFormData {
  projectType: 'actuarial-analysis' | 'compliance-audit' | 'risk-assessment' | 'historical-transformation' | 'custom';
  dataVolume: 'small' | 'medium' | 'large' | 'enterprise';
  timeline: string;
  historicalDataYears?: number;
  regulatoryRequirements: string[];
  expectedROI?: string;
  currentSoftware?: string[];
}

export interface NewsletterSignupData {
  email: string;
  interests?: string[];
  frequency?: 'weekly' | 'monthly' | 'quarterly';
  companySize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
}

export interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
  className?: string;
  rows?: number; // for textarea
}
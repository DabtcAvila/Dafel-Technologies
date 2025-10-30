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
  assignedConsultant?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface QuoteRequestResponse extends ContactSubmissionResponse {
  quoteId: string;
  estimatedQuoteDate: string;
  requiredDocuments?: string[];
  preliminaryEstimate?: {
    range: string;
    factors: string[];
  };
}

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp: string;
  page: string;
}

export interface LeadTrackingData {
  source: string;
  medium: string;
  campaign?: string;
  formType: string;
  companySize?: string;
  industry?: string;
  budgetRange?: string;
}

export interface NewsletterResponse {
  subscriptionId: string;
  confirmed: boolean;
  preferences: {
    frequency: string;
    topics: string[];
  };
}
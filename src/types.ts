export type Language = 'en' | 'ar';

export type WorkMode = 'local' | 'cloud' | 'hybrid';

export type NavigationTab = 'dashboard' | 'ai-analyzer' | 'opportunities' | 'cloud-sync' | 'security' | 'payments' | 'settings';

export type OpportunityStatus = 'new' | 'accepted' | 'saved' | 'ignored' | 'suspicious';

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  source?: string;
  category: string;
  payoutValue: number;
  rawPayoutUSD: number;
  reward?: number;
  score?: number;
  riskScore?: number;
  status?: OpportunityStatus;
  createdAt?: number;
  sourceReliability: number;
  executionDurationDays: number;
  executionDurationScore: number;
  descriptionClarity: number;
  antiFraudScore: number;
  totalScore: number;
  riskLevel: 'Verified' | 'Low Risk' | 'Medium Risk' | 'High Risk';
  description: string;
  verified: boolean;
  date: string;
  location: string;
  requiredSkills: string[];
  applyUrl?: string;
  sourceUrl?: string;
  jobType?: string;
  salaryText?: string;
}

export interface ScoreInput {
  sourceReliability: number;
  payoutValue: number;
  executionDuration: number;
  descriptionClarity: number;
  antiFraudFilter: number;
}

export interface ScoreBreakdown {
  sourceReliabilityWeighted: number;
  payoutValueWeighted: number;
  executionDurationWeighted: number;
  descriptionClarityWeighted: number;
  antiFraudFilterWeighted: number;
  totalScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  riskLevel: 'Verified' | 'Low Risk' | 'Medium Risk' | 'High Risk';
}

export interface SyncLog {
  id: string;
  timestamp: string;
  type: 'backup' | 'sync' | 'restore';
  mode: WorkMode;
  status: 'success' | 'pending' | 'failed';
  size: string;
  details: string;
}

export interface SecurityAuditItem {
  id: string;
  timestamp: string;
  event: string;
  category: 'Biometric' | 'Encryption' | 'Network' | 'Auth';
  status: 'pass' | 'warning' | 'info';
}

export interface PaymentMethod {
  id: string;
  type: 'bank' | 'wallet' | 'card';
  name: string;
  provider: string;
  accountNumber: string;
  balance: number;
  currency: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: 'completed' | 'processing' | 'failed';
  type: 'payout' | 'deposit' | 'subscription' | 'fee';
}

export interface AIAnalysisRequest {
  text: string;
  analysisType: 'comprehensive' | 'scam-check' | 'skills' | 'scoring';
}

export interface AIAnalysisResult {
  summary: string;
  score: number;
  riskAssessment: string;
  keyDeliverables: string[];
  suggestedSkills: string[];
  recommendation: string;
}

export type Language = 'en' | 'ar';

export type WorkMode = 'local' | 'cloud' | 'hybrid';

export type NavigationTab = 
  | 'dashboard'
  | 'ai-analyzer'
  | 'opportunities'
  | 'cloud-sync'
  | 'security'
  | 'payments'
  | 'settings';

export type OpportunityStatus = 'new' | 'accepted' | 'saved' | 'ignored' | 'suspicious';

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  source?: string;
  category: string;
  payoutValue: number; // Raw value or percentage rating
  rawPayoutUSD: number;
  reward?: number;
  score?: number;
  riskScore?: number;
  status?: OpportunityStatus;
  createdAt?: number;
  sourceReliability: number; // 0-100
  executionDurationDays: number;
  executionDurationScore: number; // 0-100 derived
  descriptionClarity: number; // 0-100
  antiFraudScore: number; // 0-100
  totalScore: number;
  riskLevel: 'Verified' | 'Low Risk' | 'Medium Risk' | 'High Risk';
  description: string;
  verified: boolean;
  date: string;
  location: string;
  requiredSkills: string[];
}

export interface ScoreInput {
  sourceReliability: number; // 0 - 100 (35%)
  payoutValue: number;       // 0 - 100 (25%)
  executionDuration: number; // 0 - 100 (15%)
  descriptionClarity: number;// 0 - 100 (10%)
  antiFraudFilter: number;   // 0 - 100 (15%)
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

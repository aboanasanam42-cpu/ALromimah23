import { Opportunity } from '../types';

/**
 * Port of com.marium.aiworkspace.ai.analyzer.AIOpportunityAnalyzer
 * Fraud Detection Rules & AI Scoring Engine
 */
export function analyzeAndScoreOpportunity(opportunity: Opportunity): Opportunity {
  let baseScore = 70;
  let riskScore = 0;

  const descLower = (opportunity.description || '').toLowerCase();
  const titleLower = (opportunity.title || '').toLowerCase();

  // 1. Fraud Detection Rules (قواعد كشف الاحتيال)
  const suspiciousKeywords = [
    'ادفع أولاً',
    'pay first',
    'أرباح خيالية',
    'guaranteed 1000%',
    'تحويل غير آمن',
    'طلب دفع مسبق',
    'معالجة رسوم إدارية',
    'دفع مقدم'
  ];

  for (const keyword of suspiciousKeywords) {
    if (descLower.includes(keyword) || titleLower.includes(keyword)) {
      riskScore += 40;
      baseScore -= 30;
    }
  }

  const reward = opportunity.reward ?? opportunity.rawPayoutUSD ?? 0;
  if (reward > 5000) { // Unrealistic rewards for micro-tasks / fraud risk
    riskScore += 25;
    baseScore -= 15;
  }

  if (opportunity.description && opportunity.description.trim().length < 20) { // Lack of client details
    riskScore += 20;
    baseScore -= 10;
  }

  // 2. Score evaluation based on source & reward
  if (reward >= 50.0) baseScore += 15;
  const sourceName = opportunity.source || opportunity.company;
  if (sourceName && sourceName.trim().length > 0) baseScore += 10;

  const finalScore = Math.min(100, Math.max(0, baseScore - riskScore));
  const finalRisk = Math.min(100, Math.max(0, riskScore));

  let status = opportunity.status || 'new';
  if (finalRisk >= 50) {
    status = 'suspicious';
  }

  const riskLevel = finalRisk >= 50
    ? 'High Risk'
    : finalScore >= 85
    ? 'Verified'
    : finalScore >= 70
    ? 'Low Risk'
    : 'Medium Risk';

  return {
    ...opportunity,
    source: sourceName || 'CloudWorker Network',
    company: sourceName || 'CloudWorker Network',
    reward: reward,
    rawPayoutUSD: reward,
    score: finalScore,
    totalScore: finalScore,
    riskScore: finalRisk,
    status: status,
    riskLevel: riskLevel,
    verified: riskLevel === 'Verified' || riskLevel === 'Low Risk',
    createdAt: opportunity.createdAt || Date.now()
  };
}

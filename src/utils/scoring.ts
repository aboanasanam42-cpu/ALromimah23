import { ScoreInput, ScoreBreakdown } from '../types';

/**
 * Port of com.marium.aiworkspace.ai.scoring.ScoringEngine
 * 100-Point Evaluation Scoring Algorithm
 * 
 * - Source Reliability (35%)
 * - Payout Value (25%)
 * - Execution Duration (15%)
 * - Description Clarity (10%)
 * - Anti-Fraud/Scam Filter (15%)
 */
export function calculate100PointScore(input: ScoreInput): ScoreBreakdown {
  const sourceReliabilityWeighted = (input.sourceReliability * 0.35);
  const payoutValueWeighted = (input.payoutValue * 0.25);
  const executionDurationWeighted = (input.executionDuration * 0.15);
  const descriptionClarityWeighted = (input.descriptionClarity * 0.10);
  const antiFraudFilterWeighted = (input.antiFraudFilter * 0.15);

  const totalScore = Math.min(100, Math.max(0, parseFloat((
    sourceReliabilityWeighted +
    payoutValueWeighted +
    executionDurationWeighted +
    descriptionClarityWeighted +
    antiFraudFilterWeighted
  ).toFixed(1))));

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (totalScore >= 92) grade = 'A+';
  else if (totalScore >= 82) grade = 'A';
  else if (totalScore >= 72) grade = 'B';
  else if (totalScore >= 62) grade = 'C';
  else if (totalScore >= 50) grade = 'D';
  else grade = 'F';

  let riskLevel: 'Verified' | 'Low Risk' | 'Medium Risk' | 'High Risk' = 'High Risk';
  if (input.antiFraudFilter >= 90 && totalScore >= 85) {
    riskLevel = 'Verified';
  } else if (totalScore >= 75 && input.antiFraudFilter >= 70) {
    riskLevel = 'Low Risk';
  } else if (totalScore >= 55 && input.antiFraudFilter >= 50) {
    riskLevel = 'Medium Risk';
  } else {
    riskLevel = 'High Risk';
  }

  return {
    sourceReliabilityWeighted: parseFloat(sourceReliabilityWeighted.toFixed(1)),
    payoutValueWeighted: parseFloat(payoutValueWeighted.toFixed(1)),
    executionDurationWeighted: parseFloat(executionDurationWeighted.toFixed(1)),
    descriptionClarityWeighted: parseFloat(descriptionClarityWeighted.toFixed(1)),
    antiFraudFilterWeighted: parseFloat(antiFraudFilterWeighted.toFixed(1)),
    totalScore,
    grade,
    riskLevel,
  };
}

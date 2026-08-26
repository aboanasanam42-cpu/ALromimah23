package com.marium.aiworkspace.ai.scoring

data class OpportunityScoringInput(
    val title: String,
    val description: String,
    val rawPayoutUSD: Double,
    val executionDays: Int,
    val clientVerificationStatus: Boolean,
    val sourcePlatformRating: Double = 4.5,
    val requiredSkillsCount: Int = 3
)

data class OpportunityScoreResult(
    val totalScore: Double,
    val sourceReliabilityScore: Double,
    val payoutValueScore: Double,
    val executionDurationScore: Double,
    val descriptionClarityScore: Double,
    val antiFraudScore: Double,
    val riskLevel: RiskLevel,
    val isVerified: Boolean,
    val breakdownNotes: List<String>
)

enum class RiskLevel {
    VERIFIED,
    LOW_RISK,
    MEDIUM_RISK,
    HIGH_RISK
}

class ScoringEngine {

    /**
     * 100-point mathematical evaluation matrix:
     * - 1. Source Reliability (30% weight, max 30 pts)
     * - 2. Payout Value & Fairness (25% weight, max 25 pts)
     * - 3. Execution Duration Feasibility (15% weight, max 15 pts)
     * - 4. Description Clarity & Completeness (15% weight, max 15 pts)
     * - 5. Anti-Fraud / Scam Filtration (15% weight, max 15 pts)
     */
    fun evaluate(input: OpportunityScoringInput): OpportunityScoreResult {
        val notes = mutableListOf<String>()

        // 1. Source Reliability (Max 30)
        var sourcePoints = (input.sourcePlatformRating.coerceIn(0.0, 5.0) / 5.0) * 20.0
        if (input.clientVerificationStatus) {
            sourcePoints += 10.0
            notes.add("جهة العمل موثقة بهوية تجارية معتمدة (+10)")
        } else {
            notes.add("حساب جهة العمل غير مؤكد رسمياً")
        }
        val sourceScore = sourcePoints.coerceIn(0.0, 30.0)

        // 2. Payout Value & Fairness (Max 25)
        // Rate per day calculation
        val dailyRate = if (input.executionDays > 0) input.rawPayoutUSD / input.executionDays else input.rawPayoutUSD
        val payoutPoints = when {
            input.rawPayoutUSD <= 0.0 -> 0.0
            dailyRate in 25.0..300.0 -> 25.0 // Healthy realistic remote range
            dailyRate > 300.0 -> 18.0 // High payout triggers scrutiny
            else -> (dailyRate / 25.0) * 20.0
        }
        val payoutScore = payoutPoints.coerceIn(0.0, 25.0)

        // 3. Execution Duration Feasibility (Max 15)
        val durationPoints = when (input.executionDays) {
            in 1..14 -> 15.0 // Ideal agile sprint
            in 15..30 -> 12.0
            in 31..60 -> 9.0
            else -> 6.0
        }
        val durationScore = durationPoints.coerceIn(0.0, 15.0)

        // 4. Description Clarity (Max 15)
        var clarityPoints = 0.0
        val descLength = input.description.trim().length
        if (descLength > 150) clarityPoints += 8.0
        else if (descLength > 50) clarityPoints += 4.0

        if (input.requiredSkillsCount >= 2) clarityPoints += 4.0
        if (input.title.trim().length >= 10) clarityPoints += 3.0
        val clarityScore = clarityPoints.coerceIn(0.0, 15.0)

        // 5. Anti-Fraud & Scam Filtration (Max 15 with severe penalties)
        val lowerText = (input.title + " " + input.description).lowercase()
        var fraudPoints = 15.0

        val scamKeywords = listOf(
            "deposit", "telegram", "whatsapp first", "send usdt", "guaranteed profit",
            "no experience needed earn 5000", "pay registration fee", "تحويل مالي مسبق",
            "تليجرام فقط", "دفع رسوم تسجيل", "أرباح مضمونة 100%"
        )

        for (kw in scamKeywords) {
            if (lowerText.contains(kw)) {
                fraudPoints -= 8.0
                notes.add("تحذير أمني: تم رصد عبارة اشتباه احتيال ($kw)")
            }
        }
        val fraudScore = fraudPoints.coerceIn(0.0, 15.0)

        val total = (sourceScore + payoutScore + durationScore + clarityScore + fraudScore).coerceIn(0.0, 100.0)

        val riskLevel = when {
            total >= 88.0 && fraudScore >= 12.0 -> RiskLevel.VERIFIED
            total >= 70.0 -> RiskLevel.LOW_RISK
            total >= 50.0 -> RiskLevel.MEDIUM_RISK
            else -> RiskLevel.HIGH_RISK
        }

        return OpportunityScoreResult(
            totalScore = Math.round(total * 10.0) / 10.0,
            sourceReliabilityScore = Math.round(sourceScore * 10.0) / 10.0,
            payoutValueScore = Math.round(payoutScore * 10.0) / 10.0,
            executionDurationScore = Math.round(durationScore * 10.0) / 10.0,
            descriptionClarityScore = Math.round(clarityScore * 10.0) / 10.0,
            antiFraudScore = Math.round(fraudScore * 10.0) / 10.0,
            riskLevel = riskLevel,
            isVerified = riskLevel == RiskLevel.VERIFIED,
            breakdownNotes = notes
        )
    }
}

package com.marium.aiworkspace.data.model

import java.util.Date

data class AIAnalysisResult(
    val opportunityId: String = "",
    val legitimacyScore: Int = 50,
    val riskLevel: String = "low", // low, medium, high
    val redFlags: List<String> = emptyList(),
    val greenFlags: List<String> = emptyList(),
    val advice: String = "",
    val estimatedEarnings: String = "",
    val recommendedAction: String = "",
    val scamProbability: Double = 0.0,
    val analyzedAt: Date = Date()
)

package com.marium.aiworkspace.data.model

data class AIAnalysisResult(
    val summary: String = "",
    val pros: List<String> = emptyList(),
    val cons: List<String> = emptyList(),
    val riskLevel: String = "low", // low, medium, high
    val estimatedEarnings: String = "",
    val recommendedAction: String = "",
    val scamProbability: Double = 0.0,
    val timeToComplete: String = "",
    val requiredSkills: List<String> = emptyList()
)

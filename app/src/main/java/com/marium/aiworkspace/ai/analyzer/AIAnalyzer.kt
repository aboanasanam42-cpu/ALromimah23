package com.marium.aiworkspace.ai.analyzer

import android.util.Log
import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.content
import com.marium.aiworkspace.BuildConfig
import com.marium.aiworkspace.data.model.AIAnalysisResult
import com.marium.aiworkspace.data.model.Opportunity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject

/**
 * Real AI Analyzer using Gemini API.
 * Analyzes job opportunities for legitimacy and provides insights.
 */
class AIAnalyzer {

    companion object {
        private const val TAG = "AIAnalyzer"
        private const val MODEL_NAME = "gemini-1.5-flash"
        // Replace with your actual API key or load from BuildConfig
        private val API_KEY = BuildConfig.GEMINI_API_KEY
    }

    private val generativeModel by lazy {
        GenerativeModel(
            modelName = MODEL_NAME,
            apiKey = API_KEY
        )
    }

    /**
     * Analyze an opportunity and return a structured result.
     */
    suspend fun analyzeOpportunity(opportunity: Opportunity): Result<AIAnalysisResult> = withContext(Dispatchers.IO) {
        try {
            val prompt = buildAnalysisPrompt(opportunity)

            val response = generativeModel.generateContent(
                content {
                    text(prompt)
                }
            )

            val text = response.text ?: return@withContext Result.failure(Exception("Empty response from AI"))
            val result = parseAnalysisResponse(text, opportunity.id)
            Result.success(result)
        } catch (e: Exception) {
            Log.e(TAG, "AI analysis failed", e)
            Result.failure(e)
        }
    }

    /**
     * Quick legitimacy score without full analysis.
     */
    suspend fun quickScore(opportunity: Opportunity): Int = withContext(Dispatchers.IO) {
        try {
            val prompt = """
                Rate the legitimacy of this job opportunity on a scale of 0-100.
                Title: ${opportunity.title}
                Company: ${opportunity.company}
                Pay: ${opportunity.salary}
                Description: ${opportunity.description.take(500)}
                
                Return ONLY a number between 0 and 100.
            """.trimIndent()

            val response = generativeModel.generateContent(content { text(prompt) })
            val text = response.text?.trim() ?: "50"
            text.toIntOrNull()?.coerceIn(0, 100) ?: 50
        } catch (e: Exception) {
            Log.e(TAG, "Quick score failed", e)
            50
        }
    }

    private fun buildAnalysisPrompt(opportunity: Opportunity): String {
        return """
            Analyze this remote job opportunity and provide a JSON response with these fields:
            - legitimacyScore (0-100): How legitimate this opportunity appears
            - riskLevel ("low", "medium", "high"): Risk assessment
            - redFlags (array of strings): Any warning signs
            - greenFlags (array of strings): Positive indicators
            - advice (string): Personalized advice for the applicant
            - estimatedEarnings (string): Realistic monthly earnings estimate
            - scamProbability (0.0-1.0): Probability this is a scam
            
            Opportunity Details:
            Title: ${opportunity.title}
            Company: ${opportunity.company}
            Description: ${opportunity.description}
            Pay: ${opportunity.salary}
            Skills Required: ${opportunity.skills.joinToString()}
            
            Return ONLY valid JSON, no markdown formatting.
        """.trimIndent()
    }

    private fun parseAnalysisResponse(text: String, opportunityId: String): AIAnalysisResult {
        // Clean up the response - remove markdown code blocks if present
        val cleanText = text
            .replace("```json", "")
            .replace("```", "")
            .trim()

        val json = JSONObject(cleanText)

        return AIAnalysisResult(
            opportunityId = opportunityId,
            legitimacyScore = json.optInt("legitimacyScore", 50),
            riskLevel = json.optString("riskLevel", "medium"),
            redFlags = parseStringArray(json, "redFlags"),
            greenFlags = parseStringArray(json, "greenFlags"),
            advice = json.optString("advice", ""),
            estimatedEarnings = json.optString("estimatedEarnings", ""),
            scamProbability = json.optDouble("scamProbability", 0.0),
            analyzedAt = java.util.Date()
        )
    }

    /**
     * Calculate AI score (0-100) for an opportunity.
     */
    fun calculateAIScore(opportunity: Opportunity): Double {
        var score = 50.0
        if (opportunity.salary.isNotBlank()) score += 10
        if (opportunity.skills.isNotEmpty()) score += 10
        if (opportunity.description.length > 100) score += 10
        if (opportunity.company.isNotBlank()) score += 10
        if (opportunity.reliabilityScore > 0.5) score += 10
        return score.coerceIn(0.0, 100.0)
    }

    private fun parseStringArray(json: JSONObject, key: String): List<String> {
        val array = json.optJSONArray(key)
        val list = mutableListOf<String>()
        if (array != null) {
            for (i in 0 until array.length()) {
                list.add(array.getString(i))
            }
        }
        return list
    }
}

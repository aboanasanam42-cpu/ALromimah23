package com.marium.aiworkspace.ai.analyzer

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

data class AIAnalysisResult(
    val summary: String,
    val score: Int,
    val riskAssessment: String,
    val keyDeliverables: List<String>,
    val suggestedSkills: List<String>,
    val recommendation: String,
    val rawResponse: String
)

data class AIProposalResult(
    val coverLetter: String,
    val proposedPrice: Double,
    val deliveryDays: Int,
    val milestones: List<String>,
    val clientQuestions: List<String>
)

data class TranslatedJobResult(
    val title: String,
    val description: String,
    val targetLang: String
)

class AIAnalyzer(private val baseUrl: String = "https://a-lromimah23.vercel.app") {

    suspend fun translateJob(
        title: String,
        description: String,
        targetLang: String
    ): Result<TranslatedJobResult> = withContext(Dispatchers.IO) {
        var connection: HttpURLConnection? = null
        try {
            val url = URL("$baseUrl/api/translate")
            connection = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                setRequestProperty("Content-Type", "application/json; charset=UTF-8")
                setRequestProperty("Accept", "application/json")
                doOutput = true
                doInput = true
                connectTimeout = 20_000
                readTimeout = 20_000
            }

            val payload = JSONObject().apply {
                put("title", title)
                put("description", description)
                put("targetLang", targetLang)
            }

            OutputStreamWriter(connection.outputStream, "UTF-8").use { writer ->
                writer.write(payload.toString())
                writer.flush()
            }

            val responseCode = connection.responseCode
            val responseStream = if (responseCode in 200..299) {
                connection.inputStream
            } else {
                connection.errorStream ?: connection.inputStream
            }

            val responseText = BufferedReader(InputStreamReader(responseStream, "UTF-8")).use { it.readText() }
            if (responseCode !in 200..299) {
                return@withContext Result.failure(Exception("HTTP Error $responseCode: $responseText"))
            }

            val json = JSONObject(responseText)
            Result.success(
                TranslatedJobResult(
                    title = json.optString("title", title),
                    description = json.optString("description", description),
                    targetLang = json.optString("targetLang", targetLang)
                )
            )
        } catch (e: Exception) {
            Result.failure(e)
        } finally {
            connection?.disconnect()
        }
    }

    suspend fun analyzeText(text: String, analysisType: String = "comprehensive"): Result<AIAnalysisResult> = withContext(Dispatchers.IO) {
        var connection: HttpURLConnection? = null
        try {
            val url = URL("$baseUrl/api/analyze")
            connection = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                setRequestProperty("Content-Type", "application/json; charset=UTF-8")
                setRequestProperty("Accept", "application/json")
                doOutput = true
                doInput = true
                connectTimeout = 20_000
                readTimeout = 20_000
            }

            val payload = JSONObject().apply {
                put("text", text)
                put("analysisType", analysisType)
            }

            OutputStreamWriter(connection.outputStream, "UTF-8").use { writer ->
                writer.write(payload.toString())
                writer.flush()
            }

            val responseCode = connection.responseCode
            val responseStream = if (responseCode in 200..299) {
                connection.inputStream
            } else {
                connection.errorStream ?: connection.inputStream
            }

            val responseText = BufferedReader(InputStreamReader(responseStream, "UTF-8")).use { it.readText() }

            if (responseCode !in 200..299) {
                return@withContext Result.failure(Exception("HTTP Error $responseCode: $responseText"))
            }

            val json = JSONObject(responseText)
            val resultObj = json.optJSONObject("result") ?: JSONObject()

            val deliverablesList = mutableListOf<String>()
            val deliverablesArray = resultObj.optJSONArray("keyDeliverables") ?: JSONArray()
            for (i in 0 until deliverablesArray.length()) {
                deliverablesList.add(deliverablesArray.getString(i))
            }

            val skillsList = mutableListOf<String>()
            val skillsArray = resultObj.optJSONArray("suggestedSkills") ?: JSONArray()
            for (i in 0 until skillsArray.length()) {
                skillsList.add(skillsArray.getString(i))
            }

            val analysis = AIAnalysisResult(
                summary = resultObj.optString("summary", "تم إكمال التحليل الذكي بنجاح."),
                score = resultObj.optInt("score", 85),
                riskAssessment = resultObj.optString("riskAssessment", "موثوق - منخفض المخاطر"),
                keyDeliverables = if (deliverablesList.isNotEmpty()) deliverablesList else listOf("مراجعة المتطلبات وتجهيز خطة العمل"),
                suggestedSkills = if (skillsList.isNotEmpty()) skillsList else listOf("العمل عن بعد", "إدارة المشاريع"),
                recommendation = resultObj.optString("recommendation", "المشروع يفي بالمعايير الفنية، يمكن التقدم الآن."),
                rawResponse = responseText
            )

            Result.success(analysis)
        } catch (e: Exception) {
            Result.failure(e)
        } finally {
            connection?.disconnect()
        }
    }

    suspend fun generateProposal(
        title: String,
        category: String,
        client: String,
        reward: Double,
        description: String
    ): Result<AIProposalResult> = withContext(Dispatchers.IO) {
        var connection: HttpURLConnection? = null
        try {
            val url = URL("$baseUrl/api/proposal/generate")
            connection = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                setRequestProperty("Content-Type", "application/json; charset=UTF-8")
                setRequestProperty("Accept", "application/json")
                doOutput = true
                doInput = true
                connectTimeout = 20_000
                readTimeout = 20_000
            }

            val payload = JSONObject().apply {
                put("opportunityTitle", title)
                put("category", category)
                put("client", client)
                put("reward", reward)
                put("description", description)
            }

            OutputStreamWriter(connection.outputStream, "UTF-8").use { writer ->
                writer.write(payload.toString())
                writer.flush()
            }

            val responseCode = connection.responseCode
            val responseStream = if (responseCode in 200..299) {
                connection.inputStream
            } else {
                connection.errorStream ?: connection.inputStream
            }

            val responseText = BufferedReader(InputStreamReader(responseStream, "UTF-8")).use { it.readText() }
            if (responseCode !in 200..299) {
                return@withContext Result.failure(Exception("HTTP Error $responseCode: $responseText"))
            }

            val json = JSONObject(responseText)
            val proposal = json.optJSONObject("proposal") ?: JSONObject()

            val milestones = mutableListOf<String>()
            val mArray = proposal.optJSONArray("milestones") ?: JSONArray()
            for (i in 0 until mArray.length()) {
                milestones.add(mArray.getString(i))
            }

            val questions = mutableListOf<String>()
            val qArray = proposal.optJSONArray("clientQuestions") ?: JSONArray()
            for (i in 0 until qArray.length()) {
                questions.add(qArray.getString(i))
            }

            val result = AIProposalResult(
                coverLetter = proposal.optString("coverLetter", "مرحباً، يسعدني تنفيذ المشروع بأعلى جودة."),
                proposedPrice = proposal.optDouble("proposedPrice", reward),
                deliveryDays = proposal.optInt("deliveryDays", 3),
                milestones = milestones,
                clientQuestions = questions
            )

            Result.success(result)
        } catch (e: Exception) {
            Result.failure(e)
        } finally {
            connection?.disconnect()
        }
    }
}

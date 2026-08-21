package com.marium.aiworkspace.opportunities.data

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

data class RemoteOpportunity(
    val id: String,
    val title: String,
    val company: String,
    val description: String,
    val location: String,
    val url: String,
    val source: String,
    val salary: String
)

class OpportunityDataSource {
    suspend fun fetchOpportunities(query: String = ""): List<RemoteOpportunity> = withContext(Dispatchers.IO) {
        val result = mutableListOf<RemoteOpportunity>()
        runCatching { fetchRemotive(query) }.onSuccess { result += it }
        runCatching { fetchJobicy(query) }.onSuccess { result += it }
        result.distinctBy { "${it.title.lowercase()}|${it.company.lowercase()}" }
    }

    private fun get(url: String): String {
        val connection = (URL(url).openConnection() as HttpURLConnection).apply {
            requestMethod = "GET"
            connectTimeout = 12_000
            readTimeout = 12_000
            setRequestProperty("Accept", "application/json")
            setRequestProperty("User-Agent", "Marium-AI-Workspace/2.0")
        }
        return try {
            if (connection.responseCode !in 200..299) error("HTTP ${connection.responseCode}")
            connection.inputStream.bufferedReader().use { it.readText() }
        } finally {
            connection.disconnect()
        }
    }

    private fun clean(value: String): String = value
        .replace(Regex("<[^>]*>"), " ")
        .replace(Regex("\\s+"), " ")
        .trim()

    private fun fetchRemotive(query: String): List<RemoteOpportunity> {
        val suffix = if (query.isBlank()) "" else "&search=${URLEncoder.encode(query, "UTF-8")}"
        val jobs = JSONObject(get("https://remotive.com/api/remote-jobs?limit=100$suffix"))
            .optJSONArray("jobs") ?: JSONArray()
        return (0 until jobs.length()).mapNotNull { i ->
            val j = jobs.optJSONObject(i) ?: return@mapNotNull null
            RemoteOpportunity(
                id = "remotive-${j.optString("id")}",
                title = j.optString("title", "فرصة عمل عن بُعد"),
                company = j.optString("company_name", "غير محدد"),
                description = clean(j.optString("description")),
                location = j.optString("candidate_required_location", "عالمي"),
                url = j.optString("url"),
                source = "Remotive",
                salary = j.optString("salary", "غير محدد")
            )
        }
    }

    private fun fetchJobicy(query: String): List<RemoteOpportunity> {
        val suffix = if (query.isBlank()) "" else "&tag=${URLEncoder.encode(query, "UTF-8")}"
        val jobs = JSONObject(get("https://jobicy.com/api/v2/remote-jobs?count=100$suffix"))
            .optJSONArray("jobs") ?: JSONArray()
        return (0 until jobs.length()).mapNotNull { i ->
            val j = jobs.optJSONObject(i) ?: return@mapNotNull null
            val min = j.optString("salaryMin")
            val max = j.optString("salaryMax")
            val currency = j.optString("salaryCurrency", "USD")
            RemoteOpportunity(
                id = "jobicy-${j.optString("id")}",
                title = j.optString("jobTitle", "فرصة عمل عن بُعد"),
                company = j.optString("companyName", "غير محدد"),
                description = clean(j.optString("jobDescription", j.optString("jobExcerpt"))),
                location = j.optString("jobGeo", "عالمي"),
                url = j.optString("url"),
                source = "Jobicy",
                salary = if (min.isNotBlank() || max.isNotBlank()) "$min - $max $currency" else "غير محدد"
            )
        }
    }
}

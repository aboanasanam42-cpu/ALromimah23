package com.marium.aiworkspace.opportunities.presentation

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.OpenInBrowser
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Translate
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.marium.aiworkspace.opportunities.data.OpportunityDataSource
import com.marium.aiworkspace.opportunities.data.RemoteOpportunity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

private data class JobTranslation(
    val title: String,
    val description: String
)

private suspend fun translateOpportunityText(
    title: String,
    description: String,
    targetLang: String
): Result<JobTranslation> = withContext(Dispatchers.IO) {
    var connection: HttpURLConnection? = null
    try {
        val url = URL("https://a-lromimah23.vercel.app/api/translate")
        val conn = (url.openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            setRequestProperty("Content-Type", "application/json; charset=UTF-8")
            setRequestProperty("Accept", "application/json")
            doOutput = true
            doInput = true
            connectTimeout = 20_000
            readTimeout = 20_000
        }
        connection = conn

        val payload = JSONObject().apply {
            put("title", title)
            put("description", description)
            put("targetLang", targetLang)
        }

        OutputStreamWriter(conn.outputStream, "UTF-8").use { writer ->
            writer.write(payload.toString())
            writer.flush()
        }

        val responseCode = conn.responseCode
        val stream = if (responseCode in 200..299) {
            conn.inputStream
        } else {
            conn.errorStream ?: conn.inputStream
        }
        val responseText = BufferedReader(InputStreamReader(stream, "UTF-8")).use { it.readText() }

        if (responseCode !in 200..299) {
            return@withContext Result.failure(Exception("HTTP $responseCode"))
        }

        val json = JSONObject(responseText)
        Result.success(
            JobTranslation(
                title = json.optString("title", title),
                description = json.optString("description", description)
            )
        )
    } catch (e: Exception) {
        Result.failure(e)
    } finally {
        connection?.disconnect()
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OpportunitiesScreen(navController: NavController) {
    val context = LocalContext.current
    val source = remember { OpportunityDataSource() }
    val coroutineScope = rememberCoroutineScope()

    var opportunities by remember { mutableStateOf<List<RemoteOpportunity>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var message by remember { mutableStateOf("جاري تحميل الفرص الحقيقية...") }
    var refreshToken by remember { mutableIntStateOf(0) }

    var translations by remember { mutableStateOf>>(emptyMap()) }
    var activeLangByJob by remember { mutableStateOf>(emptyMap()) }
    var translatingJobId by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(refreshToken) {
        loading = true
        message = "جاري تحديث الفرص من مصادر العمل عن بُعد..."
        val result = source.fetchOpportunities()
        opportunities = result
        loading = false
        message = if (result.isEmpty()) {
            "لم يتم العثور على فرص متاحة حالياً. اضغط تحديث للمحاولة مرة أخرى."
        } else {
            "تم العثور على ${result.size} فرصة حقيقية."
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("الفرص الحقيقية") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, "رجوع")
                    }
                },
                actions = {
                    IconButton(onClick = { refreshToken++ }) {
                        Icon(Icons.Default.Refresh, "تحديث")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(12.dp)
        ) {
            Text(message, style = MaterialTheme.typography.bodyMedium)
            Spacer(Modifier.height(8.dp))
            if (loading) {
                LinearProgressIndicator(Modifier.fillMaxWidth())
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    items(opportunities, key = { it.id }) { job ->
                        var menuExpanded by remember { mutableStateOf(false) }
                        val currentMode = activeLangByJob[job.id] ?: "original"
                        val translated = translations[job.id]?.get(currentMode)
                        val displayedTitle = translated?.title ?: job.title
                        val displayedDesc = translated?.description ?: job.description
                        val isTranslating = translatingJobId == job.id

                        ElevatedCard(Modifier.fillMaxWidth()) {
                            Column(
                                Modifier.padding(14.dp),
                                verticalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.Top
                                ) {
                                    Text(
                                        text = displayedTitle,
                                        style = MaterialTheme.typography.titleMedium,
                                        modifier = Modifier.weight(1f)
                                    )

                                    Spacer(Modifier.width(8.dp))

                                    Box {
                                        OutlinedButton(
                                            onClick = { menuExpanded = true },
                                            enabled = !isTranslating,
                                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Translate,
                                                contentDescription = "ترجمة الوظيفة",
                                                modifier = Modifier.size(16.dp)
                                            )
                                            Spacer(Modifier.width(4.dp))
                                            Text(
                                                text = when {
                                                    isTranslating -> "جاري الترجمة..."
                                                    currentMode == "ar" -> "العربية"
                                                    currentMode == "en" -> "English"
                                                    else -> "اللغة"
                                                },
                                                style = MaterialTheme.typography.labelMedium
                                            )
                                        }

                                        DropdownMenu(
                                            expanded = menuExpanded,
                                            onDismissRequest = { menuExpanded = false }
                                        ) {
                                            DropdownMenuItem(
                                                text = { Text("🇾🇪 العربية") },
                                                onClick = {
                                                    menuExpanded = false
                                                    val cached = translations[job.id]?.get("ar")
                                                    if (cached != null) {
                                                        activeLangByJob = activeLangByJob + (job.id to "ar")
                                                    } else {
                                                        coroutineScope.launch {
                                                            translatingJobId = job.id
                                                            val res = translateOpportunityText(
                                                                job.title,
                                                                job.description.take(800),
                                                                "ar"
                                                            )
                                                            res.onSuccess { tr ->
                                                                val jobMap = (translations[job.id] ?: emptyMap()) + ("ar" to tr)
                                                                translations = translations + (job.id to jobMap)
                                                                activeLangByJob = activeLangByJob + (job.id to "ar")
                                                            }.onFailure {
                                                                message = "تعذر ترجمة الوظيفة حالياً، حاول مجدداً."
                                                            }
                                                            translatingJobId = null
                                                        }
                                                    }
                                                }
                                            )
                                            DropdownMenuItem(
                                                text = { Text("🇺🇸 English") },
                                                onClick = {
                                                    menuExpanded = false
                                                    val cached = translations[job.id]?.get("en")
                                                    if (cached != null) {
                                                        activeLangByJob = activeLangByJob + (job.id to "en")
                                                    } else {
                                                        coroutineScope.launch {
                                                            translatingJobId = job.id
                                                            val res = translateOpportunityText(
                                                                job.title,
                                                                job.description.take(800),
                                                                "en"
                                                            )
                                                            res.onSuccess { tr ->
                                                                val jobMap = (translations[job.id] ?: emptyMap()) + ("en" to tr)
                                                                translations = translations + (job.id to jobMap)
                                                                activeLangByJob = activeLangByJob + (job.id to "en")
                                                            }.onFailure {
                                                                message = "تعذر ترجمة الوظيفة حالياً، حاول مجدداً."
                                                            }
                                                            translatingJobId = null
                                                        }
                                                    }
                                                }
                                            )
                                            if (currentMode != "original") {
                                                DropdownMenuItem(
                                                    text = { Text("النص الأصلي") },
                                                    onClick = {
                                                        menuExpanded = false
                                                        activeLangByJob = activeLangByJob + (job.id to "original")
                                                    }
                                                )
                                            }
                                        }
                                    }
                                }

                                Text(job.company, style = MaterialTheme.typography.labelLarge)
                                Text(
                                    "المصدر: ${job.source} • الموقع: ${job.location}",
                                    style = MaterialTheme.typography.bodySmall
                                )
                                if (job.salary.isNotBlank() && job.salary != "غير محدد") {
                                    Text(
                                        "المقابل: ${job.salary}",
                                        style = MaterialTheme.typography.bodyMedium
                                    )
                                }
                                Text(
                                    displayedDesc.take(420),
                                    style = MaterialTheme.typography.bodySmall
                                )
                                Button(
                                    onClick = {
                                        if (job.url.isNotBlank()) {
                                            context.startActivity(
                                                Intent(Intent.ACTION_VIEW, Uri.parse(job.url))
                                            )
                                        }
                                    },
                                    enabled = job.url.isNotBlank()
                                ) {
                                    Icon(Icons.Default.OpenInBrowser, null)
                                    Spacer(Modifier.width(6.dp))
                                    Text("فتح التقديم الأصلي")
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

package com.marium.aiworkspace.opportunities.presentation

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.OpenInBrowser
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Translate
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.LayoutDirection
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

@Composable
private fun JobLanguageMenuButton(
    currentMode: String,
    isTranslating: Boolean,
    onSelectLang: (String) -> Unit
) {
    var menuExpanded by remember { mutableStateOf(false) }

    Box {
        OutlinedButton(
            onClick = { menuExpanded = true },
            enabled = !isTranslating,
            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
        ) {
            if (isTranslating) {
                CircularProgressIndicator(
                    modifier = Modifier.size(14.dp),
                    strokeWidth = 2.dp
                )
            } else {
                Icon(
                    imageVector = Icons.Default.Translate,
                    contentDescription = "ترجمة الوظيفة",
                    modifier = Modifier.size(16.dp)
                )
            }
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
                trailingIcon = {
                    if (currentMode == "ar") {
                        Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                    }
                },
                onClick = {
                    menuExpanded = false
                    onSelectLang("ar")
                }
            )
            DropdownMenuItem(
                text = { Text("🇺🇸 English") },
                trailingIcon = {
                    if (currentMode == "en") {
                        Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                    }
                },
                onClick = {
                    menuExpanded = false
                    onSelectLang("en")
                }
            )
            DropdownMenuItem(
                text = { Text("النص الأصلي") },
                trailingIcon = {
                    if (currentMode == "original") {
                        Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                    }
                },
                onClick = {
                    menuExpanded = false
                    onSelectLang("original")
                }
            )
        }
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
    var selectedJob by remember { mutableStateOf<RemoteOpportunity?>(null) }

    var translations by remember { mutableStateOf<Map<String, Map<String, JobTranslation>>>(emptyMap()) }
    var activeLangByJob by remember { mutableStateOf<Map<String, String>>(emptyMap()) }
    var translatingJobId by remember { mutableStateOf<String?>(null) }

    fun handleSelectLanguage(job: RemoteOpportunity, targetLang: String) {
        if (targetLang == "original") {
            activeLangByJob = activeLangByJob + (job.id to "original")
            return
        }
        val cached = translations[job.id]?.get(targetLang)
        if (cached != null) {
            activeLangByJob = activeLangByJob + (job.id to targetLang)
            return
        }
        coroutineScope.launch {
            translatingJobId = job.id
            val res = translateOpportunityText(
                title = job.title,
                description = job.description.take(1000),
                targetLang = targetLang
            )
            res.onSuccess { tr ->
                val jobMap = (translations[job.id] ?: emptyMap()) + (targetLang to tr)
                translations = translations + (job.id to jobMap)
                activeLangByJob = activeLangByJob + (job.id to targetLang)
            }.onFailure {
                message = "تعذر ترجمة الوظيفة حالياً، حاول مجدداً."
            }
            translatingJobId = null
        }
    }

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
                        Icon(Icons.Default.ArrowBack, contentDescription = "رجوع")
                    }
                },
                actions = {
                    IconButton(onClick = { refreshToken++ }) {
                        Icon(Icons.Default.Refresh, contentDescription = "تحديث")
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
                        val currentMode = activeLangByJob[job.id] ?: "original"
                        val cachedTr = if (currentMode == "ar" || currentMode == "en") {
                            translations[job.id]?.get(currentMode)
                        } else {
                            null
                        }
                        val displayedTitle = cachedTr?.title ?: job.title
                        val displayedDesc = cachedTr?.description ?: job.description
                        val isTranslating = translatingJobId == job.id
                        val contentDirection = when (currentMode) {
                            "en" -> LayoutDirection.Ltr
                            else -> LayoutDirection.Rtl
                        }

                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { selectedJob = job }
                        ) {
                            Column(
                                modifier = Modifier.padding(14.dp),
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.Top
                                ) {
                                    CompositionLocalProvider(LocalLayoutDirection provides contentDirection) {
                                        Text(
                                            text = displayedTitle,
                                            style = MaterialTheme.typography.titleMedium,
                                            fontWeight = FontWeight.Bold,
                                            modifier = Modifier
                                                .weight(1f)
                                                .padding(end = 8.dp)
                                        )
                                    }

                                    JobLanguageMenuButton(
                                        currentMode = currentMode,
                                        isTranslating = isTranslating,
                                        onSelectLang = { lang -> handleSelectLanguage(job, lang) }
                                    )
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
                                CompositionLocalProvider(LocalLayoutDirection provides contentDirection) {
                                    Text(
                                        text = displayedDesc.take(420),
                                        style = MaterialTheme.typography.bodySmall
                                    )
                                }

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    OutlinedButton(
                                        onClick = { selectedJob = job }
                                    ) {
                                        Text("التفاصيل")
                                    }
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
                                        Icon(Icons.Default.OpenInBrowser, contentDescription = null)
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

    selectedJob?.let { job ->
        val currentMode = activeLangByJob[job.id] ?: "original"
        val cachedTr = if (currentMode == "ar" || currentMode == "en") {
            translations[job.id]?.get(currentMode)
        } else {
            null
        }
        val displayedTitle = cachedTr?.title ?: job.title
        val displayedDesc = cachedTr?.description ?: job.description
        val isTranslating = translatingJobId == job.id
        val contentDirection = when (currentMode) {
            "en" -> LayoutDirection.Ltr
            else -> LayoutDirection.Rtl
        }

        AlertDialog(
            onDismissRequest = { selectedJob = null },
            title = {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    CompositionLocalProvider(LocalLayoutDirection provides contentDirection) {
                        Text(
                            text = displayedTitle,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier
                                .weight(1f)
                                .padding(end = 8.dp)
                        )
                    }
                    JobLanguageMenuButton(
                        currentMode = currentMode,
                        isTranslating = isTranslating,
                        onSelectLang = { lang -> handleSelectLanguage(job, lang) }
                    )
                }
            },
            text = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "${job.company} • ${job.source}",
                        style = MaterialTheme.typography.labelLarge,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = "الموقع: ${job.location}" + if (job.salary.isNotBlank() && job.salary != "غير محدد") " • المقابل: ${job.salary}" else "",
                        style = MaterialTheme.typography.bodySmall
                    )
                    Divider()
                    CompositionLocalProvider(LocalLayoutDirection provides contentDirection) {
                        Text(
                            text = displayedDesc,
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (job.url.isNotBlank()) {
                            context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(job.url)))
                        }
                    },
                    enabled = job.url.isNotBlank()
                ) {
                    Icon(Icons.Default.OpenInBrowser, contentDescription = null)
                    Spacer(Modifier.width(6.dp))
                    Text("التقديم الآن")
                }
            },
            dismissButton = {
                TextButton(onClick = { selectedJob = null }) {
                    Text("إغلاق")
                }
            }
        )
    }
}

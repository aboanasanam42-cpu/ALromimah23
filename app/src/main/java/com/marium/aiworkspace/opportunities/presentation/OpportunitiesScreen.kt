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
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.marium.aiworkspace.opportunities.data.OpportunityDataSource
import com.marium.aiworkspace.opportunities.data.RemoteOpportunity

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OpportunitiesScreen(navController: NavController) {
    val context = LocalContext.current
    val source = remember { OpportunityDataSource() }
    var opportunities by remember { mutableStateOf<List<RemoteOpportunity>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var message by remember { mutableStateOf("جاري تحميل الفرص الحقيقية...") }

    fun refresh() {
        loading = true
        message = "جاري تحديث الفرص من مصادر العمل عن بُعد..."
        kotlinx.coroutines.MainScope().launch {
            val result = source.fetchOpportunities()
            opportunities = result
            loading = false
            message = if (result.isEmpty()) "لم يتم العثور على فرص متاحة حالياً. اضغط تحديث للمحاولة مرة أخرى." else "تم العثور على ${result.size} فرصة حقيقية."
        }
    }

    LaunchedEffect(Unit) { refresh() }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("الفرص الحقيقية") },
                navigationIcon = { IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "رجوع") } },
                actions = { IconButton(onClick = { refresh() }) { Icon(Icons.Default.Refresh, "تحديث") } }
            )
        }
    ) { padding ->
        Column(Modifier.fillMaxSize().padding(padding).padding(12.dp)) {
            Text(message, style = MaterialTheme.typography.bodyMedium)
            Spacer(Modifier.height(8.dp))
            if (loading) {
                LinearProgressIndicator(Modifier.fillMaxWidth())
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    items(opportunities, key = { it.id }) { job ->
                        ElevatedCard(Modifier.fillMaxWidth()) {
                            Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                Text(job.title, style = MaterialTheme.typography.titleMedium)
                                Text(job.company, style = MaterialTheme.typography.labelLarge)
                                Text("المصدر: ${job.source} • الموقع: ${job.location}", style = MaterialTheme.typography.bodySmall)
                                if (job.salary.isNotBlank() && job.salary != "غير محدد") Text("المقابل: ${job.salary}", style = MaterialTheme.typography.bodyMedium)
                                Text(job.description.take(420), style = MaterialTheme.typography.bodySmall)
                                Button(
                                    onClick = {
                                        if (job.url.isNotBlank()) context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(job.url)))
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

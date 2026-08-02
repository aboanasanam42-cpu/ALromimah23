package com.marium.aiworkspace.ai.analysis

import androidx.compose.animation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.marium.aiworkspace.data.model.AIAnalysisResult
import com.marium.aiworkspace.data.model.Opportunity

/**
 * AI Analysis Screen showing detailed opportunity analysis.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AIAnalysisScreen(
    opportunity: Opportunity,
    viewModel: AIAnalysisViewModel,
    onBack: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val scrollState = rememberScrollState()

    LaunchedEffect(opportunity) {
        if (uiState.opportunity?.id != opportunity.id) {
            viewModel.analyzeOpportunity(opportunity)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("تحليل الذكاء الاصطناعي") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            when {
                uiState.isLoading -> {
                    LoadingAnalysis()
                }
                uiState.error != null -> {
                    ErrorState(
                        error = uiState.error!!,
                        onRetry = { viewModel.analyzeOpportunity(opportunity) }
                    )
                }
                uiState.result != null -> {
                    AnalysisResult(
                        result = uiState.result!!,
                        modifier = Modifier.verticalScroll(scrollState)
                    )
                }
            }
        }
    }
}

@Composable
fun LoadingAnalysis() {
    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        CircularProgressIndicator(modifier = Modifier.size(48.dp))
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "جاري تحليل الفرصة...",
            style = MaterialTheme.typography.titleMedium
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "يقوم الذكاء الاصطناعي بفحص المصداقية والمخاطر",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
fun AnalysisResult(
    result: AIAnalysisResult,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Score Card
        ScoreCard(result)

        // Risk Level
        RiskLevelCard(result)

        // Estimated Earnings
        if (result.estimatedEarnings.isNotBlank()) {
            InfoCard(
                title = "التقديرات المالية",
                icon = Icons.Default.AttachMoney,
                content = result.estimatedEarnings
            )
        }

        // Green Flags
        if (result.greenFlags.isNotEmpty()) {
            FlagsCard(
                title = "المؤشرات الإيجابية",
                icon = Icons.Default.CheckCircle,
                flags = result.greenFlags,
                containerColor = MaterialTheme.colorScheme.primaryContainer,
                contentColor = MaterialTheme.colorScheme.onPrimaryContainer
            )
        }

        // Red Flags
        if (result.redFlags.isNotEmpty()) {
            FlagsCard(
                title = "علامات التحذير",
                icon = Icons.Default.Warning,
                flags = result.redFlags,
                containerColor = MaterialTheme.colorScheme.errorContainer,
                contentColor = MaterialTheme.colorScheme.onErrorContainer
            )
        }

        // Advice
        if (result.advice.isNotBlank()) {
            InfoCard(
                title = "النصيحة",
                icon = Icons.Default.Lightbulb,
                content = result.advice
            )
        }
    }
}

@Composable
fun ScoreCard(result: AIAnalysisResult) {
    val scoreColor = when {
        result.legitimacyScore >= 70 -> MaterialTheme.colorScheme.primary
        result.legitimacyScore >= 40 -> MaterialTheme.colorScheme.tertiary
        else -> MaterialTheme.colorScheme.error
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = scoreColor.copy(alpha = 0.1f))
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "${result.legitimacyScore}",
                style = MaterialTheme.typography.displayLarge,
                color = scoreColor
            )
            Text(
                text = "درجة المصداقية",
                style = MaterialTheme.typography.titleMedium,
                color = scoreColor.copy(alpha = 0.8f)
            )
            if (result.scamProbability > 0.5) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "احتمالية الاحتيال: ${(result.scamProbability * 100).toInt()}%",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.error
                )
            }
        }
    }
}

@Composable
fun RiskLevelCard(result: AIAnalysisResult) {
    val (icon, color, text) = when (result.riskLevel.lowercase()) {
        "low" -> Triple(Icons.Default.Security, MaterialTheme.colorScheme.primary, "مخاطر منخفضة")
        "high" -> Triple(Icons.Default.Warning, MaterialTheme.colorScheme.error, "مخاطر عالية")
        else -> Triple(Icons.Default.Info, MaterialTheme.colorScheme.tertiary, "مخاطر متوسطة")
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = color.copy(alpha = 0.1f))
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Icon(icon, contentDescription = null, tint = color)
            Text(
                text = text,
                style = MaterialTheme.typography.titleMedium,
                color = color
            )
        }
    }
}

@Composable
fun FlagsCard(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    flags: List<String>,
    containerColor: androidx.compose.ui.graphics.Color,
    contentColor: androidx.compose.ui.graphics.Color
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = containerColor)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(icon, contentDescription = null, tint = contentColor)
                Text(title, style = MaterialTheme.typography.titleMedium, color = contentColor)
            }
            Spacer(modifier = Modifier.height(8.dp))
            flags.forEach { flag ->
                Text(
                    text = "• $flag",
                    style = MaterialTheme.typography.bodyMedium,
                    color = contentColor.copy(alpha = 0.9f),
                    modifier = Modifier.padding(vertical = 2.dp)
                )
            }
        }
    }
}

@Composable
fun InfoCard(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    content: String
) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(icon, contentDescription = null)
                Text(title, style = MaterialTheme.typography.titleMedium)
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = content,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun ErrorState(
    error: String,
    onRetry: () -> Unit
) {
    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = Icons.Default.Error,
            contentDescription = null,
            modifier = Modifier.size(64.dp),
            tint = MaterialTheme.colorScheme.error
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = error,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.error,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = onRetry) {
            Text("إعادة المحاولة")
        }
    }
}

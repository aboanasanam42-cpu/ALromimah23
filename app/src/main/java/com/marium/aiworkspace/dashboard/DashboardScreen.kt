package com.marium.aiworkspace.dashboard

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.marium.aiworkspace.data.model.Opportunity

/**
 * Dashboard Screen with stats and quick actions.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    stats: DashboardStats = DashboardStats(),
    recentOpportunities: List<Opportunity> = emptyList(),
    onBack: () -> Unit,
    onViewOpportunities: () -> Unit = {},
    onViewWallet: () -> Unit = {},
    onViewProfile: () -> Unit = {}
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("لوحة التحكم") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Quick Stats Row
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatCard(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.Work,
                        value = "${stats.totalOpportunities}",
                        label = "الفرص",
                        containerColor = MaterialTheme.colorScheme.primaryContainer
                    )
                    StatCard(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.CheckCircle,
                        value = "${stats.completedTasks}",
                        label = "المنجز",
                        containerColor = MaterialTheme.colorScheme.secondaryContainer
                    )
                }
            }

            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatCard(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.AttachMoney,
                        value = "$${String.format("%.0f", stats.totalEarnings)}",
                        label = "الأرباح",
                        containerColor = MaterialTheme.colorScheme.tertiaryContainer
                    )
                    StatCard(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.Bookmark,
                        value = "${stats.savedOpportunities}",
                        label = "المحفوظات",
                        containerColor = MaterialTheme.colorScheme.errorContainer
                    )
                }
            }

            // Quick Actions
            item {
                Text(
                    text = "إجراءات سريعة",
                    style = MaterialTheme.typography.titleMedium
                )
            }

            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    QuickActionButton(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.Search,
                        label = "استكشف الفرص",
                        onClick = onViewOpportunities
                    )
                    QuickActionButton(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.AccountBalanceWallet,
                        label = "المحفظة",
                        onClick = onViewWallet
                    )
                    QuickActionButton(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.Person,
                        label = "الملف الشخصي",
                        onClick = onViewProfile
                    )
                }
            }

            // Recent Opportunities
            if (recentOpportunities.isNotEmpty()) {
                item {
                    Text(
                        text = "فرص حديثة",
                        style = MaterialTheme.typography.titleMedium
                    )
                }

                items(recentOpportunities.take(5)) { opportunity ->
                    OpportunityQuickCard(opportunity)
                }
            }
        }
    }
}

@Composable
fun StatCard(
    modifier: Modifier = Modifier,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    value: String,
    label: String,
    containerColor: androidx.compose.ui.graphics.Color
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = containerColor)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(icon, contentDescription = null)
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.headlineSmall
            )
            Text(
                text = label,
                style = MaterialTheme.typography.bodySmall
            )
        }
    }
}

@Composable
fun QuickActionButton(
    modifier: Modifier = Modifier,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    onClick: () -> Unit
) {
    OutlinedButton(
        onClick = onClick,
        modifier = modifier,
        contentPadding = PaddingValues(12.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(icon, contentDescription = null)
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = label, style = MaterialTheme.typography.bodySmall)
        }
    }
}

@Composable
fun OpportunityQuickCard(opportunity: Opportunity) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = opportunity.title,
                    style = MaterialTheme.typography.bodyLarge
                )
                Text(
                    text = opportunity.source,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            Text(
                text = opportunity.salary,
                style = MaterialTheme.typography.titleSmall,
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}

data class DashboardStats(
    val totalOpportunities: Int = 0,
    val completedTasks: Int = 0,
    val totalEarnings: Double = 0.0,
    val savedOpportunities: Int = 0
)

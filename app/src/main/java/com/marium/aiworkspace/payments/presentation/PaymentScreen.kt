package com.marium.aiworkspace.payments.presentation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PaymentScreen(navController: NavController) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("المحفظة والمدفوعات") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "رجوع")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Icon(Icons.Default.AccountBalanceWallet, contentDescription = null)
            Text("إدارة الأرباح ووسائل الاستلام", style = MaterialTheme.typography.titleLarge)
            Text(
                "أضف بيانات وسيلة الاستلام التي تختارها واحفظها محلياً بشكل آمن. التطبيق لا يرسل الأموال تلقائياً؛ استلام المبلغ يعتمد على منصة العمل أو العميل.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text("الرصيد المسجل: 0.00 دولار", style = MaterialTheme.typography.titleMedium)
            Text("الأرباح المعلقة: 0.00 دولار", style = MaterialTheme.typography.bodyLarge)
            Text("المبالغ المستلمة: 0.00 دولار", style = MaterialTheme.typography.bodyLarge)
        }
    }
}

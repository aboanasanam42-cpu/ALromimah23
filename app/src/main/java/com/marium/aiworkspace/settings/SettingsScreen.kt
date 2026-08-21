package com.marium.aiworkspace.settings

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(navController: NavController) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("الإعدادات") },
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
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Text("إعدادات مساحة العمل", style = MaterialTheme.typography.titleLarge)
            Text("اللغة الافتراضية: العربية", style = MaterialTheme.typography.bodyLarge)
            Text("اتجاه الواجهة: من اليمين إلى اليسار", style = MaterialTheme.typography.bodyLarge)
            Text("المزامنة السحابية: مهيأة للعمل عند توفر الاتصال", style = MaterialTheme.typography.bodyLarge)
            Text("التنبيهات: مفعلة للفرص الجديدة", style = MaterialTheme.typography.bodyLarge)
            Text("الأمان: بيانات الدفع لا ينبغي حفظها داخل المستودع أو في ملفات المشروع", style = MaterialTheme.typography.bodyLarge)
        }
    }
}

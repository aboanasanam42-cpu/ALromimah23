package com.marium.aiworkspace.dashboard

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.marium.aiworkspace.navigation.AppDestinations

data class CategoryItem(
    val id: String,
    val titleAr: String,
    val titleEn: String,
    val icon: ImageVector,
    val description: String,
    val opportunitiesCount: Int
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(navController: NavController) {
    val categories = listOf(
        CategoryItem("accounting", "الحسابات والمالية", "Accounting & Finance", Icons.Default.AccountBalance, "إعداد القوائم المالية، الموازنات والضرائب", 14),
        CategoryItem("project_mgmt", "إدارة المشاريع", "Project Management", Icons.Default.Assignment, "تخطيط المشاريع وجداول العمل ومتابعة الأداء", 11),
        CategoryItem("ai_automation", "الذكاء الاصطناعي", "AI & Automation", Icons.Default.SmartToy, "أتمتة الأعمال وبناء روبوتات ونماذج AI", 18),
        CategoryItem("design", "التصميم والمونتاج", "Design & Media", Icons.Default.Palette, "الهويات البصرية وتصميم UI/UX وتحرير الفيديو", 22),
        CategoryItem("translation", "الترجمة واللغات", "Translation", Icons.Default.Translate, "الترجمة الفورية المعتمدة والتدقيق اللغوي", 9),
        CategoryItem("customer_support", "الدعم والعملاء", "Customer Support", Icons.Default.HeadsetMic, "إدارة استفسارات العملاء وخدمات الدعم", 12),
        CategoryItem("marketing", "التسويق الرقمي", "Digital Marketing", Icons.Default.Campaign, "إدارة الحملات الإعلانية وتحسين محركات البحث", 16),
        CategoryItem("software", "تطوير البرمجيات", "Software Development", Icons.Default.Code, "برمجة تطبيقات الويب والموبايل والأنظمة", 25),
        CategoryItem("content", "الكتابة وصناعة المحتوى", "Content Writing", Icons.Default.EditNote, "كتابة المقالات والسيناريوهات والنصوص الإعلانية", 15),
        CategoryItem("consulting", "الاستشارات والتدريب", "Consulting & Training", Icons.Default.School, "استشارات الأعمال وجلسات التدريب المتخصص", 8)
    )

    var showDialog by remember { mutableStateOf(false) }
    var selectedCategory by remember { mutableStateOf<CategoryItem?>(null) }

    if (showDialog && selectedCategory != null) {
        val cat = selectedCategory!!
        AlertDialog(
            onDismissRequest = { showDialog = false },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(cat.icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(cat.titleAr, fontWeight = FontWeight.Bold)
                }
            },
            text = {
                Column(modifier = Modifier.padding(vertical = 4.dp)) {
                    Text(
                        text = cat.titleEn,
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Medium
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(text = cat.description, fontSize = 14.sp)
                    Spacer(modifier = Modifier.height(12.dp))
                    Surface(
                        color = MaterialTheme.colorScheme.primaryContainer,
                        shape = MaterialTheme.shapes.small,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "⚡ الفرص المتاحة حالياً: ${cat.opportunitiesCount} فرصة عمل",
                            modifier = Modifier.padding(8.dp),
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 13.sp,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                    }
                }
            },
            confirmButton = {
                Button(onClick = {
                    showDialog = false
                    navController.navigate(AppDestinations.AI_ANALYSIS)
                }) {
                    Text("تحليل وتوليد عرض AI")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDialog = false }) {
                    Text("إغلاق")
                }
            }
        )
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { 
                    Text("مريم AI | مساحة العمل", fontWeight = FontWeight.ExtraBold, fontSize = 18.sp) 
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                ),
                actions = {
                    IconButton(onClick = { navController.navigate(AppDestinations.SETTINGS) }) {
                        Icon(Icons.Default.Settings, contentDescription = "الإعدادات")
                    }
                    IconButton(onClick = { navController.navigate(AppDestinations.PAYMENT) }) {
                        Icon(Icons.Default.Payments, contentDescription = "المدفوعات")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            Text(
                text = "مرحباً بك مجدداً 👋",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
            Text(
                text = "مساحة العمل المتكاملة للمستقلين (10 مجالات مهنية مدعومة بالذكاء الاصطناعي)",
                fontSize = 13.sp,
                color = MaterialTheme.colorScheme.secondary,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(categories) { item ->
                    CategoryCard(item) {
                        selectedCategory = item
                        showDialog = true
                    }
                }
            }
        }
    }
}

@Composable
fun CategoryCard(item: CategoryItem, onClick: () -> Unit) {
    ElevatedCard(
        modifier = Modifier
            .fillMaxWidth()
            .height(135.dp)
            .clickable { onClick() },
        shape = MaterialTheme.shapes.large
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = item.icon,
                contentDescription = item.titleAr,
                modifier = Modifier.size(34.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = item.titleAr,
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp,
                textAlign = TextAlign.Center,
                maxLines = 1
            )
            Text(
                text = "${item.opportunitiesCount} فرصة عمل",
                fontSize = 11.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )
        }
    }
}

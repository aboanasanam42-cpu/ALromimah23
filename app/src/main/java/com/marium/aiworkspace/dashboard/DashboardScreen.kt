package com.marium.aiworkspace.dashboard

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.marium.aiworkspace.navigation.AppDestinations

data class CategoryItem(val title: String, val icon: ImageVector, val description: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(navController: NavController) {
    val categories = listOf(
        CategoryItem("الحسابات والمالية", Icons.Default.AccountBalance, "تقارير مالية وموازنات ومهام محاسبية عن بُعد"),
        CategoryItem("إدارة المشاريع", Icons.Default.Assignment, "تخطيط ومتابعة المشاريع والعملاء والمواعيد"),
        CategoryItem("الذكاء الاصطناعي والأتمتة", Icons.Default.SmartToy, "أتمتة الأعمال وتحليل البيانات ومساعدات AI"),
        CategoryItem("التصميم والمونتاج", Icons.Default.Palette, "تصميم الإعلانات والهوية والمواد المرئية"),
        CategoryItem("الترجمة واللغات", Icons.Default.Translate, "ترجمة وتدقيق وتوطين المحتوى"),
        CategoryItem("الدعم وخدمة العملاء", Icons.Default.HeadsetMic, "الدعم عن بُعد وخدمة العملاء"),
        CategoryItem("التسويق الرقمي", Icons.Default.Campaign, "التسويق وإدارة الحملات والمحتوى"),
        CategoryItem("تطوير البرمجيات", Icons.Default.Code, "تطبيقات الويب والموبايل والأنظمة"),
        CategoryItem("الكتابة وصناعة المحتوى", Icons.Default.EditNote, "مقالات وتقارير ونصوص ومحتوى تسويقي"),
        CategoryItem("الاستشارات والتدريب", Icons.Default.School, "استشارات مهنية وتعليم وتدريب عن بُعد")
    )

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("مريم AI | مساحة العمل", fontWeight = FontWeight.ExtraBold) },
                actions = {
                    IconButton(onClick = { navController.navigate(AppDestinations.SETTINGS) }) { Icon(Icons.Default.Settings, "الإعدادات") }
                    IconButton(onClick = { navController.navigate(AppDestinations.PAYMENT) }) { Icon(Icons.Default.Payments, "المحفظة") }
                }
            )
        }
    ) { padding ->
        Column(Modifier.fillMaxSize().padding(padding).padding(16.dp)) {
            Text("مرحباً بك 👋", fontSize = 25.sp, fontWeight = FontWeight.Bold)
            Text("لا نعتمد أرقاماً وهمية للفرص. افتح الماسح لجلب الفرص المتاحة فعلياً.", style = MaterialTheme.typography.bodyMedium, modifier = Modifier.padding(top = 4.dp))
            Spacer(Modifier.height(12.dp))
            Button(onClick = { navController.navigate(AppDestinations.OPPORTUNITIES) }, modifier = Modifier.fillMaxWidth()) {
                Icon(Icons.Default.Search, null)
                Spacer(Modifier.width(8.dp))
                Text("🔎 فحص فرص العمل الحقيقية الآن")
            }
            Spacer(Modifier.height(16.dp))
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(categories) { item -> CategoryCard(item) { navController.navigate(AppDestinations.OPPORTUNITIES) } }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun CategoryCard(item: CategoryItem, onClick: () -> Unit) {
    ElevatedCard(onClick = onClick, modifier = Modifier.fillMaxWidth().height(140.dp)) {
        Column(Modifier.fillMaxSize().padding(10.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
            Icon(item.icon, contentDescription = item.title, modifier = Modifier.size(32.dp), tint = MaterialTheme.colorScheme.primary)
            Spacer(Modifier.height(6.dp))
            Text(item.title, fontWeight = FontWeight.Bold, fontSize = 13.sp, textAlign = TextAlign.Center)
            Spacer(Modifier.height(4.dp))
            Text(item.description, fontSize = 10.sp, textAlign = TextAlign.Center, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 3)
        }
    }
}

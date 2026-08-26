package com.marium.aiworkspace.dashboard

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.marium.aiworkspace.navigation.AppDestinations
import kotlinx.coroutines.launch

// Futuristic Cyber Palette matching the image
val DarkBg = Color(0xFF070B14)
val DarkCardBg = Color(0xFF0D1424)
val DarkCardBorder = Color(0xFF162B4D)
val NeonCyan = Color(0xFF00F2FE)
val NeonTeal = Color(0xFF2DD4BF)
val NeonAmber = Color(0xFFFBBF24)
val NeonPurple = Color(0xFFA855F7)
val NeonPink = Color(0xFFEC4899)
val NeonGreen = Color(0xFF10B981)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(navController: NavController) {
    val coroutineScope = rememberCoroutineScope()
    var promptText by remember { mutableStateOf("") }
    var aiResponse by remember { mutableStateOf<String?>(null) }
    var isSending by remember { mutableStateOf(false) }

    // Pulsing animation for AI Orb
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 0.95f,
        targetValue = 1.05f,
        animationSpec = infiniteRepeatable(
            animation = tween(1500, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseScale"
    )

    Scaffold(
        containerColor = DarkBg,
        topBar = {
            // Top Bar matching MARIA | AI WORKSPACE with Avatar & Bell
            Surface(
                color = DarkBg.copy(alpha = 0.95f),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .statusBarsPadding()
                        .padding(horizontal = 16.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Logo & Brand Name
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(34.dp)
                                .clip(CircleShape)
                                .background(
                                    Brush.sweepGradient(
                                        listOf(NeonAmber, NeonPink, NeonCyan, NeonAmber)
                                    )
                                )
                                .padding(2.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .clip(CircleShape)
                                    .background(DarkBg),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.SmartToy,
                                    contentDescription = "MARIA",
                                    tint = NeonAmber,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.width(10.dp))

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "MARIA",
                                fontWeight = FontWeight.Black,
                                fontSize = 16.sp,
                                color = Color.White
                            )
                            Text(
                                text = " | ",
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = Color.Gray
                            )
                            Text(
                                text = "AI WORKSPACE",
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 12.sp,
                                color = NeonCyan
                            )
                        }
                    }

                    // Actions (Bell Notification with red dot & User Profile)
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        // Notification Bell
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(Color(0xFF131D31))
                                .border(1.dp, DarkCardBorder, CircleShape)
                                .clickable { navController.navigate(AppDestinations.OPPORTUNITIES) },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Notifications,
                                contentDescription = "الإشعارات",
                                tint = Color(0xFFCBD5E1),
                                modifier = Modifier.size(18.dp)
                            )
                            // Red Badge
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .align(Alignment.TopEnd)
                                    .offset(x = (-4).dp, y = 4.dp)
                                    .clip(CircleShape)
                                    .background(Color(0xFFEF4444))
                            )
                        }

                        // User Avatar Profile
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(
                                    Brush.linearGradient(
                                        listOf(NeonCyan, NeonAmber)
                                    )
                                )
                                .padding(1.5.dp)
                                .clickable { navController.navigate(AppDestinations.SETTINGS) },
                            contentAlignment = Alignment.Center
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .clip(CircleShape)
                                    .background(Color(0xFF0F172A)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "أنس",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 12.sp,
                                    color = NeonCyan
                                )
                            }
                        }
                    }
                }
            }
        },
        bottomBar = {
            // Bottom Dock Navigation Bar
            Surface(
                color = Color(0xFF070B14).copy(alpha = 0.98f),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, Color(0xFF0E1A30), RoundedCornerShape(topStart = 18.dp, topEnd = 18.dp))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .navigationBarsPadding()
                        .padding(vertical = 8.dp, horizontal = 4.dp),
                    horizontalArrangement = Arrangement.SpaceAround,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    BottomNavItem("لوحة القيادة", Icons.Default.Dashboard, isSelected = true) {
                        // Current Screen
                    }
                    BottomNavItem("مشغل AI", Icons.Default.SmartToy, isSelected = false) {
                        navController.navigate(AppDestinations.AI_ANALYSIS)
                    }
                    BottomNavItem("المشاريع", Icons.Default.Assignment, isSelected = false) {
                        navController.navigate(AppDestinations.OPPORTUNITIES)
                    }
                    BottomNavItem("الفرص", Icons.Default.Work, isSelected = false) {
                        navController.navigate(AppDestinations.OPPORTUNITIES)
                    }
                    BottomNavItem("المدفوعات", Icons.Default.Payments, isSelected = false) {
                        navController.navigate(AppDestinations.PAYMENT)
                    }
                    BottomNavItem("الأمان", Icons.Default.Security, isSelected = false) {
                        navController.navigate(AppDestinations.SETTINGS)
                    }
                }
            }
        }
    ) { padding ->
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Left Quick Actions Drawer (Hidden on very small screens, responsive)
            Column(
                modifier = Modifier
                    .width(105.dp)
                    .fillMaxHeight()
                    .background(Color(0xFF0A101D))
                    .border(1.dp, Color(0xFF132038))
                    .padding(vertical = 12.dp, horizontal = 6.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Active Dashboard button
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(
                            Brush.horizontalGradient(
                                listOf(Color(0xFF0E7490).copy(alpha = 0.5f), Color(0xFF0891B2).copy(alpha = 0.2f))
                            )
                        )
                        .border(1.dp, NeonCyan.copy(alpha = 0.6f), RoundedCornerShape(10.dp))
                        .padding(vertical = 8.dp, horizontal = 4.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "لوحة القيادة",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = NeonCyan,
                        textAlign = TextAlign.Center
                    )
                }

                SideNavItem("مشغل AI", Icons.Default.AutoAwesome) {
                    navController.navigate(AppDestinations.AI_ANALYSIS)
                }
                SideNavItem("المشاريع", Icons.Default.Folder) {
                    navController.navigate(AppDestinations.OPPORTUNITIES)
                }
                SideNavItem("الفرص", Icons.Default.TrendingUp) {
                    navController.navigate(AppDestinations.OPPORTUNITIES)
                }
                SideNavItem("المدفوعات", Icons.Default.AccountBalanceWallet) {
                    navController.navigate(AppDestinations.PAYMENT)
                }
                SideNavItem("الإعدادات", Icons.Default.Settings) {
                    navController.navigate(AppDestinations.SETTINGS)
                }
                SideNavItem("الأمان", Icons.Default.Shield) {
                    navController.navigate(AppDestinations.SETTINGS)
                }
            }

            // Main Content Area (Cards matching the screenshot)
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 14.dp, vertical = 10.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Section Title: لوحة القيادة
                Column(modifier = Modifier.padding(bottom = 2.dp)) {
                    Text(
                        text = "لوحة القيادة",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                    Text(
                        text = "تحليل ذكي، بوابة شاملة، تنفيذ فوري",
                        fontSize = 11.sp,
                        color = Color(0xFF94A3B8),
                        fontWeight = FontWeight.Medium
                    )
                }

                // CARD 1: تحليل الذكاء الاصطناعي (AI Analysis Card)
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(18.dp))
                        .border(1.dp, NeonCyan.copy(alpha = 0.35f), RoundedCornerShape(18.dp))
                        .clickable { navController.navigate(AppDestinations.AI_ANALYSIS) },
                    colors = CardDefaults.cardColors(
                        containerColor = Color(0xFF0C1628)
                    )
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "تحليل الذكاء الاصطناعي",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = NeonCyan
                            )
                            Text(
                                text = "•••",
                                color = Color(0xFF64748B),
                                fontSize = 14.sp
                            )
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        // Glowing 3D AI Orb
                        Box(
                            modifier = Modifier
                                .size(74.dp)
                                .scale(pulseScale)
                                .clip(CircleShape)
                                .background(
                                    Brush.sweepGradient(
                                        listOf(NeonCyan, NeonPurple, NeonAmber, NeonCyan)
                                    )
                                )
                                .padding(2.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .clip(CircleShape)
                                    .background(Color(0xFF090E1A)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "AI",
                                    fontSize = 22.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Color.White
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Text(
                            text = "التحسين بنسبة 96% سرعة العربية / الاستجابة الفورية",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFFCBD5E1),
                            textAlign = TextAlign.Center
                        )
                    }
                }

                // CARD 2: حالة مزامنة البيانات (Data Sync Status Card)
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(18.dp))
                        .border(1.dp, NeonTeal.copy(alpha = 0.35f), RoundedCornerShape(18.dp)),
                    colors = CardDefaults.cardColors(
                        containerColor = Color(0xFF0B1726)
                    )
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "حالة مزامنة البيانات",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = NeonTeal
                            )
                            Text(
                                text = "•••",
                                color = Color(0xFF64748B),
                                fontSize = 14.sp
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        // Cloud Data Flow graphic
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(0xFF070F1C))
                                .padding(vertical = 12.dp, horizontal = 10.dp),
                            horizontalArrangement = Arrangement.SpaceAround,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // Local File Node
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Box(
                                    modifier = Modifier
                                        .size(34.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(Color(0xFF1E1B4B))
                                        .border(1.dp, NeonPurple.copy(alpha = 0.5f), RoundedCornerShape(8.dp)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(Icons.Default.Description, contentDescription = null, tint = NeonPurple, modifier = Modifier.size(18.dp))
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("محلي", fontSize = 9.sp, color = Color.Gray)
                            }

                            // Glowing Cloud in Center
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Box(
                                    modifier = Modifier
                                        .size(46.dp)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(
                                            Brush.linearGradient(
                                                listOf(NeonTeal.copy(alpha = 0.3f), NeonCyan.copy(alpha = 0.1f))
                                            )
                                        )
                                        .border(1.dp, NeonTeal, RoundedCornerShape(12.dp)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(Icons.Default.Cloud, contentDescription = null, tint = NeonTeal, modifier = Modifier.size(24.dp))
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("المتصل", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = NeonTeal)
                            }

                            // Remote Cloud Node
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Box(
                                    modifier = Modifier
                                        .size(34.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(Color(0xFF451A03))
                                        .border(1.dp, NeonAmber.copy(alpha = 0.5f), RoundedCornerShape(8.dp)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(Icons.Default.CloudSync, contentDescription = null, tint = NeonAmber, modifier = Modifier.size(18.dp))
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("Firestore", fontSize = 9.sp, color = Color.Gray)
                            }
                        }
                    }
                }

                // CARD 3: مساعد الذكاء الاصطناعي (AI Assistant Card - Marium)
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(18.dp))
                        .border(1.dp, NeonPurple.copy(alpha = 0.35f), RoundedCornerShape(18.dp)),
                    colors = CardDefaults.cardColors(
                        containerColor = Color(0xFF120E26)
                    )
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "مساعد الذكاء الاصطناعي",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = NeonPurple
                            )
                            Text(
                                text = "مريم",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Black,
                                color = NeonPink
                            )
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        // Mascot Sphere Face
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.Center,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // Left Voice waves
                            Row(horizontalArrangement = Arrangement.spacedBy(3.dp), verticalAlignment = Alignment.CenterVertically) {
                                Box(modifier = Modifier.size(width = 3.dp, height = 12.dp).background(NeonPurple, RoundedCornerShape(2.dp)))
                                Box(modifier = Modifier.size(width = 3.dp, height = 22.dp).background(NeonPurple, RoundedCornerShape(2.dp)))
                                Box(modifier = Modifier.size(width = 3.dp, height = 16.dp).background(NeonPurple, RoundedCornerShape(2.dp)))
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Box(
                                modifier = Modifier
                                    .size(52.dp)
                                    .clip(CircleShape)
                                    .background(
                                        Brush.sweepGradient(
                                            listOf(NeonPurple, NeonPink, NeonCyan, NeonPurple)
                                        )
                                    )
                                    .padding(2.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .clip(CircleShape)
                                        .background(Color(0xFF0F0B24)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Face,
                                        contentDescription = "Marium Mascot",
                                        tint = NeonCyan,
                                        modifier = Modifier.size(28.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            // Right Voice waves
                            Row(horizontalArrangement = Arrangement.spacedBy(3.dp), verticalAlignment = Alignment.CenterVertically) {
                                Box(modifier = Modifier.size(width = 3.dp, height = 16.dp).background(NeonPurple, RoundedCornerShape(2.dp)))
                                Box(modifier = Modifier.size(width = 3.dp, height = 22.dp).background(NeonPurple, RoundedCornerShape(2.dp)))
                                Box(modifier = Modifier.size(width = 3.dp, height = 12.dp).background(NeonPurple, RoundedCornerShape(2.dp)))
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        if (aiResponse != null) {
                            Surface(
                                color = Color(0xFF1E153D),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
                            ) {
                                Text(
                                    text = aiResponse!!,
                                    fontSize = 11.sp,
                                    color = Color(0xFFE2E8F0),
                                    modifier = Modifier.padding(8.dp)
                                )
                            }
                        }

                        // Text Prompt Bar
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(0xFF080614))
                                .border(1.dp, Color(0xFF3B1E63), RoundedCornerShape(12.dp))
                                .padding(horizontal = 8.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            TextField(
                                value = promptText,
                                onValueChange = { promptText = it },
                                placeholder = { Text("اكتب طلبك أو استفسارك لمريم...", fontSize = 11.sp, color = Color.Gray) },
                                colors = TextFieldDefaults.colors(
                                    focusedContainerColor = Color.Transparent,
                                    unfocusedContainerColor = Color.Transparent,
                                    focusedIndicatorColor = Color.Transparent,
                                    unfocusedIndicatorColor = Color.Transparent,
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White
                                ),
                                modifier = Modifier.weight(1f),
                                singleLine = true
                            )

                            IconButton(
                                onClick = {
                                    if (promptText.isNotBlank()) {
                                        aiResponse = "مرحباً بك! تم استقبال طلبك: '$promptText'. مساعدتك مريم جاهزة لتنظيم وتوليد العروض وإنجاز المهام."
                                        promptText = ""
                                    }
                                }
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Send,
                                    contentDescription = "Send",
                                    tint = NeonPink,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }
                    }
                }

                // CARD 4: المشاريع الأخيرة (Recent Projects Carousel Card)
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(18.dp))
                        .border(1.dp, NeonAmber.copy(alpha = 0.35f), RoundedCornerShape(18.dp)),
                    colors = CardDefaults.cardColors(
                        containerColor = Color(0xFF141221)
                    )
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "المشاريع الأخيرة",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = NeonAmber
                            )
                            Text(
                                text = "•••",
                                color = Color(0xFF64748B),
                                fontSize = 14.sp
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        // Horizontal Scroll for Files/Projects
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .horizontalScroll(rememberScrollState()),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            ProjectItemCard("Marium_App.kt", "أندرويد وويب", "95%", NeonCyan, Icons.Default.Code)
                            ProjectItemCard("Financial_2026.xlsx", "محاسبة ومالية", "100%", NeonGreen, Icons.Default.TableChart)
                            ProjectItemCard("UI_App_Design.fig", "تصميم واجهات", "70%", NeonPurple, Icons.Default.Palette)
                            ProjectItemCard("Legal_Translate.pdf", "ترجمة معتمدة", "85%", NeonAmber, Icons.Default.Translate)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@Composable
fun SideNavItem(
    label: String,
    icon: ImageVector,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .clickable { onClick() }
            .padding(vertical = 6.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = Color(0xFF94A3B8),
            modifier = Modifier.size(18.dp)
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = label,
            fontSize = 9.sp,
            color = Color(0xFFCBD5E1),
            textAlign = TextAlign.Center,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}

@Composable
fun BottomNavItem(
    label: String,
    icon: ImageVector,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .clickable { onClick() }
            .padding(horizontal = 6.dp, vertical = 4.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = if (isSelected) NeonCyan else Color(0xFF64748B),
            modifier = Modifier.size(20.dp)
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = label,
            fontSize = 9.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
            color = if (isSelected) NeonCyan else Color(0xFF94A3B8)
        )
    }
}

@Composable
fun ProjectItemCard(
    title: String,
    category: String,
    progress: String,
    color: Color,
    icon: ImageVector
) {
    Surface(
        color = Color(0xFF090D18),
        shape = RoundedCornerShape(12.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, color.copy(alpha = 0.4f)),
        modifier = Modifier
            .width(115.dp)
            .height(105.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(8.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(26.dp)
                        .clip(RoundedCornerShape(6.dp))
                        .background(color.copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(16.dp))
                }
                Text(
                    text = progress,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    color = color
                )
            }

            Column {
                Text(
                    text = title,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = category,
                    fontSize = 8.sp,
                    color = Color.Gray,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }
    }
}

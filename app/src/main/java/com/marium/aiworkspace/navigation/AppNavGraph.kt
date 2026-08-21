package ai.albader.alromimh.com.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import ai.albader.alromimh.com.ai.analysis.AIAnalysisScreen
import ai.albader.alromimh.com.dashboard.DashboardScreen
import ai.albader.alromimh.com.payments.presentation.PaymentScreen
import ai.albader.alromimh.com.settings.SettingsScreen

object AppDestinations {
    const val DASHBOARD = "dashboard"
    const val SETTINGS = "settings"
    const val AI_ANALYSIS = "ai_analysis"
    const val PAYMENT = "payment"
}

@Composable
fun AppNavGraph(
    navController: NavHostController,
    modifier: Modifier = Modifier
) {
    NavHost(
        navController = navController,
        startDestination = AppDestinations.DASHBOARD,
        modifier = modifier
    ) {
        composable(AppDestinations.DASHBOARD) {
            DashboardScreen(navController)
        }
        composable(AppDestinations.SETTINGS) {
            SettingsScreen(navController)
        }
        composable(AppDestinations.AI_ANALYSIS) {
            AIAnalysisScreen(navController)
        }
        composable(AppDestinations.PAYMENT) {
            PaymentScreen(navController)
        }
    }
}

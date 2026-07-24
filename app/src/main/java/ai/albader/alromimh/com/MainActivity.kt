package ai.albader.alromimh.com

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import ai.albader.alromimh.com.ui.navigation.Screen
import ai.albader.alromimh.com.ui.screens.dashboard.DashboardScreen
import ai.albader.alromimh.com.ui.screens.splash.SplashScreen
import ai.albader.alromimh.com.ui.screens.opportunities.OpportunitiesScreen
import ai.albader.alromimh.com.ui.screens.detail.DetailScreen
import ai.albader.alromimh.com.ui.screens.payments.PaymentsScreen
import ai.albader.alromimh.com.ui.screens.settings.SettingsScreen
import ai.albader.alromimh.com.ui.theme.CloudWorkerTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            CloudWorkerTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    NavHost(
                        navController = navController,
                        startDestination = Screen.Splash.route
                    ) {
                        composable(Screen.Splash.route) {
                            SplashScreen(navController = navController)
                        }
                        composable(Screen.Dashboard.route) {
                            DashboardScreen(navController = navController)
                        }
                        composable(Screen.Opportunities.route) {
                            OpportunitiesScreen(navController = navController)
                        }
                        composable(Screen.Detail.route + "/{id}") { backStackEntry ->
                            val id = backStackEntry.arguments?.getString("id") ?: ""
                            DetailScreen(navController = navController, id = id)
                        }
                        composable(Screen.Payments.route) {
                            PaymentsScreen(navController = navController)
                        }
                        composable(Screen.Settings.route) {
                            SettingsScreen(navController = navController)
                        }
                    }
                }
            }
        }
    }
}

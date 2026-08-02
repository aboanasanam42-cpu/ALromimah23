package com.marium.aiworkspace

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.marium.aiworkspace.ai.analysis.AIAnalysisScreen
import com.marium.aiworkspace.ai.analysis.AIAnalysisViewModel
import com.marium.aiworkspace.auth.data.UserDataSource
import com.marium.aiworkspace.auth.presentation.AuthViewModel
import com.marium.aiworkspace.auth.presentation.LoginScreen
import com.marium.aiworkspace.core.network.NetworkClient
import com.marium.aiworkspace.core.security.BiometricWrapper
import com.marium.aiworkspace.dashboard.DashboardScreen
import com.marium.aiworkspace.data.local.AppDatabase
import com.marium.aiworkspace.data.model.Opportunity
import com.marium.aiworkspace.opportunities.data.OpportunityDataSource
import com.marium.aiworkspace.opportunities.presentation.OpportunitiesViewModel
import com.marium.aiworkspace.opportunities.presentation.OpportunitiesScreen
import com.marium.aiworkspace.opportunities.presentation.OpportunityDetailScreen
import com.marium.aiworkspace.payments.presentation.WalletScreen
import com.marium.aiworkspace.profile.presentation.ProfileScreen
import com.marium.aiworkspace.settings.SettingsScreen
import com.marium.aiworkspace.sync.SyncWorker
import com.marium.aiworkspace.ui.theme.CloudWorkerAITheme
import kotlinx.serialization.json.Json

/**
 * Main Activity with Navigation.
 */
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Initialize dependencies
        val database = AppDatabase.getDatabase(this)
        val networkClient = NetworkClient(this)
        val biometricWrapper = BiometricWrapper(this)

        val userDataSource = UserDataSource(
            context = this,
            userDao = database.userDao(),
            biometricWrapper = biometricWrapper
        )

        val opportunityDataSource = OpportunityDataSource(
            opportunityDao = database.opportunityDao()
        )

        // Schedule background sync
        SyncWorker.schedule(this)

        setContent {
            CloudWorkerAITheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    AppNavigation(
                        navController = navController,
                        userDataSource = userDataSource,
                        opportunityDataSource = opportunityDataSource
                    )
                }
            }
        }
    }
}

@Composable
fun AppNavigation(
    navController: NavHostController,
    userDataSource: UserDataSource,
    opportunityDataSource: OpportunityDataSource
) {
    val startDestination = if (userDataSource.isLoggedIn) "dashboard" else "login"

    NavHost(navController = navController, startDestination = startDestination) {
        composable("login") {
            val authViewModel: AuthViewModel = viewModel {
                AuthViewModel(userDataSource)
            }
            LoginScreen(
                viewModel = authViewModel,
                onLoginSuccess = {
                    navController.navigate("dashboard") {
                        popUpTo("login") { inclusive = true }
                    }
                }
            )
        }

        composable("dashboard") {
            DashboardScreen(
                onBack = { /* Dashboard is root */ },
                onViewOpportunities = { navController.navigate("opportunities") },
                onViewWallet = { navController.navigate("wallet") },
                onViewProfile = { navController.navigate("profile") }
            )
        }

        composable("opportunities") {
            val opportunitiesViewModel: OpportunitiesViewModel = viewModel {
                OpportunitiesViewModel(opportunityDataSource)
            }
            OpportunitiesScreen(
                viewModel = opportunitiesViewModel,
                onOpportunityClick = { opportunity ->
                    val opportunityJson = Json.encodeToString(Opportunity.serializer(), opportunity)
                    navController.navigate("opportunity_detail/${opportunityJson}")
                }
            )
        }

        composable(
            "opportunity_detail/{opportunity}",
            arguments = listOf(navArgument("opportunity") { type = NavType.StringType })
        ) { backStackEntry ->
            val opportunityJson = backStackEntry.arguments?.getString("opportunity") ?: "{}"
            val opportunity = try {
                Json.decodeFromString(Opportunity.serializer(), opportunityJson)
            } catch (e: Exception) {
                Opportunity()
            }

            OpportunityDetailScreen(
                opportunity = opportunity,
                onBack = { navController.popBackStack() },
                onBookmark = { /* Handle bookmark */ },
                onApply = { /* Handle apply */ },
                onAnalyze = { navController.navigate("ai_analysis/${opportunityJson}") }
            )
        }

        composable(
            "ai_analysis/{opportunity}",
            arguments = listOf(navArgument("opportunity") { type = NavType.StringType })
        ) { backStackEntry ->
            val opportunityJson = backStackEntry.arguments?.getString("opportunity") ?: "{}"
            val opportunity = try {
                Json.decodeFromString(Opportunity.serializer(), opportunityJson)
            } catch (e: Exception) {
                Opportunity()
            }

            val aiViewModel: AIAnalysisViewModel = viewModel()
            AIAnalysisScreen(
                opportunity = opportunity,
                viewModel = aiViewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable("wallet") {
            WalletScreen(
                onBack = { navController.popBackStack() }
            )
        }

        composable("profile") {
            ProfileScreen(
                onBack = { navController.popBackStack() },
                onSettings = { navController.navigate("settings") },
                onLogout = {
                    navController.navigate("login") {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }

        composable("settings") {
            SettingsScreen(
                onBack = { navController.popBackStack() }
            )
        }
    }
}

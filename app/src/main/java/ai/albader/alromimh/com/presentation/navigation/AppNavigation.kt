package ai.albader.alromimh.com.presentation.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import ai.albader.alromimh.com.presentation.components.BottomNavBar
import ai.albader.alromimh.com.presentation.screens.*

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    Scaffold(
        bottomBar = { BottomNavBar(navController) }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(paddingValues)
        ) {
            composable(Screen.Home.route) { HomeScreen(navController) }
            composable(Screen.Saved.route) { SavedScreen(navController) }
            composable(Screen.Search.route) { SearchScreen(navController) }
            composable(Screen.Profile.route) { ProfileScreen(navController) }
            composable(
                route = Screen.Detail.route,
                arguments = listOf(navArgument("opportunityId") { type = NavType.StringType })
            ) { backStackEntry ->
                val id = backStackEntry.arguments?.getString("opportunityId") ?: ""
                DetailScreen(navController, id)
            }
            composable(Screen.Settings.route) { SettingsScreen(navController) }
            composable(Screen.Payments.route) { PaymentsScreen(navController) }
            composable(Screen.Applications.route) { ApplicationsScreen(navController) }
            composable(Screen.Login.route) { LoginScreen(navController) }
        }
    }
}

package ai.albader.alromimh.com.presentation.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import ai.albader.alromimh.com.R
import ai.albader.alromimh.com.presentation.navigation.Screen

@Composable
fun BottomNavBar(navController: NavController) {
    val items = listOf(
        Triple(Screen.Home, Icons.Default.Home, R.string.nav_home),
        Triple(Screen.Saved, Icons.Default.Favorite, R.string.nav_saved),
        Triple(Screen.Search, Icons.Default.Search, R.string.nav_search),
        Triple(Screen.Profile, Icons.Default.Person, R.string.nav_profile)
    )

    NavigationBar {
        val navBackStackEntry by navController.currentBackStackEntryAsState()
        val currentRoute = navBackStackEntry?.destination?.route

        items.forEach { (screen, icon, labelRes) ->
            NavigationBarItem(
                icon = { Icon(icon, contentDescription = null) },
                label = { Text(stringResource(labelRes)) },
                selected = currentRoute == screen.route,
                onClick = {
                    navController.navigate(screen.route) {
                        popUpTo(navController.graph.startDestinationId) { saveState = true }
                        launchSingleTop = true
                        restoreState = true
                    }
                }
            )
        }
    }
}

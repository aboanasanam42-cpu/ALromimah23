package ai.albader.alromimh.com.presentation.navigation

sealed class Screen(val route: String) {
    data object Home : Screen("home")
    data object Saved : Screen("saved")
    data object Search : Screen("search")
    data object Detail : Screen("detail/{opportunityId}") {
        fun createRoute(id: String) = "detail/$id"
    }
    data object Profile : Screen("profile")
    data object Settings : Screen("settings")
    data object Payments : Screen("payments")
    data object Applications : Screen("applications")
    data object Login : Screen("login")
}

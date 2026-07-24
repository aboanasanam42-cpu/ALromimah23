package ai.albader.alromimh.com.ui.navigation

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Dashboard : Screen("dashboard")
    object Opportunities : Screen("opportunities")
    object Detail : Screen("detail")
    object Payments : Screen("payments")
    object Settings : Screen("settings")
}

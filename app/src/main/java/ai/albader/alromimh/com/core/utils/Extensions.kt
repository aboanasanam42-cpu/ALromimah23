package ai.albader.alromimh.com.core.utils

// Placeholder for common extension functions and helpers
object Extensions {
    // Example extension function
    fun String.capitalizeWords(): String {
        return this.split(" ").joinToString(" ") { it.capitalize() }
    }
}

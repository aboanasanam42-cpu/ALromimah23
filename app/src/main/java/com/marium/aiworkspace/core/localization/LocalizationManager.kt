package ai.albader.alromimh.com.core.localization

import android.content.Context
import java.util.Locale

// Placeholder for dual-language support (Arabic & English)
class LocalizationManager(private val context: Context) {

    fun setLocale(languageCode: String) {
        val locale = Locale(languageCode)
        Locale.setDefault(locale)
        val configuration = context.resources.configuration
        configuration.setLocale(locale)
        context.resources.updateConfiguration(configuration, context.resources.displayMetrics)
    }

    fun getString(resId: Int): String {
        return context.getString(resId)
    }
}

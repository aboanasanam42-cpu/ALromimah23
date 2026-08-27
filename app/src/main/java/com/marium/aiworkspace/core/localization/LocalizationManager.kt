package com.marium.aiworkspace.core.localization

import android.content.Context
import android.content.res.Configuration
import android.os.Build
import android.os.LocaleList
import java.util.Locale

class LocalizationManager(private val context: Context) {

    fun setLocale(languageCode: String): Context {
        val locale = Locale(languageCode)
        Locale.setDefault(locale)

        val configuration = Configuration(context.resources.configuration)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            configuration.setLocales(LocaleList(locale))
            return context.createConfigurationContext(configuration)
        } else {
            @Suppress("DEPRECATION")
            configuration.locale = locale
            @Suppress("DEPRECATION")
            context.resources.updateConfiguration(configuration, context.resources.displayMetrics)
            return context
        }
    }

    fun getString(resId: Int): String {
        return context.getString(resId)
    }

    fun isRtl(languageCode: String = Locale.getDefault().language): Boolean {
        return languageCode == "ar"
    }
}

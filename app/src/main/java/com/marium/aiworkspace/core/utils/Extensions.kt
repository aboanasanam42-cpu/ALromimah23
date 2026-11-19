package com.marium.aiworkspace.core.utils

import java.util.Locale

object Extensions {
    fun String.capitalizeWords(): String {
        return this.split(" ").joinToString(" ") { word ->
            word.replaceFirstChar { ch ->
                if (ch.isLowerCase()) ch.titlecase(Locale.getDefault()) else ch.toString()
            }
        }
    }
}

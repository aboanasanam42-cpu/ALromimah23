# Jetpack Compose Rules
-keep class androidx.compose.runtime.** { *; }
-keep class androidx.compose.material3.** { *; }
-keep class androidx.compose.ui.** { *; }
-keep class androidx.compose.foundation.** { *; }
-keep class androidx.navigation.** { *; }
-dontwarn androidx.compose.**

# Kotlin Coroutines & Flow
-keep class kotlinx.coroutines.** { *; }
-keepclassmembers class kotlinx.coroutines.** { *; }
-dontwarn kotlinx.coroutines.**

# Firebase & Google Play Services
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# Domain & Data Transfer Objects
-keep class com.marium.aiworkspace.ai.** { *; }
-keep class com.marium.aiworkspace.auth.** { *; }
-keep class com.marium.aiworkspace.cloud.** { *; }
-keep class com.marium.aiworkspace.core.** { *; }
-keep class com.marium.aiworkspace.opportunities.** { *; }
-keep class com.marium.aiworkspace.payments.** { *; }
-keep class com.marium.aiworkspace.settings.** { *; }
-keep class com.marium.aiworkspace.dashboard.** { *; }

# Security & KeyStore Cryptography
-keep class com.marium.aiworkspace.core.security.BiometricWrapper { *; }
-keep class javax.crypto.** { *; }
-keep class java.security.** { *; }

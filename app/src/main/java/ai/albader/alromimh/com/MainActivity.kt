package ai.albader.alromimh.com

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import ai.albader.alromimh.com.auth.login.LoginScreen
import ai.albader.alromimh.com.ui.theme.CloudWorkerAITheme
import com.google.firebase.FirebaseApp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // 1. تهيئة Firebase بشكل آمن تماماً
        var isFirebaseInitialized = true
        try {
            FirebaseApp.initializeApp(this)
        } catch (e: Exception) {
            isFirebaseInitialized = false
            Log.e("MainActivity", "Firebase Initialization Failed: ${e.message}", e)
        }

        setContent {
            CloudWorkerAITheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    if (!isFirebaseInitialized) {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = "خطأ في تهيئة Firebase. تحقق من ملف google-services.json")
                        }
                    } else {
                        LoginScreen()
                    }
                }
            }
        }
    }
}

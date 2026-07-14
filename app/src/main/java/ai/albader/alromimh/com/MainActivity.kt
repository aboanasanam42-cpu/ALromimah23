package ai.albader.alromimh.com

import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import ai.albader.alromimh.com.auth.login.LoginScreen
import ai.albader.alromimh.com.ui.theme.CloudworkerAITheme
import com.google.firebase.FirebaseApp // استيراد مكتبة فايربيس

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // 1. تهيئة Firebase بشكل آمن لمنع الانهيار عند التشغيل
        try {
            FirebaseApp.initializeApp(this)
        } catch (e: Exception) {
            Log.e("MainActivity", "Firebase initialization failed", e)
            Toast.makeText(this, "خطأ في تهيئة الخدمات السحابية", Toast.LENGTH_LONG).show()
        }

        // 2. عرض الواجهة الرسومية
        setContent {
            CloudworkerAITheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    try {
                        LoginScreen()
                    } catch (e: Exception) {
                        Log.e("MainActivity", "Error rendering LoginScreen", e)
                        // في حال وجود خطأ داخلي في الشاشة، لن يتجمد التطبيق بل سيعرض خطأ واضحاً
                    }
                }
            }
        }
    }
}

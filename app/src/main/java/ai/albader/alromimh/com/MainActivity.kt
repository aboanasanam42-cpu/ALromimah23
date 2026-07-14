package ai.albader.alromimh.com

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import ai.albader.alromimh.com.auth.login.LoginScreen
import ai.albader.alromimh.com.ui.theme.CloudworkerAITheme
import io.github.jan-tennert.supabase.createSupabaseClient
import io.github.jan-tennert.supabase.auth.Auth
import io.github.jan-tennert.supabase.postgrest.Postgrest
import io.github.jan-tennert.supabase.realtime.Realtime

class MainActivity : ComponentActivity() {

    companion object {
        // سنضع هنا رابط مشروعك ومفتاح الـ Anon الخاص بـ Supabase لاحقاً
        const val SUPABASE_URL = "https://your-project-id.supabase.co"
        const val SUPABASE_ANON_KEY = "your-anon-key-here"

        // كائن الاتصال الرئيسي بـ Supabase
        val supabase = createSupabaseClient(
            supabaseUrl = SUPABASE_URL,
            supabaseKey = SUPABASE_ANON_KEY
        ) {
            install(Auth)
            install(Postgrest)
            install(Realtime)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setContent {
            CloudworkerAITheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    // تشغيل شاشة تسجيل الدخول مباشرة وبأمان
                    LoginScreen()
                }
            }
        }
    }
}

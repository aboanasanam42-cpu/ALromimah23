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
import io.github.jan-tennert.supabase.gotrue.GoTrue
import io.github.jan-tennert.supabase.postgrest.Postgrest
import io.github.jan-tennert.supabase.realtime.Realtime

class MainActivity : ComponentActivity() {

    companion object {
        // تم ربط موقعك بنجاح
        const val SUPABASE_URL = "https://xvuniotkyrvdlgxlhotq.supabase.co"
        
        // تم ربط مفتاح الأمان الطويل الخاص بك بنجاح
        const val SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dW5pb3RreXJ2ZGxneGxob3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNDQ5NDksImV4cCI6MjA5OTYyMDk0OX0.4UrHxa54lJnWBF5KuRCB7L40BW8CgaSYIB6GSfn8dp0"

        val supabase = createSupabaseClient(
            supabaseUrl = SUPABASE_URL,
            supabaseKey = SUPABASE_ANON_KEY
        ) {
            install(GoTrue)
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
                    LoginScreen()
                }
            }
        }
    }
}

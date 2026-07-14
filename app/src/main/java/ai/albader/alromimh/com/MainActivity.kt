package ai.albader.alromimh.com

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import ai.albader.alromimh.com.auth.login.LoginScreen
import ai.albader.alromimh.com.ui.theme.AlromimahTheme // تأكد من مطابقة اسم الـ Theme الفعلي لديك

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AlromimahTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    // تشغيل شاشة تسجيل الدخول كشاشة رئيسية عند فتح التطبيق
                    LoginScreen() 
                }
            }
        }
    }
}

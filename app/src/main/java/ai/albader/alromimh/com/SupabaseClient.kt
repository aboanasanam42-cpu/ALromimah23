package ai.albader.alromimh.com

import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.gotrue.GoTrue // الاستيراد الصحيح والحديث لعملية المصادقة

// كائن العميل الخاص بـ Supabase للاتصال بقاعدة البيانات وإدارة الجلسات
val supabaseClient = createSupabaseClient(
    supabaseUrl = "https://your-project-id.supabase.co", // استبدلها برابط مشروعك الخاص بـ Supabase
    supabaseKey = "your-anon-key" // استبدلها بمفتاح anon الخاص بمشروعك
) {
    // تثبيت المكونات الأساسية للعمل
    install(Postgrest)
    install(GoTrue) {
        // يمكنك إضافة إعدادات إضافية للمصادقة هنا إذا رغبت مستقبلاً
    }
}

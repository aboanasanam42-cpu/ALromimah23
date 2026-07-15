package ai.albader.alromimh.com

import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.gotrue.GoTrue

// إعداد عميل Supabase للاتصال بالسحابة
val supabase = createSupabaseClient(
    supabaseUrl = "https://pdlhyolxjnymkhutzkew.supabase.co",
    supabaseKey = "sb_publishable_XbVsa5L5erbW-BXDonNTEQ_Y6wXkJ3J"
) {
    install(Postgrest)
    install(GoTrue)
}

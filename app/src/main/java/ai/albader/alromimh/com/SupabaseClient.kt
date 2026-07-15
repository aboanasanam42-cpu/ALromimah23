package ai.albader.alromimh.com

import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.gotrue.Auth
import io.ktor.client.engine.android.Android
import io.github.jan.supabase.serializer.KotlinXSerializer
import kotlinx.serialization.json.Json

val supabase = createSupabaseClient(
    supabaseUrl = "https://pdlhyolxjnymkhutzkew.supabase.co",
    supabaseKey = "sb_publishable_XbVsa5L5erbW-BXDonNTEQ_Y6wXkJ3J"
) {
    install(Postgrest)
    install(Auth)
    // نستخدم Ktor مع محرك Android
    defaultClient = io.ktor.client.HttpClient(Android)
    serializer = KotlinXSerializer(Json {
        ignoreUnknownKeys = true
    })
}

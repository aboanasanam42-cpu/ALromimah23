package ai.albader.alromimh.com.domain.model

data class UserProfile(
    val id: String,
    val name: String,
    val email: String,
    val phone: String? = null,
    val bio: String? = null,
    val avatarUrl: String? = null,
    val skills: List<String> = emptyList(),
    val experience: String? = null,
    val education: String? = null,
    val language: String = "en",
    val isBiometricEnabled: Boolean = false,
    val theme: String = "system"
)

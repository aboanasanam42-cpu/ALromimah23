package ai.albader.alromimh.com.domain.model

data class Opportunity(
    val id: String,
    val title: String,
    val company: String,
    val location: String,
    val description: String,
    val requirements: List<String> = emptyList(),
    val salaryRange: String? = null,
    val category: String,
    val url: String,
    val postedDate: String,
    val type: String,
    val experienceLevel: String? = null,
    val isSaved: Boolean = false,
    val isApplied: Boolean = false,
    val aiScore: Int = 0
)

package ai.albader.alromimh.com.domain.model

data class Application(
    val id: String,
    val opportunityId: String,
    val opportunityTitle: String,
    val companyName: String,
    val status: ApplicationStatus,
    val appliedAt: Long,
    val coverLetter: String? = null,
    val resumeUrl: String? = null,
    val notes: String? = null
)

enum class ApplicationStatus {
    DRAFT, SUBMITTED, UNDER_REVIEW, INTERVIEW, ACCEPTED, REJECTED
}

package ai.albader.alromimh.com.domain.model

data class Payment(
    val id: String,
    val opportunityId: String,
    val title: String,
    val amount: Double,
    val currency: String,
    val status: PaymentStatus,
    val paymentMethod: String,
    val transactionDate: Long,
    val notes: String = ""
)

enum class PaymentStatus {
    PENDING, COMPLETED, FAILED, REFUNDED
}

package ai.albader.alromimh.com.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "payments")
data class PaymentEntity(
    @PrimaryKey
    val id: String,
    val opportunityId: String,
    val title: String,
    val amount: Double,
    val currency: String,
    val status: String,
    val paymentMethod: String,
    val transactionDate: Long,
    val notes: String = "",
    val createdAt: Long = System.currentTimeMillis()
)

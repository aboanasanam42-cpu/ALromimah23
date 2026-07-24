package ai.albader.alromimh.com.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "opportunities")
data class OpportunityEntity(
    @PrimaryKey
    val id: String,
    val title: String,
    val description: String,
    val category: String,
    val budget: Double,
    val currency: String,
    val location: String,
    val deadline: Long,
    val requiredSkills: List<String>,
    val aiScore: Double,
    val aiMatchReason: String,
    val isSaved: Boolean = false,
    val isApplied: Boolean = false,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)

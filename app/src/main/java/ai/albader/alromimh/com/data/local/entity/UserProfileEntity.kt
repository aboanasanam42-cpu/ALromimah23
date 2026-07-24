package ai.albader.alromimh.com.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "user_profile")
data class UserProfileEntity(
    @PrimaryKey
    val id: String = "user_001",
    val name: String,
    val email: String,
    val phone: String,
    val bio: String,
    val skills: List<String>,
    val experienceYears: Int,
    val preferredCategories: List<String>,
    val minBudget: Double,
    val maxBudget: Double,
    val preferredLocations: List<String>,
    val isBiometricEnabled: Boolean = false,
    val language: String = "en",
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)

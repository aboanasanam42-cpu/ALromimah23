package com.marium.aiworkspace.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.Date

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey val uid: String = "",
    val email: String? = null,
    val displayName: String? = null,
    val phoneNumber: String? = null,
    val photoUrl: String? = null,
    val createdAt: Date = Date(),
    val isPremium: Boolean = false,
    val walletBalance: Double = 0.0,
    val totalEarnings: Double = 0.0,
    val completedJobs: Int = 0,
    val rating: Double = 0.0
)

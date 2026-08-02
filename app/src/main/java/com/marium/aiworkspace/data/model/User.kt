package com.marium.aiworkspace.data.model

import java.util.Date

data class User(
    val uid: String = "",
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

package com.marium.aiworkspace.data.model

/**
 * UI model for user profile screen.
 */
data class UserProfile(
    val uid: String = "",
    val name: String? = null,
    val email: String? = null,
    val avatarUrl: String? = null,
    val completedProjects: Int = 0,
    val totalEarnings: Double = 0.0,
    val rating: Double = 0.0,
    val skills: List<String> = emptyList(),
    val bio: String = ""
)
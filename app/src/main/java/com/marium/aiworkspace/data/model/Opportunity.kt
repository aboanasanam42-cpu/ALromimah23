package com.marium.aiworkspace.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.firebase.firestore.DocumentId
import kotlinx.serialization.Serializable

@Entity(tableName = "opportunities")
@Serializable
data class Opportunity(
    @PrimaryKey
    @DocumentId
    val id: String = "",
    val title: String = "",
    val description: String = "",
    val company: String = "",
    val category: String = "",
    val type: String = "", // remote, freelance, part-time, full-time
    val salary: String = "",
    val salaryValue: Double = 0.0,
    val currency: String = "USD",
    val url: String = "",
    val source: String = "",
    val location: String = "Remote",
    val postedAt: Long = System.currentTimeMillis(),
    val deadline: Long? = null,
    val skills: List<String> = emptyList(),
    val aiScore: Double = 0.0,
    val reliabilityScore: Double = 0.0,
    val isScam: Boolean = false,
    val isBookmarked: Boolean = false,
    val isApplied: Boolean = false,
    val status: String = "active" // active, expired, filled
)

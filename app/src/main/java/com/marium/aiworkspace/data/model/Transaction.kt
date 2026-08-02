package com.marium.aiworkspace.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "transactions")
data class Transaction(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val userId: String = "",
    val type: String = "", // earning, withdrawal, deposit, subscription
    val amount: Double = 0.0,
    val currency: String = "USD",
    val description: String = "",
    val status: String = "pending", // pending, completed, failed
    val referenceId: String = "",
    val timestamp: Long = System.currentTimeMillis()
)

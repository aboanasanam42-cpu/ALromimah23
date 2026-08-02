package com.marium.aiworkspace.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "payment_methods")
data class PaymentMethod(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val userId: String = "",
    val type: String = "", // paypal, bank, crypto, stripe
    val name: String = "",
    val accountNumber: String = "", // encrypted
    val isDefault: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)

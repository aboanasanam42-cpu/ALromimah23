package com.marium.aiworkspace.data.local

import androidx.room.*
import com.marium.aiworkspace.data.model.PaymentMethod
import kotlinx.coroutines.flow.Flow

@Dao
interface PaymentDao {

    @Query("SELECT * FROM payment_methods WHERE userId = :userId")
    fun getPaymentMethods(userId: String): Flow<List<PaymentMethod>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPaymentMethod(paymentMethod: PaymentMethod)

    @Delete
    suspend fun deletePaymentMethod(paymentMethod: PaymentMethod)

    @Query("UPDATE payment_methods SET isDefault = 0 WHERE userId = :userId")
    suspend fun clearDefaultPayment(userId: String)

    @Query("UPDATE payment_methods SET isDefault = 1 WHERE id = :id")
    suspend fun setDefaultPayment(id: Int)
}

package com.marium.aiworkspace.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.marium.aiworkspace.data.model.Opportunity
import com.marium.aiworkspace.data.model.PaymentMethod
import com.marium.aiworkspace.data.model.Transaction
import com.marium.aiworkspace.data.model.UserEntity

@Database(
    entities = [Opportunity::class, PaymentMethod::class, Transaction::class, UserEntity::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun opportunityDao(): OpportunityDao
    abstract fun paymentDao(): PaymentDao
    abstract fun transactionDao(): TransactionDao
    abstract fun userDao(): UserDao
}

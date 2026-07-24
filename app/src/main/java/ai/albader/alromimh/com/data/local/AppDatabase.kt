package ai.albader.alromimh.com.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import ai.albader.alromimh.com.data.local.dao.*
import ai.albader.alromimh.com.data.local.entity.*

@Database(
    entities = [
        OpportunityEntity::class,
        UserProfileEntity::class,
        PaymentEntity::class,
        ApplicationEntity::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun opportunityDao(): OpportunityDao
    abstract fun userProfileDao(): UserProfileDao
    abstract fun paymentDao(): PaymentDao
    abstract fun applicationDao(): ApplicationDao
}

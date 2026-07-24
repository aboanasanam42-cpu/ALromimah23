package ai.albader.alromimh.com.di

import android.content.Context
import androidx.room.Room
import ai.albader.alromimh.com.data.local.AppDatabase
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "cloudworker.db"
        ).build()
    }

    @Provides
    fun provideOpportunityDao(db: AppDatabase) = db.opportunityDao()

    @Provides
    fun provideUserProfileDao(db: AppDatabase) = db.userProfileDao()

    @Provides
    fun providePaymentDao(db: AppDatabase) = db.paymentDao()

    @Provides
    fun provideApplicationDao(db: AppDatabase) = db.applicationDao()
}

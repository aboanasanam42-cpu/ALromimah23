package ai.albader.alromimh.com.di

import ai.albader.alromimh.com.data.repository.OpportunityRepositoryImpl
import ai.albader.alromimh.com.domain.repository.OpportunityRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindOpportunityRepository(
        impl: OpportunityRepositoryImpl
    ): OpportunityRepository
}

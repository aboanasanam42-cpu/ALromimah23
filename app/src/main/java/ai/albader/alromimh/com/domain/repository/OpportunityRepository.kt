package ai.albader.alromimh.com.domain.repository

import ai.albader.alromimh.com.domain.model.Opportunity
import ai.albader.alromimh.com.domain.util.Resource
import kotlinx.coroutines.flow.Flow

interface OpportunityRepository {
    fun getOpportunities(): Flow<Resource<List<Opportunity>>>
    fun getSavedOpportunities(): Flow<List<Opportunity>>
    suspend fun toggleSaveOpportunity(id: String, isSaved: Boolean)
    suspend fun updateAppliedStatus(id: String, isApplied: Boolean)
    fun searchOpportunities(query: String): Flow<Resource<List<Opportunity>>>
}

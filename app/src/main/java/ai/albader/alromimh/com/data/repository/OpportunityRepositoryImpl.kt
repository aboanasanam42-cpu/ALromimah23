package ai.albader.alromimh.com.data.repository

import ai.albader.alromimh.com.data.local.dao.OpportunityDao
import ai.albader.alromimh.com.data.local.entity.OpportunityEntity
import ai.albader.alromimh.com.data.remote.api.CloudWorkerApi
import ai.albader.alromimh.com.domain.model.Opportunity
import ai.albader.alromimh.com.domain.repository.OpportunityRepository
import ai.albader.alromimh.com.domain.util.Resource
import kotlinx.coroutines.flow.*
import javax.inject.Inject

class OpportunityRepositoryImpl @Inject constructor(
    private val api: CloudWorkerApi,
    private val dao: OpportunityDao
) : OpportunityRepository {

    override fun getOpportunities(): Flow<Resource<List<Opportunity>>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getOpportunities()
            if (response.isSuccessful) {
                val opportunities = response.body()?.opportunities?.map { it.toDomain() } ?: emptyList()
                dao.insertOpportunities(opportunities.map { it.toEntity() })
                emit(Resource.Success(opportunities))
            } else {
                emit(Resource.Error("Failed to load opportunities"))
            }
        } catch (e: Exception) {
            val local = dao.getAllOpportunities().first().map { it.toDomain() }
            emit(Resource.Success(local))
        }
    }

    override fun getSavedOpportunities(): Flow<List<Opportunity>> {
        return dao.getSavedOpportunities().map { list -> list.map { it.toDomain() } }
    }

    override suspend fun toggleSaveOpportunity(id: String, isSaved: Boolean) {
        dao.updateSavedStatus(id, isSaved)
    }

    override suspend fun updateAppliedStatus(id: String, isApplied: Boolean) {
        dao.updateAppliedStatus(id, isApplied)
    }

    override fun searchOpportunities(query: String): Flow<Resource<List<Opportunity>>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.searchOpportunities(query)
            if (response.isSuccessful) {
                val opportunities = response.body()?.opportunities?.map { it.toDomain() } ?: emptyList()
                emit(Resource.Success(opportunities))
            } else {
                emit(Resource.Error("Search failed"))
            }
        } catch (e: Exception) {
            emit(Resource.Error(e.message ?: "Unknown error"))
        }
    }

    private fun OpportunityDto.toDomain() = Opportunity(
        id = id,
        title = title,
        company = company,
        location = location,
        description = description,
        requirements = requirements ?: emptyList(),
        salaryRange = salaryRange,
        category = category,
        url = url,
        postedDate = postedDate,
        type = type,
        experienceLevel = experienceLevel,
        aiScore = (70..98).random()
    )

    private fun Opportunity.toEntity() = OpportunityEntity(
        id = id,
        title = title,
        company = company,
        location = location,
        description = description,
        requirements = requirements,
        salaryRange = salaryRange,
        category = category,
        url = url,
        postedDate = postedDate,
        type = type,
        experienceLevel = experienceLevel,
        isSaved = isSaved,
        isApplied = isApplied,
        aiScore = aiScore,
        createdAt = System.currentTimeMillis()
    )

    private fun OpportunityEntity.toDomain() = Opportunity(
        id = id,
        title = title,
        company = company,
        location = location,
        description = description,
        requirements = requirements,
        salaryRange = salaryRange,
        category = category,
        url = url,
        postedDate = postedDate,
        type = type,
        experienceLevel = experienceLevel,
        isSaved = isSaved,
        isApplied = isApplied,
        aiScore = aiScore
    )
}

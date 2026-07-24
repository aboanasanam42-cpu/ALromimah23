package ai.albader.alromimh.com.domain.usecase

import ai.albader.alromimh.com.domain.model.Opportunity
import ai.albader.alromimh.com.domain.repository.OpportunityRepository
import ai.albader.alromimh.com.domain.util.Resource
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class GetOpportunitiesUseCase @Inject constructor(
    private val repository: OpportunityRepository
) {
    operator fun invoke(): Flow<Resource<List<Opportunity>>> = repository.getOpportunities()
}

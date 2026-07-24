package ai.albader.alromimh.com.domain.usecase

import ai.albader.alromimh.com.domain.repository.OpportunityRepository
import javax.inject.Inject

class ToggleSaveOpportunityUseCase @Inject constructor(
    private val repository: OpportunityRepository
) {
    suspend operator fun invoke(id: String, isSaved: Boolean) {
        repository.toggleSaveOpportunity(id, isSaved)
    }
}

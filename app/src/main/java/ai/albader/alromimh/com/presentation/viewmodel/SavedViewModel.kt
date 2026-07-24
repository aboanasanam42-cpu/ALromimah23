package ai.albader.alromimh.com.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ai.albader.alromimh.com.domain.model.Opportunity
import ai.albader.alromimh.com.domain.repository.OpportunityRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SavedViewModel @Inject constructor(
    private val repository: OpportunityRepository
) : ViewModel() {

    val savedOpportunities: StateFlow<List<Opportunity>> = repository.getSavedOpportunities()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun toggleSave(id: String, isSaved: Boolean) {
        viewModelScope.launch {
            repository.toggleSaveOpportunity(id, isSaved)
        }
    }
}

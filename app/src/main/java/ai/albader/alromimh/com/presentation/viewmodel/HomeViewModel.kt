package ai.albader.alromimh.com.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ai.albader.alromimh.com.domain.model.Opportunity
import ai.albader.alromimh.com.domain.usecase.GetOpportunitiesUseCase
import ai.albader.alromimh.com.domain.usecase.ToggleSaveOpportunityUseCase
import ai.albader.alromimh.com.domain.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val getOpportunitiesUseCase: GetOpportunitiesUseCase,
    private val toggleSaveUseCase: ToggleSaveOpportunityUseCase
) : ViewModel() {

    private val _opportunities = MutableStateFlow<Resource<List<Opportunity>>>(Resource.Loading())
    val opportunities: StateFlow<Resource<List<Opportunity>>> = _opportunities.asStateFlow()

    init {
        loadOpportunities()
    }

    private fun loadOpportunities() {
        getOpportunitiesUseCase().onEach { result ->
            _opportunities.value = result
        }.launchIn(viewModelScope)
    }

    fun toggleSave(id: String, isSaved: Boolean) {
        viewModelScope.launch {
            toggleSaveUseCase(id, isSaved)
        }
    }
}

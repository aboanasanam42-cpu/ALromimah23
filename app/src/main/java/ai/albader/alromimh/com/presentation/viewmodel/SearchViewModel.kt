package ai.albader.alromimh.com.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ai.albader.alromimh.com.domain.model.Opportunity
import ai.albader.alromimh.com.domain.usecase.SearchOpportunitiesUseCase
import ai.albader.alromimh.com.domain.usecase.ToggleSaveOpportunityUseCase
import ai.albader.alromimh.com.domain.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SearchViewModel @Inject constructor(
    private val searchUseCase: SearchOpportunitiesUseCase,
    private val toggleSaveUseCase: ToggleSaveOpportunityUseCase
) : ViewModel() {

    private val _searchResults = MutableStateFlow<Resource<List<Opportunity>>>(Resource.Success(emptyList()))
    val searchResults: StateFlow<Resource<List<Opportunity>>> = _searchResults.asStateFlow()

    private val _searchQuery = MutableStateFlow("")

    init {
        _searchQuery
            .debounce(300)
            .filter { it.isNotBlank() }
            .flatMapLatest { query ->
                searchUseCase(query)
            }
            .onEach { result ->
                _searchResults.value = result
            }
            .launchIn(viewModelScope)
    }

    fun search(query: String) {
        _searchQuery.value = query
        if (query.isBlank()) {
            _searchResults.value = Resource.Success(emptyList())
        }
    }

    fun toggleSave(id: String, isSaved: Boolean) {
        viewModelScope.launch {
            toggleSaveUseCase(id, isSaved)
        }
    }
}

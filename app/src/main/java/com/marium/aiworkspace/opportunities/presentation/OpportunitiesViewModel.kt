package com.marium.aiworkspace.opportunities.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.marium.aiworkspace.data.model.Opportunity
import com.marium.aiworkspace.opportunities.data.OpportunityDataSource
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * ViewModel for Opportunities Screen.
 */
class OpportunitiesViewModel(
    private val dataSource: OpportunityDataSource
) : ViewModel() {

    data class OpportunitiesUiState(
        val opportunities: List<Opportunity> = emptyList(),
        val isLoading: Boolean = false,
        val error: String? = null,
        val selectedCategory: String? = null,
        val searchQuery: String = "",
        val bookmarkedOnly: Boolean = false
    )

    private val _uiState = MutableStateFlow(OpportunitiesUiState())
    val uiState: StateFlow<OpportunitiesUiState> = _uiState.asStateFlow()

    init {
        loadOpportunities()
    }

    fun loadOpportunities(forceRefresh: Boolean = false) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }

            try {
                dataSource.getOpportunities(
                    category = _uiState.value.selectedCategory,
                    forceRefresh = forceRefresh
                )
                    .catch { e ->
                        _uiState.update { it.copy(isLoading = false, error = e.message) }
                    }
                    .collect { opportunities ->
                        _uiState.update {
                            it.copy(
                                opportunities = opportunities,
                                isLoading = false,
                                error = null
                            )
                        }
                    }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, error = e.message) }
            }
        }
    }

    fun selectCategory(category: String?) {
        _uiState.update { it.copy(selectedCategory = category) }
        loadOpportunities(forceRefresh = true)
    }

    fun toggleBookmark(opportunity: Opportunity) {
        viewModelScope.launch {
            dataSource.toggleBookmark(opportunity.id, opportunity.isBookmarked)
            loadOpportunities()
        }
    }

    fun search(query: String) {
        _uiState.update { it.copy(searchQuery = query) }
        if (query.length >= 2) {
            viewModelScope.launch {
                val results = dataSource.searchOpportunities(query)
                _uiState.update { it.copy(opportunities = results) }
            }
        } else if (query.isEmpty()) {
            loadOpportunities()
        }
    }

    fun toggleBookmarkedFilter() {
        val newValue = !_uiState.value.bookmarkedOnly
        _uiState.update { it.copy(bookmarkedOnly = newValue) }

        if (newValue) {
            viewModelScope.launch {
                dataSource.getBookmarkedOpportunities()
                    .collect { bookmarked ->
                        _uiState.update { it.copy(opportunities = bookmarked) }
                    }
            }
        } else {
            loadOpportunities()
        }
    }

    fun analyzeOpportunity(opportunity: Opportunity) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            dataSource.analyzeOpportunity(opportunity)
                .onSuccess { analyzed ->
                    val updatedList = _uiState.value.opportunities.map {
                        if (it.id == analyzed.id) analyzed else it
                    }
                    _uiState.update { it.copy(opportunities = updatedList, isLoading = false) }
                }
                .onFailure { e ->
                    _uiState.update { it.copy(isLoading = false, error = e.message) }
                }
        }
    }

    fun clearError() {
        _uiState.update { it.copy(error = null) }
    }
}

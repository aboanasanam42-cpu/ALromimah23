package com.marium.aiworkspace.ai.analysis

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.marium.aiworkspace.ai.analyzer.AIAnalyzer
import com.marium.aiworkspace.data.model.AIAnalysisResult
import com.marium.aiworkspace.data.model.Opportunity
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

/**
 * ViewModel for AI Analysis feature.
 */
class AIAnalysisViewModel(
    private val aiAnalyzer: AIAnalyzer = AIAnalyzer()
) : ViewModel() {

    private val _uiState = MutableStateFlow(AIAnalysisUiState())
    val uiState: StateFlow<AIAnalysisUiState> = _uiState

    fun analyzeOpportunity(opportunity: Opportunity) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isLoading = true,
                error = null,
                opportunity = opportunity
            )

            aiAnalyzer.analyzeOpportunity(opportunity)
                .onSuccess { result ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        result = result
                    )
                }
                .onFailure { error ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = error.message ?: "Analysis failed"
                    )
                }
        }
    }

    fun quickScore(opportunity: Opportunity) {
        viewModelScope.launch {
            val score = aiAnalyzer.quickScore(opportunity)
            _uiState.value = _uiState.value.copy(
                quickScore = score
            )
        }
    }

    fun dismissError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}

data class AIAnalysisUiState(
    val isLoading: Boolean = false,
    val opportunity: Opportunity? = null,
    val result: AIAnalysisResult? = null,
    val quickScore: Int? = null,
    val error: String? = null
)

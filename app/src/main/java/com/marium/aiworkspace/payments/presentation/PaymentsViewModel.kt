package com.marium.aiworkspace.payments.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.marium.aiworkspace.data.model.PaymentMethod
import com.marium.aiworkspace.data.model.Transaction
import com.marium.aiworkspace.payments.data.PaymentDataSource
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * ViewModel for Payments & Wallet.
 */
class PaymentsViewModel(
    private val paymentDataSource: PaymentDataSource,
    private val userId: String
) : ViewModel() {

    data class PaymentsUiState(
        val balance: Double = 0.0,
        val totalEarnings: Double = 0.0,
        val paymentMethods: List<PaymentMethod> = emptyList(),
        val transactions: List<Transaction> = emptyList(),
        val isLoading: Boolean = false,
        val error: String? = null,
        val successMessage: String? = null
    )

    private val _uiState = MutableStateFlow(PaymentsUiState())
    val uiState: StateFlow<PaymentsUiState> = _uiState.asStateFlow()

    init {
        loadWalletData()
    }

    fun loadWalletData() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            try {
                val balance = paymentDataSource.getWalletBalance(userId)
                val earnings = paymentDataSource.getTotalEarnings(userId)
                _uiState.update {
                    it.copy(
                        balance = balance,
                        totalEarnings = earnings,
                        isLoading = false
                    )
                }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, error = e.message) }
            }
        }
    }

    fun addEarning(amount: Double, description: String, referenceId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            paymentDataSource.addEarning(userId, amount, description, referenceId)
                .onSuccess {
                    loadWalletData()
                    _uiState.update { it.copy(successMessage = "Earning added: $$amount") }
                }
                .onFailure { e ->
                    _uiState.update { it.copy(isLoading = false, error = e.message) }
                }
        }
    }

    fun requestWithdrawal(amount: Double, paymentMethodId: Int, description: String) {
        viewModelScope.launch {
            if (amount > _uiState.value.balance) {
                _uiState.update { it.copy(error = "Insufficient balance") }
                return@launch
            }
            _uiState.update { it.copy(isLoading = true) }
            paymentDataSource.requestWithdrawal(userId, amount, paymentMethodId, description)
                .onSuccess { refId ->
                    loadWalletData()
                    _uiState.update { it.copy(successMessage = "Withdrawal requested: $refId") }
                }
                .onFailure { e ->
                    _uiState.update { it.copy(isLoading = false, error = e.message) }
                }
        }
    }

    fun addPaymentMethod(paymentMethod: PaymentMethod) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            paymentDataSource.addPaymentMethod(paymentMethod)
                .onSuccess {
                    _uiState.update { it.copy(isLoading = false, successMessage = "Payment method added") }
                }
                .onFailure { e ->
                    _uiState.update { it.copy(isLoading = false, error = e.message) }
                }
        }
    }

    fun clearMessages() {
        _uiState.update { it.copy(error = null, successMessage = null) }
    }
}

package com.marium.aiworkspace.auth.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.marium.aiworkspace.auth.data.UserDataSource
import com.marium.aiworkspace.core.security.BiometricWrapper
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

/**
 * Authentication ViewModel.
 */
class AuthViewModel(
    private val userDataSource: UserDataSource
) : ViewModel() {

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState

    init {
        checkBiometricAvailability()
    }

    private fun checkBiometricAvailability() {
        _uiState.value = _uiState.value.copy(
            isBiometricAvailable = userDataSource.isBiometricAvailable()
        )
    }

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            try {
                val success = userDataSource.login(email, password)
                if (success) {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        isLoggedIn = true
                    )
                } else {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = "البريد الإلكتروني أو كلمة المرور غير صحيحة"
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "حدث خطأ غير متوقع"
                )
            }
        }
    }

    fun authenticateWithBiometric() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            try {
                val result = userDataSource.authenticateWithBiometric()
                when (result) {
                    is BiometricWrapper.AuthResult.Success -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            isLoggedIn = true
                        )
                    }
                    is BiometricWrapper.AuthResult.Error -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            error = result.message
                        )
                    }
                    BiometricWrapper.AuthResult.Cancelled -> {
                        _uiState.value = _uiState.value.copy(isLoading = false)
                    }
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "فشلت المصادقة البيومترية"
                )
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            userDataSource.logout()
            _uiState.value = AuthUiState(isBiometricAvailable = userDataSource.isBiometricAvailable())
        }
    }
}

data class AuthUiState(
    val isLoading: Boolean = false,
    val isLoggedIn: Boolean = false,
    val isBiometricAvailable: Boolean = false,
    val error: String? = null
)

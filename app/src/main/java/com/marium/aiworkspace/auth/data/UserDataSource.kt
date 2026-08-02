package com.marium.aiworkspace.auth.data

import android.content.Context
import android.util.Log
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.marium.aiworkspace.core.security.BiometricWrapper
import com.marium.aiworkspace.data.local.UserDao
import com.marium.aiworkspace.data.model.UserEntity
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.tasks.await

private val Context.dataStore by preferencesDataStore(name = "user_prefs")

/**
 * User data source handling auth, local persistence, and biometric.
 */
class UserDataSource(
    private val context: Context,
    private val userDao: UserDao,
    private val biometricWrapper: BiometricWrapper
) {
    companion object {
        private const val TAG = "UserDataSource"
        private val KEY_USER_ID = stringPreferencesKey("user_id")
        private val KEY_IS_LOGGED_IN = booleanPreferencesKey("is_logged_in")
    }

    private val auth = FirebaseAuth.getInstance()
    private val dataStore = context.dataStore

    val isLoggedIn: Boolean
        get() = auth.currentUser != null

    val currentUser: FirebaseUser?
        get() = auth.currentUser

    fun observeCurrentUser(): Flow<UserEntity?> = userDao.getCurrentUser()

    suspend fun login(email: String, password: String): Boolean {
        return try {
            val result = auth.signInWithEmailAndPassword(email, password).await()
            val firebaseUser = result.user
            if (firebaseUser != null) {
                saveUserToLocal(firebaseUser)
                dataStore.edit { prefs ->
                    prefs[KEY_USER_ID] = firebaseUser.uid
                    prefs[KEY_IS_LOGGED_IN] = true
                }
                true
            } else {
                false
            }
        } catch (e: Exception) {
            Log.e(TAG, "Login failed", e)
            false
        }
    }

    suspend fun register(email: String, password: String, displayName: String): Boolean {
        return try {
            val result = auth.createUserWithEmailAndPassword(email, password).await()
            val firebaseUser = result.user
            if (firebaseUser != null) {
                // Update display name
                val profileUpdates = com.google.firebase.auth.UserProfileChangeRequest.Builder()
                    .setDisplayName(displayName)
                    .build()
                firebaseUser.updateProfile(profileUpdates).await()
                saveUserToLocal(firebaseUser)
                true
            } else {
                false
            }
        } catch (e: Exception) {
            Log.e(TAG, "Registration failed", e)
            false
        }
    }

    suspend fun logout() {
        auth.signOut()
        userDao.clearAllUsers()
        dataStore.edit { prefs ->
            prefs.remove(KEY_USER_ID)
            prefs[KEY_IS_LOGGED_IN] = false
        }
    }

    fun isBiometricAvailable(): Boolean = biometricWrapper.canAuthenticate()

    suspend fun authenticateWithBiometric(): BiometricWrapper.AuthResult {
        // Check if we have a stored user
        val userId = dataStore.data.map { it[KEY_USER_ID] }.first()
        return if (userId != null) {
            // In a real app, you'd verify biometric then retrieve credentials
            BiometricWrapper.AuthResult.Success
        } else {
            BiometricWrapper.AuthResult.Error("No stored credentials")
        }
    }

    private suspend fun saveUserToLocal(firebaseUser: FirebaseUser) {
        val entity = UserEntity(
            uid = firebaseUser.uid,
            email = firebaseUser.email,
            displayName = firebaseUser.displayName,
            phoneNumber = firebaseUser.phoneNumber,
            photoUrl = firebaseUser.photoUrl?.toString()
        )
        userDao.insertUser(entity)
    }
}

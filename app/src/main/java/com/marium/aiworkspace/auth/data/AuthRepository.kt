package com.marium.aiworkspace.auth.data

import android.content.Context
import android.content.Intent
import android.util.Log
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.firebase.auth.AuthCredential
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.FirebaseException
import com.google.firebase.auth.PhoneAuthCredential
import com.google.firebase.auth.PhoneAuthOptions
import com.google.firebase.auth.PhoneAuthProvider
import com.google.firebase.firestore.FirebaseFirestore
import com.marium.aiworkspace.R
import com.marium.aiworkspace.data.model.User
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.tasks.await
import java.util.concurrent.TimeUnit

/**
 * Real Authentication Repository using Firebase Auth.
 * Supports Google Sign-In, Phone Authentication, and Email/Password.
 */
class AuthRepository(private val context: Context) {

    companion object {
        private const val TAG = "AuthRepository"
        private const val USERS_COLLECTION = "users"
    }

    private val auth: FirebaseAuth = FirebaseAuth.getInstance()
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()

    val currentUser: FirebaseUser? get() = auth.currentUser

    val isUserLoggedIn: Boolean get() = currentUser != null

    /**
     * Get Google Sign-In Client for UI integration
     */
    fun getGoogleSignInClient(): GoogleSignInClient {
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(context.getString(R.string.default_web_client_id))
            .requestEmail()
            .requestProfile()
            .build()
        return GoogleSignIn.getClient(context, gso)
    }

    /**
     * Sign in with Google
     */
    suspend fun signInWithGoogle(idToken: String): Result<FirebaseUser> {
        return try {
            val credential = GoogleAuthProvider.getCredential(idToken, null)
            val result = auth.signInWithCredential(credential).await()
            val user = result.user ?: throw Exception("Google sign-in failed: user is null")

            // Create/update user document in Firestore
            createUserDocument(user)
            Result.success(user)
        } catch (e: Exception) {
            Log.e(TAG, "Google sign-in error", e)
            Result.failure(e)
        }
    }

    /**
     * Handle Google Sign-In result from Activity
     */
    suspend fun handleGoogleSignInResult(data: Intent?): Result<FirebaseUser> {
        return try {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            val account = task.getResult(ApiException::class.java)
            val idToken = account?.idToken ?: throw Exception("Google ID Token is null")
            signInWithGoogle(idToken)
        } catch (e: ApiException) {
            Log.e(TAG, "Google sign-in failed: ${e.statusCode}", e)
            Result.failure(e)
        }
    }

    /**
     * Sign in with Email and Password
     */
    suspend fun signInWithEmail(email: String, password: String): Result<FirebaseUser> {
        return try {
            val result = auth.signInWithEmailAndPassword(email, password).await()
            val user = result.user ?: throw Exception("Email sign-in failed: user is null")
            Result.success(user)
        } catch (e: Exception) {
            Log.e(TAG, "Email sign-in error", e)
            Result.failure(e)
        }
    }

    /**
     * Register with Email and Password
     */
    suspend fun registerWithEmail(email: String, password: String, displayName: String): Result<FirebaseUser> {
        return try {
            val result = auth.createUserWithEmailAndPassword(email, password).await()
            val user = result.user ?: throw Exception("Registration failed: user is null")

            // Update display name
            val profileUpdates = com.google.firebase.auth.UserProfileChangeRequest.Builder()
                .setDisplayName(displayName)
                .build()
            user.updateProfile(profileUpdates).await()

            // Create user document
            createUserDocument(user, displayName)
            Result.success(user)
        } catch (e: Exception) {
            Log.e(TAG, "Registration error", e)
            Result.failure(e)
        }
    }

    /**
     * Send password reset email
     */
    suspend fun sendPasswordReset(email: String): Result<Unit> {
        return try {
            auth.sendPasswordResetEmail(email).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Log.e(TAG, "Password reset error", e)
            Result.failure(e)
        }
    }

    /**
     * Phone Authentication - Send verification code
     */
    fun sendPhoneVerificationCode(
        phoneNumber: String,
        onCodeSent: (String) -> Unit,
        onError: (Exception) -> Unit
    ) {
        val callbacks = object : PhoneAuthProvider.OnVerificationStateChangedCallbacks() {
            override fun onVerificationCompleted(credential: PhoneAuthCredential) {
                // Auto-verification on some devices
                runBlocking { signInWithPhoneCredential(credential) }
            }

            override fun onVerificationFailed(e: FirebaseException) {
                Log.e(TAG, "Phone verification failed", e)
                onError(e)
            }

            override fun onCodeSent(verificationId: String, token: PhoneAuthProvider.ForceResendingToken) {
                onCodeSent(verificationId)
            }
        }

        val options = PhoneAuthOptions.newBuilder(auth)
            .setPhoneNumber(phoneNumber)
            .setTimeout(60L, TimeUnit.SECONDS)
            .setCallbacks(callbacks)
            .build()

        PhoneAuthProvider.verifyPhoneNumber(options)
    }

    /**
     * Verify phone code and sign in
     */
    suspend fun verifyPhoneCode(verificationId: String, code: String): Result<FirebaseUser> {
        return try {
            val credential = PhoneAuthProvider.getCredential(verificationId, code)
            signInWithPhoneCredential(credential)
        } catch (e: Exception) {
            Log.e(TAG, "Phone code verification error", e)
            Result.failure(e)
        }
    }

    private suspend fun signInWithPhoneCredential(credential: PhoneAuthCredential): Result<FirebaseUser> {
        return try {
            val result = auth.signInWithCredential(credential).await()
            val user = result.user ?: throw Exception("Phone sign-in failed")
            createUserDocument(user)
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Sign out
     */
    suspend fun signOut() {
        auth.signOut()
        getGoogleSignInClient().signOut().await()
    }

    /**
     * Observe auth state changes
     */
    fun observeAuthState(): Flow<FirebaseUser?> = callbackFlow {
        val listener = FirebaseAuth.AuthStateListener { firebaseAuth ->
            trySend(firebaseAuth.currentUser)
        }
        auth.addAuthStateListener(listener)
        awaitClose { auth.removeAuthStateListener(listener) }
    }

    /**
     * Get user data from Firestore
     */
    suspend fun getUserData(uid: String): Result<User> {
        return try {
            val doc = firestore.collection(USERS_COLLECTION).document(uid).get().await()
            val user = doc.toObject(User::class.java) ?: User(uid = uid)
            Result.success(user)
        } catch (e: Exception) {
            Log.e(TAG, "Get user data error", e)
            Result.failure(e)
        }
    }

    /**
     * Update user data
     */
    suspend fun updateUserData(uid: String, updates: Map<String, Any>): Result<Unit> {
        return try {
            firestore.collection(USERS_COLLECTION).document(uid).update(updates).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Log.e(TAG, "Update user data error", e)
            Result.failure(e)
        }
    }

    /**
     * Delete account
     */
    suspend fun deleteAccount(): Result<Unit> {
        return try {
            val user = currentUser ?: throw Exception("No user logged in")
            firestore.collection(USERS_COLLECTION).document(user.uid).delete().await()
            user.delete().await()
            Result.success(Unit)
        } catch (e: Exception) {
            Log.e(TAG, "Delete account error", e)
            Result.failure(e)
        }
    }

    private suspend fun createUserDocument(user: FirebaseUser, overrideName: String? = null) {
        val userDoc = firestore.collection(USERS_COLLECTION).document(user.uid)
        val existingDoc = userDoc.get().await()

        if (!existingDoc.exists()) {
            val newUser = User(
                uid = user.uid,
                email = user.email,
                displayName = overrideName ?: user.displayName,
                phoneNumber = user.phoneNumber,
                photoUrl = user.photoUrl?.toString()
            )
            userDoc.set(newUser).await()
        }
    }
}

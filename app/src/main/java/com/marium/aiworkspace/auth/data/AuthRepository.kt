package com.marium.aiworkspace.auth.data

import android.app.Activity
import com.google.firebase.FirebaseException
import com.google.firebase.auth.AuthResult
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.auth.PhoneAuthCredential
import com.google.firebase.auth.PhoneAuthOptions
import com.google.firebase.auth.PhoneAuthProvider
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await
import java.util.concurrent.TimeUnit

sealed class PhoneVerificationState {
    data class CodeSent(val verificationId: String, val token: PhoneAuthProvider.ForceResendingToken) : PhoneVerificationState()
    data class VerificationCompleted(val credential: PhoneAuthCredential) : PhoneVerificationState()
    data class VerificationFailed(val exception: FirebaseException) : PhoneVerificationState()
}

class AuthRepository(private val auth: FirebaseAuth = FirebaseAuth.getInstance()) {

    val currentUser: FirebaseUser?
        get() = auth.currentUser

    fun observeAuthState(): Flow<FirebaseUser?> = callbackFlow {
        val listener = FirebaseAuth.AuthStateListener { firebaseAuth ->
            trySend(firebaseAuth.currentUser)
        }
        auth.addAuthStateListener(listener)
        awaitClose { auth.removeAuthStateListener(listener) }
    }

    suspend fun signInWithGoogle(idToken: String): Result<FirebaseUser> {
        return try {
            val credential = GoogleAuthProvider.getCredential(idToken, null)
            val authResult: AuthResult = auth.signInWithCredential(credential).await()
            val user = authResult.user ?: throw Exception("Google Authentication returned null user")
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun startPhoneVerification(
        phoneNumber: String,
        activity: Activity
    ): Flow<PhoneVerificationState> = callbackFlow {
        val callbacks = object : PhoneAuthProvider.OnVerificationStateChangedCallbacks() {
            override fun onVerificationCompleted(credential: PhoneAuthCredential) {
                trySend(PhoneVerificationState.VerificationCompleted(credential))
            }

            override fun onVerificationFailed(e: FirebaseException) {
                trySend(PhoneVerificationState.VerificationFailed(e))
                close(e)
            }

            override fun onCodeSent(
                verificationId: String,
                token: PhoneAuthProvider.ForceResendingToken
            ) {
                trySend(PhoneVerificationState.CodeSent(verificationId, token))
            }
        }

        val options = PhoneAuthOptions.newBuilder(auth)
            .setPhoneNumber(phoneNumber)
            .setTimeout(60L, TimeUnit.SECONDS)
            .setActivity(activity)
            .setCallbacks(callbacks)
            .build()

        PhoneAuthProvider.verifyPhoneNumber(options)

        awaitClose { /* Clean up listener when flow closes */ }
    }

    suspend fun signInWithPhoneCredential(credential: PhoneAuthCredential): Result<FirebaseUser> {
        return try {
            val authResult: AuthResult = auth.signInWithCredential(credential).await()
            val user = authResult.user ?: throw Exception("Phone sign-in failed to return user")
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun verifyAndSignInPhone(verificationId: String, smsCode: String): Result<FirebaseUser> {
        val credential = PhoneAuthProvider.getCredential(verificationId, smsCode)
        return signInWithPhoneCredential(credential)
    }

    fun signOut() {
        auth.signOut()
    }
}

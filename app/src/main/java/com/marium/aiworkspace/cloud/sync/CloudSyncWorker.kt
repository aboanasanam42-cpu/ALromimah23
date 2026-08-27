package com.marium.aiworkspace.cloud.sync

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.SetOptions
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext

sealed class SyncStatus {
    object Idle : SyncStatus()
    object InProgress : SyncStatus()
    data class Success(val itemsSynced: Int, val timestamp: Long) : SyncStatus()
    data class Error(val message: String, val cause: Throwable? = null) : SyncStatus()
}

data class SyncPayload(
    val entityType: String,
    val entityId: String,
    val data: Map<String, Any?>,
    val updatedAt: Long = System.currentTimeMillis()
)

class CloudSyncWorker(
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance(),
    private val auth: FirebaseAuth = FirebaseAuth.getInstance()
) {

    private val _syncStatus = MutableStateFlow<SyncStatus>(SyncStatus.Idle)
    val syncStatus: StateFlow<SyncStatus> = _syncStatus.asStateFlow()

    /**
     * Executes cloud synchronization on [Dispatchers.IO] for a batch of payloads.
     */
    suspend fun syncBatch(payloads: List<SyncPayload>): Result<Int> = withContext(Dispatchers.IO) {
        val user = auth.currentUser
        if (user == null) {
            val error = "User is not authenticated for cloud synchronization."
            _syncStatus.value = SyncStatus.Error(error)
            return@withContext Result.failure(IllegalStateException(error))
        }

        _syncStatus.value = SyncStatus.InProgress

        try {
            val batch = firestore.batch()
            val userRoot = firestore.collection("users").document(user.uid)

            for (item in payloads) {
                val docRef = userRoot.collection(item.entityType).document(item.entityId)
                val dataWithMeta = item.data.toMutableMap().apply {
                    put("syncedAt", System.currentTimeMillis())
                    put("lastUpdatedAt", item.updatedAt)
                    put("ownerUid", user.uid)
                }
                batch.set(docRef, dataWithMeta, SetOptions.merge())
            }

            batch.commit().await()

            val successStatus = SyncStatus.Success(
                itemsSynced = payloads.size,
                timestamp = System.currentTimeMillis()
            )
            _syncStatus.value = successStatus
            Result.success(payloads.size)
        } catch (e: Exception) {
            _syncStatus.value = SyncStatus.Error(e.localizedMessage ?: "Sync execution failed", e)
            Result.failure(e)
        }
    }

    /**
     * Fetches cloud records for an entity collection on [Dispatchers.IO].
     */
    suspend fun fetchEntities(entityType: String): Result<List<Map<String, Any>>> = withContext(Dispatchers.IO) {
        val user = auth.currentUser
        if (user == null) {
            return@withContext Result.failure(IllegalStateException("User unauthenticated"))
        }

        try {
            val snapshot = firestore.collection("users")
                .document(user.uid)
                .collection(entityType)
                .get()
                .await()

            val results = snapshot.documents.mapNotNull { it.data }
            Result.success(results)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

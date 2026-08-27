package com.marium.aiworkspace.cloud.backup

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.marium.aiworkspace.core.security.BiometricWrapper
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class BackupMetadata(
    val backupId: String,
    val timestamp: Long,
    val formattedDate: String,
    val sizeBytes: Int
)

class FirebaseBackupManager(
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance(),
    private val auth: FirebaseAuth = FirebaseAuth.getInstance(),
    private val biometricWrapper: BiometricWrapper = BiometricWrapper()
) {

    /**
     * Serializes, encrypts, and pushes a complete application backup snapshot to Firebase on [Dispatchers.IO].
     */
    suspend fun createEncryptedBackup(rawJsonData: String): Result<String> = withContext(Dispatchers.IO) {
        val user = auth.currentUser
        if (user == null) {
            return@withContext Result.failure(IllegalStateException("User is not authenticated for backup."))
        }

        try {
            val timestamp = System.currentTimeMillis()
            val backupId = "backup_$timestamp"
            val encryptedPayload = biometricWrapper.encrypt(rawJsonData)

            val formatter = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US)
            val dateStr = formatter.format(Date(timestamp))

            val backupDocument = hashMapOf(
                "backupId" to backupId,
                "timestamp" to timestamp,
                "formattedDate" to dateStr,
                "encryptedData" to encryptedPayload,
                "sizeBytes" to rawJsonData.toByteArray(Charsets.UTF_8).size,
                "version" to "2.0"
            )

            firestore.collection("users")
                .document(user.uid)
                .collection("encrypted_backups")
                .document(backupId)
                .set(backupDocument)
                .await()

            Result.success(backupId)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Retrieves and decrypts a specific backup by ID on [Dispatchers.IO].
     */
    suspend fun restoreEncryptedBackup(backupId: String): Result<String> = withContext(Dispatchers.IO) {
        val user = auth.currentUser
        if (user == null) {
            return@withContext Result.failure(IllegalStateException("User is not authenticated."))
        }

        try {
            val doc = firestore.collection("users")
                .document(user.uid)
                .collection("encrypted_backups")
                .document(backupId)
                .get()
                .await()

            val encryptedPayload = doc.getString("encryptedData")
                ?: throw NoSuchElementException("Backup payload not found or corrupted.")

            val decryptedJson = biometricWrapper.decrypt(encryptedPayload)
            Result.success(decryptedJson)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Lists available cloud backups sorted by newest first on [Dispatchers.IO].
     */
    suspend fun listBackups(): Result<List<BackupMetadata>> = withContext(Dispatchers.IO) {
        val user = auth.currentUser
        if (user == null) {
            return@withContext Result.failure(IllegalStateException("User is not authenticated."))
        }

        try {
            val querySnapshot = firestore.collection("users")
                .document(user.uid)
                .collection("encrypted_backups")
                .orderBy("timestamp", Query.Direction.DESCENDING)
                .limit(20)
                .get()
                .await()

            val list = querySnapshot.documents.mapNotNull { doc ->
                val id = doc.getString("backupId") ?: doc.id
                val ts = doc.getLong("timestamp") ?: 0L
                val formatted = doc.getString("formattedDate") ?: ""
                val size = doc.getLong("sizeBytes")?.toInt() ?: 0
                BackupMetadata(backupId = id, timestamp = ts, formattedDate = formatted, sizeBytes = size)
            }

            Result.success(list)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

package com.marium.aiworkspace.payments.data

import android.content.Context
import com.google.firebase.firestore.FirebaseFirestore
import com.marium.aiworkspace.core.security.BiometricWrapper
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await
import org.json.JSONArray
import org.json.JSONObject

data class PaymentMethodEntity(
    val id: String = "",
    val name: String = "",
    val type: String = "wallet", // wallet, bank, crypto
    val accountNumber: String = "",
    val balance: Double = 0.0,
    val isDefault: Boolean = false,
    val currency: String = "USD"
)

class PaymentDataSource(
    private val context: Context,
    private val biometricWrapper: BiometricWrapper = BiometricWrapper(),
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()
) {
    private val prefs = context.getSharedPreferences("marium_encrypted_vault", Context.MODE_PRIVATE)

    fun observePaymentMethods(userId: String): Flow<List<PaymentMethodEntity>> = callbackFlow {
        val collection = firestore.collection("users").document(userId).collection("paymentMethods")
        val listener = collection.addSnapshotListener { snapshot, error ->
            if (error != null) {
                trySend(getDecryptedLocalPaymentMethods())
                return@addSnapshotListener
            }

            if (snapshot != null) {
                val list = snapshot.documents.mapNotNull { doc ->
                    val pm = doc.toObject(PaymentMethodEntity::class.java)
                    pm?.copy(id = doc.id)
                }
                savePaymentMethodsEncrypted(list)
                trySend(list)
            }
        }

        awaitClose { listener.remove() }
    }

    suspend fun savePaymentMethodToCloud(userId: String, method: PaymentMethodEntity): Result<String> {
        return try {
            val docRef = if (method.id.isNotEmpty()) {
                firestore.collection("users").document(userId).collection("paymentMethods").document(method.id)
            } else {
                firestore.collection("users").document(userId).collection("paymentMethods").document()
            }

            val toSave = method.copy(id = docRef.id)
            docRef.set(toSave).await()
            Result.success(docRef.id)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun savePaymentMethodsEncrypted(methods: List<PaymentMethodEntity>) {
        val array = JSONArray()
        for (m in methods) {
            val obj = JSONObject().apply {
                put("id", m.id)
                put("name", m.name)
                put("type", m.type)
                put("accountNumber", m.accountNumber)
                put("balance", m.balance)
                put("isDefault", m.isDefault)
                put("currency", m.currency)
            }
            array.put(obj)
        }
        val rawJson = array.toString()
        val encryptedBase64 = biometricWrapper.encrypt(rawJson)
        prefs.edit().putString("encrypted_pms", encryptedBase64).apply()
    }

    fun getDecryptedLocalPaymentMethods(): List<PaymentMethodEntity> {
        val encrypted = prefs.getString("encrypted_pms", null) ?: return emptyList()
        return try {
            val decryptedJson = biometricWrapper.decrypt(encrypted)
            val array = JSONArray(decryptedJson)
            val list = mutableListOf<PaymentMethodEntity>()
            for (i in 0 until array.length()) {
                val obj = array.getJSONObject(i)
                list.add(
                    PaymentMethodEntity(
                        id = obj.optString("id"),
                        name = obj.optString("name"),
                        type = obj.optString("type", "wallet"),
                        accountNumber = obj.optString("accountNumber"),
                        balance = obj.optDouble("balance", 0.0),
                        isDefault = obj.optBoolean("isDefault", false),
                        currency = obj.optString("currency", "USD")
                    )
                )
            }
            list
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }
}

package com.marium.aiworkspace.core.notification

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.marium.aiworkspace.R
import com.marium.aiworkspace.data.model.Opportunity
import kotlinx.coroutines.tasks.await

/**
 * Background worker that checks for new opportunities and sends notifications.
 */
class NotificationWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    companion object {
        const val WORK_NAME = "opportunity_notification_work"
        const val CHANNEL_ID = "opportunities_channel"
        const val CHANNEL_NAME = "فرص العمل الجديدة"
    }

    private val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    private val firestore = FirebaseFirestore.getInstance()

    override suspend fun doWork(): Result {
        return try {
            createNotificationChannel()

            // Query latest opportunities from Firestore
            val snapshot = firestore.collection("opportunities")
                .orderBy("timestamp", Query.Direction.DESCENDING)
                .limit(5)
                .get()
                .await()

            val opportunities = snapshot.toObjects(Opportunity::class.java)

            if (opportunities.isNotEmpty()) {
                val latest = opportunities.first()
                sendNotification(
                    title = "فرصة جديدة: ${latest.title}",
                    message = "${latest.companyName} - $${latest.payRate}/${latest.payUnit}"
                )
            }

            Result.success()
        } catch (e: Exception) {
            Result.retry()
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "إشعارات بفرص العمل الجديدة"
            }
            notificationManager.createNotificationChannel(channel)
        }
    }

    private fun sendNotification(title: String, message: String) {
        val notification = NotificationCompat.Builder(applicationContext, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)
            .build()

        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }
}

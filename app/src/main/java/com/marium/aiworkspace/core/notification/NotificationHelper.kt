package com.marium.aiworkspace.core.notification

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import com.marium.aiworkspace.R

/**
 * Helper for posting local notifications.
 */
class NotificationHelper(private val context: Context) {

    companion object {
        const val CHANNEL_ID_GENERAL = "general_channel"
        const val CHANNEL_NAME_GENERAL = "إشعارات عامة"
    }

    private val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    init {
        createChannels()
    }

    private fun createChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channels = listOf(
                NotificationChannel(
                    CHANNEL_ID_GENERAL,
                    CHANNEL_NAME_GENERAL,
                    NotificationManager.IMPORTANCE_DEFAULT
                ).apply {
                    description = "الإشعارات العامة للتطبيق"
                },
                NotificationChannel(
                    NotificationWorker.CHANNEL_ID,
                    NotificationWorker.CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_DEFAULT
                ).apply {
                    description = "إشعارات بفرص العمل الجديدة"
                }
            )
            notificationManager.createNotificationChannels(channels)
        }
    }

    fun showNotification(
        title: String,
        message: String,
        notificationId: Int = System.currentTimeMillis().toInt()
    ) {
        val notification = NotificationCompat.Builder(context, CHANNEL_ID_GENERAL)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)
            .build()

        notificationManager.notify(notificationId, notification)
    }
}

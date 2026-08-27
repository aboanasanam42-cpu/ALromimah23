package com.marium.aiworkspace.core.network

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

class NetworkClient(private val context: Context? = null) {

    /**
     * Checks if the device has active internet capability using modern NetworkCapabilities API.
     */
    fun isInternetAvailable(): Boolean {
        val cm = context?.getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
            ?: return true // Fallback to true if context not provided

        val activeNetwork = cm.activeNetwork ?: return false
        val capabilities = cm.getNetworkCapabilities(activeNetwork) ?: return false

        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
                capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)
    }

    /**
     * Performs a standard GET/POST request on [Dispatchers.IO].
     */
    suspend fun makeApiCall(
        endpoint: String,
        method: String = "GET",
        headers: Map<String, String> = emptyMap(),
        body: String? = null
    ): Result<String> = withContext(Dispatchers.IO) {
        try {
            val url = URL(endpoint)
            val connection = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = method
                connectTimeout = 15000
                readTimeout = 15000
                headers.forEach { (k, v) -> setRequestProperty(k, v) }
                if (body != null) {
                    doOutput = true
                    outputStream.use { os ->
                        os.write(body.toByteArray(Charsets.UTF_8))
                        os.flush()
                    }
                }
            }

            val responseCode = connection.responseCode
            val stream = if (responseCode in 200..299) connection.inputStream else connection.errorStream ?: connection.inputStream
            val responseText = BufferedReader(InputStreamReader(stream, Charsets.UTF_8)).use { it.readText() }

            if (responseCode in 200..299) {
                Result.success(responseText)
            } else {
                Result.failure(Exception("HTTP $responseCode: $responseText"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

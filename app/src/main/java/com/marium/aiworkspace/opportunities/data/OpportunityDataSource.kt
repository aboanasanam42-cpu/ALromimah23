package com.marium.aiworkspace.opportunities.data

import android.util.Log
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.marium.aiworkspace.ai.analyzer.AIAnalyzer
import com.marium.aiworkspace.data.local.OpportunityDao
import com.marium.aiworkspace.data.model.Opportunity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext

/**
 * Real Opportunity Data Source.
 * Fetches from Firestore, caches locally with Room, analyzes with AI.
 */
class OpportunityDataSource(
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance(),
    private val opportunityDao: OpportunityDao,
    private val aiAnalyzer: AIAnalyzer = AIAnalyzer()
) {

    companion object {
        private const val TAG = "OpportunityDataSource"
        private const val COLLECTION = "opportunities"
        private const val CACHE_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours
    }

    /**
     * Get all opportunities - combines Firestore + local cache
     */
    fun getOpportunities(
        category: String? = null,
        forceRefresh: Boolean = false
    ): Flow<List<Opportunity>> = flow {
        // Emit cached data first
        val cachedData = if (category != null) {
            opportunityDao.getOpportunitiesByCategory(category).first()
        } else {
            opportunityDao.getAllOpportunities().first()
        }
        emit(cachedData)

        // Fetch from Firestore if needed
        if (forceRefresh || cachedData.isEmpty() || isCacheStale(cachedData)) {
            try {
                val remoteOpportunities = fetchFromFirestore(category)
                opportunityDao.insertOpportunities(remoteOpportunities)
                emit(remoteOpportunities)
            } catch (e: Exception) {
                Log.e(TAG, "Failed to fetch from Firestore", e)
                // Keep cached data on error
            }
        }
    }.flowOn(Dispatchers.IO)

    /**
     * Get bookmarked opportunities
     */
    fun getBookmarkedOpportunities(): Flow<List<Opportunity>> {
        return opportunityDao.getBookmarkedOpportunities()
    }

    /**
     * Get single opportunity
     */
    suspend fun getOpportunity(id: String): Opportunity? {
        return opportunityDao.getOpportunityById(id)
    }

    /**
     * Toggle bookmark status
     */
    suspend fun toggleBookmark(id: String, isBookmarked: Boolean) {
        opportunityDao.updateBookmarkStatus(id, !isBookmarked)

        // Sync to Firestore if user is logged in
        try {
            firestore.collection(COLLECTION).document(id)
                .update("isBookmarked", !isBookmarked)
                .await()
        } catch (e: Exception) {
            Log.e(TAG, "Failed to sync bookmark", e)
        }
    }

    /**
     * Mark opportunity as applied
     */
    suspend fun markAsApplied(id: String) {
        opportunityDao.updateBookmarkStatus(id, true) // Using update method for simplicity
        try {
            firestore.collection(COLLECTION).document(id)
                .update("isApplied", true)
                .await()
        } catch (e: Exception) {
            Log.e(TAG, "Failed to mark as applied", e)
        }
    }

    /**
     * Search opportunities
     */
    suspend fun searchOpportunities(query: String): List<Opportunity> = withContext(Dispatchers.IO) {
        try {
            val snapshot = firestore.collection(COLLECTION)
                .orderBy("title")
                .startAt(query)
                .endAt(query + "\uf8ff")
                .get()
                .await()

            snapshot.toObjects(Opportunity::class.java)
        } catch (e: Exception) {
            Log.e(TAG, "Search failed", e)
            emptyList()
        }
    }

    /**
     * Analyze opportunity with AI and update score
     */
    suspend fun analyzeOpportunity(opportunity: Opportunity): Result<Opportunity> = withContext(Dispatchers.IO) {
        try {
            val analysis = aiAnalyzer.analyzeOpportunity(opportunity)
            val aiScore = aiAnalyzer.calculateAIScore(opportunity)

            val updatedOpportunity = opportunity.copy(
                aiScore = aiScore,
                isScam = analysis.scamProbability > 0.6,
                status = if (analysis.recommendedAction == "avoid") "suspicious" else opportunity.status
            )

            opportunityDao.insertOpportunity(updatedOpportunity)
            Result.success(updatedOpportunity)
        } catch (e: Exception) {
            Log.e(TAG, "AI analysis failed", e)
            Result.failure(e)
        }
    }

    /**
     * Add new opportunity (admin/submission feature)
     */
    suspend fun addOpportunity(opportunity: Opportunity): Result<String> = withContext(Dispatchers.IO) {
        try {
            val docRef = if (opportunity.id.isBlank()) {
                firestore.collection(COLLECTION).document()
            } else {
                firestore.collection(COLLECTION).document(opportunity.id)
            }

            val opportunityWithId = if (opportunity.id.isBlank()) {
                opportunity.copy(id = docRef.id)
            } else opportunity

            docRef.set(opportunityWithId).await()
            opportunityDao.insertOpportunity(opportunityWithId)
            Result.success(docRef.id)
        } catch (e: Exception) {
            Log.e(TAG, "Add opportunity failed", e)
            Result.failure(e)
        }
    }

    /**
     * Clean old opportunities
     */
    suspend fun cleanOldOpportunities() {
        val cutoffTime = System.currentTimeMillis() - (7 * 24 * 60 * 60 * 1000) // 7 days
        opportunityDao.deleteOldOpportunities(cutoffTime)
    }

    private suspend fun fetchFromFirestore(category: String? = null): List<Opportunity> {
        var query: Query = firestore.collection(COLLECTION)
            .whereEqualTo("status", "active")
            .orderBy("postedAt", Query.Direction.DESCENDING)
            .limit(100)

        if (category != null) {
            query = query.whereEqualTo("category", category)
        }

        val snapshot = query.get().await()
        return snapshot.toObjects(Opportunity::class.java).map { doc ->
            val id = snapshot.documents.find { it.toObject(Opportunity::class.java) == doc }?.id ?: ""
            doc.copy(id = id)
        }
    }

    private fun isCacheStale(cachedData: List<Opportunity>): Boolean {
        if (cachedData.isEmpty()) return true
        val oldestEntry = cachedData.minByOrNull { it.postedAt } ?: return true
        return (System.currentTimeMillis() - oldestEntry.postedAt) > CACHE_DURATION_MS
    }
}

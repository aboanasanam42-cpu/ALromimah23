package com.marium.aiworkspace.data.local

import androidx.room.*
import com.marium.aiworkspace.data.model.Opportunity
import kotlinx.coroutines.flow.Flow

@Dao
interface OpportunityDao {

    @Query("SELECT * FROM opportunities ORDER BY aiScore DESC, postedAt DESC")
    fun getAllOpportunities(): Flow<List<Opportunity>>

    @Query("SELECT * FROM opportunities WHERE isBookmarked = 1")
    fun getBookmarkedOpportunities(): Flow<List<Opportunity>>

    @Query("SELECT * FROM opportunities WHERE category = :category ORDER BY aiScore DESC")
    fun getOpportunitiesByCategory(category: String): Flow<List<Opportunity>>

    @Query("SELECT * FROM opportunities WHERE id = :id")
    suspend fun getOpportunityById(id: String): Opportunity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOpportunities(opportunities: List<Opportunity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOpportunity(opportunity: Opportunity)

    @Update
    suspend fun updateOpportunity(opportunity: Opportunity)

    @Query("UPDATE opportunities SET isBookmarked = :isBookmarked WHERE id = :id")
    suspend fun updateBookmarkStatus(id: String, isBookmarked: Boolean)

    @Query("DELETE FROM opportunities WHERE postedAt < :timestamp")
    suspend fun deleteOldOpportunities(timestamp: Long)

    @Query("DELETE FROM opportunities")
    suspend fun clearAll()
}

package ai.albader.alromimh.com.data.local.dao

import androidx.room.*
import ai.albader.alromimh.com.data.local.entity.OpportunityEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface OpportunityDao {
    @Query("SELECT * FROM opportunities ORDER BY aiScore DESC")
    fun getAllOpportunities(): Flow<List<OpportunityEntity>>

    @Query("SELECT * FROM opportunities WHERE isSaved = 1 ORDER BY aiScore DESC")
    fun getSavedOpportunities(): Flow<List<OpportunityEntity>>

    @Query("SELECT * FROM opportunities WHERE id = :id")
    suspend fun getOpportunityById(id: String): OpportunityEntity?

    @Query("SELECT * FROM opportunities WHERE category IN (:categories) ORDER BY aiScore DESC")
    fun getOpportunitiesByCategories(categories: List<String>): Flow<List<OpportunityEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOpportunities(opportunities: List<OpportunityEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOpportunity(opportunity: OpportunityEntity)

    @Update
    suspend fun updateOpportunity(opportunity: OpportunityEntity)

    @Query("UPDATE opportunities SET isSaved = :isSaved WHERE id = :id")
    suspend fun updateSavedStatus(id: String, isSaved: Boolean)

    @Query("UPDATE opportunities SET isApplied = :isApplied WHERE id = :id")
    suspend fun updateAppliedStatus(id: String, isApplied: Boolean)

    @Query("DELETE FROM opportunities WHERE id = :id")
    suspend fun deleteOpportunity(id: String)

    @Query("DELETE FROM opportunities")
    suspend fun deleteAllOpportunities()
}

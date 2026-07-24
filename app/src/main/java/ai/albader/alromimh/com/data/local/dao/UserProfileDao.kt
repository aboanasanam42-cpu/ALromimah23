package ai.albader.alromimh.com.data.local.dao

import androidx.room.*
import ai.albader.alromimh.com.data.local.entity.UserProfileEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface UserProfileDao {
    @Query("SELECT * FROM user_profile LIMIT 1")
    fun getUserProfile(): Flow<UserProfileEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUserProfile(profile: UserProfileEntity)

    @Update
    suspend fun updateUserProfile(profile: UserProfileEntity)

    @Query("UPDATE user_profile SET isBiometricEnabled = :enabled WHERE id = :id")
    suspend fun updateBiometricStatus(id: String, enabled: Boolean)

    @Query("UPDATE user_profile SET language = :language WHERE id = :id")
    suspend fun updateLanguage(id: String, language: String)
}

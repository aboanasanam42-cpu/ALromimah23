package ai.albader.alromimh.com.data.remote.api

import ai.albader.alromimh.com.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

interface CloudWorkerApi {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    @GET("opportunities")
    suspend fun getOpportunities(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("category") category: String? = null
    ): Response<OpportunitiesResponse>

    @GET("opportunities/{id}")
    suspend fun getOpportunityDetail(@Path("id") id: String): Response<OpportunityDto>

    @GET("opportunities/search")
    suspend fun searchOpportunities(
        @Query("query") query: String,
        @Query("page") page: Int = 1
    ): Response<OpportunitiesResponse>

    @POST("applications")
    suspend fun submitApplication(
        @Body application: ApplicationRequest
    ): Response<ApplicationResponse>

    @GET("payments")
    suspend fun getPayments(): Response<List<PaymentDto>>
}

data class ApplicationRequest(
    val opportunityId: String,
    val coverLetter: String,
    val resumeUrl: String?
)

data class ApplicationResponse(
    val id: String,
    val status: String,
    val message: String
)

data class PaymentDto(
    val id: String,
    val opportunityId: String,
    val title: String,
    val amount: Double,
    val currency: String,
    val status: String,
    val paymentMethod: String,
    val transactionDate: String
)

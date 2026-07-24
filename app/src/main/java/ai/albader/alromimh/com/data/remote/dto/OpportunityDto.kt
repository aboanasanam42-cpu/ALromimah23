package ai.albader.alromimh.com.data.remote.dto

import com.google.gson.annotations.SerializedName

data class OpportunityDto(
    @SerializedName("id") val id: String,
    @SerializedName("title") val title: String,
    @SerializedName("company") val company: String,
    @SerializedName("location") val location: String,
    @SerializedName("description") val description: String,
    @SerializedName("requirements") val requirements: List<String>?,
    @SerializedName("salaryRange") val salaryRange: String?,
    @SerializedName("category") val category: String,
    @SerializedName("url") val url: String,
    @SerializedName("postedDate") val postedDate: String,
    @SerializedName("type") val type: String,
    @SerializedName("experienceLevel") val experienceLevel: String?
)

data class OpportunitiesResponse(
    @SerializedName("opportunities") val opportunities: List<OpportunityDto>,
    @SerializedName("total") val total: Int
)

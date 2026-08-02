package com.marium.aiworkspace.data.remote

import com.marium.aiworkspace.data.model.Opportunity

/**
 * Remote API client for fetching opportunities.
 */
class OpportunityApi {

    suspend fun getOpportunities(): List<Opportunity> {
        // TODO: Replace with real API call using NetworkClient/Retrofit
        return emptyList()
    }
}
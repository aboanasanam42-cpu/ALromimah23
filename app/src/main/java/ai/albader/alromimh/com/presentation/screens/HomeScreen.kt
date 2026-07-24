package ai.albader.alromimh.com.presentation.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import ai.albader.alromimh.com.domain.model.Opportunity
import ai.albader.alromimh.com.domain.util.Resource
import ai.albader.alromimh.com.presentation.navigation.Screen
import ai.albader.alromimh.com.presentation.viewmodel.HomeViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    navController: NavController,
    viewModel: HomeViewModel = hiltViewModel()
) {
    val opportunities by viewModel.opportunities.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("CloudWorker AI") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                )
            )
        }
    ) { padding ->
        when (val state = opportunities) {
            is Resource.Loading -> {
                Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator()
                }
            }
            is Resource.Error -> {
                Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                    Text(text = state.message ?: "Error", color = MaterialTheme.colorScheme.error)
                }
            }
            is Resource.Success -> {
                LazyColumn(modifier = Modifier.padding(padding)) {
                    items(state.data ?: emptyList()) { opportunity ->
                        OpportunityCard(opportunity, navController, viewModel)
                    }
                }
            }
        }
    }
}

@Composable
fun OpportunityCard(
    opportunity: Opportunity,
    navController: NavController,
    viewModel: HomeViewModel
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        onClick = { navController.navigate(Screen.Detail.createRoute(opportunity.id)) }
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = opportunity.title,
                    style = MaterialTheme.typography.titleMedium,
                    modifier = Modifier.weight(1f)
                )
                if (opportunity.aiScore > 0) {
                    AssistChip(
                        onClick = {},
                        label = { Text("${opportunity.aiScore}%") },
                        leadingIcon = { Icon(Icons.Default.Star, null, modifier = Modifier.size(16.dp)) }
                    )
                }
            }
            Text(text = opportunity.company, style = MaterialTheme.typography.bodyMedium)
            Text(text = opportunity.location, style = MaterialTheme.typography.bodySmall)
            Text(
                text = opportunity.description,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                style = MaterialTheme.typography.bodySmall
            )
            Row(modifier = Modifier.padding(top = 8.dp)) {
                TextButton(onClick = { viewModel.toggleSave(opportunity.id, !opportunity.isSaved) }) {
                    Text(if (opportunity.isSaved) "Unsave" else "Save")
                }
            }
        }
    }
}

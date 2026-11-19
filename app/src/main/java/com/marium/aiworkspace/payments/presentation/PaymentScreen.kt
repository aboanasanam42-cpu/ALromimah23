package com.marium.aiworkspace.payments.presentation

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.CurrencyBitcoin
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.marium.aiworkspace.payments.data.OwnerWalletAccount
import com.marium.aiworkspace.payments.data.OwnerWalletConfig
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PaymentScreen(navController: NavController) {
    val clipboardManager = LocalClipboardManager.current
    val snackbarHostState = remember { SnackbarHostState() }
    val coroutineScope = rememberCoroutineScope()
    var copiedKey by remember { mutableStateOf<String?>(null) }

    fun copyValue(key: String, value: String, label: String) {
        clipboardManager.setText(AnnotatedString(value))
        copiedKey = key
        coroutineScope.launch {
            snackbarHostState.showSnackbar("تم نسخ $label: $value")
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
        topBar = {
            TopAppBar(
                title = { Text("المحافظ وحسابات الاستلام") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "رجوع")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.primaryContainer
                    ),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.AccountBalanceWallet,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                            Text(
                                text = "حسابات الاستلام والإيداع المعتمدة (${OwnerWalletConfig.activeWallets.size})",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                        }
                        Text(
                            text = "جميع الحسابات البنكية والمحافظ المحلية وعناوين Binance USDT الرسمية الخاصة بك مع النسخ السريع بضغطة واحدة.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                    }
                }
            }

            items(OwnerWalletConfig.activeWallets, key = { it.id }) { wallet ->
                WalletAccountCard(
                    wallet = wallet,
                    copiedKey = copiedKey,
                    onCopy = ::copyValue
                )
            }
        }
    }
}

@Composable
private fun WalletAccountCard(
    wallet: OwnerWalletAccount,
    copiedKey: String?,
    onCopy: (key: String, value: String, label: String) -> Unit
) {
    val icon = when (wallet.providerType) {
        "bank" -> Icons.Default.AccountBalance
        "crypto" -> Icons.Default.CurrencyBitcoin
        else -> Icons.Default.AccountBalanceWallet
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (wallet.isDefault) {
                MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.65f)
            } else {
                MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.55f)
            }
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    modifier = Modifier.weight(1f),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Column {
                        Text(
                            text = wallet.title,
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold
                        )
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "العملة: ${wallet.currency}",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.primary
                            )
                            if (wallet.network != null) {
                                Text(
                                    text = "• الشبكة: ${wallet.network}",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }

                if (wallet.isDefault) {
                    Surface(
                        color = MaterialTheme.colorScheme.primary,
                        shape = RoundedCornerShape(20.dp)
                    ) {
                        Text(
                            text = "رئيسي",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onPrimary,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                        )
                    }
                }
            }

            CopyableDetailRow(
                label = if (wallet.providerType == "crypto") "عنوان الإيداع (Deposit Address)" else "رقم الحساب / الهاتف",
                value = wallet.accountNumber,
                isCopied = copiedKey == "${wallet.id}_main",
                onCopy = { onCopy("${wallet.id}_main", wallet.accountNumber, wallet.title) }
            )

            if (!wallet.altAccountNumber.isNullOrBlank()) {
                CopyableDetailRow(
                    label = "رقم الحساب البديل",
                    value = wallet.altAccountNumber,
                    isCopied = copiedKey == "${wallet.id}_alt",
                    onCopy = { onCopy("${wallet.id}_alt", wallet.altAccountNumber, "الحساب البديل") }
                )
            }

            if (!wallet.email.isNullOrBlank()) {
                CopyableDetailRow(
                    label = "البريد الإلكتروني",
                    value = wallet.email,
                    isCopied = copiedKey == "${wallet.id}_email",
                    onCopy = { onCopy("${wallet.id}_email", wallet.email, "البريد الإلكتروني") }
                )
            }

            if (!wallet.minDeposit.isNullOrBlank()) {
                Text(
                    text = "الحد الأدنى للإيداع: ${wallet.minDeposit}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            if (!wallet.note.isNullOrBlank()) {
                Text(
                    text = wallet.note,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.error,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}

@Composable
private fun CopyableDetailRow(
    label: String,
    value: String,
    isCopied: Boolean,
    onCopy: () -> Unit
) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f).padding(end = 8.dp)) {
                Text(
                    text = label,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = value,
                    style = MaterialTheme.typography.bodyMedium,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.SemiBold
                )
            }
            FilledTonalButton(
                onClick = onCopy,
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
            ) {
                Icon(
                    imageVector = if (isCopied) Icons.Default.Check else Icons.Default.ContentCopy,
                    contentDescription = "نسخ",
                    modifier = Modifier.size(16.dp)
                )
                Spacer(Modifier.width(4.dp))
                Text(
                    text = if (isCopied) "تم النسخ" else "نسخ",
                    style = MaterialTheme.typography.labelMedium
                )
            }
        }
    }
}

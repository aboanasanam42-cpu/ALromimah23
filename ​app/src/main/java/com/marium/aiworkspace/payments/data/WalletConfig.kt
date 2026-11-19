package com.marium.aiworkspace.payments.data

data class PaymentWallet(
    val id: String,
    val title: String,
    val accountNumber: String,
    val altAccountNumber: String? = null,
    val network: String? = null,
    val currency: String
)

object WalletConfig {
    val activeWallets = listOf(
        PaymentWallet(
            id = "shamel-money-ye",
            title = "شامل موني",
            accountNumber = "771134103",
            currency = "YER"
        ),
        PaymentWallet(
            id = "one-cash-ye",
            title = "ون كاش",
            accountNumber = "730768718",
            altAccountNumber = "146158879",
            currency = "YER"
        ),
        PaymentWallet(
            id = "binance-usdt-trc20",
            title = "Binance USDT (TRC20)",
            accountNumber = "TBZjJKmePUGVT5tGwpQrfk6z7ZmSiJkTpv",
            network = "Tron (TRC20)",
            currency = "USDT"
        ),
        PaymentWallet(
            id = "binance-usdt-bep20",
            title = "Binance USDT (BEP20)",
            accountNumber = "0x31ac47694c792a7c7d5ced4cc8dc31010b83c20a",
            network = "BNB Smart Chain (BEP20)",
            currency = "USDT"
        ),
        PaymentWallet(
            id = "binance-usdt-erc20",
            title = "Binance USDT (ERC20)",
            accountNumber = "0x31ac47694c792a7c7d5ced4cc8dc31010b83c20a",
            network = "Ethereum (ERC20)",
            currency = "USDT"
        ),
        PaymentWallet(
            id = "binance-usdt-sol",
            title = "Binance USDT (Solana)",
            accountNumber = "85BcyhKTsFBvssX5PGm5uCjCK7kucBN7e2PTVfoDm8hj",
            network = "Solana (SOL)",
            currency = "USDT"
        )
    )
}

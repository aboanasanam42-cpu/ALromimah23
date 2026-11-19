package com.marium.aiworkspace.payments.data

data class OwnerWalletAccount(
    val id: String,
    val title: String,
    val providerType: String,
    val accountNumber: String,
    val altAccountNumber: String? = null,
    val email: String? = null,
    val network: String? = null,
    val minDeposit: String? = null,
    val note: String? = null,
    val currency: String,
    val isDefault: Boolean = false
)

object OwnerWalletConfig {
    val activeWallets = listOf(
        OwnerWalletAccount(
            id = "kuraimi-bank-usd",
            title = "بنك الكريمي للتمويل الأصغر الإسلامي (جاري - تعز)",
            providerType = "bank",
            accountNumber = "3181903553",
            currency = "USD",
            isDefault = true
        ),
        OwnerWalletAccount(
            id = "shamel-money-ye",
            title = "شامل موني (Shamel Money)",
            providerType = "wallet",
            accountNumber = "771134103",
            email = "aboanasanam42@gmail.com",
            currency = "YER"
        ),
        OwnerWalletAccount(
            id = "one-cash-ye",
            title = "ون كاش (OneCash)",
            providerType = "wallet",
            accountNumber = "730768718",
            altAccountNumber = "146158879",
            currency = "YER"
        ),
        OwnerWalletAccount(
            id = "binance-usdt-trc20",
            title = "Binance USDT — Tron (TRC20)",
            providerType = "crypto",
            accountNumber = "TBZjJKmePUGVT5tGwpQrfk6z7ZmSiJkTpv",
            network = "Tron (TRC20)",
            minDeposit = ">0.01 USDT",
            currency = "USDT"
        ),
        OwnerWalletAccount(
            id = "binance-usdt-bep20",
            title = "Binance USDT — BNB Smart Chain (BEP20)",
            providerType = "crypto",
            accountNumber = "0x31ac47694c792a7c7d5ced4cc8dc31010b83c20a",
            network = "BNB Smart Chain (BEP20)",
            minDeposit = ">0.01 USDT",
            currency = "USDT"
        ),
        OwnerWalletAccount(
            id = "binance-usdt-erc20",
            title = "Binance USDT — Ethereum (ERC20)",
            providerType = "crypto",
            accountNumber = "0x31ac47694c792a7c7d5ced4cc8dc31010b83c20a",
            network = "Ethereum (ERC20)",
            minDeposit = ">0.001 USDT",
            currency = "USDT"
        ),
        OwnerWalletAccount(
            id = "binance-usdt-sol",
            title = "Binance USDT — Solana (SOL)",
            providerType = "crypto",
            accountNumber = "85BcyhKTsFBvssX5PGm5uCjCK7kucBN7e2PTVfoDm8hj",
            network = "Solana (SOL)",
            minDeposit = ">0.001 USDT",
            note = "ملاحظة: العنوان حساس لحالة الأحرف (Case-sensitive)",
            currency = "USDT"
        )
    )
}

import { Language } from '../types';

export const translations = {
  en: {
    appName: 'CloudWorker AI',
    welcomeTitle: 'Welcome Back',
    welcomeSubtitle: 'Workspace is active and secure.',
    welcomeMessage: 'Welcome to CloudWorker AI',
    
    // Modes
    localMode: 'Local App Mode',
    localModeAr: 'العمل عبر التطبيق',
    cloudMode: 'Cloud Mode',
    cloudModeAr: 'العمل عبر السحابة',
    hybridMode: 'Hybrid Mode',
    hybridModeAr: 'الوضع المزدوج',
    
    // Nav Tabs
    navDashboard: 'Dashboard',
    navAiAnalyzer: 'AI Analysis',
    navOpportunities: 'Trends & Jobs',
    navCloudSync: 'Cloud Sync',
    navSecurity: 'Security',
    navPayments: 'Payments',
    navSettings: 'Settings',

    // Dashboard Cards
    cardAiTitle: 'AI Analysis',
    cardAiDesc: 'Deep text insights',
    cardSyncTitle: 'Cloud Sync',
    cardSyncDesc: 'Secure backup',
    cardTrendsTitle: 'Trends & Jobs',
    cardTrendsDesc: 'Market tracking',
    cardSecurityTitle: 'Security',
    cardSecurityDesc: 'Data protection',
    cardPaymentsTitle: 'Payments',
    cardPaymentsDesc: 'Subscriptions',
    cardSettingsTitle: 'Settings',
    cardSettingsDesc: 'App config',

    // AI Analyzer
    aiAnalyzerHeader: 'AI Text & Opportunity Analyzer',
    aiAnalyzerSub: 'Powered by Google AI Studio Gemini engine for contract & text risk assessment',
    enterTextPlaceholder: 'Paste contract text, remote job description, or message to analyze...',
    analyzeBtn: 'Run AI Analysis',
    analyzingText: 'Analyzing text with AI...',
    quickTemplates: 'Quick Samples',
    sample1Name: 'Remote React Contract',
    sample2Name: 'Unverified Telegram Offer',
    sample3Name: 'Cloud DevOps Gig',
    scamLikelihood: 'Scam Risk',
    overallScoreLabel: 'AI Quality Score',
    keyDeliverables: 'Key Deliverables',
    suggestedSkills: 'Required Skills',
    recommendationLabel: 'AI Recommendation',

    // Opportunities & Scoring Engine
    opportunitiesHeader: 'Remote Opportunities & Scoring Engine',
    opportunitiesSub: '100-Point Algorithm evaluation for remote tasks & market trends',
    searchPlaceholder: 'Search jobs, skills, companies...',
    filterAll: 'All Opportunities',
    filterVerified: 'Verified Only',
    calculatorTitle: 'Interactive 100-Point Scoring Calculator',
    sourceReliabilityLabel: 'Source Reliability (35%)',
    payoutValueLabel: 'Payout Value (25%)',
    executionDurationLabel: 'Execution Duration (15%)',
    descriptionClarityLabel: 'Description Clarity (10%)',
    antiFraudFilterLabel: 'Anti-Fraud / Scam Filter (15%)',
    computedScore: 'Computed Evaluation Score',
    riskLevelLabel: 'Risk Assessment Level',

    // Cloud Sync & Backup
    syncHeader: 'Cloud Synchronization & Backup Manager',
    syncSub: 'Automated encrypted Firebase database backup & state manager',
    syncNowBtn: 'Trigger Manual Sync',
    lastSyncTimeLabel: 'Last Successful Backup',
    syncStatusLabel: 'Sync Status',
    syncLogsTitle: 'Sync & Backup Event Logs',
    syncModeTitle: 'Active Sync Operation Mode',

    // Security
    securityHeader: 'Security & Biometrics Shield',
    securitySub: 'Local AES encryption, biometric locks, & security audit overview',
    biometricStatus: 'Biometric Authentication',
    pinStatus: 'PIN Code Protection',
    securityScoreLabel: 'System Security Score',
    aesTesterTitle: 'AES-256 Text Encryption Sandbox',
    encryptInputPlaceholder: 'Type text to encrypt...',
    encryptBtn: 'Encrypt Data',
    decryptBtn: 'Decrypt Data',
    encryptedOutput: 'AES Cipher Output',
    decryptedOutput: 'Decrypted Result',
    auditLogsTitle: 'Security Audit History',

    // Payments
    paymentsHeader: 'Wallet & Payment Management',
    paymentsSub: 'Manage remote payout wallets, connected banks, & subscriptions',
    totalBalance: 'Total Wallet Balance',
    addPaymentMethod: '+ Add Payment Method',
    connectedAccounts: 'Connected Payout Accounts',
    transactionHistory: 'Recent Transactions',

    // Settings
    settingsHeader: 'App Configuration & Settings',
    settingsSub: 'Customize language, synchronization mode, & workspace security',
    languageSelector: 'Interface Language',
    workModeSelector: 'Workspace Operating Mode',
    notificationsToggle: 'Push Notifications & Risk Alerts',
    biometricToggle: 'Require Biometrics on App Launch',
    autoBackupToggle: 'Automated Background Cloud Backups',
    saveSettingsBtn: 'Save Preferences',
    settingsSavedMessage: 'Settings updated successfully.',
  },
  ar: {
    appName: 'CloudWorker AI',
    welcomeTitle: 'مرحباً بعودتك',
    welcomeSubtitle: 'بيئة العمل نشطة وآمنة.',
    welcomeMessage: 'مرحباً بك في CloudWorker AI',
    
    // Modes
    localMode: 'العمل عبر التطبيق',
    localModeAr: 'العمل عبر التطبيق',
    cloudMode: 'العمل عبر السحابة',
    cloudModeAr: 'العمل عبر السحابة',
    hybridMode: 'الوضع المزدوج',
    hybridModeAr: 'الوضع المزدوج',

    // Nav Tabs
    navDashboard: 'لوحة التحكم',
    navAiAnalyzer: 'تحليل الذكاء الاصطناعي',
    navOpportunities: 'الاتجاهات والفرص',
    navCloudSync: 'المزامنة السحابية',
    navSecurity: 'الأمان والحماية',
    navPayments: 'المدفوعات والاشتراكات',
    navSettings: 'الإعدادات',

    // Dashboard Cards
    cardAiTitle: 'تحليل الذكاء الاصطناعي',
    cardAiDesc: 'رؤى نصية عميقة',
    cardSyncTitle: 'المزامنة السحابية',
    cardSyncDesc: 'نسخ احتياطي آمن',
    cardTrendsTitle: 'الاتجاهات والفرص',
    cardTrendsDesc: 'تتبع السوق والوظائف',
    cardSecurityTitle: 'الأمان والحماية',
    cardSecurityDesc: 'حماية البيانات والتشفير',
    cardPaymentsTitle: 'المدفوعات',
    cardPaymentsDesc: 'المحافظ والاشتراكات',
    cardSettingsTitle: 'الإعدادات',
    cardSettingsDesc: 'تكوين التطبيق',

    // AI Analyzer
    aiAnalyzerHeader: 'محلل النصوص والفرص بالذكاء الاصطناعي',
    aiAnalyzerSub: 'مدعوم بمحرك Google AI Studio Gemini لتقييم العقود والمخاطر النصية',
    enterTextPlaceholder: 'أدخل نص العقد، تفاصيل الوظيفة أو الرسالة للتحليل...',
    analyzeBtn: 'بدء تحليل الذكاء الاصطناعي',
    analyzingText: 'جاري تحليل النص بالذكاء الاصطناعي...',
    quickTemplates: 'نماذج سريعة',
    sample1Name: 'عقد تطوير React remote',
    sample2Name: 'عرض غير موثق عبر تلغرام',
    sample3Name: 'مشروع DevOps سحابي',
    scamLikelihood: 'مستوى احتمال الاحتيال',
    overallScoreLabel: 'درجة جودة التقييم',
    keyDeliverables: 'المخرجات الأساسية',
    suggestedSkills: 'المهارات المطلوبة',
    recommendationLabel: 'توصية الذكاء الاصطناعي',

    // Opportunities & Scoring Engine
    opportunitiesHeader: 'فرص العمل ومحرك التقييم',
    opportunitiesSub: 'خوارزمية التقييم المكونة من 100 نقطة للوظائف والاتجاهات',
    searchPlaceholder: 'بحث في الوظائف، المهارات، والشركات...',
    filterAll: 'جميع الفرص',
    filterVerified: 'الموثوقة فقط',
    calculatorTitle: 'حاسبة التقييم التفاعلية (100 نقطة)',
    sourceReliabilityLabel: 'موثوقية المصدر (35%)',
    payoutValueLabel: 'قيمة الدفع (25%)',
    executionDurationLabel: 'مدة التنفيذ (15%)',
    descriptionClarityLabel: 'وضوح الوصف (10%)',
    antiFraudFilterLabel: 'فلتر منع الاحتيال (15%)',
    computedScore: 'النتيجة الإجمالية للتقييم',
    riskLevelLabel: 'مستوى تقييم المخاطر',

    // Cloud Sync & Backup
    syncHeader: 'إدارة المزامنة السحابية والنسخ الاحتياطي',
    syncSub: 'مُزامِن سحابي ومحاكي النسخ الاحتياطي المشفر لـ Firebase',
    syncNowBtn: 'بدء مزامنة يدوية',
    lastSyncTimeLabel: 'آخر نسخ احتياطي ناجح',
    syncStatusLabel: 'حالة المزامنة',
    syncLogsTitle: 'سجل عمليات المزامنة والنسخ',
    syncModeTitle: 'وضع العمل والتشغيل النشط',

    // Security
    securityHeader: 'درع الأمان والمقاييس الحيوية',
    securitySub: 'تشفير AES المحلي، القفل البيومتري، وسجل تدقيق الأمان',
    biometricStatus: 'المصادقة البيومترية',
    pinStatus: 'حماية رمز PIN',
    securityScoreLabel: 'مؤشر أمان النظام',
    aesTesterTitle: 'منصة اختبار تشفير AES-256',
    encryptInputPlaceholder: 'أدخل نص لتشفيره...',
    encryptBtn: 'تشفير البيانات',
    decryptBtn: 'فك تشفير البيانات',
    encryptedOutput: 'النص المشفر',
    decryptedOutput: 'النتيجة بعد الفك',
    auditLogsTitle: 'سجل تدقيق الأمان',

    // Payments
    paymentsHeader: 'إدارة المحافظ والمدفوعات',
    paymentsSub: 'إدارة الحسابات البنكية، المحافظ السحابية، والاشتراكات',
    totalBalance: 'إجمالي رصيد المحفظة',
    addPaymentMethod: '+ إضافة طريقة دفع',
    connectedAccounts: 'الحسابات المربوطة',
    transactionHistory: 'سجل المعاملات الأخيرة',

    // Settings
    settingsHeader: 'تكوين وإعدادات التطبيق',
    settingsSub: 'خصص اللغة، وضع المزامنة، وخيارات أمان بيئة العمل',
    languageSelector: 'لغة الواجهة',
    workModeSelector: 'وضع تشغيل بيئة العمل',
    notificationsToggle: 'التنبيهات وإشعارات المخاطر',
    biometricToggle: 'طلب البصمة عند فتح التطبيق',
    autoBackupToggle: 'النسخ الاحتياطي التلقائي بالسحابة',
    saveSettingsBtn: 'حفظ التفضيلات',
    settingsSavedMessage: 'تم تحديث الإعدادات بنجاح.',
  }
};

export function t(lang: Language, key: keyof typeof translations.en): string {
  return translations[lang][key] || translations.en[key] || key;
}

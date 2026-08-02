package com.marium.aiworkspace.data.local

import com.marium.aiworkspace.data.model.Opportunity
import com.marium.aiworkspace.data.model.Transaction
import com.marium.aiworkspace.data.model.PaymentMethod
import com.marium.aiworkspace.data.model.AIAnalysisResult

/**
 * Rich mock data provider for demo/testing purposes.
 * Mirrors the web app data sources.
 */
object MockDataProvider {

    val opportunities = listOf(
        Opportunity(
            id = "opp_1",
            title = "مطور تطبيقات موبايل (Flutter/React Native)",
            description = "نبحث عن مطور تطبيقات موبايل ذو خبرة لبناء تطبيق إدارة المشاريع لشركة ناشئة. العمل عن بُعد بدوام كامل مع مرونة في الساعات. المشروع يتطلب خبرة 2+ سنة في Flutter أو React Native وتجربة في ربط التطبيقات بـ APIs RESTful. يُفضل من يمتلك مشاريع على GitHub.",
            company = "CloudWorker Solutions",
            category = "تطوير تطبيقات",
            type = "full-time",
            salary = "\$2,500 - \$4,000 / شهرياً",
            salaryValue = 3250.0,
            currency = "USD",
            url = "https://cloudworker.com/jobs/1",
            source = "CloudWorker",
            location = "عن بُعد",
            postedAt = System.currentTimeMillis() - 2L * 24 * 60 * 60 * 1000,
            deadline = System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000,
            skills = listOf("Flutter", "React Native", "Dart", "JavaScript", "Firebase", "REST API"),
            aiScore = 92.0,
            reliabilityScore = 0.95,
            isScam = false,
            isBookmarked = false,
            isApplied = false,
            status = "active"
        ),
        Opportunity(
            id = "opp_2",
            title = "مصمم UI/UX (Figma & Adobe XD)",
            description = "مطلوب مصمم UI/UX محترف لتصميم واجهات تطبيقات موبايل ومواقع إلكترونية. العمل عن بُعد بدوام جزئي (20-30 ساعة/أسبوع). يجب أن يكون لديك خبرة في تصميم Design Systems وتجربة المستخدم. نقدم بيئة عمل مرنة وتواصل يومي.",
            company = "DesignHub Arabia",
            category = "تصميم",
            type = "part-time",
            salary = "\$1,500 - \$2,500 / شهرياً",
            salaryValue = 2000.0,
            currency = "USD",
            url = "https://designhub.ar/jobs/2",
            source = "DesignHub",
            location = "عن بُعد",
            postedAt = System.currentTimeMillis() - 5L * 24 * 60 * 60 * 1000,
            deadline = System.currentTimeMillis() + 25L * 24 * 60 * 60 * 1000,
            skills = listOf("Figma", "Adobe XD", "Photoshop", "UI/UX", "Prototyping"),
            aiScore = 88.0,
            reliabilityScore = 0.88,
            isScam = false,
            isBookmarked = true,
            isApplied = false,
            status = "active"
        ),
        Opportunity(
            id = "opp_3",
            title = "مطور Full-Stack (Node.js + React)",
            description = "فرصة عمل ممتازة لمطور Full-Stack ذو خبرة في Node.js و React. المشروع هو بناء منصة تعليمية إلكترونية. يتطلب العمل 40 ساعة/أسبوع عن بُعد. نبحث عن شخص يمكنه البدء فوراً. رواتب تنافسية مع مكافآت أداء شهرياً.",
            company = "EduTech Solutions",
            category = "تطوير ويب",
            type = "full-time",
            salary = "\$3,000 - \$5,000 / شهرياً",
            salaryValue = 4000.0,
            currency = "USD",
            url = "https://edutech.com/jobs/3",
            source = "EduTech",
            location = "عن بُعد",
            postedAt = System.currentTimeMillis() - 1L * 24 * 60 * 60 * 1000,
            deadline = System.currentTimeMillis() + 45L * 24 * 60 * 60 * 1000,
            skills = listOf("Node.js", "React", "TypeScript", "MongoDB", "Docker", "AWS"),
            aiScore = 95.0,
            reliabilityScore = 0.97,
            isScam = false,
            isBookmarked = false,
            isApplied = true,
            status = "active"
        ),
        Opportunity(
            id = "opp_4",
            title = "مدير محتوى (Content Manager) - عربي/إنجليزي",
            description = "مطلوب مدير محتوى متعدد اللغات للعمل على إدارة المحتوى لمنصة تقنية. المسؤوليات تشمل كتابة المقالات، إدارة التواصل الاجتماعي، وتحسين SEO. العمل بدوام جزئي عن بُعد.",
            company = "TechMedia Group",
            category = "تسويق رقمي",
            type = "part-time",
            salary = "\$1,200 - \$2,000 / شهرياً",
            salaryValue = 1600.0,
            currency = "USD",
            url = "https://techmedia.com/jobs/4",
            source = "TechMedia",
            location = "عن بُعد",
            postedAt = System.currentTimeMillis() - 7L * 24 * 60 * 60 * 1000,
            deadline = System.currentTimeMillis() + 20L * 24 * 60 * 60 * 1000,
            skills = listOf("SEO", "Content Writing", "Social Media", "Arabic", "English"),
            aiScore = 78.0,
            reliabilityScore = 0.80,
            isScam = false,
            isBookmarked = false,
            isApplied = false,
            status = "active"
        ),
        Opportunity(
            id = "opp_5",
            title = "أخصائي دعم فني (Technical Support Specialist)",
            description = "فرصة لأخصائي دعم فني للعمل في فريق دعم العملاء. يتطلب خبرة في التعامل مع برامج CRM ودعم البرمجيات. العمل بدوام كامل عن بُعد مع فريق متعدد الجنسيات. يُفضل من يتحدث العربية والإنجليزية.",
            company = "GlobalSupport Inc.",
            category = "دعم فني",
            type = "full-time",
            salary = "\$1,800 - \$2,800 / شهرياً",
            salaryValue = 2300.0,
            currency = "USD",
            url = "https://globalsupport.com/jobs/5",
            source = "GlobalSupport",
            location = "عن بُعد",
            postedAt = System.currentTimeMillis() - 3L * 24 * 60 * 60 * 1000,
            deadline = System.currentTimeMillis() + 35L * 24 * 60 * 60 * 1000,
            skills = listOf("Customer Support", "CRM", "Troubleshooting", "Communication", "English"),
            aiScore = 82.0,
            reliabilityScore = 0.85,
            isScam = false,
            isBookmarked = false,
            isApplied = false,
            status = "active"
        ),
        Opportunity(
            id = "opp_6",
            title = "مستقل في ترجمة المستندات (عربي ↔ إنجليزي)",
            description = "مطلوب مترجم محترف لترجمة المستندات التقنية والقانونية. العمل بدوام حر (Freelance) مع دفع شهري حسب الكمية المترجمة. يجب التزام دقيق بالمواعيد والجودة العالية.",
            company = "TranslationPro",
            category = "ترجمة",
            type = "freelance",
            salary = "\$500 - \$1,500 / شهرياً",
            salaryValue = 1000.0,
            currency = "USD",
            url = "https://translationpro.com/jobs/6",
            source = "TranslationPro",
            location = "عن بُعد",
            postedAt = System.currentTimeMillis() - 10L * 24 * 60 * 60 * 1000,
            deadline = System.currentTimeMillis() + 60L * 24 * 60 * 60 * 1000,
            skills = listOf("Translation", "Arabic", "English", "Proofreading", "Technical Writing"),
            aiScore = 75.0,
            reliabilityScore = 0.75,
            isScam = false,
            isBookmarked = false,
            isApplied = false,
            status = "active"
        ),
        Opportunity(
            id = "opp_7",
            title = "مطور Python (AI/ML) - محلل بيانات",
            description = "فرصة ممتازة لمطور Python متخصص في الذكاء الاصطناعي والتعلم الآلي. المشروع هو بناء نظام توصية ذكي. يتطلب خبرة في Pandas, TensorFlow, و Scikit-learn. رواتب تنافسية ومكافآت.",
            company = "AI Innovations Lab",
            category = "ذكاء اصطناعي",
            type = "full-time",
            salary = "\$4,000 - \$6,500 / شهرياً",
            salaryValue = 5250.0,
            currency = "USD",
            url = "https://aiinnovations.com/jobs/7",
            source = "AI Innovations",
            location = "عن بُعد",
            postedAt = System.currentTimeMillis() - 4L * 24 * 60 * 60 * 1000,
            deadline = System.currentTimeMillis() + 40L * 24 * 60 * 60 * 1000,
            skills = listOf("Python", "TensorFlow", "Pandas", "Machine Learning", "Data Analysis"),
            aiScore = 96.0,
            reliabilityScore = 0.98,
            isScam = false,
            isBookmarked = false,
            isApplied = false,
            status = "active"
        ),
        Opportunity(
            id = "opp_8",
            title = "مطور WordPress و WooCommerce",
            description = "مطلوب مطور WordPress و WooCommerce لبناء وصيانة متاجر إلكترونية. العمل عن بُعد بدوام حر مع فرصة عمل طويلة الأمد. يجب أن يكون لديك خبرة في إنشاء Themes و Plugins مخصصة.",
            company = "ECommerce Experts",
            category = "تطوير ويب",
            type = "freelance",
            salary = "\$800 - \$2,000 / شهرياً",
            salaryValue = 1400.0,
            currency = "USD",
            url = "https://ecommerce-experts.com/jobs/8",
            source = "ECommerce Experts",
            location = "عن بُعد",
            postedAt = System.currentTimeMillis() - 6L * 24 * 60 * 60 * 1000,
            deadline = System.currentTimeMillis() + 50L * 24 * 60 * 60 * 1000,
            skills = listOf("WordPress", "WooCommerce", "PHP", "JavaScript", "CSS"),
            aiScore = 70.0,
            reliabilityScore = 0.70,
            isScam = false,
            isBookmarked = false,
            isApplied = false,
            status = "active"
        )
    )

    val transactions = listOf(
        Transaction(
            id = "txn_1",
            userId = "user_1",
            type = "earning",
            amount = 2500.0,
            currency = "USD",
            description = "دخل من مشروع تطوير تطبيقات موبايل",
            status = "completed",
            referenceId = "proj_2025_001",
            timestamp = System.currentTimeMillis() - 10L * 24 * 60 * 60 * 1000
        ),
        Transaction(
            id = "txn_2",
            userId = "user_1",
            type = "earning",
            amount = 1800.0,
            currency = "USD",
            description = "دخل من مشروع تصميم UI/UX",
            status = "completed",
            referenceId = "proj_2025_002",
            timestamp = System.currentTimeMillis() - 25L * 24 * 60 * 60 * 1000
        ),
        Transaction(
            id = "txn_3",
            userId = "user_1",
            type = "withdrawal",
            amount = -1500.0,
            currency = "USD",
            description = "سحب إلى PayPal",
            status = "completed",
            referenceId = "wth_2025_001",
            timestamp = System.currentTimeMillis() - 15L * 24 * 60 * 60 * 1000
        ),
        Transaction(
            id = "txn_4",
            userId = "user_1",
            type = "deposit",
            amount = 500.0,
            currency = "USD",
            description = "إيداع محفظة",
            status = "completed",
            referenceId = "dep_2025_001",
            timestamp = System.currentTimeMillis() - 5L * 24 * 60 * 60 * 1000
        ),
        Transaction(
            id = "txn_5",
            userId = "user_1",
            type = "subscription",
            amount = -9.99,
            currency = "USD",
            description = "اشتراك شهري بريميوم",
            status = "completed",
            referenceId = "sub_2025_001",
            timestamp = System.currentTimeMillis() - 1L * 24 * 60 * 60 * 1000
        )
    )

    val paymentMethods = listOf(
        PaymentMethod(
            id = "pm_1",
            userId = "user_1",
            type = "bank",
            name = "حساب بنكي دولي",
            last4 = "1234",
            expiryDate = "12/28",
            isDefault = true,
            isVerified = true
        ),
        PaymentMethod(
            id = "pm_2",
            userId = "user_1",
            type = "card",
            name = "Visa",
            last4 = "5678",
            expiryDate = "08/27",
            isDefault = false,
            isVerified = true
        ),
        PaymentMethod(
            id = "pm_3",
            userId = "user_1",
            type = "paypal",
            name = "PayPal",
            last4 = "9012",
            expiryDate = "",
            isDefault = false,
            isVerified = true
        )
    )

    val analysisResults = mapOf(
        "opp_1" to AIAnalysisResult(
            opportunityId = "opp_1",
            legitimacyScore = 92,
            riskLevel = "low",
            redFlags = listOf(),
            greenFlags = listOf(
                "شركة موثوقة مع تاريخ واضح",
                "الرواتب واضحة وتنافسية",
                "وصف المهام محدد بدقة"
            ),
            advice = "فرصة ممتازة. قدم طلبك الآن مع نماذج أعمالك السابقة. تأكد من التفاوض على الراتب المناسب لخبرتك.",
            estimatedEarnings = "\$2,500 - \$4,000 / شهرياً",
            scamProbability = 0.05,
            analyzedAt = java.util.Date(System.currentTimeMillis() - 2L * 24 * 60 * 60 * 1000)
        ),
        "opp_2" to AIAnalysisResult(
            opportunityId = "opp_2",
            legitimacyScore = 88,
            riskLevel = "low",
            redFlags = listOf(),
            greenFlags = listOf(
                "وصف واضح للمهام والمسؤوليات",
                "الرواتب محددة بشكل شفاف"
            ),
            advice = "فرصة جيدة للمصممين. تأكد من فهم متطلبات Design Systems قبل التقديم.",
            estimatedEarnings = "\$1,500 - \$2,500 / شهرياً",
            scamProbability = 0.08,
            analyzedAt = java.util.Date(System.currentTimeMillis() - 5L * 24 * 60 * 60 * 1000)
        ),
        "opp_3" to AIAnalysisResult(
            opportunityId = "opp_3",
            legitimacyScore = 95,
            riskLevel = "low",
            redFlags = listOf(),
            greenFlags = listOf(
                "مشروع محدد بوضوح (منصة تعليمية)",
                "رواتب تنافسية جداً مع مكافآت",
                "تقنيات حديثة ومحددة"
            ),
            advice = "فرصة ممتازة للمطورين. البدء الفوري يعني جدية. استعد لمقابلة تقنية صارمة.",
            estimatedEarnings = "\$3,000 - \$5,000 / شهرياً",
            scamProbability = 0.03,
            analyzedAt = java.util.Date(System.currentTimeMillis() - 1L * 24 * 60 * 60 * 1000)
        )
    )

    fun getDashboardStats(): DashboardStats {
        return DashboardStats(
            totalOpportunities = opportunities.size,
            completedTasks = 3,
            totalEarnings = 4300.0,
            savedOpportunities = 2
        )
    }

    data class DashboardStats(
        val totalOpportunities: Int = 0,
        val completedTasks: Int = 0,
        val totalEarnings: Double = 0.0,
        val savedOpportunities: Int = 0
    )
}

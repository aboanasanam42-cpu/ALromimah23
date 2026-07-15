pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral() // ضروري لتمكين تحميل مكتبات Supabase بنجاح
    }
}

rootProject.name = "Alromimah23"
include(":app")

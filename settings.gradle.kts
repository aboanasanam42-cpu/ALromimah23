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
        mavenCentral() // هذا السطر هو المفتاح لحل مشكلة تحميل مكتبات Supabase
    }
}

rootProject.name = "Alromimah23"
include(":app")

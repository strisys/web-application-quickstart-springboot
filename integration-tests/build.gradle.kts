dependencies {
    implementation(project(":model"))
    implementation(project(":service"))
    testImplementation(libs.poi.ooxml)
    testImplementation(libs.bundles.test.base)
}

tasks.named<Test>("test") {
    enabled = false
}

// 2. Register the custom Excel test task
tasks.register<Test>("runExcelTests") {
    group = "verification"
    description = "Runs the Excel-based integration tests."

    testClassesDirs = sourceSets["test"].output.classesDirs
    classpath = sourceSets["test"].runtimeClasspath

    useJUnitPlatform()

    jvmArgs("-XX:+EnableDynamicAgentLoading")
}
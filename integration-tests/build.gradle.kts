dependencies {
    implementation(project(":model"))
    implementation(project(":service"))
    implementation(libs.jackson.datatype.jsr310)
    testImplementation(libs.poi.ooxml)
    testImplementation(libs.bundles.test.base)
}

tasks.named<Test>("test") {
    enabled = false
}

// 2. Register the custom Excel test task
tasks.register<Test>("integrationTest") {
    group = "verification"
    description = "Runs the integration tests."

    testClassesDirs = sourceSets["test"].output.classesDirs
    classpath = sourceSets["test"].runtimeClasspath

    useJUnitPlatform()

    jvmArgs("-XX:+EnableDynamicAgentLoading")
}
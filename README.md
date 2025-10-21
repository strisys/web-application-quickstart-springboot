# Web Application QuickStart using Spring Boot & Gradle

This is a simple demonstration of creating a basic REST application using [Spring Boot](https://spring.io/projects/spring-restdocs) in a [Gradle multi-project build](https://docs.gradle.org/current/userguide/multi_project_builds.html).  This project may also be used as a template to start a new application.

## Usage

### IntelliJ IDEA

From the [IntelliJ IDEA Gradle tool window](https://www.jetbrains.com/help/idea/jetgradle-tool-window.html), navigate in a browser to [http://localhost:8080](http://localhost:8080/)

```bash
gradle clean api:bootRun
```

### Docker Compose

To run in a Docker container, first build a .jar file from the [IntelliJ IDEA Gradle tool window](https://www.jetbrains.com/help/idea/jetgradle-tool-window.html)

```bash
gradle clean api:bootJar
```

Then use Docker Compose to build the image, run, and manage the container.

```bash
docker compose up
```


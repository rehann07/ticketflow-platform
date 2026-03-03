# STAGE 1: Build the application using Maven and Java 21
FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the pom.xml and download dependencies first
# (This caches the dependencies so future builds are much faster!)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code and package the application
COPY src ./src
RUN mvn clean package -DskipTests

# STAGE 2: Run the application using a lightweight JRE
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the compiled .jar file from the "build" stage
COPY --from=build /app/target/*-SNAPSHOT.jar app.jar

# Expose port 8080 to match your application.yml and docker-compose
EXPOSE 8080

# Command to run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
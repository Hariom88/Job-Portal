# Stage 1: Build the application
FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /app

# Copy the mvnw and .mvn directory
COPY mvnw .
COPY .mvn .mvn

# Copy the pom.xml and source code
COPY pom.xml .
COPY src src

# Make the mvnw executable and build the application
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]

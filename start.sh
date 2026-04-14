#!/bin/bash
# Build and Start Script
./mvnw clean package -DskipTests
java -jar backend/target/backend-0.0.1-SNAPSHOT.jar --server.port=${PORT:8080}

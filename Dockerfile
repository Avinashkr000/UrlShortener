# ==============================
# 🔹 Build Stage
# ==============================
FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -U -e -B clean package -DskipTests=true

# ==============================
# 🔹 Runtime Stage
# ==============================
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy jar from build stage
COPY --from=builder /app/target/url-shortener-0.0.1-SNAPSHOT.jar app.jar

# Expose app port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]

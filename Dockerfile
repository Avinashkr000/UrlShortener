# =======================================
# STAGE 1: Build JAR using Maven
# =======================================
FROM maven:3.9.4-eclipse-temurin-17 AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn -B -q dependency:go-offline -DskipTests
COPY src ./src
RUN mvn -B -DskipTests clean package

# =======================================
# STAGE 2: Run Application
# =======================================
FROM eclipse-temurin:17-jre
WORKDIR /app
ARG JAR_FILE=/build/target/*.jar
COPY --from=builder ${JAR_FILE} app.jar
EXPOSE 8080

# Non-root user for security
RUN addgroup --system appgroup && adduser --system appuser && chown -R appuser:appgroup /app
USER appuser

ENV JAVA_OPTS="-Xms256m -Xmx512m -Dspring.profiles.active=prod"
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]

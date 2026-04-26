# ============================================
# STAGE 1: Build with Maven
# ============================================
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Copy pom.xml first (cache dependencies)
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Download dependencies (cached layer)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build JAR (skip tests for faster build)
RUN mvn clean package -DskipTests -B

# ============================================
# STAGE 2: Production runner
# ============================================
FROM eclipse-temurin:17-jre-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system spring && adduser --system --ingroup spring spring

# Copy JAR from builder
COPY --from=builder /app/target/*.jar app.jar

# Set correct permissions
USER spring

EXPOSE 8080

# JVM tuning for container environment
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
# syntax=docker/dockerfile:1.7

# --- Build stage: compile all Spring Boot services ---
FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /workspace

# Cache-friendly: copy only poms first
COPY backend/conteo-service/pom.xml backend/conteo-service/pom.xml
COPY backend/producto-service-main/pom.xml backend/producto-service-main/pom.xml
COPY backend/ruleta-service/pom.xml backend/ruleta-service/pom.xml
# Pre-descargar dependencias para cacheo de capas
RUN mvn -q -f backend/conteo-service/pom.xml -DskipTests dependency:go-offline
RUN mvn -q -f backend/producto-service-main/pom.xml -DskipTests dependency:go-offline
RUN mvn -q -f backend/ruleta-service/pom.xml -DskipTests dependency:go-offline

# Copy sources
COPY backend/conteo-service backend/conteo-service
COPY backend/producto-service-main backend/producto-service-main
COPY backend/ruleta-service backend/ruleta-service

# Build jars
RUN --mount=type=cache,target=/root/.m2 \
    mvn -q -DskipTests -f backend/conteo-service/pom.xml clean package && \
    mvn -q -DskipTests -f backend/producto-service-main/pom.xml clean package && \
    mvn -q -DskipTests -f backend/ruleta-service/pom.xml clean package && \
    mkdir -p /out && \
    cp backend/conteo-service/target/*.jar /out/conteo.jar && \
    cp backend/producto-service-main/target/*.jar /out/blackjack.jar && \
    cp backend/ruleta-service/target/*.jar /out/ruleta.jar

# --- Runtime stage: run all services in one container ---
FROM eclipse-temurin:17-jre
WORKDIR /

# timezone and basic tools
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates tzdata bash && rm -rf /var/lib/apt/lists/*

ENV JAVA_OPTS="" \
    SPRING_PROFILES_ACTIVE=dev

COPY --from=builder /out /app
COPY backend/all-in-one/start.sh /start.sh
# Normalizar fin de línea (por si el repo está en Windows)
RUN sed -i 's/\r$//' /start.sh && chmod +x /start.sh

EXPOSE 8082 8083 8084

ENTRYPOINT ["/bin/bash","/start.sh"]

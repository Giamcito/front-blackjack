FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace

COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 mvn -q -DskipTests dependency:go-offline

COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -q -DskipTests package

FROM eclipse-temurin:17-jre
ENV SPRING_PROFILES_ACTIVE=dev \
    JAVA_OPTS=""
WORKDIR /app

COPY --from=build /workspace/target/*.jar /app/app.jar

EXPOSE 8082

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]

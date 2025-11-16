# front-blackjack
Frontend para appweb educativa sobre blackjack

## Ejecutar el microservicio producto-service (perfil dev)

Para que el frontend consuma los endpoints vía proxy, levanta primero el microservicio en `http://localhost:8080` con el perfil `dev` (usa H2 en memoria, sin PostgreSQL).

Opción A (recomendada): usando el Maven Wrapper del proyecto y el JDK embebido del repo

1) Abre una terminal en PowerShell y ejecuta:

```powershell
# Ir al proyecto del microservicio
Set-Location "c:\Users\user\Documents\Programas\producto-service-main\producto-service-main"

# Usar el JDK embebido del repo para evitar instalar Java
$env:JAVA_HOME = "c:\Users\user\Documents\Programas\Paginas\front-blackjack\backend\tools\jdk\jdk-17.0.17+10"
$env:PATH = "$env:JAVA_HOME\bin;" + $env:PATH

# Levantar la app con perfil dev (H2)
./mvnw.cmd '-Dspring-boot.run.profiles=dev' spring-boot:run
```

Deja esta terminal abierta para que el servicio siga corriendo. Health: http://localhost:8080/actuator/health

Opción B: compilar JAR con Maven portable y ejecutar con el JDK embebido

```powershell
# Compilar (desde cualquier carpeta)
& "c:\Users\user\Documents\Programas\Paginas\front-blackjack\backend\tools\run-mvn.cmd" -f "c:\Users\user\Documents\Programas\producto-service-main\producto-service-main\pom.xml" -DskipTests clean package

# Ejecutar el JAR con perfil dev
& "c:\Users\user\Documents\Programas\Paginas\front-blackjack\backend\tools\jdk\jdk-17.0.17+10\bin\java.exe" -jar "c:\Users\user\Documents\Programas\producto-service-main\producto-service-main\target\carro-0.0.1-SNAPSHOT.jar" --spring.profiles.active=dev
```

Nota: si ves un error de H2 en “exclusive mode”, ya está mitigado en `application-dev.properties` usando una BD en memoria única por ejecución. Si persiste, cierra procesos `java.exe` previos y vuelve a ejecutar.

## Proxy desde Next.js al microservicio

El frontend reescribe llamadas a `/api/blackjack/*` hacia el microservicio en `http://localhost:8080/api/v1/blackjack/*` (ver `next.config.mjs`).

Ejemplos (con el microservicio arriba y el dev server de Next.js en 3000):

```powershell
# Crear mazo (1 mazo)
Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/api/blackjack/deck?decks=1'

# Health del microservicio
Invoke-RestMethod -Uri 'http://localhost:8080/actuator/health'
```

## Problemas comunes

- “mvnw.cmd no se reconoce”: ejecuta el comando dentro de `producto-service-main\producto-service-main`.
- “No compiler is provided (JRE vs JDK)”: usa la opción A anterior para exportar `JAVA_HOME` al JDK embebido y reintenta.
- “exclusive mode” de H2: cierra procesos `java.exe` previos o cambia el nombre de la BD en `application-dev.properties`.

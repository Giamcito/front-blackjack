# Guía de Configuración y Ejecución del Microservicio Blackjack

## Prerequisitos

### 1. Instalar JDK 17 (requerido)

El proyecto usa Java 17. Necesitas tener un **JDK 17** instalado (no solo JRE).

#### Windows:
- Descargar desde: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
- O usar una distribución: 
  - Eclipse Temurin: https://adoptium.net/
  - Amazon Corretto: https://aws.amazon.com/corretto/

**Pasos después de descargar:**
1. Instala el JDK (por ejemplo en `C:\Program Files\Java\jdk-17.0.x`)
2. Configura la variable de entorno `JAVA_HOME`:
   - Panel de control → Variables de entorno → Nueva variable del sistema
   - Nombre: `JAVA_HOME`
   - Valor: `C:\Program Files\Java\jdk-17.0.x`
3. Añade `%JAVA_HOME%\bin` al `PATH`:
   - Panel de control → Variables de entorno → Editar `PATH`
   - Añade: `C:\Program Files\Java\jdk-17.0.x\bin`
4. Verifica desde PowerShell:
   ```powershell
   javac -version
   java -version
   ```

### 2. Preparar la biblioteca `blackjack.dll`

Coloca `blackjack.dll` en **una de estas ubicaciones**:
- Carpeta raíz del proyecto (mismo nivel que `pom.xml`)
- O en una carpeta incluida en la variable de entorno `PATH` de Windows
- O configura la ruta en la aplicación (opcional, ver sección de configuración)

## Compilar el Proyecto

Una vez tengas JDK 17 configurado:

```powershell
cd c:\Users\Max\OneDrive\Desktop\producto-service-main

# Opción 1: Compilar sin ejecutar tests
.\mvnw.cmd clean package -DskipTests

# Opción 2: Compilar y ejecutar tests (si existen)
.\mvnw.cmd clean package

# Opción 3: Compilar en modo verbose (si hay errores)
.\mvnw.cmd clean package -DskipTests -X
```

## Ejecutar la Aplicación

### Opción 1: Ejecutar con Maven
```powershell
.\mvnw.cmd spring-boot:run
```

La aplicación escuchará en `http://localhost:8080`

### Opción 2: Ejecutar el JAR compilado
```powershell
.\mvnw.cmd package -DskipTests
java -jar target/carro-0.0.1-SNAPSHOT.jar
```

## Probar los Endpoints

Usa **Postman**, **curl**, o cualquier cliente HTTP.

### Crear un Mazo
```http
POST http://localhost:8080/api/v1/blackjack/deck?decks=1
```
Response:
```json
{
  "mensaje": "Mazo creado exitosamente",
  "deck": {
    "id": "d2b5c3a1-...",
    "numDecks": 1,
    "remaining": 52
  }
}
```

### Crear una Partida
```http
POST http://localhost:8080/api/v1/blackjack/game?players=2&decks=1
```

### Repartir Cartas Iniciales
```http
POST http://localhost:8080/api/v1/blackjack/game/{gameId}/deal
```

### Jugador Pide Carta
```http
POST http://localhost:8080/api/v1/blackjack/game/{gameId}/player/0/hit
```

### Colocar Apuesta
```http
POST http://localhost:8080/api/v1/blackjack/game/{gameId}/player/0/bet?amount=100
```

### Turno del Dealer
```http
POST http://localhost:8080/api/v1/blackjack/game/{gameId}/dealer/play
```

### Obtener Estado de la Partida
```http
GET http://localhost:8080/api/v1/blackjack/game/{gameId}
```

### Terminar Partida
```http
DELETE http://localhost:8080/api/v1/blackjack/game/{gameId}
```

## Problemas Comunes

### Error: "No compiler is provided in this environment"
**Solución:** No tienes JDK instalado o `JAVA_HOME` no está configurado.
- Descarga e instala JDK 17
- Configura `JAVA_HOME` y `PATH` según se describe arriba
- Reinicia PowerShell después de cambiar variables de entorno

### Error: "java.lang.UnsatisfiedLinkError: Unable to load library"
**Solución:** La `blackjack.dll` no se encuentra.
- Verifica que `blackjack.dll` esté en la raíz del proyecto o en `PATH`
- Alterna: modifica `BlackjackNative.java` para especificar la ruta absoluta:
  ```java
  BlackjackNative.INSTANCE = Native.load("C:\\ruta\\absoluta\\blackjack.dll", BlackjackNative.class);
  ```

### Error: "Cannot find symbol"
**Solución:** Dependencias no descargadas o proyecto desincronizado.
```powershell
.\mvnw.cmd clean install
```

## Arquitectura del Proyecto

```
src/main/java/co/empresa/productoservice/
├── domain/
│   ├── exception/          # Excepciones del dominio
│   ├── model/              # Modelos (Card, Deck, Player, Dealer, Game)
│   └── service/            # Lógica de negocio (interfaz + implementación)
├── delivery/
│   ├── rest/               # Controladores REST
│   └── exception/          # Manejador global de excepciones
├── infrastructure/
│   └── native_lib/         # Mapeo JNA de blackjack.dll
└── ProductoServiceApplication.java  # Clase principal
```

## Próximos Pasos

1. **Extender funcionalidad:** Agrega más reglas de Blackjack en `BlackjackServiceImpl`
2. **Persistencia:** Si necesitas guardar partidas, integra JPA/Hibernate
3. **Tests:** Crea tests en `src/test/java/`
4. **Documentación API:** Considera añadir Swagger/Springdoc-OpenAPI

## Contacto / Soporte

Si tienes problemas con la compilación o ejecución, verifica:
- Versión de Java: `java -version` → debe ser 17.x
- Variables de entorno: `echo $env:JAVA_HOME` en PowerShell
- Path a Maven: `.\mvnw.cmd --version`
- Que `blackjack.dll` esté en la ubicación correcta

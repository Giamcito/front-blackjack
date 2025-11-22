# AI Coding Agent Instructions for Conteo Service

## Project Overview
**Conteo Service** is a Spring Boot 3.5.7 REST API built with Java 17. It implements a layered architecture separating concerns between **delivery** (REST controllers, HTTP handling) and **domain** (business logic, data persistence).

**Technology Stack:**
- Spring Boot 3.5.7 (parent POM)
- Spring Data JPA + PostgreSQL
- Project Lombok for boilerplate reduction
- Maven for build management

## Architecture Pattern

### Package Structure
```
src/main/java/com/blackjack/conteo/
├── ConteoServiceApplication.java      # Bootstrap entry point
├── delivery/                          # HTTP layer
│   ├── rest/                         # Controllers (REST endpoints)
│   └── exception/                    # HTTP error handling
└── domain/                           # Business logic layer
    ├── service/                      # Business services
    ├── repository/                   # Spring Data JPA repositories
    ├── model/                        # Entity classes
    └── exception/                    # Domain-level exceptions
```

### Layering Pattern
1. **delivery/rest/** - Controllers handle HTTP requests/responses. Controllers call `domain.service.*` classes.
2. **domain/service/** - Business logic services. Services use `domain.repository.*` for data access.
3. **domain/repository/** - Spring Data JPA repositories extending `JpaRepository<Entity, ID>`.
4. **domain/model/** - JPA entity classes (Lombok `@Data`, `@Entity`, `@Table` annotations).

Example flow:
```
HTTP Request → RestController (delivery/rest) 
            → Service (domain/service) 
            → Repository (domain/repository) 
            → PostgreSQL
```

## Key Conventions

### Lombok Usage
- Entities use `@Data` for auto-generated getters/setters/equals/hashCode
- Optional: `@Builder` for entity construction patterns
- Lombok is configured in `pom.xml` with annotation processors for Maven compilation

### Exception Handling
- **domain/exception/** - Custom domain exceptions (BusinessRuleException, ResourceNotFoundException, etc.)
- **delivery/exception/** - Exception mappers/handlers that convert domain exceptions to HTTP responses
- Use specific exception types, not generic `RuntimeException`

### Testing
- Unit tests in `src/test/java/` mirror source structure
- Use `@SpringBootTest` for integration tests
- Keep tests in the same package structure as main code for clarity
- H2 in-memory database used for testing (no external DB needed)
- Test profile: `application-test.properties` with `create-drop` DDL strategy

### Data Persistence
- **CountHistory Entity** (`domain/model/`) - Tracks card count history
- **CountHistoryRepository** (`domain/repository/`) - JPA queries for history
- **Automatic Logging:** Each card registration saves to database
- **History Endpoints:**
  - `GET /counter/history` - Retrieve all count records
  - `POST /counter/clear-history` - Clear history

## H2 Database (Testing & Development)

### Overview
Embedded H2 database for rapid development and testing without PostgreSQL.

### Key Features
- **In-Memory:** Ultra-fast, auto-clears on shutdown
- **Zero Config:** Works out-of-the-box with Spring Boot
- **H2 Console:** Web UI at `http://localhost:8080/h2-console`
- **JPA Integration:** Automatic table creation via Hibernate

### Tables
```sql
CREATE TABLE count_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    running_count INT NOT NULL,
    true_count INT NOT NULL,
    card_value INT NOT NULL,
    decks_in_play INT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    notes VARCHAR(500)
);
```

### Default Credentials (H2 Console)
- URL: `jdbc:h2:mem:conteo`
- Username: `sa`
- Password: (leave blank)

## Developer Workflows

### Build & Run
```bash
# Build with Maven (uses mvn wrapper)
./mvnw clean install

# Run on Windows with wrapper
./mvnw.cmd spring-boot:run

# Run tests
./mvnw test
```

### Adding New Endpoints
1. Create controller in `delivery/rest/` (e.g., `UserRestController.java`)
2. Create service in `domain/service/` (e.g., `UserService.java`)
3. Create JPA repository in `domain/repository/` (extend `JpaRepository`)
4. Create entity in `domain/model/` with JPA annotations
5. Define domain exceptions in `domain/exception/` as needed
6. Map domain exceptions to HTTP responses in `delivery/exception/`

### Database Configuration
- **Driver:** PostgreSQL (scope: runtime in pom.xml)
- **Embedded Testing:** H2 in-memory database for fast testing
- **Properties:** Configure in `src/main/resources/application.properties`
- **Example PostgreSQL configs:**
  ```properties
  spring.datasource.url=jdbc:postgresql://localhost:5432/conteo
  spring.datasource.username=postgres
  spring.datasource.password=...
  spring.jpa.hibernate.ddl-auto=update
  ```
- **H2 Configuration (Built-in):**
  ```properties
  spring.datasource.url=jdbc:h2:mem:conteo
  spring.h2.console.enabled=true
  spring.h2.console.path=/h2-console
  spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
  ```

## Code Generation Tips
- Lombok auto-generates constructors, getters, setters, equals, hashCode, toString
- For REST endpoints, follow existing controller patterns if they exist
- Always specify `@JsonProperty` or `@JsonIgnore` on entity fields if needed for API contracts
- Use descriptive exception messages for debugging

## Integration Points
- **PostgreSQL:** Direct via Spring Data JPA (repositories)
- **Spring MVC:** Controllers use `@RestController`, `@RequestMapping`, `@GetMapping`, etc.
- **DevTools:** Enabled for hot-reload during development (scope: runtime)
- **JNA (Java Native Access):** Maps C library functions from `libcard_counter.so` to Java methods

## Native Library Integration (libcard_counter.so)

### Overview
The `libcard_counter.so` C library is integrated via JNA to provide card counting operations for blackjack strategy.

### Architecture
1. **CardCounterLibrary** (domain/native_lib/) - JNA interface mapping C functions
   - `cc_init(num_decks)` - Initialize counter
   - `cc_register_card_value(value)` - Register card (2-11)
   - `cc_get_running_count()` - Get running count
   - `cc_get_true_count()` - Get true count (adjusted)
   - `cc_recommend(player_total, dealer_up)` - Get HIT/STAND recommendation
   - `cc_reset()` - Reset counter state

2. **CardCounterService** (domain/service/) - Business logic layer
   - Wraps JNA calls with validation and error handling
   - Ensures counter initialization before operations
   - Validates card values (2-11) and game totals (4-21)
   - Throws `CardCounterException` for errors

3. **CardCounterRestController** (delivery/rest/) - HTTP layer
   - `POST /counter/init` - Initialize counter
   - `POST /counter/register` - Register card
   - `GET /counter/running` - Get running count
   - `GET /counter/true` - Get true count
   - `POST /counter/reset` - Reset counter
   - `POST /counter/recommend` - Get recommendation
   - `GET /counter/status` - Check initialization status

### Key Patterns
- **Library Loading:** JNA auto-loads `libcard_counter.so` based on OS (Platform.isWindows() check)
- **Error Handling:** CardCounterException caught by GlobalExceptionHandler → HTTP 400 Bad Request
- **Validation:** All inputs validated in service before C library calls
- **Logging:** Comprehensive logging at DEBUG level for troubleshooting

### Testing
- Unit tests in `src/test/java/com/blackjack/conteo/domain/service/CardCounterServiceTest.java`
- Tests verify initialization state, input validation, and operation success
- Requires native library in classpath (LD_LIBRARY_PATH on Linux, PATH on Windows)

---
*Last updated: November 12, 2025. Reflects Spring Boot 3.5.7 baseline architecture with JNA integration.*

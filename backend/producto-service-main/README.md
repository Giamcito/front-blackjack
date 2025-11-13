# Blackjack microservicio

Este proyecto es una versión reducida del microservicio enfocada en exponer la biblioteca nativa `blackjack.dll` mediante JNA.

Rápido resumen:
- Dependencia: JNA (net.java.dev.jna:jna).
- Paquete principal: `co.empresa.productoservice.blackjack`.
- Endpoints disponibles:
  - POST /api/v1/blackjack/deck?decks=1  -> crea un mazo y devuelve `deckId`.
  - POST /api/v1/blackjack/deck/{id}/shuffle?seed=0 -> baraja.
  - POST /api/v1/blackjack/deck/{id}/draw -> reparte una carta.
  - GET /api/v1/blackjack/deck/{id}/remaining -> cartas restantes.
  - DELETE /api/v1/blackjack/deck/{id} -> libera el mazo.

Cómo ejecutar localmente (Windows PowerShell):

1. Coloca `blackjack.dll` en el directorio desde el que ejecutarás la aplicación o en una carpeta incluida en `PATH`.

2. Compilar y arrancar:

```powershell
.\mvnw.cmd package
.\mvnw.cmd spring-boot:run
```

3. Probar un endpoint:

```http
POST http://localhost:8080/api/v1/blackjack/deck?decks=1
```

Notas:
- Si la DLL no está disponible, las llamadas a funciones nativas lanzarán excepciones en tiempo de ejecución.
- El mapeo JNA de estructuras puede necesitar ajustes según la implementación real de la DLL.

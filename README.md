# front-blackjack
Frontend para appweb educativa sobre blackjack, ruleta y conteo de cartas.

## Backend (all-in-one) con Docker

Ahora los microservicios de backend (Blackjack, Conteo y Ruleta) corren juntos en un solo contenedor Docker, cada uno expuesto en su puerto:

- Blackjack → 8082 (`/api/v1/blackjack/*`)
- Conteo → 8083 (`/counter/*`)
- Ruleta → 8084 (`/roulette/*`)

Requisitos: Docker Desktop instalado y corriendo.

Arrancar el backend consolidado:

```powershell
Set-Location "d:\.programas\front-blackjack"
docker compose up -d --build backend-stack
```

Ver logs (opcional):

```powershell
docker compose logs -f backend-stack
```

Comprobaciones rápidas de salud (PowerShell):

```powershell
# Blackjack: crear mazo directamente contra 8082
Invoke-WebRequest -Method Post -Uri 'http://localhost:8082/api/v1/blackjack/deck?decks=1' | Select-Object -ExpandProperty StatusCode

# Conteo: estado
Invoke-RestMethod -Uri 'http://localhost:8083/counter/status'

# Ruleta: estado
Invoke-RestMethod -Uri 'http://localhost:8084/roulette/status'
```

Detener el backend:

```powershell
docker compose down
```

## Frontend (Next.js)

Instalar dependencias y levantar el servidor de desarrollo (puerto 3000):

```powershell
# Con pnpm (recomendado si lo tienes instalado)
pnpm install
pnpm dev

# O con npm
npm install
npm run dev
```

## Proxy desde Next.js a los microservicios

El frontend reescribe las llamadas (ver `next.config.mjs`):

- `/api/blackjack/:path*` → `http://localhost:8082/api/v1/blackjack/:path*`
- `/api/conteo/:path*` → `http://localhost:8083/counter/:path*`
- `/api/ruleta/:path*` → `http://localhost:8084/roulette/:path*`
- `/api/users/:path*` → `http://localhost:8085/:path*`

Ejemplos a través del frontend (con Next.js en 3000):

```powershell
# Blackjack: crear mazo vía proxy del frontend
Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/api/blackjack/deck?decks=1'

# Conteo: estado
Invoke-RestMethod -Uri 'http://localhost:3000/api/conteo/status'

# Ruleta: girar (cambia apuestas según corresponda)
$body = @{ bets = @(@{ type = 'COLOR'; value = 'RED'; amount = 10 }) } | ConvertTo-Json
Invoke-RestMethod -Method Post -ContentType 'application/json' -Body $body -Uri 'http://localhost:3000/api/ruleta/spin'
```

## Notas y problemas comunes

- Si Docker no encuentra la imagen `casino-backend:dev`, asegúrate de estar en la carpeta del repo al ejecutar `docker compose up`.
- Si un servicio del contenedor all-in-one sale, el contenedor se detendrá; revisa `docker compose logs -f backend-stack` para ver cuál falló.
- Usuario/Autenticación (`users` en 8085) sigue corriendo como servicio independiente en `docker-compose.yml` y requiere PostgreSQL (contenedor `db-users`).

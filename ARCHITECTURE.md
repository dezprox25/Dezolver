# Dezolver — System Architecture

> **Reflects all fixes applied to:** `render.yaml`, `backend/src/config/cors.ts`,
> `backend/src/app.ts`, `frontend/src/config/index.ts`, `frontend/vite.config.ts`,
> and all `frontend/.env.*` files.

---

## Table of Contents

1. [High-Level System Overview](#1-high-level-system-overview)
2. [Production Deployment on Render](#2-production-deployment-on-render)
3. [Development Environment](#3-development-environment)
4. [Backend Startup Sequence](#4-backend-startup-sequence)
5. [Request Lifecycle & Middleware Stack](#5-request-lifecycle--middleware-stack)
6. [CORS Flow](#6-cors-flow)
7. [Authentication Flow](#7-authentication-flow)
8. [WebSocket Architecture](#8-websocket-architecture)
9. [API Route Map](#9-api-route-map)
10. [Data Layer](#10-data-layer)
11. [Environment Variables Reference](#11-environment-variables-reference)
12. [Build & Deploy Pipeline](#12-build--deploy-pipeline)
13. [Monorepo Folder Structure](#13-monorepo-folder-structure)

---

## 1. High-Level System Overview

```mermaid
graph TB
    U(["👤 User / Browser"])

    subgraph RENDER["☁️  Render Cloud"]
        direction TB

        subgraph FE_SVC["🎨 dezolver-frontend  —  Static Site"]
            FE["React 18 + Vite 5\nTypeScript · Tailwind CSS\nReact Router · Zustand · React Query"]
        end

        subgraph BE_SVC["⚙️  dezolver-backend  —  Web Service  (Node.js)"]
            BE["Express 4 + TypeScript\ndist/server.js  ·  PORT 3000\nSocket.IO · JWT · Helmet · Winston"]
        end

        subgraph DATA["🗄️  Data Layer"]
            PG[("PostgreSQL\nTypeORM + pg pool\nSSL required")]
            RD[("Redis\nioredis\nCache · Sessions · Queues")]
        end
    end

    subgraph EXT["🔌 External Services"]
        J0["Judge0\nhttps://ce.judge0.com\nCode Execution Engine"]
    end

    U      -->|"HTTPS  GET /*\nServes index.html (SPA)"| FE
    U      -->|"HTTPS  /api/*\nAuthorization: Bearer token"| BE
    U     <-->|"WSS  /socket.io\nReal-time events"| BE
    FE    -.->|"VITE_API_URL baked at build time\nhttps://dezolver-backend.onrender.com/api"| BE
    BE     -->|"DATABASE_URL\npostgresql://...?sslmode=require"| PG
    BE     -->|"REDIS_URL\nredis://:password@host:6379"| RD
    BE     -->|"JUDGE0_URL\nhttps://ce.judge0.com"| J0
```

---

## 2. Production Deployment on Render

```mermaid
graph LR
    subgraph GH["GitHub — github.com/dezprox25/Dezolver"]
        REPO["main branch\nmonorepo root"]
    end

    subgraph RENDER["Render Services"]
        direction TB

        subgraph FE_R["dezolver-frontend  (runtime: static)"]
            F_ROOT["rootDir: frontend"]
            F_BUILD["buildCommand:\nnpm install && npm run build"]
            F_PUB["staticPublishPath: dist"]
            F_RW["routes: /* → /index.html"]
            F_ROOT --> F_BUILD --> F_PUB --> F_RW
        end

        subgraph BE_R["dezolver-backend  (runtime: node)"]
            B_ROOT["rootDir: backend"]
            B_BUILD["buildCommand:\nnpm install && npm run build"]
            B_START["startCommand:\nnode dist/server.js"]
            B_ROOT --> B_BUILD --> B_START
        end
    end

    subgraph URLS["Live URLs"]
        FE_URL["https://dezolver-frontend.onrender.com"]
        BE_URL["https://dezolver-backend.onrender.com"]
    end

    REPO -->|"push to main\ntriggers deploy"| FE_R
    REPO -->|"push to main\ntriggers deploy"| BE_R
    FE_R --> FE_URL
    BE_R --> BE_URL
```

---

## 3. Development Environment

```mermaid
graph TB
    DEV(["💻 Developer\nlocalhost:3002"])

    subgraph LOCAL["Local Machine"]
        direction LR

        subgraph VITE["Vite Dev Server — :3002\nnpm run dev  (frontend/)"]
            VD["React HMR\nFast Refresh"]
            PX["Built-in Proxy Layer\nvite.config.ts"]
        end

        subgraph BACK["Backend — :3000\nnpm run dev  (backend/)\nts-node-dev --respawn"]
            TS["TypeScript source\nsrc/server.ts"]
        end

        subgraph LOCAL_DB["Local Services"]
            LPG[("PostgreSQL\n:5432")]
            LRD[("Redis\n:6379")]
        end
    end

    DEV      --> VD
    VD       --> PX
    PX       -->|"proxy: /api/*\ntarget: http://localhost:3000\nchangeOrigin: true"| TS
    PX       -->|"proxy: /ws\ntarget: ws://localhost:3000\nws: true"| TS
    TS       --> LPG
    TS       --> LRD
```

### Dev vs Production URL Mapping

| Context      | `VITE_API_URL`                                    | How requests reach backend            |
|:-------------|:--------------------------------------------------|:--------------------------------------|
| Development  | `http://localhost:3000/api`                       | Direct HTTP call to local backend     |
| Development  | *(unset — fallback)*                              | Vite proxy forwards `/api/*` to `:3000` |
| Production   | `https://dezolver-backend.onrender.com/api`       | HTTPS call to Render backend service  |
| Staging      | `https://dezolver-backend-staging.onrender.com/api` | HTTPS call to staging service       |

> **Rule:** `VITE_API_URL` is the **raw Axios `baseURL`**. Every path in `services/api.ts`
> is relative (e.g. `/auth/login`), so the final URL is always:
> `baseURL + path` → `https://dezolver-backend.onrender.com/api/auth/login`

---

## 4. Backend Startup Sequence

```mermaid
graph TD
    START(["node dist/server.js"])

    START  --> DOTENV["dotenv/config\nload .env file"]
    DOTENV --> ENV{"validateEnvironment()\nCheck required vars"}

    ENV    -->|"❌ missing:\nJWT_SECRET\nJWT_REFRESH_SECRET\nDB_PASSWORD\nSESSION_SECRET"| FAIL1(["process.exit(1)\n💥 Fatal — missing secrets"])
    ENV    -->|"❌ weak secret\n< 32 chars or default value\n(production only)"| FAIL2(["process.exit(1)\n💥 Fatal — weak secrets"])
    ENV    -->|"✅ all valid"| SOCK["socketService.initialize(server)\nSocket.IO attached to HTTP server"]

    SOCK   --> DB["connectDatabase()\nTypeORM DataSource.initialize()\n+ pgPool test query"]
    DB     -->|"❌ connection refused\nor auth failure"| FAIL3(["process.exit(1)\n💥 Fatal — DB unreachable"])
    DB     -->|"✅ connected"| REDIS["connectRedis()\nioredis.ping()"]

    REDIS  -->|"❌ connection refused"| FAIL4(["process.exit(1)\n💥 Fatal — Redis unreachable"])
    REDIS  -->|"✅ connected"| LISTEN["server.listen(PORT, '0.0.0.0')\nPORT = process.env.PORT || 3000"]

    LISTEN --> READY(["🟢 Server ready\nAccepting connections"])

    READY  --> SIGTERM["SIGTERM / SIGINT received"]
    SIGTERM --> SHUTDOWN["gracefulShutdown()\nserver.close()\nclose DB + Redis\nprocess.exit(0)"]
```

---

## 5. Request Lifecycle & Middleware Stack

Every inbound HTTP request passes through this exact ordered chain in `src/app.ts`:

```mermaid
graph TD
    REQ(["Incoming HTTP Request"])

    REQ     --> OPT{"OPTIONS\npreflight?"}

    OPT     -->|"YES"| CORS_PRE["① app.options('*', cors)\nResponds immediately → 204\nSets all Access-Control-* headers\nNever reaches downstream middleware"]

    OPT     -->|"NO"| CORS_MW["② app.use(cors)\nAttaches Access-Control-Allow-Origin\nAccess-Control-Allow-Credentials: true"]

    CORS_MW --> HELMET["③ app.use(helmet)\nCSP · HSTS · X-Frame-Options\nX-Content-Type-Options\nReferrer-Policy"]

    HELMET  --> COMP["④ app.use(compression)\ngzip / deflate response bodies"]

    COMP    --> PARSE["⑤ express.json  +  express.urlencoded\nbody size limit: 10 mb"]

    PARSE   --> STATIC["⑥ /uploads → express.static\nserves uploaded files"]

    STATIC  --> LOG["⑦ requestLogger\nWinston HTTP logging"]

    LOG     --> RATE{"⑧ NODE_ENV\n=== production?"}
    RATE    -->|"YES"| RL["rateLimiter\n100 req / 15 min per IP\napplied to /api/ only"]
    RATE    -->|"NO (dev)"| ROUTE
    RL      --> ROUTE

    ROUTE   --> ROUTE_MATCH{"Match /api/*\nroute?"}
    ROUTE_MATCH -->|"✅ matched"| HANDLER["Route Handler\n(controller logic)"]
    ROUTE_MATCH -->|"❌ no match"| NF["notFoundHandler\n→ 404 JSON"]

    HANDLER --> RESP(["HTTP Response"])
    NF      --> ERR
    HANDLER -->|"throws error"| ERR["errorHandler\n(last middleware)\nformats error JSON\nmaps status codes"]
    ERR     --> RESP
```

---

## 6. CORS Flow

### How allowed origins are resolved

```mermaid
graph TD
    BOOT(["Module Load\nsrc/config/cors.ts"])

    BOOT   --> FURL{"FRONTEND_URL\nenv var set?"}

    FURL   -->|"YES (production)\nFRONTEND_URL=https://dezolver-frontend.onrender.com"| PROD["Parse comma-separated list\ntrim() + strip trailing slash\nallowedOrigins = [\n  'https://dezolver-frontend.onrender.com'\n]"]

    FURL   -->|"NO (development)"| DEV["Use hardcoded dev fallback\nallowedOrigins = [\n  'http://localhost:5173'\n  'http://localhost:5174'\n  'http://localhost:3000'\n  'http://localhost:3001'\n  'http://localhost:3002'\n  'http://127.0.0.1:5173'\n  'http://127.0.0.1:3000'\n]"]

    PROD   --> LOG["logger.info([CORS] Allowed origins...)"]
    DEV    --> LOG
```

### Preflight + Actual Request Sequence

```mermaid
sequenceDiagram
    participant B  as 🌐 Browser
    participant FE as React App
    participant BE as Express Backend

    Note over B,BE: ── First API call triggers a CORS preflight ──

    FE ->> B:  axios.post('/auth/login', data)
    B  ->> BE: OPTIONS /api/auth/login<br/>Origin: https://dezolver-frontend.onrender.com<br/>Access-Control-Request-Method: POST<br/>Access-Control-Request-Headers: Authorization, Content-Type

    Note over BE: app.options('*', cors(corsOptions))<br/>normalizes origin, checks allowedOrigins[]<br/>preflightContinue: false

    BE -->> B:  HTTP 204 No Content<br/>Access-Control-Allow-Origin: https://dezolver-frontend.onrender.com<br/>Access-Control-Allow-Credentials: true<br/>Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS<br/>Access-Control-Allow-Headers: Content-Type, Authorization, ...<br/>Access-Control-Max-Age: 86400

    Note over B: Browser caches preflight for 24 h<br/>No OPTIONS fired again until cache expires

    B  ->> BE: POST /api/auth/login<br/>Origin: https://dezolver-frontend.onrender.com<br/>Content-Type: application/json<br/>Authorization: Bearer <token>

    Note over BE: app.use(cors(corsOptions))<br/>validates origin again, sets response headers

    BE -->> B:  HTTP 200 OK<br/>Access-Control-Allow-Origin: https://dezolver-frontend.onrender.com<br/>Access-Control-Allow-Credentials: true<br/>{ success: true, data: { token, user } }

    B -->> FE:  resolved Axios response
```

### CORS Rejection Flow

```mermaid
sequenceDiagram
    participant B  as 🌐 Browser (unknown origin)
    participant BE as Express Backend

    B  ->> BE: POST /api/auth/login<br/>Origin: https://attacker.com

    Note over BE: normalizedOrigin not in allowedOrigins[]<br/>logger.warn([CORS] Blocked: "https://attacker.com")

    BE -->> B:  HTTP 500 (CORS error thrown)<br/>No Access-Control-Allow-Origin header set

    Note over B: Browser blocks response<br/>"CORS policy: No 'Access-Control-Allow-Origin'"
```

---

## 7. Authentication Flow

```mermaid
sequenceDiagram
    participant C  as React Client
    participant LS as localStorage
    participant ZS as Zustand Store
    participant API as Express /api/auth

    Note over C,API: ── Login ──
    C   ->> API: POST /api/auth/login<br/>{ username, password }
    API -->> C:  200 OK<br/>{ token (7d), refreshToken (30d) }
    C   ->> LS:  setItem('techfolks_auth_token', token)
    C   ->> LS:  setItem('techfolks_refresh_token', refreshToken)
    C   ->> ZS:  authStore.setToken(token)

    Note over C,API: ── Authenticated request ──
    C   ->> API: GET /api/users/profile<br/>Authorization: Bearer <token>
    Note over API: JWT middleware verifies token<br/>with JWT_SECRET
    API -->> C:  200 OK  { user }

    Note over C,API: ── Token expired → auto-refresh ──
    C   ->> API: GET /api/problems<br/>Authorization: Bearer <expired-token>
    API -->> C:  401 Unauthorized

    Note over C: Axios response interceptor catches 401<br/>isRefreshing = true, queues failed request
    C   ->> LS:  getItem('techfolks_refresh_token')
    C   ->> API: POST /api/auth/refresh-token<br/>{ refreshToken }
    Note over API: Verifies with JWT_REFRESH_SECRET
    API -->> C:  200 OK  { token: <newToken> }
    C   ->> ZS:  authStore.setToken(newToken)
    C   ->> API: GET /api/problems  ← retried with new token
    API -->> C:  200 OK  { problems }

    Note over C,API: ── Logout ──
    C   ->> API: POST /api/auth/logout
    C   ->> LS:  removeItem('techfolks_auth_token')
    C   ->> LS:  removeItem('techfolks_refresh_token')
    C   ->> ZS:  authStore.logout()
```

---

## 8. WebSocket Architecture

```mermaid
graph TB
    subgraph CLIENT["React Client  (frontend/src/services/websocket.ts)"]
        WS_C["wsService.connect()\nio(VITE_WS_URL, { auth: { token } })\ntransports: ['websocket']"]
        WS_EVT["wsEvents\nCONTEST_START · CONTEST_END\nSUBMISSION_RESULT\nLEADERBOARD_UPDATE\nNOTIFICATION\nCODE_OUTPUT · CODE_ERROR"]
    end

    subgraph SERVER["Express Backend  (src/services/socketService.ts)"]
        HTTP_SRV["http.createServer(app)"]
        IO_SRV["Socket.IO Server\nattached to HTTP server\nsocketService.initialize(server)"]
    end

    WS_C   <-->|"WSS wss://dezolver-backend.onrender.com\n(dev: ws://localhost:3000)\nauto-reconnect: 5 attempts, 1s delay"| IO_SRV
    HTTP_SRV --> IO_SRV
```

### WebSocket URL per Environment

| Environment | `VITE_WS_URL`                               | Protocol |
|:------------|:--------------------------------------------|:---------|
| Development | `ws://localhost:3000`                       | WS (plain)  |
| Staging     | `wss://dezolver-backend-staging.onrender.com` | WSS (secure) |
| Production  | `wss://dezolver-backend.onrender.com`       | WSS (secure) |

> **Note:** `wss://` (secure WebSocket) is mandatory in production because Render serves
> all traffic over HTTPS. Browsers block mixed-content `ws://` connections from `https://` pages.

---

## 9. API Route Map

All routes are mounted in `src/app.ts` under the `/api` prefix.

### Core Platform

| Route Prefix          | File                        | Responsibility                                |
|:----------------------|:----------------------------|:----------------------------------------------|
| `GET /health`         | `app.ts` (inline)           | Health check — returns DB + Redis status      |
| `GET /api/test`       | `app.ts` (inline)           | Smoke test                                    |
| `/api/auth`           | `auth.routes.ts`            | Login · Register · Logout · Refresh token     |
| `/api/users`          | `user.routes.ts`            | Profile · Stats · Submissions per user        |
| `/api/problems`       | `problem.routes.ts`         | CRUD · Submit code · Recommendations          |
| `/api/submissions`    | `submission.routes.ts`      | Submission history · Results                  |
| `/api/contests`       | `contest.routes.ts`         | CRUD · Register · Leaderboard · Problems      |
| `/api/leaderboard`    | `leaderboard.routes.ts`     | Global · Weekly · Monthly rankings            |
| `/api/dashboard`      | `dashboard.routes.ts`       | Aggregated user stats                         |
| `/api/discussions`    | `discussion.routes.ts`      | Problem discussions · Comments                |
| `/api/editorials`     | `editorial.routes.ts`       | Problem editorials                            |
| `/api/teams`          | `team.routes.ts`            | Team management                               |
| `/api/groups`         | `groups.routes.ts`          | Groups · Invite codes · Group contests        |

### Organisation & Payroll

| Route Prefix          | File                        | Responsibility                                |
|:----------------------|:----------------------------|:----------------------------------------------|
| `/api/organizations`  | `organization.routes.ts`    | Multi-tenant org management · Subscriptions   |
| `/api/employees`      | `employee.routes.ts`        | Employee CRUD · Bank details · Compensation   |
| `/api/payroll`        | `payroll.routes.ts`         | Calculate · Process · Salary slips            |
| `/api/company-bank`   | `company-bank.routes.ts`    | Company bank account management               |
| `/api/payments`       | `payment.routes.ts`         | Razorpay payment processing                   |
| `/api/certificates`   | `certificate.routes.ts`     | Generate · Verify · Revoke · Templates        |
| `/api/assessments`    | `assessment.routes.ts`      | Assessment CRUD · Attempts · Results          |

### Administration

| Route Prefix          | File                        | Responsibility                                |
|:----------------------|:----------------------------|:----------------------------------------------|
| `/api/admin`          | `admin.routes.ts`           | User management · Ban · Promote · System stats |
| `/api/managers`       | `manager.routes.ts`         | Manager-level operations                      |
| `/api/super-admin`    | `superadmin.routes.ts`      | Platform-wide administration                  |

### Static Assets

| Path                  | Handler                     | Notes                                          |
|:----------------------|:----------------------------|:-----------------------------------------------|
| `/uploads/*`          | `express.static('uploads')` | User-uploaded files served directly            |

---

## 10. Data Layer

```mermaid
graph LR
    subgraph BE["Backend — src/config/database.ts"]
        ORM["TypeORM DataSource\nAppDataSource.initialize()"]
        POOL["pg Pool\npgPool.connect()"]
        MONGO["mongoose.connect()\n(exported — not called in server.ts)"]
    end

    subgraph PG["PostgreSQL"]
        direction TB
        ENTS["Entities (TypeORM)\nUser · Problem · Submission\nContest · TestCase\nCertificate · CertificateTemplate\nEmployee · PayrollRecord · PayrollCycle\nCompanyBankDetails · Payment\nOrganization · Subscription\nAssessment · Question\nQuestionOption · AssessmentAttempt"]
    end

    subgraph REDIS["Redis — src/config/redis.ts"]
        R_MAIN["redis  (main client)\nCache · Session"]
        R_PUB["pubClient\nSocket.IO pub/sub"]
        R_SUB["subClient\nSocket.IO pub/sub"]
        R_CACHE["TypeORM query cache\n(production only)\ndefault TTL: 30 s"]
    end

    ORM   -->|"poolSize: 100\nssl: DB_SSL=true"| PG
    POOL  -->|"max: 100 connections\nidleTimeout: 60 s"| PG
    ORM   -.->|"cache (prod)\ndb: REDIS_CACHE_DB=1"| R_CACHE
    BE    --> R_MAIN
    BE    --> R_PUB
    BE    --> R_SUB
```

### Database Connection Settings

| Setting                  | Environment Variable         | Default     |
|:-------------------------|:-----------------------------|:------------|
| Host                     | `DB_HOST`                    | `localhost` |
| Port                     | `DB_PORT`                    | `5432`      |
| Database name            | `DB_NAME`                    | `techfolks_db` |
| Username                 | `DB_USER`                    | `postgres`  |
| Password                 | `DB_PASSWORD` *(required)*   | —           |
| SSL                      | `DB_SSL`                     | `false`     |
| Max pool connections     | `DB_MAX_CONNECTIONS`         | `100`       |
| Min pool connections     | `DB_MIN_CONNECTIONS`         | `20`        |
| Connection timeout       | `DB_CONNECTION_TIMEOUT`      | `10000 ms`  |
| Statement timeout        | `DB_STATEMENT_TIMEOUT`       | `30000 ms`  |

### Redis Connection Settings

| Setting              | Environment Variable    | Default     |
|:---------------------|:------------------------|:------------|
| Host                 | `REDIS_HOST`            | `localhost` |
| Port                 | `REDIS_PORT`            | `6379`      |
| Password             | `REDIS_PASSWORD`        | —           |
| Database index       | `REDIS_DB`              | `0`         |
| Max connections      | `REDIS_MAX_CONNECTIONS` | `50`        |
| Connect timeout      | `REDIS_CONNECT_TIMEOUT` | `10000 ms`  |
| Command timeout      | `REDIS_COMMAND_TIMEOUT` | `5000 ms`   |

---

## 11. Environment Variables Reference

### Backend (`render.yaml` → `dezolver-backend`)

| Variable              | Value in Render                                | Required | Source              |
|:----------------------|:-----------------------------------------------|:--------:|:--------------------|
| `NODE_ENV`            | `production`                                   | ✅        | render.yaml         |
| `PORT`                | `3000`                                         | ✅        | render.yaml         |
| `JWT_SECRET`          | *(auto-generated)*                             | ✅        | `generateValue`     |
| `JWT_REFRESH_SECRET`  | *(auto-generated)*                             | ✅        | `generateValue`     |
| `SESSION_SECRET`      | *(auto-generated)*                             | ✅        | `generateValue`     |
| `DATABASE_URL`        | `postgresql://user:pass@host:5432/db?sslmode=require` | ✅ | Render dashboard |
| `DB_SSL`              | `"true"`                                       | ✅        | render.yaml         |
| `REDIS_URL`           | `redis://:password@host:6379`                  | ✅        | Render dashboard    |
| `FRONTEND_URL`        | `https://dezolver-frontend.onrender.com`       | ✅        | render.yaml (CORS)  |
| `JUDGE0_URL`          | `https://ce.judge0.com`                        | ✅        | render.yaml         |
| `ENABLE_METRICS`      | `true` / `false`                               | ⬜        | optional            |
| `LOG_LEVEL`           | `info`                                         | ⬜        | optional            |
| `SENTRY_DSN`          | `https://...@sentry.io/...`                    | ⬜        | optional            |

> **Validated at startup by `src/utils/environment.ts`:**
> `JWT_SECRET` · `JWT_REFRESH_SECRET` · `DB_PASSWORD` · `SESSION_SECRET`
> Missing or weak (< 32 chars) values cause an immediate `process.exit(1)`.

---

### Frontend (`render.yaml` + `.env.*` files)

| Variable                    | Development                        | Production                                          |
|:----------------------------|:-----------------------------------|:----------------------------------------------------|
| `VITE_ENV`                  | `development`                      | `production`                                        |
| `VITE_API_URL`              | `http://localhost:3000/api`        | `https://dezolver-backend.onrender.com/api`         |
| `VITE_WS_URL`               | `ws://localhost:3000`              | `wss://dezolver-backend.onrender.com`               |
| `VITE_APP_NAME`             | `Dezolver`                         | `Dezolver`                                          |
| `VITE_API_TIMEOUT`          | `10000`                            | `15000`                                             |
| `VITE_UPLOAD_TIMEOUT`       | `30000`                            | `60000`                                             |
| `VITE_AUTH_TOKEN_KEY`       | `techfolks_auth_token`             | `techfolks_auth_token`                              |
| `VITE_REFRESH_TOKEN_KEY`    | `techfolks_refresh_token`          | `techfolks_refresh_token`                           |
| `VITE_SESSION_TIMEOUT`      | `604800000` (7 days)               | `604800000` (7 days)                                |
| `VITE_MAX_LOGIN_ATTEMPTS`   | `5`                                | `5`                                                 |
| `VITE_STORAGE_PREFIX`       | `techfolks`                        | `techfolks`                                         |
| `VITE_MAX_SUBMISSIONS_PER_MINUTE` | `5`                          | `5`                                                 |
| `VITE_ENABLE_SOCIAL_AUTH`   | `false`                            | `true`                                              |
| `VITE_ENABLE_CODE_EXECUTION`| `true`                             | `true`                                              |

> **Important:** All `VITE_*` variables are **baked into the JavaScript bundle at build time**
> by Vite. They are read via `import.meta.env.VITE_*` and are not secret.
> Never store tokens, passwords, or private keys as `VITE_*` variables.

---

## 12. Build & Deploy Pipeline

```mermaid
graph TD
    DEV(["👨‍💻 Developer\ngit push origin main"])

    DEV     --> GH["GitHub\ngithub.com/dezprox25/Dezolver"]

    GH      -->|"webhook trigger\nbranch: main"| R_FE
    GH      -->|"webhook trigger\nbranch: main"| R_BE

    subgraph R_FE["Render — dezolver-frontend"]
        direction TB
        FE1["cd frontend/\nnpm install"]
        FE2["tsc — TypeScript check"]
        FE3["vite build\nVITE_API_URL baked into bundle\noutDir: dist/"]
        FE4["Serve dist/ as static files\nroutes: /* → index.html"]
        FE1 --> FE2 --> FE3 --> FE4
    end

    subgraph R_BE["Render — dezolver-backend"]
        direction TB
        BE1["cd backend/\nnpm install"]
        BE2["npm run build\ntsc → dist/server.js"]
        BE3["node dist/server.js\nPORT=3000  HOST=0.0.0.0"]
        BE1 --> BE2 --> BE3
    end

    R_FE --> FE_LIVE(["🟢 https://dezolver-frontend.onrender.com"])
    R_BE --> BE_LIVE(["🟢 https://dezolver-backend.onrender.com"])
```

### Build-time vs Runtime Variables

```mermaid
graph LR
    subgraph BUILD["At Build Time  (vite build)"]
        V1["VITE_API_URL\nVITE_WS_URL\nVITE_ENV\nVITE_APP_NAME\n...all VITE_* vars"]
    end

    subgraph BUNDLE["JS Bundle  (dist/)"]
        V2["Values hard-coded\ninto JavaScript\nread via import.meta.env.*"]
    end

    subgraph RUNTIME["At Runtime  (node dist/server.js)"]
        V3["JWT_SECRET\nDATABASE_URL\nREDIS_URL\nFRONTEND_URL\nJUDGE0_URL\n...all backend vars"]
    end

    subgraph PROC["Node.js Process"]
        V4["Values read live\nfrom process.env.*\ninjected by Render"]
    end

    V1 --> V2
    V3 --> V4
```

> - **Frontend vars** are resolved **once at build time** and frozen into the static bundle.
>   Changing `VITE_API_URL` on the Render dashboard requires a **redeploy** to take effect.
> - **Backend vars** are injected by Render into the process environment at container start.
>   They can be updated in the Render dashboard and take effect on the **next restart**.

---

## 13. Monorepo Folder Structure

```
Dezolver/                          ← repo root
│
├── render.yaml                    ← Render deployment config (both services)
├── ARCHITECTURE.md                ← this file
├── QUICK_START.md
├── PRODUCT_PROPOSAL.md
├── start-app.sh                   ← local dev launcher (backend :3000, frontend :3002)
│
├── backend/                       ← rootDir for dezolver-backend service
│   ├── package.json               ← "start": "node dist/server.js"
│   │                                 "build": "tsc"
│   │                                 "dev":   "ts-node-dev src/server.ts"
│   ├── tsconfig.json              ← src/ → dist/,  strict: true
│   ├── Dockerfile                 ← multi-stage production Docker image
│   ├── Dockerfile.render          ← simplified Render Docker build
│   ├── render-build.sh            ← tsc with --noEmitOnError false fallback
│   │
│   ├── src/
│   │   ├── server.ts              ← entry: createServer → connectDB → connectRedis → listen
│   │   ├── app.ts                 ← Express app, middleware chain, all route mounts
│   │   │
│   │   ├── config/
│   │   │   ├── cors.ts            ← FRONTEND_URL → allowedOrigins, credentials: true
│   │   │   ├── database.ts        ← TypeORM AppDataSource + pgPool + mongoose
│   │   │   ├── redis.ts           ← ioredis client + pub/sub clients + cache utils
│   │   │   ├── constants.ts
│   │   │   ├── ormconfig.ts
│   │   │   ├── submission.config.ts
│   │   │   └── swagger.ts
│   │   │
│   │   ├── routes/                ← 21 route files (one per domain)
│   │   │   ├── auth.routes.ts         → /api/auth
│   │   │   ├── user.routes.ts         → /api/users
│   │   │   ├── problem.routes.ts      → /api/problems
│   │   │   ├── submission.routes.ts   → /api/submissions
│   │   │   ├── contest.routes.ts      → /api/contests
│   │   │   ├── leaderboard.routes.ts  → /api/leaderboard
│   │   │   ├── dashboard.routes.ts    → /api/dashboard
│   │   │   ├── discussion.routes.ts   → /api/discussions
│   │   │   ├── editorial.routes.ts    → /api/editorials
│   │   │   ├── team.routes.ts         → /api/teams
│   │   │   ├── groups.routes.ts       → /api/groups
│   │   │   ├── certificate.routes.ts  → /api/certificates
│   │   │   ├── employee.routes.ts     → /api/employees
│   │   │   ├── payroll.routes.ts      → /api/payroll
│   │   │   ├── company-bank.routes.ts → /api/company-bank
│   │   │   ├── payment.routes.ts      → /api/payments
│   │   │   ├── organization.routes.ts → /api/organizations
│   │   │   ├── admin.routes.ts        → /api/admin
│   │   │   ├── manager.routes.ts      → /api/managers
│   │   │   ├── superadmin.routes.ts   → /api/super-admin
│   │   │   └── assessment.routes.ts   → /api/assessments
│   │   │
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts    ← global error formatter (last middleware)
│   │   │   ├── rateLimiter.ts     ← 100 req / 15 min (production only)
│   │   │   ├── requestLogger.ts   ← Winston HTTP logging
│   │   │   └── notFoundHandler.ts ← 404 JSON response
│   │   │
│   │   ├── utils/
│   │   │   ├── environment.ts     ← validateEnvironment() — throws on missing secrets
│   │   │   ├── logger.ts          ← Winston logger instance
│   │   │   ├── errors.ts          ← custom error classes
│   │   │   └── database.monitor.ts
│   │   │
│   │   ├── models/                ← TypeORM entities (User, Problem, Submission …)
│   │   ├── controllers/           ← route handler logic
│   │   ├── services/              ← business logic, socketService, monitoring
│   │   ├── types/                 ← shared TypeScript types
│   │   └── scripts/               ← DB setup scripts
│   │
│   ├── dist/                      ← compiled output (git-ignored, created by tsc)
│   │   └── server.js              ← production entry point
│   │
│   ├── .env.development           ← local dev secrets (git-ignored)
│   ├── .env.example               ← template with all required keys
│   └── migrations/                ← database migration files
│
└── frontend/                      ← rootDir for dezolver-frontend service
    ├── package.json               ← "build": "tsc && vite build"
    │                                 "dev":   "vite"
    ├── vite.config.ts             ← outDir: dist, proxy /api → :3000
    ├── tsconfig.json              ← noEmit: true (Vite handles emit)
    ├── tailwind.config.js
    ├── index.html                 ← SPA shell
    │
    ├── src/
    │   ├── main.tsx               ← React DOM root
    │   ├── App.tsx                ← Router + providers
    │   │
    │   ├── config/
    │   │   └── index.ts           ← reads all VITE_* vars via import.meta.env
    │   │                             config.api.baseUrl = VITE_API_URL
    │   │
    │   ├── services/
    │   │   ├── api.ts             ← Axios instance + all API endpoint functions
    │   │   │                         baseURL = config.api.baseUrl
    │   │   │                         request interceptor: attach Bearer token
    │   │   │                         response interceptor: auto-refresh on 401
    │   │   ├── websocket.ts       ← Socket.IO client, wsEvents constants
    │   │   └── payment.service.ts ← Razorpay integration
    │   │
    │   ├── store/                 ← Zustand stores (authStore, …)
    │   ├── components/            ← shared UI components
    │   ├── pages/                 ← route-level page components
    │   ├── hooks/                 ← custom React hooks
    │   ├── types/                 ← TypeScript interfaces
    │   ├── utils/                 ← helper functions
    │   └── styles/                ← global CSS
    │
    ├── dist/                      ← Vite build output (git-ignored)
    │   └── index.html             ← entry for all routes (SPA rewrite rule)
    │
    ├── .env.development           ← VITE_API_URL=http://localhost:3000/api
    ├── .env.production            ← VITE_API_URL=https://dezolver-backend.onrender.com/api
    ├── .env.staging               ← VITE_API_URL=https://dezolver-backend-staging.onrender.com/api
    └── .env.example               ← documents every available VITE_* variable
```

---

*End of architecture document.*
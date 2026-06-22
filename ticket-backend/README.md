# 🧠 TicketFlow: AI-Powered Support Backend

The core microservice for the TicketFlow platform. This Spring Boot application serves as the central brain of the ecosystem, handling stateless JWT authentication, AI-driven ticket triaging, distributed caching, and asynchronous event publishing.

---

## 🚀 Tech Stack
* **Framework:** Java 21, Spring Boot 3.3.5
* **Artificial Intelligence:** Spring AI integrated with Groq (`llama-3.3-70b-versatile`)
* **Database:** PostgreSQL (Hosted on Aiven Cloud)
* **Caching & Security:** Redis / Valkey (Hosted on Aiven Cloud)
* **Message Broker:** Apache Kafka (Hosted on Aiven Cloud)
* **Security:** Spring Security, JWT, Role-Based Access Control (RBAC)
* **API Documentation:** Swagger / OpenAPI 3

---

## ✨ Core Features

### 🤖 AI Auto-Triage (Spring AI + Groq)
When a user submits a support ticket, the system bypasses manual review. The `AiService` intercepts the ticket and prompts a Llama-3 model to analyze the text, automatically returning a structured JSON response to assign:
* **Priority:** `LOW`, `MEDIUM`, `HIGH`
* **Category:** Technical, Billing, Account, Feature
* **Sentiment Analysis:** Positive, Neutral, Frustrated, Angry
* **Ticket Summary:** A condensed 1-sentence TL;DR for support agents.

### 🔒 Enterprise Security & Auth
* **Stateless JWTs:** Secure login and registration.
* **Server-Side Token Revocation:** Implements a Redis-backed Token Blacklist. When a user logs out, their specific JWT is instantly cached in Redis as "revoked", preventing token hijacking without requiring a database hit.
* **IDOR Protection:** Strict validation ensures users can only read, update, or delete their own tickets unless they hold the `ROLE_ADMIN` authority.

### ⚡ Distributed Caching
Frequent read operations (like fetching ticket details) are cached in Redis (`@Cacheable`). When a ticket is updated or deleted, the cache is automatically evicted to ensure data consistency, drastically reducing PostgreSQL load.

### 📨 Event-Driven Architecture
Acts as the primary Kafka Producer. It broadcasts real-time system events (`TicketCreated`, `TicketResolved`, `UserDeleted`) to the Kafka cluster, allowing decoupled microservices (like the Real-Time Notification Service) to react instantly. It also consumes its own events to handle asynchronous SMTP Email dispatching.

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory. This project uses `spring-dotenv` to inject these securely into the `application.yml`.

```env
# Database
DB_URL=jdbc:postgresql://<your-aiven-db-url>?user=avnadmin&password=<password>&sslmode=require

# Redis Cache
REDIS_URL=rediss://default:<password>@<your-aiven-redis-url>

# Kafka Cluster
KAFKA_SERVERS=<your-aiven-kafka-url>:25311
KAFKA_USERNAME=avnadmin
KAFKA_API_SECRET=<your-kafka-password>

# AI Integration
GROQ_API_KEY=<your-groq-api-key>

# JWT Security
JWT_SECRET=<your-very-long-secure-random-secret-key>

# Email Service
MAIL_USERNAME=<your-gmail-address>


MAIL_PASSWORD=<your-gmail-app-password>

# Frontend URL (Use port 3000 if running via Docker, or 5173 for local npm run dev)
FRONTEND_URL=http://localhost:3000 
```

---

## 🗺️ API Architecture

Once the application is running, you can view the fully interactive OpenAPI documentation at:

👉 `http://localhost:8080/swagger-ui.html`

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/signup` | Register a new user |
| `POST` | `/login` | Authenticate and receive JWT |
| `POST` | `/logout` | Revoke the current JWT via Redis |

### User Tickets (`/api/tickets`) - *Requires JWT*

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/` | Submit a ticket (Triggers AI Triage & Kafka Event) |
| `GET` | `/` | Retrieve all tickets owned by the current user |
| `GET` | `/{id}` | Retrieve a specific ticket (Redis Cached) |
| `PUT` | `/{id}` | Update ticket details |
| `DELETE` | `/{id}` | Delete a ticket |

### Admin Controls (`/api/admin`) - *Requires `ROLE_ADMIN`*

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/tickets` | View all system tickets including AI Sentiment & Summaries |
| `PUT` | `/{id}/status` | Update ticket status (Triggers Kafka Resolution Event) |
| `GET` | `/users` | View all registered users |
| `DELETE` | `/users/{id}` | Ban/Delete a user (Triggers Kafka Wipe Event) |

---

## 🐳 Running the Service

You can run this service independently via Maven:

```bash
  mvn spring-boot:run
```

Or, deploy it as part of the complete microservice ecosystem using Docker Compose from the root directory:

```bash
  docker compose up -d --build
```
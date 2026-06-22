# 🚀 TicketFlow: AI-Based Real-Time Support Platform

TicketFlow is a distributed, microservice-based support ticket ecosystem. It leverages **Artificial Intelligence** for automated ticket triaging, **distributed caching** for high performance, and an **event-driven architecture** (Kafka) to deliver real-time WebSocket notifications to end-users.

---

## 🏗️ System Architecture

The ecosystem consists of a React client and two Spring Boot microservices, heavily integrated with cloud infrastructure hosted on Aiven and AI models provided by Groq.

```text
                             [ React Frontend ] 
                                     │
                 (HTTP API)          │          (WebSockets / STOMP)
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
       [ Ticket Backend ]                      [ Realtime Service ]
       (Port 8080 - Main API)                  (Port 8081 - Notifications)
                 │                                       │
                 ├─► (Prompts) ───────► [ Groq AI (Llama 3) ]
                 │                                       │
                 ├─► (Publishes) ─────► [ Apache Kafka ] ├─► (Consumes)
                 │                                       │
                 ├─► (Read/Write) ────► [ PostgreSQL ] ◄─┤   (Read-Only)
                 │
                 └─► (Caches Tokens) ─► [ Redis/Valkey ] 

```

## 📂 Project Structure

This monorepo contains three core applications. See their individual `README.md` files for deeper technical details:

* **`/ticket-backend`**: The primary API. Handles stateless JWT authentication, AI auto-triaging, CRUD operations, and publishes system events to Kafka.
* **`/realtime-service`**: An event-driven microservice. Consumes Kafka topics and pushes live updates to the React frontend via WebSockets.
* **`/ticket-frontend`**: The React 19/Vite client interface. Features role-based routing (Admin vs. User), dynamic Recharts dashboards, and dual-Axios configuration.

## 🛠️ Global Tech Stack


<div align="center">
  <img src="https://skillicons.dev/icons?i=java,spring,postgres,redis,react,tailwind,vite,docker,git,github" alt="Tech Stack Logos" />
</div> 


| Domain | Technologies |
| --- | --- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, shadcn/ui, Recharts |
| **Backends** | Java 21, Spring Boot 3.3, Spring Security, Spring WebSockets |
| **Artificial Intelligence** | Spring AI, Groq (`llama-3.3-70b-versatile`) |
| **Message Broker** | Apache Kafka (Aiven Cloud) |
| **Database & Cache** | PostgreSQL, Redis/Valkey (Aiven Cloud) |
| **Deployment** | Docker, Docker Compose |

---

## 🚦 Getting Started (Docker Deployment)

The entire ecosystem is fully containerized. You do not need to install Java, Node, or databases on your local machine to run the project.

### 1. Prerequisites

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
* Cloud instances of PostgreSQL, Redis, and Kafka (e.g., via Aiven Free Tier).
* A free API key from [Groq](https://console.groq.com/).

### 2. Environment Configuration

Create a `.env` file in this **root directory**. Docker will automatically inject these variables into your containers.

```env

# --- Frontend URL ---
FRONTEND_URL=http://localhost:3000

VITE_API_BASE_URL=http://localhost:8080/api
VITE_NOTIFICATION_API_URL=http://localhost:8081/api/notifications
VITE_WEBSOCKET_URL=http://localhost:8081/ws

# --- Aiven Database ---
DB_URL=jdbc:postgresql://<your-aiven-db-url>?user=avnadmin&password=<password>&sslmode=require

# --- Aiven Redis Cache ---
REDIS_URL=rediss://default:<password>@<your-aiven-redis-url>

# --- Aiven Kafka Cluster ---
KAFKA_SERVERS=<your-aiven-kafka-url>:25311
KAFKA_USERNAME=avnadmin
KAFKA_API_SECRET=<your-kafka-password>

# --- AI & Security ---
GROQ_API_KEY=<your-groq-key>
JWT_SECRET=<your-secure-random-jwt-secret>

# --- Email Notifications (Optional) ---
MAIL_USERNAME=<your-gmail-address>
MAIL_PASSWORD=<your-gmail-app-password>

```

### 3. Build & Launch

Open your terminal in this root folder and run:

```bash
docker compose up -d --build

```

### 4. Access the Applications

Once Docker indicates all containers are running, the ecosystem is live at:

* **🖥️ Web Application:** `http://localhost:3000`
* **⚙️ Backend API / Swagger Docs:** `http://localhost:8080/swagger-ui.html`
* **🔔 WebSocket Tunnel (Realtime Service):** `http://localhost:8081`

---
## 👤 Author

**Rehan Naikwadi**

GitHub: [@rehann07](https://github.com/rehann07)

---

## 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](./LICENSE) file for full details.
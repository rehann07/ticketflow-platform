# 🔔 TicketFlow: Real-Time Notification Service

A Spring Boot microservice designed to handle real-time, event-driven notifications for the TicketFlow platform. 

This service acts as the bridge between backend events and the user interface. It listens to a distributed Kafka broker for system events, persists notification history to a cloud PostgreSQL database, and instantly broadcasts live updates to the React frontend using WebSockets and STOMP.

--- 

## 🚀 Tech Stack
* **Framework:** Java 21, Spring Boot 3.3.5
* **Messaging:** Apache Kafka (Hosted on Aiven Cloud)
* **Real-Time Communication:** WebSockets (STOMP Protocol)
* **Database:** PostgreSQL (Hosted on Aiven Cloud), Spring Data JPA
* **Configuration:** `spring-dotenv` for secure environment variable management

---

## 🏗️ Architecture Flow

1. **Listen:** The `KafkaEventConsumer` asynchronously listens to topics (e.g., `ticket_created_topic`) published by the main backend.
2. **Process:** The event is deserialized and converted into a user-friendly `Notification` entity.
3. **Persist:** The notification is saved to the Aiven PostgreSQL database (`notification_db`) so the user can view their history later.
4. **Broadcast:** The `SimpMessagingTemplate` instantly pushes the payload through an open WebSocket tunnel directly to the specific user's browser.

---

## ⚙️ Environment Setup

Because this microservice connects to cloud infrastructure, you must provide a `.env` file in the root directory of this project before running it.

Create a `.env` file:
```env
# Aiven PostgreSQL Database
DB_URL=jdbc:postgresql://<your-aiven-url>:11925/defaultdb?user=avnadmin&password=<your-password>&sslmode=require

# Aiven Kafka Cluster
KAFKA_SERVERS=<your-aiven-kafka-url>:25311
KAFKA_USERNAME=avnadmin
KAFKA_API_SECRET=<your-kafka-password>

# Frontend URL (Use port 3000 if running via Docker, or 5173 for local npm run dev)
FRONTEND_URL=http://localhost:3000

```

---

## 📡 Kafka Topics Consumed

This service acts as a Kafka Consumer for the `notification-group` and listens to the following topics:

| Topic | Trigger | Action |
| --- | --- | --- |
| `ticket_created_topic` | A user submits a new support ticket. | Pushes a "Ticket Created" notification. |
| `ticket_resolved_topic` | An admin resolves a ticket. | Pushes a "Ticket Resolved" notification. |
| `user_deleted_topic` | A user account is removed. | Wipes all notification history for that user. |

---

## 🔌 WebSocket (STOMP) Integration

To receive live notifications on the frontend, the client must connect to the STOMP endpoint and subscribe to their personal topic.

* **Connection Endpoint:** `ws://localhost:8081/ws`
* **Subscription Topic:** `/topic/notifications/{username}`

**Example React (SockJS + STOMP) connection:**

```javascript
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const socket = new SockJS('http://localhost:8081/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
    stompClient.subscribe(`/topic/notifications/${currentUser}`, (message) => {
        const newNotification = JSON.parse(message.body);
        console.log("Live update received: ", newNotification);
    });
});

```

---

## 🌐 REST API Endpoints

While WebSockets handle live updates, this service also provides a standard REST API for the frontend to fetch history and manage read states on page load.

**Base URL:** `http://localhost:8081/api/notifications`

| Method | Endpoint | Headers Required | Description |
| --- | --- | --- | --- |
| `GET` | `/` | `X-Username: <username>` | Fetch all historical notifications for the user (Newest first). |
| `PUT` | `/{id}/read` | None | Mark a specific notification as "read". |
| `DELETE` | `/{id}` | None | Delete a specific notification. |
| `DELETE` | `/all` | `X-Username: <username>` | Clear all notifications for the user. |

> **Note:** Because authentication is handled by the main backend, this microservice trusts the `X-Username` header provided by the frontend API interceptor.

---

## 🐳 Docker Deployment

This service is fully containerized and designed to run alongside the main backend and frontend in a unified network.

To run the entire TicketFlow ecosystem:

```bash
  docker compose up -d --build
```

*The notification service runs internally on port `8081` to prevent clashing with the main backend on `8080`.*

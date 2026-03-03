# TicketFlow - Real-Time Support Platform 

TicketFlow is a high-performance, containerized support ticket management system built with a decoupled microservice architecture. It features AI-driven auto-triage, real-time notifications, role-based access control, and optimized database interactions using caching and event-driven messaging.

## 🚀 Features

* **🤖 AI-Powered Auto-Triage:** Integrates Groq AI (Llama 3) to automatically analyze ticket descriptions, determine user sentiment, generate admin summaries, and intelligently assign priority and categories.
* **⚡ Real-Time Notifications:** Utilizes Redis Pub/Sub and WebSockets to push instant updates to users when tickets are created or resolved.
* **🔗 Decoupled Microservices:** Separated `ticket-backend` and `notification-system` to ensure independent scaling and fault tolerance.
* **🛡️ Role-Based Access Control (RBAC):** Secure JWT authentication with strict boundaries between regular Users and Admins.
* **🚀 High-Performance Caching:** Redis caching implemented on heavily queried endpoints to reduce PostgreSQL load and improve response times.
* **📧 Automated Email Alerts:** Asynchronous email dispatching for critical ticket lifecycle events.
* **💻 Modern, Responsive UI:** Built with React, Tailwind CSS, and Shadcn UI for a sleek, enterprise-grade user experience.

## 🛠️ Tech Stack

<div align="center">
  <img src="https://skillicons.dev/icons?i=java,spring,postgres,redis,react,tailwind,vite,docker,git,github" alt="Tech Stack Logos" />
</div> 

**Frontend**
* React.js (Vite)
* Tailwind CSS & Shadcn UI
* Lottie Animations
* Axios for API communication

**Backend (Java / Spring Boot 3)**
* **Core APIs:** Spring Web, Spring Security (JWT), Spring Data JPA
* **AI Integration:** Spring AI (Groq / Llama 3)
* **Databases:** PostgreSQL (Separate DBs for Tickets and Notifications)
* **Messaging & Cache:** Redis (Pub/Sub for event routing, Caching for performance)
* **Real-Time:** Spring WebSockets

**DevOps & Deployment**
* Docker & Docker Compose (Multi-container orchestration)

## 🏗️ Architecture Overview

1.  **Ticket Backend:** Handles core business logic, user management, and ticket CRUD operations. It runs AI analysis on incoming tickets and publishes a JSON payload to a Redis topic whenever a major event occurs.
2.  **Notification System:** A lightweight, independent service that subscribes to Redis topics, saves notification history to its own database, and blasts real-time updates to the React frontend via WebSockets.
3.  **Redis:** Acts as the central nervous system, handling both API response caching and ultra-fast Pub/Sub message brokering.

## ⚙️ Local Setup & Installation

Ensure you have [Docker](https://www.docker.com/) and Docker Compose installed on your machine.

**1. Clone the repository**
```bash
git clone https://github.com/rehann07/TicketFlow.git
cd TicketFlow

```

**2. Configure Environment Variables**
Create a `.env` file in the root directory and add your credentials:

```env
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
GROQ_API_KEY=your_groq_api_key

```

**3. Build and run with Docker Compose**

```bash
docker compose up -d --build

```

**4. Access the Application**

* **Frontend:** `http://localhost:3000`
* **Ticket API:** `http://localhost:8080`
* **Notification API / WebSockets:** `http://localhost:8081`

## 🔒 Default Admin Credentials

*(For local testing and review purposes)*

* **Username:** admin
* **Password:** admin123

## 🤝 Contributing
Contributions are welcome! Please fork the repo and create a pull request for improvements.

## 📝 License
This project is licensed under the MIT License.
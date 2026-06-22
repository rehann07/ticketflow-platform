# 🖥️ TicketFlow: Frontend

The modern, responsive frontend application for the TicketFlow ecosystem. Built with React 19 and Vite, this client seamlessly integrates with a distributed Spring Boot backend to provide role-based dashboards, real-time WebSocket notifications, and AI-driven insights.

## 🚀 Tech Stack
* **Core:** React 19, Vite, React Router DOM (v7)
* **Styling & UI:** Tailwind CSS v4, shadcn/ui, Lucide Icons
* **Data Fetching:** Axios (with custom JWT interceptors)
* **Real-Time WebSockets:** `sockjs-client`, `stompjs`
* **Data Visualization:** Recharts
* **Form Handling:** React Hook Form, Zod (Schema Validation)
* **Animations:** Lottie React

---

## ✨ Core Features

### 🔐 Role-Based Access Control (RBAC)
The application dynamically routes users based on their JWT claims (`ROLE_USER` vs `ROLE_ADMIN`). 
* **User Portal:** Allows clients to submit tickets, track status, and view real-time updates.
* **Admin Command Center:** A protected layout featuring analytical charts (Recharts) that visualize AI-determined ticket sentiments, priorities, and system-wide resolution rates.

### 📡 Dual-Microservice Integration
To communicate with the distributed backend, this client implements a dual-Axios interceptor strategy:
* **Main API (`api`):** Automatically injects the Bearer token and handles 401 Unauthorized responses by securely purging local state and redirecting to login.
* **Notification API (`notificationApi`):** Manages requests to the isolated Real-Time microservice, injecting custom headers (`X-Username`) alongside the JWT for strict security.

### ⚡ Real-Time WebSocket Notifications
Implements a live STOMP over SockJS connection to the Notification Microservice. When a user logs in, the client subscribes to a secure, user-specific topic (`/topic/notifications/{username}`). UI badges and the notification inbox update instantly—without refreshing the page—the moment a Kafka event triggers a backend broadcast.

### 🧠 AI Visualizations
The Admin dashboard transforms raw JSON data from the Groq/Llama-3 integration into clean, readable UI elements. Administrators can instantly see AI-generated summaries, sentiment badges (Angry, Frustrated, Positive), and data-driven pie charts to prioritize their workflow.

---

## 📂 Project Structure

This project uses a scalable, feature-based architecture:
```text
src/
├── api/             # Dual Axios configurations (Main API & Notification API)
├── assets/          # Static files and Lottie animations
├── components/      # Reusable UI components (shadcn/ui, Layouts, Sidebars)
├── context/         # React Context (AuthContext for global user state)
├── features/        # Domain-specific modules
│   ├── admin/       # Admin dashboards and user management tables
│   ├── auth/        # Login and Signup pages
│   ├── notifications/# WebSocket subscription logic and UI
│   ├── settings/    # Profile management and password updates
│   └── tickets/     # Ticket creation, detail views, and lists
├── lib/             # Utility functions (Tailwind merge, formatting)
└── routes/          # Protected Route wrappers

```

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory. Since this is a Vite project, variables must be prefixed with `VITE_`.

```env
# Main Spring Boot Backend (Port 8080)
VITE_API_BASE_URL=http://localhost:8080/api

# Real-Time Notification Microservice (Port 8081)
VITE_NOTIFICATION_API_URL=http://localhost:8081/api/notifications
VITE_WEBSOCKET_URL=http://localhost:8081/ws

```

---

## 🚦 Getting Started

1. **Install Dependencies:**
```bash
npm install
```

2. **Run the Development Server:**
```bash
npm run dev
```


*The app will be available at `http://localhost:5173` (or the port specified by Vite).*
3. **Production Build:**
```bash
npm run build
npm run preview
```

---

## 🐳 Docker Deployment

This frontend is designed to be served via Nginx in a production Docker environment.

To spin up the entire ecosystem (Frontend, Main Backend, Notification Service, Aiven Databases, and Redis), run the following from the root monorepo directory:

```bash
docker compose up -d --build
```

*When containerized, the frontend maps to port `3000` by default.*
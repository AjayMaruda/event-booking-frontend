# 🎟️ Event Booking Frontend

A modern Vue 3 frontend for the Event Booking System built with **Vue 3**, **Tailwind CSS**, **Pinia**, and **Vue Router**.

## ✨ Features
- 🔐 Login & Register with JWT authentication
- 🎭 Role-based UI (Admin vs User)
- 📅 Browse events with date filters & pagination
- 🎟️ Book events with real-time seat availability
- ❌ Cancel bookings
- ⚙️ Admin panel — create, edit, delete events
- 📥 Export bookings as CSV (Admin only)
- 🔔 Toast notifications
- 📱 Fully responsive

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API) |
| State | Pinia |
| Routing | Vue Router 4 |
| Styling | Tailwind CSS 3 |
| HTTP Client | Axios |
| Build Tool | Vite |

## ⚙️ Setup

```bash
git clone https://github.com/AjayMaruda/event-booking-frontend.git
cd event-booking-frontend
npm install
cp .env.example .env
# Edit .env: VITE_API_BASE_URL=http://localhost:3000
npm run dev
```

App runs at: **http://localhost:5173**

## 🔑 Roles

| Feature | User | Admin |
|---|---|---|
| Browse events | ✅ | ✅ |
| Book events | ✅ | ❌ |
| Cancel bookings | ✅ | ❌ |
| Create/Edit/Delete events | ❌ | ✅ |
| Export CSV | ❌ | ✅ |

## 🔗 Backend
[event-booking-system](https://github.com/AjayMaruda/event-booking-system) — Node.js + Express + MongoDB

# PropSpace — Property Listing App

PropSpace is a full-stack web application where users can **list, view, update, and delete**
properties for rent or sale. It includes user authentication, dynamic search filters, a personal
dashboard ("My Listings"), and account/profile settings.

This project is built to be **beginner-friendly**: the code is split into small, clearly named
files with comments explaining *what* each part does and *why*.

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React (Vite) + React Router         |
| Backend  | Node.js + Express                   |
| Database | MongoDB (with Mongoose)             |
| Auth     | JWT (JSON Web Tokens) + bcrypt      |

---

## Project Structure

```
EXAM/
├── server/          # Backend API (Node + Express + MongoDB)
│   ├── config/      # Database connection
│   ├── models/      # Mongoose schemas (User, Property)
│   ├── repositories/# Data access layer (talks to the DB)
│   ├── controllers/ # Business logic / validation
│   ├── routes/      # API endpoints (URL -> controller)
│   ├── middleware/  # Auth guard + error handling
│   └── server.js    # App entry point
│
└── client/          # Frontend (React + Vite)
    └── src/
        ├── api/         # Axios instance + token interceptor
        ├── context/     # Global auth state
        ├── components/  # Reusable UI blocks (PropertyCard, etc.)
        └── pages/       # Full screens (Login, Feed, Dashboard...)
```

The backend follows a clean **3-layer architecture**:

1. **Routes** — parse the request and call the controller.
2. **Controllers** — validate input and apply business rules.
3. **Repositories / Models** — talk to the database.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [MongoDB](https://www.mongodb.com/) running locally, **or** a free MongoDB Atlas connection string

### 1. Start the backend
```bash
cd server
npm install
cp .env.example .env      # then edit .env with your values
npm run dev               # starts on http://localhost:5000
```

### 2. Start the frontend
```bash
cd client
npm install
npm run dev               # starts on http://localhost:5173
```

---

## API Overview

| Method | Endpoint                  | Access  | Description                         |
| ------ | ------------------------- | ------- | ----------------------------------- |
| POST   | `/api/auth/register`      | Public  | Create a new account                |
| POST   | `/api/auth/login`         | Public  | Log in, returns a JWT               |
| GET    | `/api/users/me`           | Private | Get current profile                 |
| PUT    | `/api/users/me`           | Private | Update profile info                 |
| PUT    | `/api/users/me/password`  | Private | Change password (verifies old one)  |
| GET    | `/api/properties`         | Public  | List/search/filter all properties   |
| GET    | `/api/properties/:id`     | Public  | View a single property              |
| GET    | `/api/properties/mine`    | Private | List properties I authored          |
| POST   | `/api/properties`         | Private | Create a listing                    |
| PUT    | `/api/properties/:id`     | Private | Update my listing (author only)     |
| DELETE | `/api/properties/:id`     | Private | Delete my listing (author only)     |

---

## Build Progress

This project is built **module by module**. See the commit history for each step.

- [x] Module 1 — Project scaffold
- [x] Module 2 — Backend foundation
- [x] Module 3 — Authentication
- [x] Module 4 — Account management
- [x] Module 5 — Property CRUD
- [x] Module 6 — Frontend scaffold
- [x] Module 7 — Auth pages
- [x] Module 8 — Property feed
- [x] Module 9 — Dashboard
- [x] Module 10 — Profile settings

---

## Features at a glance

- **Cameroon-localised** — prices in **FCFA**, Cameroonian city suggestions
  (Douala, Yaoundé, Bamenda…), and country defaulting to Cameroon.
- **Professional oxblood + white theme** that is fully responsive (phone/tablet/desktop).

- **Authentication** — register/login with salted + hashed passwords (bcrypt) and JWT.
- **Account dashboard** — edit name, phone, and avatar; change password (old one verified).
- **Property listings** — full CRUD; authors can edit/delete only their own listings.
- **Public feed** — browse, search by city, and filter by type and price range (no login needed).
- **My Listings** — private dashboard showing only the listings you authored.
- **Robust UX** — explicit loading, empty, and error states everywhere; form validation
  before any network call; protected routes that redirect guests to login.

## Folder map (final)

```
server/
  config/db.js                 MongoDB connection
  models/                      User, Property (Mongoose schemas)
  repositories/                Data-access layer
  controllers/                 Business logic + validation
  routes/                      RESTful endpoints
  middleware/                  protect (JWT) + error handlers
  utils/                       asyncHandler, generateToken
client/src/
  api/axios.js                 Axios instance + JWT interceptor
  context/AuthContext.jsx      Global auth state
  components/                  Navbar, PropertyCard, FilterBar, PropertyForm,
                               InputField, Loader, Message, ProtectedRoute
  pages/                       Home, Login, Register, PropertyDetail,
                               Dashboard, CreateProperty, EditProperty, Profile
```

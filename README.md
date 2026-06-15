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
- [ ] Module 2 — Backend foundation
- [ ] Module 3 — Authentication
- [ ] Module 4 — Account management
- [ ] Module 5 — Property CRUD
- [ ] Module 6 — Frontend scaffold
- [ ] Module 7 — Auth pages
- [ ] Module 8 — Property feed
- [ ] Module 9 — Dashboard
- [ ] Module 10 — Profile settings

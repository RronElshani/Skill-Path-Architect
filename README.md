# Skill Path Architect

A full-stack web application for building and managing learning paths.

## Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS v4
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT (Access + Refresh Tokens)

## Architecture

The backend follows a **layered architecture**:

```
Controllers  →  Services  →  Repositories  →  Database
```

| Layer        | Responsibility                                       |
|-------------|------------------------------------------------------|
| Controllers | Handle HTTP requests/responses (no business logic)   |
| Services    | All business logic and application rules             |
| Repositories| Database communication (isolate Mongoose from services) |

## Security

- **Authentication & Authorization:** JWT with access tokens (15min) and refresh tokens (7d). Role-based endpoint protection (user/admin).
- **Password Hashing:** bcrypt with salt rounds of 12, never stored as plain text.
- **Input Validation:** express-validator with sanitization (XSS/injection protection).
- **CORS:** Configured to only allow authorized client origin.
- **Environment Variables:** All secrets managed via `.env` files (never committed).

## Project Structure

```
Skill-Path-Architect/
├── client/                    # Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer (axios)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                    # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── config/            # Configuration & DB connection
│   │   ├── controllers/       # HTTP request handlers
│   │   ├── middleware/        # Auth, error handling
│   │   ├── models/            # Mongoose schemas
│   │   ├── repositories/     # Database access layer
│   │   ├── routes/            # Route definitions
│   │   ├── services/          # Business logic
│   │   ├── validators/       # Input validation rules
│   │   └── server.js          # Entry point
│   ├── .env                   # Environment vars (not committed)
│   ├── .env.example           # Template for env vars
│   └── package.json
│
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js v20+
- MongoDB running locally or a MongoDB Atlas URI

### Setup

1. **Clone the repo:**
   ```bash
   git clone <repo-url>
   cd Skill-Path-Architect
   ```

2. **Install dependencies:**
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

3. **Configure environment:**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secrets
   ```

4. **Run the backend:**
   ```bash
   cd server
   npm run dev
   ```

5. **Run the frontend (in a new terminal):**
   ```bash
   cd client
   npm run dev
   ```

6. Open `http://localhost:5173` in your browser.

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint         | Auth | Description              |
|--------|-----------------|------|--------------------------|
| POST   | `/register`     | No   | Register a new user      |
| POST   | `/login`        | No   | Login and get tokens     |
| POST   | `/refresh-token`| No   | Get new access token     |
| POST   | `/logout`       | Yes  | Logout (clear refresh)   |
| GET    | `/me`           | Yes  | Get current user         |

### Users (`/api/users`) — Admin only
| Method | Endpoint  | Auth  | Description         |
|--------|----------|-------|---------------------|
| GET    | `/`      | Admin | Get all users       |
| GET    | `/:id`   | Admin | Get user by ID      |
| PUT    | `/:id`   | Admin | Update user         |
| DELETE | `/:id`   | Admin | Delete user         |

### Health
| Method | Endpoint       | Auth | Description      |
|--------|---------------|------|------------------|
| GET    | `/api/health` | No   | Health check     |

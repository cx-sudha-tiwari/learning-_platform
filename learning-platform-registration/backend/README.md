# EduAuth Platform Backend API

Node.js/Express backend with SQLite database for user registration and authentication in the EduAuth learning management system.

## Features

- ✅ User registration with validation
- ✅ Secure password hashing (bcrypt)
- ✅ JWT authentication
- ✅ SQLite database (easy local dev, upgradeable to PostgreSQL/MySQL)
- ✅ Email uniqueness check
- ✅ CORS enabled
- ✅ Input validation with express-validator
- ✅ Login endpoint

## Project Structure

```
backend/
├─ models/
│  └─ User.js           # User model with CRUD operations
├─ routes/
│  └─ auth.js           # Authentication routes (register, login)
├─ middleware/
│  └─ validation.js     # Request validation middleware
├─ database.js          # SQLite setup and schema
├─ server.js            # Express app entry point
├─ package.json
├─ .env.example
└─ .gitignore
```

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
DATABASE_PATH=./database.db
```

**Important:** Change `JWT_SECRET` to a strong random string in production.

### 3. Start the server

```bash
npm start
```

For development with auto-reload (Node 18+):
```bash
npm run dev
```

Server will start at `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-10T06:24:59.000Z"
}
```

### Register User
```
POST /api/auth/register
Content-Type: application/json
```

Request body:
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123",
  "role": "student",
  "interests": ["web", "ai"]
}
```

Success response (201):
```json
{
  "success": true,
  "message": "Registration successful! Please verify your email.",
  "data": {
    "user": {
      "id": 1,
      "full_name": "Jane Doe",
      "email": "jane@example.com",
      "role": "student",
      "interests": ["web", "ai"],
      "email_verified": 0,
      "created_at": "2025-10-10 06:24:59"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Error response (400/409/500):
```json
{
  "success": false,
  "message": "Email already registered"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json
```

Request body:
```json
{
  "email": "jane@example.com",
  "password": "SecurePass123"
}
```

Success response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Database Schema

### users table

| Column         | Type    | Constraints                              |
|----------------|---------|------------------------------------------|
| id             | INTEGER | PRIMARY KEY AUTOINCREMENT                |
| full_name      | TEXT    | NOT NULL                                 |
| email          | TEXT    | UNIQUE NOT NULL                          |
| password_hash  | TEXT    | NOT NULL                                 |
| role           | TEXT    | NOT NULL, CHECK(role IN ('student', 'instructor')) |
| interests      | TEXT    | JSON array stored as text                |
| email_verified | INTEGER | DEFAULT 0                                |
| created_at     | TEXT    | DEFAULT CURRENT_TIMESTAMP                |
| updated_at     | TEXT    | DEFAULT CURRENT_TIMESTAMP                |

## Security Notes

- Passwords are hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 7 days
- CORS is enabled for all origins in development (restrict in production)
- SQL injection protection via parameterized queries
- Input validation on all endpoints

## Production Deployment

1. **Set strong JWT_SECRET** in environment variables
2. **Update CORS origin** in `server.js` to your frontend domain
3. **Use PostgreSQL/MySQL** instead of SQLite for scalability
4. **Enable HTTPS** (required for secure cookie/token transmission)
5. **Add rate limiting** (e.g., express-rate-limit)
6. **Set up email verification** flow
7. **Add logging** (e.g., winston, morgan)
8. **Environment variables** via hosting platform (Heroku, Railway, Render, AWS)

## Testing

Test registration with curl:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "role": "student",
    "interests": ["web"]
  }'
```

Test login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

## Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env or kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Database locked:**
- Close any SQLite browser tools
- Restart the server

**CORS errors:**
- Ensure frontend is making requests to `http://localhost:3000`
- Check browser console for specific CORS error details

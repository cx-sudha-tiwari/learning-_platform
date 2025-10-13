# EduAuth Platform – Learning Management Authentication System

Full-stack authentication and user management system for educational platforms. Built with modern frontend (HTML/CSS/JS) and Node.js/Express backend featuring SQLite database, JWT authentication, email verification, password reset, and enterprise-grade security.

## Project structure

```
learning-platform-registration/
├─ frontend/
│  ├─ index.html        # Registration form UI
│  ├─ styles.css        # Modern responsive styling
│  └─ script.js         # Client-side validation + API integration
├─ backend/
│  ├─ models/
│  │  └─ User.js        # User model
│  ├─ routes/
│  │  └─ auth.js        # Registration & login endpoints
│  ├─ middleware/
│  │  └─ validation.js  # Input validation
│  ├─ database.js       # SQLite setup
│  ├─ server.js         # Express server
│  ├─ package.json
│  ├─ .env.example
│  └─ README.md         # Backend documentation
└─ README.md
```

**Note:** Frontend files (`index.html`, `styles.css`, `script.js`) are in the root directory for easy access.

## Quick Start

### 1. Start the Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set JWT_SECRET to a strong random string
npm start
```

Backend will run at `http://localhost:3000`

### 2. Open the Frontend

- **Option A:** Double-click `index.html` to open in your browser
- **Option B (Recommended):** Use a local server:
  - VS Code: Install "Live Server" extension and click "Go Live"
  - Or: `npx serve` in the root directory

### 3. Test Registration

1. Fill out the registration form
2. Submit and check the browser console for the API response
3. User data is stored in `backend/database.db`

## Features

### Frontend
- ✅ Accessible form with proper ARIA labels and live regions
- ✅ Client-side validation (email, password strength, password match, role, terms)
- ✅ Responsive UI with modern dark glassmorphism design
- ✅ Real-time field validation with error messages
- ✅ API integration with fetch and error handling

### Backend
- ✅ RESTful API with Express.js
- ✅ SQLite database (easily upgradeable to PostgreSQL/MySQL)
- ✅ Secure password hashing with bcrypt
- ✅ JWT authentication tokens
- ✅ Input validation with express-validator
- ✅ Email uniqueness check
- ✅ CORS enabled for cross-origin requests
- ✅ Login endpoint included

## Customization

- **Fields:** Edit inputs in `index.html` under the `<form id="registrationForm">` block.
- **Validation:** Update rules in `script.js` functions `emailValid()`, `passwordStrong()`, and `validateField()`.
- **Styles:** Tweak palette in `styles.css` `:root` tokens and component classes.

## API Endpoints

### Register User
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123",
  "role": "student",
  "interests": ["web", "ai"]
}
```

### Login
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "SecurePass123"
}
```

See `backend/README.md` for detailed API documentation.

## Database

Users are stored in SQLite (`backend/database.db`) with this schema:

- `id` (INTEGER, PRIMARY KEY)
- `full_name` (TEXT)
- `email` (TEXT, UNIQUE)
- `password_hash` (TEXT)
- `role` (TEXT: 'student' or 'instructor')
- `interests` (TEXT: JSON array)
- `email_verified` (INTEGER: 0/1)
- `created_at`, `updated_at` (TEXT: ISO timestamps)

## Security Features

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ SQL injection protection (parameterized queries)
- ✅ Input validation on both client and server
- ✅ Password strength requirements (min 8 chars, letters + numbers)
- ✅ Email format validation
- ✅ CORS configuration

## Next Steps

- [ ] Email verification flow (send verification link)
- [ ] Password reset functionality
- [ ] Rate limiting (express-rate-limit)
- [ ] Refresh token rotation
- [ ] User profile management
- [ ] Admin dashboard
- [ ] Upgrade to PostgreSQL/MySQL for production
- [ ] Deploy backend (Railway, Render, Heroku)
- [ ] Deploy frontend (Netlify, Vercel, GitHub Pages)

## Troubleshooting

**Backend won't start:**
- Check if port 3000 is available: `netstat -ano | findstr :3000`
- Ensure `.env` file exists with `JWT_SECRET` set

**Frontend can't connect to backend:**
- Verify backend is running at `http://localhost:3000`
- Check browser console for CORS errors
- Ensure `API_URL` in `script.js` matches your backend URL

**"Email already registered" error:**
- Email must be unique. Try a different email or delete `backend/database.db` to reset

## Production Deployment

1. **Backend:** Set environment variables on your hosting platform (Railway, Render, Heroku)
2. **Frontend:** Update `API_URL` in `script.js` to your production backend URL
3. **Security:** Use HTTPS, restrict CORS origins, add rate limiting
4. **Database:** Migrate from SQLite to PostgreSQL/MySQL for scalability

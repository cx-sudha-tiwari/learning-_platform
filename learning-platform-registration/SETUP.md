# Complete Setup Guide - EduAuth Platform

This guide walks you through setting up the full-stack EduAuth Platform authentication system with all advanced features.

## Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- A code editor (VS Code recommended)
- A web browser

## Step-by-Step Setup

### 1. Install Backend Dependencies

Open a terminal and navigate to the backend folder:

```bash
cd backend
npm install
```

This will install:
- `express` - Web framework
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `better-sqlite3` - SQLite database
- `nodemailer` - Email sending
- `express-rate-limit` - Rate limiting
- `express-validator` - Input validation
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` folder:

```bash
cd backend
copy .env.example .env
```

Edit `.env` with your settings:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-abc123xyz
NODE_ENV=development
DATABASE_PATH=./database.db

# Frontend URL (for email verification/password reset links)
FRONTEND_URL=http://localhost:5500

# Email configuration (optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@learningplatform.com
```

**Important:**
- Change `JWT_SECRET` to a strong random string (at least 32 characters)
- For email functionality in production, configure SMTP settings
- In development, emails will be logged to console instead of sent

### 3. Start the Backend Server

```bash
cd backend
npm start
```

You should see:
```
✓ Database initialized at: ./database.db
🚀 Server running on http://localhost:3000
📝 API endpoints:
   POST http://localhost:3000/api/auth/register
   POST http://localhost:3000/api/auth/login
   GET  http://localhost:3000/api/auth/verify-email/:token
   POST http://localhost:3000/api/auth/forgot-password
   POST http://localhost:3000/api/auth/reset-password
   GET  http://localhost:3000/api/user/profile (protected)
   GET  http://localhost:3000/health
```

### 4. Start the Frontend

**Option A: Using VS Code Live Server (Recommended)**

1. Install the "Live Server" extension in VS Code
2. Right-click `index.html` in the root folder
3. Select "Open with Live Server"
4. Your browser will open at `http://localhost:5500` (or similar)

**Option B: Using npx serve**

In a new terminal, from the root folder:

```bash
npx serve
```

Then open `http://localhost:3000` in your browser (note: if port 3000 is taken by backend, it will use 3001)

**Option C: Direct file access**

Simply double-click `index.html` to open in your browser. Note: Some features may not work due to CORS restrictions.

### 5. Test the Application

#### Register a New User

1. Open `http://localhost:5500/index.html` (or your frontend URL)
2. Fill out the registration form:
   - Full name: John Doe
   - Email: john@example.com
   - Password: TestPass123
   - Role: Student
   - Select some interests
   - Check "I agree to Terms"
3. Click "Create account"
4. You should be redirected to the dashboard after 2 seconds

#### Check the Dashboard

- You should see your profile information
- If email is not verified, you'll see a warning banner
- The dashboard shows your name, email, role, and interests

#### Test Email Verification (Development Mode)

In development, verification emails are logged to the backend console:

1. Check the backend terminal for the verification link
2. Copy the URL (looks like: `http://localhost:5500/verify-email.html?token=...`)
3. Open it in your browser
4. You should see "Email Verified!" message
5. Refresh the dashboard - the warning banner should disappear

#### Test Password Reset

1. Go to `http://localhost:5500/forgot-password.html`
2. Enter your email address
3. Click "Send Reset Link"
4. Check the backend console for the reset link
5. Copy and open the reset URL
6. Enter a new password
7. You'll be redirected to login

#### Test Login (Future Feature)

Currently, the system auto-logs you in after registration. To implement a login page:
- Create `login.html` similar to `index.html`
- Call `POST /api/auth/login` with email and password
- Store the returned token in localStorage
- Redirect to dashboard

## Troubleshooting

### Backend won't start

**Error: Port 3000 already in use**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change PORT in .env to 3001
```

**Error: Cannot find module**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend can't connect to backend

**CORS errors in browser console:**
- Ensure backend is running at `http://localhost:3000`
- Check that `API_URL` in frontend JS files matches your backend URL
- Verify CORS is enabled in `backend/server.js`

**Network error:**
- Check if backend server is running
- Try accessing `http://localhost:3000/health` directly in browser
- Should return: `{"status":"ok","timestamp":"..."}`

### Email not sending

In development mode, emails are logged to console instead of sent. Check the backend terminal for:
```
✓ Verification email sent: <message-id>
Preview URL: https://ethereal.email/message/...
```

For production email sending:
1. Configure SMTP settings in `.env`
2. For Gmail: Enable "App Passwords" in Google Account settings
3. Use the app password (not your regular password) in `SMTP_PASS`

### Database issues

**Reset database:**
```bash
cd backend
rm database.db
npm start  # Database will be recreated
```

**View database contents:**
- Install SQLite browser: https://sqlitebrowser.org/
- Open `backend/database.db`
- Browse the `users` table

### Rate limiting errors

If you see "Too many requests" errors:
- Wait 15 minutes for the rate limit to reset
- Or restart the backend server (resets in-memory rate limits)
- For development, you can increase limits in `backend/middleware/rateLimiter.js`

## Testing with curl

### Register a user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "role": "student",
    "interests": ["web", "ai"]
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Get profile (protected route)
```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Request password reset
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## Next Steps

Now that your system is running:

1. **Customize the UI**: Edit `styles.css` to match your brand colors
2. **Add more fields**: Modify `index.html` and validation in `backend/middleware/validation.js`
3. **Implement login page**: Create a separate login form
4. **Add course management**: Create new routes and pages for courses
5. **Deploy to production**: See deployment guide below

## Production Deployment

### Backend (Railway, Render, Heroku)

1. Push code to GitHub
2. Connect your hosting platform to the repo
3. Set environment variables in the hosting dashboard:
   - `JWT_SECRET` (strong random string)
   - `NODE_ENV=production`
   - `FRONTEND_URL` (your frontend domain)
   - SMTP settings for email
4. Change database from SQLite to PostgreSQL:
   - Install `pg` package
   - Update `database.js` to use PostgreSQL
5. Deploy!

### Frontend (Netlify, Vercel, GitHub Pages)

1. Update `API_URL` in all JS files to your production backend URL
2. Build and deploy:
   - Netlify: Drag & drop the root folder
   - Vercel: Connect GitHub repo
   - GitHub Pages: Push to `gh-pages` branch

### Security Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Update CORS origin in `server.js` to your frontend domain
- [ ] Enable HTTPS (required for secure cookies)
- [ ] Configure real SMTP service for emails
- [ ] Add rate limiting (already implemented)
- [ ] Set up database backups
- [ ] Add logging (Winston, Morgan)
- [ ] Set up monitoring (Sentry, LogRocket)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review backend console logs for errors
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly
5. Ensure all dependencies are installed (`npm install`)

Happy coding! 🚀

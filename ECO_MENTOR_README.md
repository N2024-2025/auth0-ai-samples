# Eco Mentor: Auth0 + Google Calendar Integration

A hackathon-ready application that allows parents to schedule 5-day water-saving challenges for their children using Auth0 authentication and Google Calendar via Token Vault.

**Live Demo:** https://ecomentor-tunisia.base44.app

---

## 🎯 Features

✅ **Auth0 Universal Login** - Secure authentication with email/password or OAuth  
✅ **Google Token Vault** - Secure token exchange without storing credentials  
✅ **Google Calendar Integration** - Create 5 calendar events automatically  
✅ **React SPA + Express Backend** - Full-stack integration  
✅ **Production-Ready** - Deployed on Vercel  

---

## 🏗️ Architecture

```
Frontend (React SPA)
├─ Auth0 Login → Universal Login
├─ Connect Google Calendar → Token Vault scope request
└─ Schedule Challenge → POST /api/calendar/schedule

Backend (Express)
├─ POST /api/calendar/schedule endpoint
├─ Verify Auth0 JWT
├─ Exchange Auth0 token for Google token (Token Vault)
└─ Create 5 Google Calendar events via Google Calendar API
```

---

## 📋 Prerequisites

- **Auth0 Tenant** with Machine-to-Machine app enabled
- **Google Cloud Project** with Calendar API enabled
- **Node.js** 18+ with npm
- **Vercel CLI** for deployment

---

## 🚀 Quick Start

### 1. Clone & Setup

```bash
git clone https://github.com/N2024-2025/auth0-ai-samples.git
cd auth0-ai-samples/asynchronous-authorization/vercel-ai-next-js

npm install
```

### 2. Configure Auth0

Follow [AUTH0_SETUP_ECO_MENTOR.md](./AUTH0_SETUP_ECO_MENTOR.md) to:
- Create Regular Web Application
- Create Backend API
- Create Machine-to-Machine app
- Enable Google Social Connection
- Set up Token Vault
- Configure callback URLs

### 3. Set Environment Variables

Create `.env.local`:

```env
# Frontend (React)
REACT_APP_AUTH0_DOMAIN=dev-1z4uqik17jjikako.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=YOUR_WEB_APP_CLIENT_ID
REACT_APP_AUTH0_REDIRECT_URI=https://ecomentor-tunisia.base44.app/auth/callback

# Backend (Express)
AUTH0_DOMAIN=dev-1z4uqik17jjikako.us.auth0.com
AUTH0_CLIENT_ID=YOUR_M2M_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_M2M_CLIENT_SECRET
AUTH0_API_IDENTIFIER=https://ecomentor-calendar-api

# Google
GOOGLE_CALENDAR_API_KEY=YOUR_GOOGLE_API_KEY
```

### 4. Run Locally

```bash
# Frontend + Backend (Next.js with API routes)
npm run dev

# Visit: http://localhost:3000
```

### 5. Deploy to Vercel

```bash
vercel deploy --prod
```

---

## 📝 API Endpoints

### POST `/api/calendar/schedule`

**Request:**
```json
{
  "childName": "Emma",
  "startDate": "2026-04-15",
  "preferredTime": "09:00"
}
```

**Headers:**
```
Authorization: Bearer {AUTH0_ACCESS_TOKEN}
Content-Type: application/json
```

**Response (Success):**
```json
{
  "success": true,
  "childName": "Emma",
  "startDate": "2026-04-15",
  "events": [
    {
      "id": "event123",
      "summary": "Day 1: Emma's Water-Saving Challenge 💧",
      "date": "2026-04-15T09:00:00Z"
    },
    // ... 4 more events
  ],
  "message": "Successfully scheduled 5-day water-saving challenge for Emma!"
}
```

**Response (Error):**
```json
{
  "error": "Google Calendar authorization failed. Please connect your Google Calendar.",
  "details": "..."
}
```

---

## 🔐 Security

- **Auth0 JWT Verification** - All API requests verified with Auth0 access tokens
- **Token Vault** - Google tokens exchanged just-in-time, never stored
- **OAuth 2.0 with PKCE** - Frontend uses Auth0 SDK for secure code flow
- **HTTPS Only** - All requests encrypted in transit
- **Environment Variables** - Secrets never exposed in code

---

## 🧪 Testing

### Manual Testing Flow

1. **Login**
   - Click "Login with Auth0"
   - Authenticate with test user
   - Redirect back to app

2. **Connect Google Calendar**
   - Click "Connect Google Calendar"
   - Consent to calendar scope
   - Should show "✅ Connected"

3. **Schedule Challenge**
   - Fill: Child name, start date, time
   - Click "Schedule Water-Saving Challenge"
   - Should see 5 events created in Google Calendar

### Automated Testing

```bash
# Run tests
npm test

# Test coverage
npm run test:coverage
```

---

## 📦 Deployment Configuration

### Vercel Environment Variables

Set these in Vercel project settings:

```env
AUTH0_DOMAIN=dev-1z4uqik17jjikako.us.auth0.com
AUTH0_CLIENT_ID=xxxxx
AUTH0_CLIENT_SECRET=xxxxx
AUTH0_API_IDENTIFIER=https://ecomentor-calendar-api
REACT_APP_AUTH0_DOMAIN=dev-1z4uqik17jjikako.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=xxxxx
REACT_APP_AUTH0_REDIRECT_URI=https://ecomentor-tunisia.base44.app/auth/callback
```

### Vercel Build Settings

- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

---

## 📊 File Structure

```
asynchronous-authorization/vercel-ai-next-js/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── api/
│   │   │   ├── auth/[auth0]/route.ts   # Auth0 callback handler
│   │   │   └── calendar/
│   │   │       └── schedule/route.ts   # Calendar scheduling endpoint
│   │   └── layout.tsx
│   ├── components/
│   │   └── eco-mentor-scheduler.tsx    # Main scheduler component
│   └── lib/
│       └── auth0.ts                    # Auth0 client setup
├── .env.local                          # Environment variables
├── package.json
└── README.md
```

---

## 🐛 Troubleshooting

### "Callback URL mismatch"
- ✅ Verify Auth0 app callback URLs match exactly: `https://ecomentor-tunisia.base44.app/auth/callback`
- ✅ Clear browser cache and cookies

### "Google Calendar permission denied"
- ✅ Ensure user consented to `https://www.googleapis.com/auth/calendar` scope
- ✅ User must have a Google account with Calendar enabled

### "Token Vault not working"
- ✅ Verify Google Social Connection has Token Vault enabled
- ✅ Check that M2M app has proper permissions on API
- ✅ Review Auth0 Dashboard → Logs for details

### "Events not appearing in calendar"
- ✅ Check user's Google Calendar account online
- ✅ Verify Auth0 token exchange succeeded
- ✅ Review backend error logs: `npm run logs`

---

## 🎬 Demo Video Flow

**3-Minute Demo:**

1. **0:00** - Application landing page with Auth0 login
2. **0:15** - Login flow with Auth0 Universal Login
3. **0:30** - Scheduler page after authentication
4. **0:45** - Click "Connect Google Calendar" → Consent screen → Connected
5. **1:00** - Fill form: name, date, time
6. **1:15** - Click "Schedule Water-Saving Challenge"
7. **1:30** - Success message with created events
8. **1:45** - Show Google Calendar with 5 events created
9. **2:30** - Summary of Auth0 + Token Vault flow
10. **3:00** - End

---

## 📚 Resources

- [Auth0 Token Vault Docs](https://auth0.com/ai/docs/intro/token-vault)
- [Google Calendar API](https://developers.google.com/calendar)
- [Auth0 SDK for JavaScript](https://github.com/auth0/auth0-spa-js)
- [Express OAuth Middleware](https://github.com/auth0/express-openid-connect)

---

## 👥 Support

For issues or questions:
1. Check [Troubleshooting](#-troubleshooting) section
2. Review [AUTH0_SETUP_ECO_MENTOR.md](./AUTH0_SETUP_ECO_MENTOR.md)
3. Check Auth0 Dashboard → Logs for errors
4. Open GitHub issue: https://github.com/N2024-2025/auth0-ai-samples/issues

---

## 📄 License

MIT - See LICENSE file

---

**Built with Auth0 + Google Calendar for hackathon challenges! 🌱💧**

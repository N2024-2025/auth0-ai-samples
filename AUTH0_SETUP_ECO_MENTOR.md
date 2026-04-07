# Auth0 Configuration for Eco Mentor + Google Calendar Integration

This guide sets up Auth0 for Token Vault flow with Google Calendar access.

## Prerequisites
- Auth0 Tenant: `dev-1z4uqik17jjikako.us.auth0.com`
- Google Cloud Project with Calendar API enabled
- Application domain: `https://ecomentor-tunisia.base44.app`

---

## Step 1: Create Auth0 Regular Web Application

1. Go to **Auth0 Dashboard** → **Applications**
2. Click **Create Application**
3. Set name: `Eco Mentor`
4. Choose: **Regular Web Application**
5. Click **Create**

### Configure Application Settings:

**Basic Information:**
- Save your `Client ID` and `Client Secret`

**Application URIs:**
```
Allowed Callback URLs:
https://ecomentor-tunisia.base44.app/auth/callback
http://localhost:3000/auth/callback

Allowed Logout URLs:
https://ecomentor-tunisia.base44.app
http://localhost:3000

Allowed Web Origins:
https://ecomentor-tunisia.base44.app
http://localhost:3000
```

**Grant Types:** Enable
- ✅ Authorization Code
- ✅ Refresh Token
- ✅ Client Credentials
- ✅ Token Exchange (for Token Vault)

---

## Step 2: Create Auth0 API

1. Go to **Auth0 Dashboard** → **APIs**
2. Click **Create API**
3. Set name: `Eco Mentor Google Calendar API`
4. Set identifier: `https://ecomentor-calendar-api`
5. Signing algorithm: `RS256`
6. Click **Create**

### Configure API Scopes:

Add scope:
- **Scope Name**: `schedule:calendar`
- **Description**: `Schedule events on Google Calendar`

---

## Step 3: Create Auth0 Machine-to-Machine Application

1. Go to **Applications** → **Create Application**
2. Name: `Eco Mentor Backend`
3. Choose: **Machine to Machine Applications**
4. Select API: `Eco Mentor Google Calendar API`
5. Click **Create**

### Authorize the App:

In the **Machine to Machine** tab:
- Select: `Eco Mentor Google Calendar API`
- Authorize all scopes (or specific scopes needed)

---

## Step 4: Enable Google Social Connection

1. Go to **Auth0 Dashboard** → **Connections** → **Social**
2. Click **Google**
3. Toggle: **Enable**
4. Enter Google OAuth credentials (Client ID & Secret from Google Cloud Project)
5. Click **Save**

### Enable Connection on Application:

1. Go back to **Applications** → **Eco Mentor**
2. Click **Connections** tab
3. Find **Google** → Toggle **Enable**

---

## Step 5: Set Up Token Vault for Google Calendar

### In Auth0:

1. Go to **Auth0 Dashboard** → **Connections** → **Social** → **Google**
2. Enable: **Token Vault** (checkbox)
3. Set:
   - **Scope**: `https://www.googleapis.com/auth/calendar`
   - This allows exchanging Auth0 tokens for Google Calendar tokens

---

## Step 6: Configure Backend API Credentials

In your backend `.env`:
```env
AUTH0_DOMAIN=dev-1z4uqik17jjikako.us.auth0.com
AUTH0_CLIENT_ID=YOUR_BACKEND_M2M_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_BACKEND_M2M_CLIENT_SECRET
AUTH0_API_IDENTIFIER=https://ecomentor-calendar-api

# Google Calendar
GOOGLE_CALENDAR_API_KEY=YOUR_GOOGLE_API_KEY  # Optional for public calendars
```

---

## Step 7: Test Token Vault Flow

### Frontend Request:
```javascript
// After user logs in with Auth0
const token = await auth0.getAccessToken();

// Request to backend
const response = await fetch('/api/calendar/schedule', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    childName: 'Emma',
    startDate: '2026-04-15',
    preferredTime: '09:00'
  })
});
```

### Backend Token Exchange:
```javascript
// Backend exchanges Auth0 token for Google token via Token Vault
const googleToken = await exchangeTokenVault(userToken);

// Use googleToken to call Google Calendar API
```

---

## Troubleshooting

**"Callback URL mismatch"**
- Verify callback URLs match exactly: `https://ecomentor-tunisia.base44.app/auth/callback`

**"Token Vault not working"**
- Ensure Google Social Connection has Token Vault enabled
- Verify user granted Google Calendar permission

**"Google Calendar permission denied"**
- User must consent to Google Calendar scope `https://www.googleapis.com/auth/calendar`
- Check that user's Google account has Calendar access

---

## Next Steps

1. Deploy frontend with Auth0 SDK
2. Deploy backend with Token Vault + Google Calendar API integration
3. Test full flow: Login → Connect Calendar → Create Events
4. Monitor logs in Auth0 Dashboard → Logs

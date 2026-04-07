import { Router, Request, Response } from 'express';
import { ManagementClient } from '@auth0/auth0-node';
import { google } from 'googleapis';
import { verifyAccessToken } from '../middleware/auth';

const router = Router();

const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
});

interface ScheduleRequest {
  childName: string;
  startDate: string;
  preferredTime: string;
}

/**
 * POST /api/calendar/schedule
 * 
 * Creates 5 water-saving challenge events in the user's Google Calendar
 * using Auth0 Token Vault for secure token exchange
 * 
 * Body:
 * {
 *   "childName": "Emma",
 *   "startDate": "2026-04-15",
 *   "preferredTime": "09:00"
 * }
 * 
 * Returns: { success: true, events: [...], childName, message }
 */
router.post('/schedule', verifyAccessToken, async (req: Request, res: Response) => {
  try {
    const { childName, startDate, preferredTime } = req.body as ScheduleRequest;
    const userId = req.user?.sub; // Auth0 user ID from JWT

    // Validation
    if (!childName || !startDate || !preferredTime) {
      return res.status(400).json({
        error: 'Missing required fields: childName, startDate, preferredTime',
      });
    }

    // Step 1: Get Google Calendar token via Token Vault
    // Auth0 exchanges the user's access token for a Google Calendar token
    const googleToken = await exchangeTokenVault(userId, req.headers.authorization);

    // Step 2: Initialize Google Calendar client
    const calendar = google.calendar({
      version: 'v3',
      auth: new google.auth.OAuth2(
        undefined,
        undefined,
        undefined,
        { access_token: googleToken }
      ),
    });

    // Step 3: Create 5 water-saving challenge events
    const events = [];
    const startDateTime = new Date(`${startDate}T${preferredTime}:00`);

    for (let i = 0; i < 5; i++) {
      const eventDate = new Date(startDateTime);
      eventDate.setDate(eventDate.getDate() + i);

      const event = {
        summary: `Day ${i + 1}: ${childName}'s Water-Saving Challenge 💧`,
        description: `Water-saving sustainability challenge for ${childName}.\n\nChallenge: Reduce water usage today!`,
        start: {
          dateTime: eventDate.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: new Date(eventDate.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour
          timeZone: 'UTC',
        },
        reminders: {
          useDefault: true,
        },
      };

      const created = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });

      events.push({
        id: created.data.id,
        summary: created.data.summary,
        date: eventDate.toISOString(),
      });
    }

    res.json({
      success: true,
      childName,
      startDate,
      events,
      message: `Successfully scheduled 5-day water-saving challenge for ${childName}!`,
    });
  } catch (error: any) {
    console.error('Calendar scheduling error:', error);

    // Specific error handling
    if (error.message?.includes('Token Vault')) {
      return res.status(403).json({
        error: 'Google Calendar authorization failed. Please connect your Google Calendar.',
        details: error.message,
      });
    }

    res.status(500).json({
      error: 'Failed to schedule calendar events',
      details: error.message,
    });
  }
});

/**
 * Exchange Auth0 access token for Google Calendar token via Token Vault
 * 
 * Token Vault allows secure, just-in-time token exchange without storing credentials
 */
async function exchangeTokenVault(userId: string, authHeader?: string): Promise<string> {
  try {
    // Get Auth0 M2M token (for management API)
    const m2mToken = await auth0.getAccessToken();

    // Exchange user's Auth0 token for Google token via Token Vault
    const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_API_IDENTIFIER,
        grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
        subject_token: authHeader?.replace('Bearer ', ''),
        subject_token_type: 'urn:ietf:params:oauth:token-type:access_token',
        resource: 'https://www.googleapis.com', // Audience for Google
        scope: 'https://www.googleapis.com/auth/calendar',
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Token Vault exchange error:', error);
    throw new Error('Failed to obtain Google Calendar access token');
  }
}

export default router;

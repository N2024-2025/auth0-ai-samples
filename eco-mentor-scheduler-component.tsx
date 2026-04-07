import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * Eco Mentor Water-Saving Challenge Scheduler
 * 
 * Integrates:
 * - Auth0 Universal Login
 * - Google Token Vault
 * - Google Calendar event creation
 */
export const EcoMentorScheduler: React.FC = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [childName, setChildName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('09:00');
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Step 1: Connect Google Calendar (triggers OAuth consent screen)
  const handleConnectGoogle = async () => {
    try {
      setIsLoading(true);
      
      // Request Google Calendar scope through Auth0
      const token = await getAccessTokenSilently({
        audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}`,
        scope: 'https://www.googleapis.com/auth/calendar',
      });

      // Token Vault will handle the exchange automatically
      setIsGoogleConnected(true);
      setErrorMessage('');
    } catch (error: any) {
      console.error('Google Calendar connection error:', error);
      setErrorMessage(error.message || 'Failed to connect Google Calendar');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Schedule the water-saving challenge
  const handleScheduleChallenge = async () => {
    if (!childName || !startDate || !preferredTime) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      // Get fresh access token
      const token = await getAccessTokenSilently();

      // Call backend endpoint
      const response = await fetch('/api/calendar/schedule', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childName,
          startDate,
          preferredTime,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to schedule challenge');
      }

      const data = await response.json();
      
      // Show success message with event details
      setSuccessMessage(
        `✅ ${data.message}\n\nCreated ${data.events.length} events:\n${data.events
          .map((e: any) => `• ${e.summary}`)
          .join('\n')}`
      );

      // Reset form
      setChildName('');
      setStartDate('');
      setPreferredTime('09:00');
    } catch (error: any) {
      console.error('Scheduling error:', error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Not authenticated - show login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Eco Mentor</h1>
            <p className="text-lg text-slate-600">
              Schedule Your Child's Water-Saving Challenge
            </p>
          </div>

          <button
            onClick={() => loginWithRedirect()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            Login with Auth0
          </button>
        </div>
      </div>
    );
  }

  // Authenticated - show scheduler
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="w-full max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Eco Mentor</h1>
              <p className="text-slate-600 mt-1">Water-Saving Challenge Scheduler</p>
            </div>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="text-sm text-slate-600 hover:text-slate-900 underline"
            >
              Logout
            </button>
          </div>
          <p className="text-sm text-slate-600">
            Welcome, {user?.name || user?.email}
          </p>
        </div>

        {/* Google Calendar Connection */}
        <div className="mb-6 p-4 rounded-lg border border-slate-200 bg-slate-50">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-900">Google Calendar</p>
              <p className="text-sm text-slate-600 mt-1">
                {isGoogleConnected
                  ? '✅ Connected'
                  : '❌ Not connected - Click to authorize calendar access'}
              </p>
            </div>
            <button
              onClick={handleConnectGoogle}
              disabled={isLoading || isGoogleConnected}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                isGoogleConnected
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isGoogleConnected ? 'Connected' : 'Connect Calendar'}
            </button>
          </div>
        </div>

        {/* Challenge Form */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Child's Name
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Emma"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Preferred Time
              </label>
              <input
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleScheduleChallenge}
          disabled={isLoading || !isGoogleConnected}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
            isLoading || !isGoogleConnected
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isLoading ? 'Scheduling...' : "Schedule Water-Saving Challenge"}
        </button>

        {/* Messages */}
        {errorMessage && (
          <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-800 text-sm">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="text-green-800 text-sm whitespace-pre-line">
              {successMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoMentorScheduler;

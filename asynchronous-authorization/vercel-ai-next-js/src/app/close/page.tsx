'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [childName, setChildName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleConnectCalendar = () => {
    setIsGoogleConnected(true);
  };

  const handleSchedule = () => {
    setSuccessMessage('Your child’s 5-day water-saving challenge has been scheduled successfully.');
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Eco Mentor Authorized to Act</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Schedule my child’s water-saving challenge</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            A secure AI-powered sustainability assistant that helps parents schedule a 5-day water-saving challenge using Auth0 Token
            Vault and Google Calendar.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4 mb-8">
          <Button asChild className="w-full sm:w-auto">
            <a href="/auth/login" className="w-full text-center">Login with Auth0</a>
          </Button>
          <Button type="button" variant="outline" onClick={handleConnectCalendar} className="w-full sm:w-auto">
            Connect Google Calendar
          </Button>
        </div>

        <div className="mb-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
          <p className="font-medium text-slate-900">Connection status</p>
          <p className="mt-2 text-slate-600">
            {isGoogleConnected ? 'Google Calendar connected' : 'Google Calendar not connected'}
          </p>
          {isGoogleConnected && <p className="mt-2 text-slate-500">Your calendar is ready for the Eco Mentor challenge.</p>}
        </div>

        <div className="grid gap-6">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Child name
            <Input
              value={childName}
              onChange={(event) => setChildName(event.target.value)}
              placeholder="Enter your child’s name"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Start date
            <Input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Preferred time
            <Input
              type="time"
              value={preferredTime}
              onChange={(event) => setPreferredTime(event.target.value)}
            />
          </label>

          <Button type="button" size="lg" onClick={handleSchedule} className="mt-2 w-full">
            Schedule my child’s water-saving challenge
          </Button>
        </div>

        {successMessage ? (
          <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            {successMessage}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
            Your schedule will appear here once the challenge is created.
          </div>
        )}
      </div>
    </main>
  );
}

        <div className="grid gap-6">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Child name
            <Input
              value={childName}
              onChange={(event) => setChildName(event.target.value)}
              placeholder="Enter your child’s name"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Start date
            <Input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Preferred time
            <Input
              type="time"
              value={preferredTime}
              onChange={(event) => setPreferredTime(event.target.value)}
            />
          </label>

          <Button type="button" size="lg" onClick={handleSchedule} className="mt-2 w-full">
            Schedule my child’s water-saving challenge
          </Button>
        </div>

        {successMessage ? (
          <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            {successMessage}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
            Your schedule will appear here once the challenge is created.
          </div>
        )}
      </div>
    </main>
  );
}
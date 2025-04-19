// src/pages/record.tsx
'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';

type Team = { id: number; name: string };
const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Record() {
  const { data: teams } = useSWR<Team[]>('/api/teams', fetcher);
  const [form, setForm] = useState({
    gameweek: 1,
    home_team: 1,
    away_team: 2,
    home_score: 0,
    away_score: 0,
  });

  const submit = async () => {
    const res = await fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      alert('Result saved!');
      setForm(f => ({ ...f, home_score: 0, away_score: 0 }));
    } else {
      const { error } = await res.json();
      alert('Error: ' + error);
    }
  };

  if (!teams) return <p className="p-8 text-gray-500">Loading teams…</p>;

  return (
    <main className="flex justify-center p-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => mutate('/api/teams')}
            className="text-sm text-blue-600 hover:underline"
          >
            Refresh Teams
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center">Record a Match</h1>

        <div className="space-y-4">
          <label className="block text-lg font-medium">
            Gameweek
            <select
              className="mt-1 block w-full border rounded px-3 py-2"
              value={form.gameweek}
              onChange={e =>
                setForm(f => ({ ...f, gameweek: +e.target.value }))
              }
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-lg font-medium">
            Home Team
            <select
              className="mt-1 block w-full border rounded px-3 py-2"
              value={form.home_team}
              onChange={e =>
                setForm(f => ({ ...f, home_team: +e.target.value }))
              }
            >
              {teams.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-lg font-medium">
            Away Team
            <select
              className="mt-1 block w-full border rounded px-3 py-2"
              value={form.away_team}
              onChange={e =>
                setForm(f => ({ ...f, away_team: +e.target.value }))
              }
            >
              {teams.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-lg font-medium">
            Home Score
            <input
              type="number"
              min={0}
              className="mt-1 block w-full border rounded px-3 py-2"
              value={form.home_score}
              onChange={e =>
                setForm(f => ({ ...f, home_score: +e.target.value }))
              }
            />
          </label>

          <label className="block text-lg font-medium">
            Away Score
            <input
              type="number"
              min={0}
              className="mt-1 block w-full border rounded px-3 py-2"
              value={form.away_score}
              onChange={e =>
                setForm(f => ({ ...f, away_score: +e.target.value }))
              }
            />
          </label>
        </div>

        <button
          onClick={submit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3"
        >
          Save Result
        </button>
      </div>
    </main>
  );
}

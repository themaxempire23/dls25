// src/pages/fixtures/generate.tsx
'use client';
import React, { useState } from 'react';

export default function GenerateFixturesPage() {
  const [status, setStatus] = useState<string>();

  const generate = async () => {
    setStatus('Generating…');
    const res = await fetch('/api/fixtures/generate', { method: 'POST' });
    if (res.ok) setStatus('Fixtures generated!');
    else {
      const { error } = await res.json();
      setStatus('Error: ' + error);
    }
  };

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Generate Fixtures</h1>
      <p>Run once to schedule all 5 gameweeks.</p>
      <button
        onClick={generate}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Generate
      </button>
      {status && <p>{status}</p>}
    </main>
  );
}

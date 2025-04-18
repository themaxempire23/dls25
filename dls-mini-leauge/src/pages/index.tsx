// src/pages/index.tsx
import useSWR from 'swr';

type Team = { id: number; name: string };
const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function HomePage() {
  const { data: teams, error } = useSWR<Team[]>('/api/teams', fetcher);

  if (error) return <p className="p-8 text-red-600">Failed to load teams</p>;
  if (!teams) return <p className="p-8">Loading teams…</p>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Dream League Mini Teams</h1>
        <ul className="divide-y">
          {teams.map((t) => (
            <li key={t.id} className="py-2">
              {t.name}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

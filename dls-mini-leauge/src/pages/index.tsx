// src/pages/index.tsx
import useSWR from 'swr';

type Team = { id: number; name: string };
const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function HomePage() {
  const { data: teams, error } = useSWR<Team[]>('/api/teams', fetcher);

  if (error) return <p className="p-8 text-red-600">Failed to load teams</p>;
  if (!teams) return <p className="p-8 text-gray-500">Loading…</p>;

  return (
    <main className="flex justify-center p-8">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10">
        <h1 className="text-4xl font-extrabold mb-6 text-center">
          Namibian premier leauge teams
        </h1>
        <ul className="space-y-3">
          {teams.map(t => (
            <li
              key={t.id}
              className="py-2 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-lg"
            >
              {t.name}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

type FX = {
  gameweek: number;
  match_date: string;
  home_team: { name: string };
  away_team: { name: string };
};

export async function getServerSideProps() {
  // fetch teams & fixtures
  const [{ data: teams }, { data: fixtures }] = await Promise.all([
    supabase.from('teams').select('id'),
    supabase.from('fixtures').select('gameweek,match_date,home_team(name),away_team(name)')
      .order('gameweek', { ascending: true })
  ]);

  const teamCount = teams?.length ?? 0;
  // expected fixtures = #weeks * floor(teamCount/2)
  const expected = 5 * Math.floor(teamCount / 2);

  return {
    props: {
      fixtures: fixtures || [],
      expectedCount: expected
    }
  };
}

export default function FixturesPage({
  fixtures,
  expectedCount
}: {
  fixtures: FX[];
  expectedCount: number;
}) {
  const router = useRouter();
  const showGenerate = fixtures.length < expectedCount;

  // group by week
  const byWeek = fixtures.reduce<Record<number, FX[]>>((acc, f) => {
    (acc[f.gameweek] ??= []).push(f);
    return acc;
  }, {});

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Scheduled Fixtures</h1>
        <div className="flex space-x-2">
          {/* Refresh button */}
          <button
            onClick={() => router.reload()}
            className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
          >
            Refresh
          </button>

          {/* Generate only when we have fewer fixtures than expected */}
          {showGenerate && (
            <Link href="/fixtures/generate">
              <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                Generate Fixtures
              </button>
            </Link>
          )}
        </div>
      </div>

      {Object.entries(byWeek).map(([wk, matches]) => (
        <section key={wk} className="bg-white shadow rounded-lg p-4">
          <h2 className="font-semibold mb-2">Gameweek {wk}</h2>
          <ul className="divide-y">
            {matches.map((m, i) => (
              <li key={i} className="py-2 flex justify-between">
                <span>{m.home_team.name} vs {m.away_team.name}</span>
                <span className="text-sm text-gray-600">{m.match_date}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

// src/pages/standings.tsx
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

type TeamRow = {
  id: number;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  pts: number;
};

export async function getServerSideProps() {
  const [{ data: teams }, { data: matches }] = await Promise.all([
    supabase.from('teams').select('id,name'),
    supabase
      .from('match_results')
      .select('home_team,away_team,home_score,away_score'),
  ]);

  const table = (teams || []).map(t => ({
    ...t,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    pts: 0,
  }));
  const lookup = Object.fromEntries(table.map(r => [r.id, r]));

  (matches || []).forEach(m => {
    const home = lookup[m.home_team],
          away = lookup[m.away_team];
    home.played++; away.played++;
    home.gf += m.home_score; home.ga += m.away_score;
    away.gf += m.away_score; away.ga += m.home_score;

    if (m.home_score > m.away_score) {
      home.won++; home.pts += 3; away.lost++;
    } else if (m.home_score < m.away_score) {
      away.won++; away.pts += 3; home.lost++;
    } else {
      home.drawn++; away.drawn++; home.pts++; away.pts++;
    }
  });

  table.sort(
    (a, b) =>
      b.pts - a.pts ||
      (b.gf - b.ga) - (a.gf - a.ga) ||
      b.gf - a.gf
  );

  return { props: { table } };
}

export default function StandingsPage({
  table,
}: {
  table: TeamRow[];
}) {
  const router = useRouter();

  return (
    <main className="flex justify-center p-8">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">League Standings</h1>
          <button
            onClick={() => router.reload()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center text-lg">
            <thead>
              <tr className="border-b">
                <th className="py-2">#</th>
                <th className="text-left py-2">Team</th>
                <th className="py-2">P</th>
                <th className="py-2">W</th>
                <th className="py-2">D</th>
                <th className="py-2">L</th>
                <th className="py-2">GF</th>
                <th className="py-2">GA</th>
                <th className="py-2">Pts</th>
              </tr>
            </thead>
            <tbody>
              {table.map((r, i) => (
                <tr
                  key={r.id}
                  className={i % 2 ? 'bg-gray-50' : 'bg-gray-100'}
                >
                  <td className="py-1">{i + 1}</td>
                  <td className="text-left py-1">{r.name}</td>
                  <td className="py-1">{r.played}</td>
                  <td className="py-1">{r.won}</td>
                  <td className="py-1">{r.drawn}</td>
                  <td className="py-1">{r.lost}</td>
                  <td className="py-1">{r.gf}</td>
                  <td className="py-1">{r.ga}</td>
                  <td className="py-1">{r.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

// src/pages/standings.tsx
import { supabase } from '../lib/supabaseClient';

type TeamRow = {
  id:number; name:string;
  played:number; won:number; drawn:number; lost:number;
  gf:number; ga:number; pts:number;
};

export async function getServerSideProps() {
  const [{ data: teams }, { data: matches }] = await Promise.all([
    supabase.from('teams').select('id,name'),
    supabase.from('match_results').select('home_team,away_team,home_score,away_score')
  ]);

  const table = (teams||[]).map(t => ({
    ...t, played:0, won:0, drawn:0, lost:0, gf:0, ga:0, pts:0
  }));
  const lookup = Object.fromEntries(table.map(r=>[r.id,r]));

  (matches||[]).forEach(m => {
    const home=lookup[m.home_team], away=lookup[m.away_team];
    home.played++; away.played++;
    home.gf+=m.home_score; home.ga+=m.away_score;
    away.gf+=m.away_score; away.ga+=m.home_score;
    if (m.home_score>m.away_score) { home.won++; home.pts+=3; away.lost++; }
    else if (m.home_score<m.away_score) { away.won++; away.pts+=3; home.lost++; }
    else { home.drawn++; away.drawn++; home.pts++; away.pts++; }
  });

  table.sort((a,b)=>
    b.pts-a.pts ||
    (b.gf-b.ga)-(a.gf-a.ga) ||
    b.gf-a.gf
  );

  return { props:{ table } };
}

export default function StandingsPage({ table }: { table: TeamRow[] }) {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        <h1 className="text-2xl font-bold mb-4">League Standings</h1>
        <table className="w-full text-center">
          <thead>
            <tr className="border-b">
              <th>#</th><th className="text-left">Team</th><th>P</th><th>W</th>
              <th>D</th><th>L</th><th>GF</th><th>GA</th><th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {table.map((r,i) => (
              <tr key={r.id} className={i%2?'bg-gray-50':'bg-white'}>
                <td>{i+1}</td>
                <td className="text-left">{r.name}</td>
                <td>{r.played}</td><td>{r.won}</td><td>{r.drawn}</td><td>{r.lost}</td>
                <td>{r.gf}</td><td>{r.ga}</td><td>{r.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

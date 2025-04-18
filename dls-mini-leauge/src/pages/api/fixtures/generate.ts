// src/pages/api/fixtures/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

function rotate(arr: (number|null)[]) {
  // Standard round‑robin rotate (fix first element)
  const [first, ...rest] = arr;
  const last = rest.pop()!;
  return [first, last, ...rest];
}

function nextSaturday(offsetWeeks: number): string {
  const today = new Date();
  const day = today.getDay();            // 0=Sun … 6=Sat
  const daysUntilSat = (6 - day + 7) % 7;
  const target = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + daysUntilSat + offsetWeeks*7
  );
  return target.toISOString().split('T')[0]; // YYYY‑MM‑DD
}

export default async function handler(
  req: NextApiRequest, res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow',['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  // 1) Fetch team IDs
  const { data: teams, error: tErr } =
    await supabase.from('teams').select('id').order('id');
  if (tErr || !teams) return res.status(500).json({ error: tErr?.message });

  // 2) Build a round‑robin schedule for 5 weeks
  let ids = teams.map(t => t.id);
  if (ids.length % 2 !== 0) ids.push(null); // null = bye
  const totalWeeks = 5;
  const fixtures: Array<{
    gameweek:number, home_team:number, away_team:number, match_date:string
  }> = [];

  for (let week = 1; week <= totalWeeks; ++week) {
    for (let i = 0; i < ids.length/2; ++i) {
      const home = ids[i], away = ids[ids.length - 1 - i];
      if (home !== null && away !== null) {
        fixtures.push({
          gameweek: week,
          home_team: home,
          away_team: away,
          match_date: nextSaturday(week-1)
        });
      }
      // if one is null → that team has a bye (game in hand)
    }
    // rotate array for next round
    ids = rotate(ids);
  }

  // 3) Insert into Supabase
  const { error: fErr } = await supabase
    .from('fixtures')
    .insert(fixtures);

  if (fErr) return res.status(500).json({ error: fErr.message });
  res.status(201).json({ success: true, count: fixtures.length });
}
